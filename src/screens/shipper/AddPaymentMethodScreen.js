import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';

const AddPaymentMethodScreen = ({navigation}) => {
  const {user} = useAuth();
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const cardFlipAnim = new Animated.Value(0);
  const [showBack, setShowBack] = useState(false);

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const validateCard = () => {
    const newErrors = {};
    
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber || cleanCardNumber.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!cardHolder || cardHolder.trim().length < 3) {
      newErrors.cardHolder = 'Card holder name is required';
    }

    const expiryParts = expiryDate.split('/');
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    } else {
      const month = parseInt(expiryParts[0]);
      const year = parseInt('20' + expiryParts[1]);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateCard()) {
      return;
    }

    try {
      setSaving(true);

      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      const lastFourDigits = cleanCardNumber.substring(12);
      const cardType = detectCardType(cleanCardNumber);

      const paymentMethod = {
        userId: user?.uid,
        cardType,
        lastFourDigits,
        cardHolder: cardHolder.trim(),
        expiryDate,
        isDefault,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      // If this is set as default, unset other defaults
      if (isDefault) {
        const existingMethods = await firestore()
          .collection('paymentMethods')
          .where('userId', '==', user?.uid)
          .where('isDefault', '==', true)
          .get();

        const batch = firestore().batch();
        existingMethods.forEach(doc => {
          batch.update(doc.ref, {isDefault: false});
        });
        await batch.commit();
      }

      await firestore().collection('paymentMethods').add(paymentMethod);

      // Show success animation
      Animated.sequence([
        Animated.timing(cardFlipAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(cardFlipAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.goBack();
      });
    } catch (error) {
      console.error('Error saving payment method:', error);
      alert('Failed to save payment method. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const detectCardType = (number) => {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) {
        return type;
      }
    }
    return 'unknown';
  };

  const getCardIcon = () => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    const type = detectCardType(cleanNumber);
    
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
      unknown: '💳',
    };
    
    return icons[type] || icons.unknown;
  };

  const flipCard = () => {
    Animated.timing(cardFlipAnim, {
      toValue: showBack ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowBack(!showBack);
  };

  const frontInterpolate = cardFlipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = cardFlipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

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
        <Text style={styles.headerTitle}>Add Payment Method</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Card Preview */}
        <View style={styles.cardPreviewContainer}>
          <Animated.View
            style={[
              styles.cardPreview,
              {transform: [{rotateY: frontInterpolate}]},
              showBack && styles.cardHidden,
            ]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{getCardIcon()}</Text>
              <Text style={styles.cardType}>
                {detectCardType(cardNumber.replace(/\s/g, '')).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.cardNumberPreview}>
              {cardNumber || '•••• •••• •••• ••••'}
            </Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>CARD HOLDER</Text>
                <Text style={styles.cardValue}>
                  {cardHolder || 'YOUR NAME'}
                </Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>EXPIRES</Text>
                <Text style={styles.cardValue}>
                  {expiryDate || 'MM/YY'}
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.cardPreview,
              styles.cardBack,
              {transform: [{rotateY: backInterpolate}]},
              !showBack && styles.cardHidden,
            ]}>
            <View style={styles.magneticStripe} />
            <View style={styles.cvvContainer}>
              <Text style={styles.cvvLabel}>CVV</Text>
              <View style={styles.cvvBox}>
                <Text style={styles.cvvText}>{cvv || '•••'}</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Card Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={[styles.input, errors.cardNumber && styles.inputError]}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#999"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              keyboardType="number-pad"
              maxLength={19}
            />
            {errors.cardNumber && (
              <Text style={styles.errorText}>{errors.cardNumber}</Text>
            )}
          </View>

          {/* Card Holder */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Holder Name</Text>
            <TextInput
              style={[styles.input, errors.cardHolder && styles.inputError]}
              placeholder="John Doe"
              placeholderTextColor="#999"
              value={cardHolder}
              onChangeText={setCardHolder}
              autoCapitalize="words"
            />
            {errors.cardHolder && (
              <Text style={styles.errorText}>{errors.cardHolder}</Text>
            )}
          </View>

          {/* Expiry and CVV */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={[styles.input, errors.expiryDate && styles.inputError]}
                placeholder="MM/YY"
                placeholderTextColor="#999"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                keyboardType="number-pad"
                maxLength={5}
              />
              {errors.expiryDate && (
                <Text style={styles.errorText}>{errors.expiryDate}</Text>
              )}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <View style={styles.cvvHeader}>
                <Text style={styles.label}>CVV</Text>
                <TouchableOpacity onPress={flipCard}>
                  <Text style={styles.flipIcon}>🔄</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input, errors.cvv && styles.inputError]}
                placeholder="123"
                placeholderTextColor="#999"
                value={cvv}
                onChangeText={(text) => setCvv(text.replace(/\D/g, ''))}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                onFocus={flipCard}
                onBlur={() => showBack && flipCard()}
              />
              {errors.cvv && (
                <Text style={styles.errorText}>{errors.cvv}</Text>
              )}
            </View>
          </View>

          {/* Set as Default */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsDefault(!isDefault)}>
            <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
              {isDefault && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Set as default payment method</Text>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Add Payment Method</Text>
            )}
          </TouchableOpacity>

          {/* Security Note */}
          <View style={styles.securityNote}>
            <Text style={styles.securityIcon}>🔒</Text>
            <Text style={styles.securityText}>
              Your payment information is encrypted and secure
            </Text>
          </View>
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  cardPreviewContainer: {
    height: 220,
    marginBottom: 32,
  },
  cardPreview: {
    position: 'absolute',
    width: '100%',
    height: 200,
    backgroundColor: '#480000ff',
    borderRadius: 16,
    padding: 24,
    // elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#033283ff',
  },
  cardHidden: {
    // opacity: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  cardNumberPreview: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  magneticStripe: {
    width: '100%',
    height: 50,
    backgroundColor: '#000000',
    marginTop: 20,
    marginBottom: 20,
  },
  cvvContainer: {
    paddingHorizontal: 24,
  },
  cvvLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 8,
  },
  cvvBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 12,
    alignItems: 'flex-end',
  },
  cvvText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 2,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
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
  inputError: {
    borderColor: '#FF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  cvvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  flipIcon: {
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#8B5A9F',
    borderColor: '#8B5A9F',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#8B5A9F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#666',
  },
});

export default AddPaymentMethodScreen;
