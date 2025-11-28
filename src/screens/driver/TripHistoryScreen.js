import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';

const {width} = Dimensions.get('window');

const TripHistoryScreen = ({navigation}) => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all'); // all, completed, cancelled

  useEffect(() => {
    loadTrips();
  }, [filter]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      
      let query = firestore()
        .collection('trips')
        .where('driverId', '==', user?.uid)
        .orderBy('createdAt', 'desc')
        .limit(50);

      if (filter === 'completed') {
        query = query.where('status', '==', 'completed');
      } else if (filter === 'cancelled') {
        query = query.where('status', '==', 'cancelled');
      }

      const snapshot = await query.get();
      const tripsData = [];

      snapshot.forEach(doc => {
        tripsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setTrips(tripsData);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTrips();
  };

  const formatCurrency = amount => {
    return `₦${(amount || 0).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = timestamp => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return '#00C896';
      case 'in_progress':
        return '#FFA500';
      case 'cancelled':
        return '#FF4444';
      default:
        return '#999';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status || 'Unknown';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00C896" />
          <Text style={styles.loadingText}>Loading trips...</Text>
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
        <Text style={styles.headerTitle}>Trip History</Text>
        <View style={styles.backButton} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => setFilter('all')}>
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText,
            ]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'completed' && styles.activeFilterTab,
          ]}
          onPress={() => setFilter('completed')}>
          <Text
            style={[
              styles.filterText,
              filter === 'completed' && styles.activeFilterText,
            ]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === 'cancelled' && styles.activeFilterTab,
          ]}
          onPress={() => setFilter('cancelled')}>
          <Text
            style={[
              styles.filterText,
              filter === 'cancelled' && styles.activeFilterText,
            ]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🚛</Text>
            <Text style={styles.emptyStateTitle}>No trips found</Text>
            <Text style={styles.emptyStateText}>
              {filter === 'all'
                ? 'Your trip history will appear here'
                : `No ${filter} trips yet`}
            </Text>
          </View>
        ) : (
          trips.map(trip => (
            <TouchableOpacity
              key={trip.id}
              style={styles.tripCard}
              onPress={() => {
                navigation.navigate('TripDetails', {tripId: trip.id});
              }}>
              <View style={styles.tripHeader}>
                <View style={styles.tripHeaderLeft}>
                  <Text style={styles.tripDate}>
                    {formatDate(trip.createdAt)}
                  </Text>
                  <Text style={styles.tripId}>Trip #{trip.id.slice(-6)}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(trip.status)},
                  ]}>
                  <Text style={styles.statusText}>
                    {getStatusText(trip.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.tripLocations}>
                <View style={styles.locationRow}>
                  <View style={styles.greenDot} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {trip.pickupAddress || 'Pickup location'}
                  </Text>
                </View>
                <View style={styles.locationDivider} />
                <View style={styles.locationRow}>
                  <View style={styles.purpleDot} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {trip.deliveryAddress || 'Delivery location'}
                  </Text>
                </View>
              </View>

              <View style={styles.tripFooter}>
                <View style={styles.tripDetails}>
                  <Text style={styles.tripDetailLabel}>Earnings</Text>
                  <Text style={styles.tripDetailValue}>
                    {formatCurrency(trip.fare || trip.amount || 0)}
                  </Text>
                </View>
                <View style={styles.tripDetails}>
                  <Text style={styles.tripDetailLabel}>Distance</Text>
                  <Text style={styles.tripDetailValue}>
                    {trip.distance ? `${trip.distance} km` : 'N/A'}
                  </Text>
                </View>
                <View style={styles.tripDetails}>
                  <Text style={styles.tripDetailLabel}>Duration</Text>
                  <Text style={styles.tripDetailValue}>
                    {trip.duration ? `${trip.duration} min` : 'N/A'}
                  </Text>
                </View>
              </View>

              {trip.shipperName && (
                <View style={styles.shipperInfo}>
                  <Text style={styles.shipperLabel}>Shipper: </Text>
                  <Text style={styles.shipperName}>{trip.shipperName}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#00C896',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tripHeaderLeft: {
    flex: 1,
  },
  tripDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tripId: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tripLocations: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00C896',
    marginRight: 12,
  },
  purpleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5A9F',
    marginRight: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  locationDivider: {
    width: 2,
    height: 20,
    backgroundColor: '#E0E0E0',
    marginLeft: 5,
    marginVertical: 4,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tripDetails: {
    flex: 1,
    alignItems: 'center',
  },
  tripDetailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  tripDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  shipperInfo: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  shipperLabel: {
    fontSize: 14,
    color: '#999',
  },
  shipperName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default TripHistoryScreen;
