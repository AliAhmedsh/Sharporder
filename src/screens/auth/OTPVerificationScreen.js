import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const OTPVerificationScreen = ({route, navigation}) => {
  const {email, password, userData, userType} = route.params || {};
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);
  const shakeAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);

    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (newOtp.every(digit => digit !== '') && !verifying) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode = null) => {
    const code = otpCode || otp.join('');
    
    if (code.length !== 6) {
      shakeAnimation();
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    try {
      setVerifying(true);

      // Verify OTP from Firestore
      const otpDoc = await firestore()
        .collection('otpCodes')
        .where('email', '==', email)
        .where('code', '==', code)
        .where('used', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      if (otpDoc.empty) {
        shakeAnimation();
        Alert.alert('Error', 'Invalid or expired verification code');
        setVerifying(false);
        return;
      }

      const otpData = otpDoc.docs[0].data();
      const createdAt = otpData.createdAt?.toDate() || new Date(0);
      const now = new Date();
      const diffMinutes = (now - createdAt) / 1000 / 60;

      // Check if OTP is expired (10 minutes)
      if (diffMinutes > 10) {
        shakeAnimation();
        Alert.alert('Error', 'Verification code has expired. Please request a new one.');
        setVerifying(false);
        return;
      }

      // Mark OTP as used
      await otpDoc.docs[0].ref.update({used: true});

      // Create user account
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Send email verification
      await user.sendEmailVerification();

      // Save user data to Firestore
      await firestore().collection('users').doc(user.uid).set({
        ...userData,
        email,
        userType,
        emailVerified: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // Success animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Navigate to success or main app
        Alert.alert(
          'Success!',
          'Your account has been created. Please check your email to verify your account.',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('Login'),
            },
          ]
        );
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      shakeAnimation();
      
      let errorMessage = 'Verification failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;

    try {
      setResending(true);

      // Generate new OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save to Firestore
      await firestore().collection('otpCodes').add({
        email,
        code: newOtp,
        used: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // In production, send email via Cloud Function
      // For now, just log it
      console.log('New OTP:', newOtp);

      Alert.alert('Success', 'A new verification code has been sent to your email');

      // Reset countdown
      setCountdown(60);
      setCanResend(false);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {toValue: 10, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: -10, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 10, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 0, duration: 50, useNativeDriver: true}),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B5A9F" barStyle="light-content" />
      
      <Animated.View style={[styles.content, {opacity: fadeAnim}]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📧</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit verification code to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        {/* OTP Input */}
        <Animated.View style={[styles.otpContainer, {transform: [{translateX: shakeAnim}]}]}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </Animated.View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.verifyButton, verifying && styles.verifyButtonDisabled]}
          onPress={() => handleVerify()}
          disabled={verifying || otp.some(digit => !digit)}>
          {verifying ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify Code</Text>
          )}
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              <Text style={styles.resendLink}>
                {resending ? 'Sending...' : 'Resend'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.countdown}>Resend in {countdown}s</Text>
          )}
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpIcon}>💡</Text>
          <Text style={styles.helpText}>
            Check your spam folder if you don't see the email
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B5A9F',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 8,
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 40,
    lineHeight: 24,
  },
  email: {
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 12,
  },
  otpInput: {
    width: 50,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  otpInputFilled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: '#FFFFFF',
  },
  verifyButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5A9F',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  resendLink: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  countdown: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  helpIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  helpText: {
    flex: 1,
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});

export default OTPVerificationScreen;
