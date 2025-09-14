import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  Image, 
  Alert,
  ActivityIndicator,
  Modal 
} from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import back from '../../assets/icons/back.png';
import eye from '../../assets/icons/eye.png';

const SignUpScreen = ({ navigation }) => {
  const { formData, setFormData } = useAppContext();
  const { signUp, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleBack = () => {
    navigation.goBack();
  };

  const validateForm = () => {
    const errors = {};

    // Business name validation
    if (!formData.businessName.trim()) {
      errors.businessName = 'Business name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formData.phone.length < 10) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Terms and conditions validation
    if (!isChecked) {
      errors.terms = 'Please agree to the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const userData = {
        businessName: formData.businessName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        status: 'pending_verification',
        profileComplete: false,
        userType: 'shipper',
        createdAt: new Date().toISOString(),
      };

      const result = await signUp(
        formData.email.trim(),
        formData.password,
        userData,
        'shipper'
      );

      if (result && result.success) {
        // Reset form data
        setFormData({
          businessName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });
        
        // Show verification modal
        setShowVerificationModal(true);
        
        // The AuthContext will handle the navigation after successful signup
      } else {
        const errorMessage = result?.error || 'Failed to create account. Please try again.';
        Alert.alert('Sign Up Failed', errorMessage);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error?.message || 'An unexpected error occurred. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const renderInputError = (fieldName) => {
    if (validationErrors[fieldName]) {
      return (
        <Text style={styles.errorText}>{validationErrors[fieldName]}</Text>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      {/* Verification Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showVerificationModal}
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Account Created Successfully!</Text>
            <Text style={styles.modalText}>
              Your account has been created. You'll be redirected to the dashboard shortly.
            </Text>
          </View>
        </View>
      </Modal>
      
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Image source={back} style={styles.backArrow} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Create your account</Text>
            <Text style={styles.headerSubtitle}>Please provide accurate details to proceed</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Business name</Text>
          <TextInput
            style={[
              styles.input,
              validationErrors.businessName && styles.inputError
            ]}
            placeholder="Business name"
            value={formData.businessName}
            onChangeText={(text) => {
              setFormData({...formData, businessName: text});
              if (validationErrors.businessName) {
                setValidationErrors({...validationErrors, businessName: null});
              }
            }}
            placeholderTextColor="#C0C0C0"
            editable={!loading}
          />
          {renderInputError('businessName')}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email address</Text>
          <TextInput
            style={[
              styles.input,
              validationErrors.email && styles.inputError
            ]}
            placeholder="Email address"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({...formData, email: text});
              if (validationErrors.email) {
                setValidationErrors({...validationErrors, email: null});
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#C0C0C0"
            editable={!loading}
          />
          {renderInputError('email')}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone number</Text>
          <TextInput
            style={[
              styles.input,
              validationErrors.phone && styles.inputError
            ]}
            placeholder="+234 08012345678"
            value={formData.phone}
            onChangeText={(text) => {
              setFormData({...formData, phone: text});
              if (validationErrors.phone) {
                setValidationErrors({...validationErrors, phone: null});
              }
            }}
            keyboardType="phone-pad"
            placeholderTextColor="#C0C0C0"
            editable={!loading}
          />
          {renderInputError('phone')}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={[
            styles.passwordContainer,
            validationErrors.password && styles.inputError
          ]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter here"
              value={formData.password}
              onChangeText={(text) => {
                setFormData({...formData, password: text});
                if (validationErrors.password) {
                  setValidationErrors({...validationErrors, password: null});
                }
              }}
              secureTextEntry={!showPassword}
              placeholderTextColor="#C0C0C0"
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              disabled={loading}
            >
              <Image source={eye} style={styles.eyeIcon}/>
            </TouchableOpacity>
          </View>
          {renderInputError('password')}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm password</Text>
          <View style={[
            styles.passwordContainer,
            validationErrors.confirmPassword && styles.inputError
          ]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter here"
              value={formData.confirmPassword}
              onChangeText={(text) => {
                setFormData({...formData, confirmPassword: text});
                if (validationErrors.confirmPassword) {
                  setValidationErrors({...validationErrors, confirmPassword: null});
                }
              }}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#C0C0C0"
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
              disabled={loading}
            >
              <Image source={eye} style={styles.eyeIcon}/>
            </TouchableOpacity>
          </View>
          {renderInputError('confirmPassword')}
        </View>

        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => {
            if (!loading) {
              setIsChecked(!isChecked);
              if (validationErrors.terms) {
                setValidationErrors({...validationErrors, terms: null});
              }
            }
          }}
          disabled={loading}
        >
          <View style={[
            styles.checkbox, 
            isChecked && styles.checkboxChecked,
            validationErrors.terms && styles.checkboxError
          ]}>
            {isChecked && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxText}>
            I agree to the <Text style={styles.linkText}>Terms and Conditions</Text> and{' '}
            <Text style={styles.linkText}>Privacy policy</Text> of this platform
          </Text>
        </TouchableOpacity>
        {renderInputError('terms')}

        <TouchableOpacity
          style={[
            styles.fullWidthButton,
            loading && styles.buttonDisabled
          ]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.fullWidthButtonText}>CREATE ACCOUNT</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signInContainer}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  backArrow: {
    width: 20,
    height: 20,
    tintColor: '#007AFF',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333333',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  eyeIcon: {
    width: 30,
    height: 20,
    tintColor: '#007AFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 3,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkboxError: {
    borderColor: '#FF3B30',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  linkText: {
    color: '#007AFF',
  },
  fullWidthButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  fullWidthButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  signInContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  signInText: {
    fontSize: 14,
    color: '#666666',
  },
  signInLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default SignUpScreen;