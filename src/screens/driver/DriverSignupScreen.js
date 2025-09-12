import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Modal,
  Image,
} from 'react-native';
import back from '../../assets/icons/back.png';
import eye from '../../assets/icons/eye.png';
import upload from '../../assets/icons/upload.png';
import calender from '../../assets/icons/calender.png';
import camera from '../../assets/icons/camera.png';

const DriverSignupScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    truckType: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
  });

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleUpload = () => {
    setShowVerificationModal(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${(currentStep / 2) * 100}%` }]} />
    </View>
  );

  const renderPersonalDetails = () => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image source={back} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Personal details</Text>
          <Text style={styles.headerSubtitle}>Please provide accurate information.</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>First name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Full name"
            placeholderTextColor="#C7C7CD"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange('firstName', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Last name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Full name"
            placeholderTextColor="#C7C7CD"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange('lastName', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Date of birth</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={[styles.textInput, styles.textInputWithIcon]}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#C7C7CD"
              value={formData.dateOfBirth}
              onChangeText={(value) => handleInputChange('dateOfBirth', value)}
            />
            <TouchableOpacity style={styles.iconButton}>
              <Image source={calender} style={styles.inputCalenderImage} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone number</Text>
          <View style={styles.phoneInputContainer}>
            <Text style={styles.countryCode}>+234</Text>
            <TextInput
              style={[styles.textInput, styles.phoneInput]}
              placeholder="08012345678"
              placeholderTextColor="#C7C7CD"
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email address</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Email address"
            placeholderTextColor="#C7C7CD"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Truck type</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={[styles.dropdownText, !formData.truckType && styles.placeholderText]}>
              {formData.truckType || 'Select here'}
            </Text>
            <Text style={styles.dropdownIcon}>⌄</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Create password</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={[styles.textInput, styles.textInputWithIcon]}
              placeholder="Enter here"
              placeholderTextColor="#C7C7CD"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconButton}
            >
              <Image source={eye} style={styles.inputIconImage} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm password</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={[styles.textInput, styles.textInputWithIcon]}
              placeholder="Enter here"
              placeholderTextColor="#C7C7CD"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.iconButton}
            >
              <Image source={eye} style={styles.inputIconImage} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>NEXT</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPhotoVerification = () => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image source={back} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Photo verification</Text>
          <Text style={styles.headerSubtitle}>
            Take a clear photo of your face for verification. No hats, sunglasses, or filters.
          </Text>
        </View>
      </View>

      <View style={styles.photoContainer}>
          <TouchableOpacity style={styles.photoPlaceholder}>
            <Image source={camera} style={styles.cameraIcon} />
          </TouchableOpacity>
      </View>

      <View style={styles.separatorLine} />

      <View style={styles.documentSection}>
        <Text style={styles.sectionTitle}>Document upload</Text>
        <Text style={styles.sectionSubtitle}>Upload your documents for verification.</Text>

        <View style={styles.documentInputGroup}>
          <Text style={styles.inputLabel}>Driver's licence</Text>
          <TouchableOpacity style={styles.uploadField}>
            <Text style={styles.uploadText}>Upload here</Text>
            <Image source={upload} style={styles.uploadIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.documentInputGroup}>
          <Text style={styles.inputLabel}>Licence number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="L/No AKW06968AA2"
            placeholderTextColor="#C7C7CD"
            value={formData.licenseNumber}
            onChangeText={(value) => handleInputChange('licenseNumber', value)}
          />
        </View>

        <View style={styles.documentInputGroup}>
          <Text style={styles.inputLabel}>Photo of truck</Text>
          <TouchableOpacity style={styles.uploadField}>
            <Text style={styles.uploadText}>Upload here</Text>
            <Image source={upload} style={styles.uploadIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleUpload}>
        <Text style={styles.nextButtonText}>UPLOAD</Text>
      </TouchableOpacity>
    </View>
  );

  const renderVerificationModal = () => (
    <Modal
      visible={showVerificationModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Verification in Progress</Text>
          <Text style={styles.modalText}>
            Thank you for submitting your documents. Our team will review them and reach-out within 
            24-48 hours once verification is complete.
          </Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => {
              setShowVerificationModal(false);
              navigation.navigate('DriverDashboard');
            }}
          >
            <Text style={styles.closeButtonText}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      {renderProgressBar()}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderPersonalDetails()}
        {currentStep === 2 && renderPhotoVerification()}
      </ScrollView>
      {renderVerificationModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#007AFF',
  },
  scrollContainer: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
    marginTop: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#007AFF',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 17,
    color: '#8E8E93',
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 17,
    color: '#000000',
    marginBottom: 8,
    fontWeight: '400',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 12,
    padding: 16,
    fontSize: 17,
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  textInputWithIcon: {
    paddingRight: 50,
  },
  inputWithIcon: {
    position: 'relative',
  },
  iconButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  inputIconImage: {
    width: 30,
    height: 20,
    tintColor: '#007AFF',
  },
  inputCalenderImage: {
    width: 24,
    height: 24,
    tintColor: '#007AFF',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  countryCode: {
    fontSize: 17,
    color: '#000000',
    paddingLeft: 16,
    paddingRight: 8,
    fontWeight: '400',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 0,
    margin: 0,
    paddingLeft: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  dropdownText: {
    fontSize: 17,
    color: '#000000',
  },
  placeholderText: {
    color: '#C7C7CD',
  },
  dropdownIcon: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  photoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E1F5FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 200,
    height: 200,
    tintColor: '#007AFF',
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 20,
  },
  documentSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 17,
    color: '#8E8E93',
    marginBottom: 30,
  },
  documentInputGroup: {
    marginBottom: 24,
  },
  uploadField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  uploadText: {
    fontSize: 17,
    color: '#C7C7CD',
  },
  uploadIcon: {
    width: 20,
    height: 20,
    tintColor: '#007AFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 30,
    paddingTop: 16,
    paddingBottom: 30,
    alignItems: 'center',
    minHeight: 300,
  },
  modalHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E5EA',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default DriverSignupScreen;