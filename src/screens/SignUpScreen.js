import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, StatusBar, Modal } from 'react-native';
import { useAppContext } from '../context/AppContext';

const SignUpScreen = ({ navigation }) => {
  const { 
    formData, 
    setFormData, 
    showOTPModal, 
    setShowOTPModal 
  } = useAppContext();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOTPComplete = () => {
    navigation.navigate('Dashboard');
  };

  return (
  <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
    <ScrollView style={styles.formContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create your account</Text>
        <Text style={styles.headerSubtitle}>Please provide accurate details to proceed</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Business name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={formData.fullName}
          onChangeText={(text) => setFormData({...formData, fullName: text})}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email address</Text>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Phone number</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => setFormData({...formData, phone: text})}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter here"
          value={formData.password}
          onChangeText={(text) => setFormData({...formData, password: text})}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Confirm password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter here"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
          secureTextEntry
        />
      </View>

      <View style={styles.checkboxContainer}>
        <View style={styles.checkbox} />
        <Text style={styles.checkboxText}>
          I agree to the <Text style={styles.linkText}>Terms and Conditions</Text> and{' '}
          <Text style={styles.linkText}>Privacy policy</Text> of this platform
        </Text>
      </View>

      <TouchableOpacity
        style={styles.fullWidthButton}
        onPress={() => setShowOTPModal(true)}
      >
        <Text style={styles.fullWidthButtonText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>
    </ScrollView>

    {/* OTP Modal */}
    <Modal visible={showOTPModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.otpModal}>
          <Text style={styles.otpTitle}>OTP verification</Text>
          <Text style={styles.otpDescription}>
            Enter the 5 digit code sent to your registered phone number below to verify your account.
          </Text>
          
          <View style={styles.otpInputContainer}>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <View key={index} style={styles.otpInput} />
            ))}
          </View>
          
          <View style={styles.keypadContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number, index) => (
              <TouchableOpacity
                key={index}
                style={styles.keypadButton}
                onPress={() => {
                  if (index === 9) {
                    setShowOTPModal(false);
                    handleOTPComplete();
                  }
                }}
              >
                <Text style={styles.keypadButtonText}>{number}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.keypadButton}>
              <Text style={styles.keypadButtonText}>DELETE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 30,
  },
  backArrow: {
    fontSize: 24,
    color: '#00BFFF',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#00BFFF',
    borderRadius: 4,
    marginRight: 10,
    marginTop: 2,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  linkText: {
    color: '#00BFFF',
  },
  fullWidthButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  fullWidthButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  otpModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: 'center',
  },
  otpTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  otpDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  otpInputContainer: {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 15,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
  },
  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    maxWidth: 250,
  },
  keypadButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
});

export default SignUpScreen;
