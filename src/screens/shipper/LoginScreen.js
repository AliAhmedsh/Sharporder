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
} from 'react-native';
import { useAppContext } from '../../context/AppContext';
import logo from '../../assets/icons/logo.png';
// import fingerprint from '../../assets/icons/fingerprint.png';
import eye from '../../assets/icons/eye.png';

const LoginScreen = ({ navigation }) => {
  const { formData, setFormData } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    navigation.navigate('Dashboard');
  };

  const handleSignUp = () => {
    navigation.navigate('RoleSelection');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView 
        style={styles.formContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.loginLogoContainer}>
          <Image source={logo} style={styles.logoImage} />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.loginTitle}>Welcome back</Text>
          <Text style={styles.loginSubtitle}>
            Sign in to your account to continue shipping
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone number</Text>
            <TextInput
              style={styles.input}
              placeholder="+234 08012345678"
              value={formData.phone}
              onChangeText={text => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
              placeholderTextColor="#C0C0C0"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter here"
                value={formData.password}
                onChangeText={text => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
                placeholderTextColor="#C0C0C0"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Image source={eye} style={styles.eyeIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.loginLinks}>
            <TouchableOpacity>
              <Text style={styles.signUpText}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.linkText}>Don't have an account? <Text style={styles.signUpText}>Sign up</Text></Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.fullWidthButton} onPress={handleLogin}>
            <Text style={styles.fullWidthButtonText}>LOGIN</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.fingerprintButton}>
            <Image source={fingerprint} style={styles.fingerprintIcon} />
            <Text style={styles.fingerprintText}>LOGIN WITH FINGERPRINT</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  loginLogoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 0,
  },
  logoImage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  formSection: {
    flex: 1,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 40,
    lineHeight: 20,
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
  loginLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  linkText: {
    color: '#000000',
    fontSize: 14,
  },
  signUpText: {
    fontWeight: '600',
    color: '#007AFF',
  },
  fullWidthButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  fullWidthButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // fingerprintButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingVertical: 16,
  // },
  // fingerprintIcon: {
  //   width: 24,
  //   height: 24,
  //   marginRight: 10,
  //   tintColor: '#007AFF',
  // },
  // fingerprintText: {
  //   color: '#007AFF',
  //   fontSize: 14,
  //   fontWeight: '600',
  //   letterSpacing: 0.5,
  // },
  
});

export default LoginScreen;