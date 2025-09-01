import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAppContext } from '../context/AppContext';

const LoginScreen = ({ navigation }) => {
  const { formData, setFormData } = useAppContext();

  const handleLogin = () => {
    navigation.navigate('Dashboard');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView style={styles.formContainer}>
        <View style={styles.loginLogoContainer}>
          <Text style={styles.logoIcon}>🚛</Text>
          <Text style={styles.logoText}>Sharporder</Text>
        </View>

        <Text style={styles.loginTitle}>Welcome back</Text>
        <Text style={styles.loginSubtitle}>
          Sign in to your account to continue shipping
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone number</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={text => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter here"
            value={formData.password}
            onChangeText={text => setFormData({ ...formData, password: text })}
            secureTextEntry
          />
        </View>

        <View style={styles.loginLinks}>
          <TouchableOpacity>
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.fullWidthButton} onPress={handleLogin}>
          <Text style={styles.fullWidthButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fingerprintButton}>
          <Text style={styles.fingerprintIcon}>👆</Text>
          <Text style={styles.fingerprintText}>LOGIN WITH FINGERPRINT</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  loginLogoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  logoIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#00BFFF',
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
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
  loginLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  linkText: {
    color: '#00BFFF',
    fontSize: 14,
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
  fingerprintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  fingerprintIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  fingerprintText: {
    color: '#00BFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
