import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Animated,
  Alert,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';

const ProfileScreen = ({navigation}) => {
  const {user, userType, updateUserProfile} = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    address: '',
    photoURL: '',
  });

  const [driverData, setDriverData] = useState({
    truckType: '',
    licenseNumber: '',
    vehicleNumber: '',
  });

  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDoc = await firestore().collection('users').doc(user?.uid).get();
      
      if (userDoc.exists) {
        const data = userDoc.data();
        setFormData({
          displayName: data.displayName || user?.displayName || '',
          email: data.email || user?.email || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          photoURL: data.photoURL || user?.photoURL || '',
        });

        if (userType === 'driver') {
          setDriverData({
            truckType: data.truckType || '',
            licenseNumber: data.licenseNumber || '',
            vehicleNumber: data.vehicleNumber || '',
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleImagePick = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
      });

      if (image?.path) {
        setUploadingImage(true);
        
        // Upload to Firebase Storage
        const filename = `profile_${user?.uid}_${Date.now()}.jpg`;
        const reference = storage().ref(`profile_images/${filename}`);
        
        await reference.putFile(image.path);
        const url = await reference.getDownloadURL();
        
        setFormData(prev => ({...prev, photoURL: url}));
        setUploadingImage(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.displayName.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        displayName: formData.displayName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        photoURL: formData.photoURL,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (userType === 'driver') {
        updateData.truckType = driverData.truckType;
        updateData.licenseNumber = driverData.licenseNumber;
        updateData.vehicleNumber = driverData.vehicleNumber;
      }

      await firestore().collection('users').doc(user?.uid).update(updateData);

      // Update auth profile
      if (updateUserProfile) {
        await updateUserProfile({
          displayName: formData.displayName.trim(),
          photoURL: formData.photoURL,
        });
      }

      // Success animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    loadUserData();
    setEditing(false);
  };

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
        <Text style={styles.headerTitle}>Profile</Text>
        {!editing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(true)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Profile Picture */}
        <Animated.View style={[styles.profileSection, {transform: [{scale: scaleAnim}]}]}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={editing ? handleImagePick : null}
            disabled={!editing}>
            {uploadingImage ? (
              <View style={styles.avatarLoading}>
                <ActivityIndicator color="#8B5A9F" />
              </View>
            ) : formData.photoURL ? (
              <Image source={{uri: formData.photoURL}} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {formData.displayName?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
            {editing && (
              <View style={styles.cameraIcon}>
                <Text style={styles.cameraEmoji}>📷</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>{formData.displayName || 'User'}</Text>
          <Text style={styles.userType}>
            {userType === 'driver' ? 'Driver' : 'Shipper'}
          </Text>
        </Animated.View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, !editing && styles.inputDisabled]}
              value={formData.displayName}
              onChangeText={(text) => setFormData(prev => ({...prev, displayName: text}))}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              editable={editing}
            />
          </View>

          {/* Email (read-only) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={formData.email}
              editable={false}
            />
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, !editing && styles.inputDisabled]}
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData(prev => ({...prev, phoneNumber: text}))}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              editable={editing}
            />
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea, !editing && styles.inputDisabled]}
              value={formData.address}
              onChangeText={(text) => setFormData(prev => ({...prev, address: text}))}
              placeholder="Enter your address"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              editable={editing}
            />
          </View>

          {/* Driver-specific fields */}
          {userType === 'driver' && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Vehicle Information</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Truck Type</Text>
                <TextInput
                  style={[styles.input, !editing && styles.inputDisabled]}
                  value={driverData.truckType}
                  onChangeText={(text) => setDriverData(prev => ({...prev, truckType: text}))}
                  placeholder="e.g., Box Truck, Flatbed"
                  placeholderTextColor="#999"
                  editable={editing}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>License Number</Text>
                <TextInput
                  style={[styles.input, !editing && styles.inputDisabled]}
                  value={driverData.licenseNumber}
                  onChangeText={(text) => setDriverData(prev => ({...prev, licenseNumber: text}))}
                  placeholder="Enter license number"
                  placeholderTextColor="#999"
                  editable={editing}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle Number</Text>
                <TextInput
                  style={[styles.input, !editing && styles.inputDisabled]}
                  value={driverData.vehicleNumber}
                  onChangeText={(text) => setDriverData(prev => ({...prev, vehicleNumber: text}))}
                  placeholder="Enter vehicle number"
                  placeholderTextColor="#999"
                  editable={editing}
                />
              </View>
            </>
          )}

          {/* Action Buttons */}
          {editing && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}>
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Account Stats */}
        {!editing && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Account Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>📅</Text>
                <Text style={styles.statLabel}>Member Since</Text>
                <Text style={styles.statValue}>
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'short',
                      })
                    : 'N/A'}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>✅</Text>
                <Text style={styles.statLabel}>Email Verified</Text>
                <Text style={styles.statValue}>
                  {user?.emailVerified ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
          </View>
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
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: '#8B5A9F',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8B5A9F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avatarLoading: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5A9F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraEmoji: {
    fontSize: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputDisabled: {
    backgroundColor: '#F0F0F0',
    color: '#999',
  },
  textArea: {
    minHeight: 80,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#8B5A9F',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  saveButtonDisabled: {
    backgroundColor: '#CCC',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProfileScreen;
