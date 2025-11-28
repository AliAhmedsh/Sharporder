import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  StatusBar,
  ScrollView,
  Dimensions,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';

const {width} = Dimensions.get('window');

const RatingScreen = ({navigation, route}) => {
  const {user, userType} = useAuth();
  const {tripId} = route.params || {};
  
  const [rating, setRating] = useState(0);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState(null);
  const [otherUserData, setOtherUserData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load trip data
  useEffect(() => {
    loadTripData();
  }, [tripId]);

  const loadTripData = async () => {
    if (!tripId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get trip data
      const tripDoc = await firestore().collection('trips').doc(tripId).get();
      
      if (!tripDoc.exists) {
        Alert.alert('Error', 'Trip not found');
        navigation.goBack();
        return;
      }

      const trip = {id: tripDoc.id, ...tripDoc.data()};
      setTripData(trip);

      // Get other user data (driver for shipper, shipper for driver)
      const otherUserId = userType === 'shipper' ? trip.driverId : trip.shipperId;
      
      if (otherUserId) {
        const userDoc = await firestore().collection('users').doc(otherUserId).get();
        if (userDoc.exists) {
          setOtherUserData({id: userDoc.id, ...userDoc.data()});
        }
      }
    } catch (error) {
      console.error('Error loading trip data:', error);
      Alert.alert('Error', 'Failed to load trip data');
    } finally {
      setLoading(false);
    }
  };

  // Sample quick review options
  const quickReviews = [
    'Professional',
    'On Time',
    'Friendly',
    'Clean Vehicle',
    'Safe Driving',
    'Good Communication',
  ];

  const handleStarPress = (star) => {
    setRating(star);
  };

  const handleQuickReview = (text) => {
    if (selectedReviews.includes(text)) {
      setSelectedReviews(selectedReviews.filter(r => r !== text));
    } else {
      setSelectedReviews([...selectedReviews, text]);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);

      // Determine who we're rating
      const otherUserId = userType === 'shipper' ? tripData?.driverId : tripData?.shipperId;
      const otherUserType = userType === 'shipper' ? 'driver' : 'shipper';

      if (!otherUserId) {
        Alert.alert('Error', 'Cannot find user to rate');
        return;
      }

      const ratingData = {
        tripId: tripId || null,
        fromUserId: user?.uid,
        fromUserType: userType,
        toUserId: otherUserId,
        toUserType: otherUserType,
        rating,
        quickReviews: selectedReviews,
        comment: comment.trim(),
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      // Add rating to ratings collection
      await firestore().collection('ratings').add(ratingData);

      // Update the user's average rating
      const userRef = firestore().collection('users').doc(otherUserId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        const currentRating = userData.rating || 0;
        const ratingCount = userData.ratingCount || 0;
        
        const newRatingCount = ratingCount + 1;
        const newAverageRating = ((currentRating * ratingCount) + rating) / newRatingCount;
        
        await userRef.update({
          rating: parseFloat(newAverageRating.toFixed(2)),
          ratingCount: newRatingCount,
        });
      }

      // If trip ID exists, mark trip as rated
      if (tripId) {
        await firestore()
          .collection('trips')
          .doc(tripId)
          .update({
            [`rated_by_${userType}`]: true,
          });
      }

      setShowSuccess(true);
      
      // Navigate back after showing success
      setTimeout(() => {
        setShowSuccess(false);
        navigation.goBack();
      }, 2000);

    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5A9F" />
          <Text style={styles.loadingText}>Loading trip details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate Your Experience</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Trip Info */}
        {tripData && (
          <View style={styles.tripCard}>
            <Text style={styles.tripTitle}>Trip Details</Text>
            <View style={styles.tripRow}>
              <Text style={styles.tripLabel}>From:</Text>
              <Text style={styles.tripValue} numberOfLines={1}>
                {tripData.pickupAddress || 'N/A'}
              </Text>
            </View>
            <View style={styles.tripRow}>
              <Text style={styles.tripLabel}>To:</Text>
              <Text style={styles.tripValue} numberOfLines={1}>
                {tripData.deliveryAddress || 'N/A'}
              </Text>
            </View>
            {tripData.fare && (
              <View style={styles.tripRow}>
                <Text style={styles.tripLabel}>Fare:</Text>
                <Text style={styles.tripValue}>
                  ₦{tripData.fare.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {otherUserData?.displayName?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {otherUserData?.displayName || 'User'}
          </Text>
          <Text style={styles.userType}>
            {userType === 'shipper' ? 'Your Driver' : 'Your Shipper'}
          </Text>
        </View>

        {/* Rating Stars */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>How was your experience?</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                style={styles.starButton}
                onPress={() => handleStarPress(star)}>
                <Text
                  style={[
                    styles.star,
                    star <= rating && styles.starFilled,
                  ]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </Text>
          )}
        </View>

        {/* Quick Reviews */}
        {rating > 0 && (
          <View style={styles.quickReviewSection}>
            <Text style={styles.sectionTitle}>Quick reviews (optional)</Text>
            <View style={styles.quickReviewsContainer}>
              {quickReviews.map((text, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quickReviewChip,
                    selectedReviews.includes(text) && styles.quickReviewChipSelected,
                  ]}
                  onPress={() => handleQuickReview(text)}>
                  <Text
                    style={[
                      styles.quickReviewText,
                      selectedReviews.includes(text) && styles.quickReviewTextSelected,
                    ]}>
                    {text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Review Text */}
        {rating > 0 && (
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>
              Additional comments (optional)
            </Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Share more details about your experience..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              maxLength={500}
              value={comment}
              onChangeText={setComment}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{comment.length}/500</Text>
          </View>
        )}

        {/* Submit Button */}
        {rating > 0 && (
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}>
            <Text style={styles.submitButtonText}>
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Thank you!</Text>
            <Text style={styles.successMessage}>
              Your rating has been submitted
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tripRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tripLabel: {
    fontSize: 14,
    color: '#666',
    width: 60,
    fontWeight: '600',
  },
  tripValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5A9F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: '#666',
  },
  ratingSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 48,
    color: '#E0E0E0',
  },
  starFilled: {
    color: '#FFB800',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B5A9F',
  },
  quickReviewSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  quickReviewsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  quickReviewChip: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickReviewChipSelected: {
    backgroundColor: '#E8E0F0',
    borderColor: '#8B5A9F',
  },
  quickReviewText: {
    fontSize: 14,
    color: '#666',
  },
  quickReviewTextSelected: {
    color: '#8B5A9F',
    fontWeight: '600',
  },
  reviewSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  reviewInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#8B5A9F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    minWidth: 280,
  },
  successIcon: {
    fontSize: 64,
    color: '#00C896',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default RatingScreen;
