import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Modal,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Main App Component
const App = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showTruckSelector, setShowTruckSelector] = useState(false);
  const [showDriverSelection, setShowDriverSelection] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeliveryAlert, setShowDeliveryAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [alertResolved, setAlertResolved] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '+234 08012345678',
    password: '',
    confirmPassword: '',
    pickupAddress: '',
    deliveryAddress: '',
    truckType: '',
    loadDescription: '',
    recipientName: '',
    recipientNumber: '+234 08012345678',
    fareOffer: '10000',
  });

  const onboardingSteps = [
    {
      title: 'Ship with ease',
      description: 'Send packages anywhere with just a few taps. Our platform connects you with trusted drivers in your area.',
      image: '🚛',
    },
    {
      title: 'Choose your driver',
      description: 'Browse verified drivers, check their ratings, and select the perfect match for your delivery needs.',
      image: '📋',
    },
    {
      title: 'Real-time tracking',
      description: 'Track your package every step of the way with live updates and GPS monitoring for peace of mind.',
      image: '📍',
    },
    {
      title: 'Secure and reliable',
      description: 'Your packages are protected with insurance coverage and verified driver background checks.',
      image: '🔒',
    },
  ];

  const truckTypes = [
    {
      id: 1,
      name: 'Standard Rigid Dump Truck',
      capacity: '10-30 cubic yards',
      weight: '15-25 tons',
      tyres: '6',
      selected: true,
    },
    {
      id: 2,
      name: 'Articulated Dump Truck',
      capacity: '25-45 cubic yards',
      weight: '35-45 tons',
      tyres: '10',
      selected: false,
    },
    {
      id: 3,
      name: 'Transfer Dump Truck',
      capacity: '15-25 cubic yards',
      weight: '20-30 tons combined',
      tyres: '8',
      selected: false,
    },
    {
      id: 4,
      name: 'Super Dump Truck',
      capacity: '20-30 cubic yards',
      weight: '26-33 tons',
      tyres: '12',
      selected: false,
    },
    {
      id: 5,
      name: 'Semi-trailer End Dump Truck',
      capacity: '20-30 cubic yards',
      weight: '20-25 tons',
      tyres: '8',
      selected: false,
    },
  ];

  const drivers = [
    { id: 1, name: 'Kunle Alamu', rating: 4.5, deliveries: 50, price: 15000, time: '10 mins away' },
    { id: 2, name: 'Mohammed Babaginda', rating: 4.8, deliveries: 120, price: 12000, time: '10 mins away' },
    { id: 3, name: 'Chukwuebube Osinachi', rating: 4.8, deliveries: 120, price: 12000, time: '10 mins away' },
    { id: 4, name: 'Oghenetega Atufe', rating: 4.8, deliveries: 120, price: 12000, time: '10 mins away' },
    { id: 5, name: 'Oluwatomisin Alamu', rating: 4.5, deliveries: 50, price: 15000, time: '10 mins away' },
  ];

  // Splash Screen Component
  const SplashScreen = () => (
    <View style={styles.splashContainer}>
      <StatusBar backgroundColor="#00BFFF" barStyle="light-content" />
      <View style={styles.logoContainer}>
        <Text style={styles.logoIcon}>🚛</Text>
        <Text style={styles.logoText}>Sharporder</Text>
      </View>
    </View>
  );

  // Onboarding Screen Component
  const OnboardingScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={() => setCurrentScreen('login')}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.onboardingContent}>
        <View style={styles.imageContainer}>
          <Text style={styles.onboardingImage}>{onboardingSteps[currentOnboardingStep].image}</Text>
        </View>
        
        <Text style={styles.onboardingTitle}>{onboardingSteps[currentOnboardingStep].title}</Text>
        <Text style={styles.onboardingDescription}>{onboardingSteps[currentOnboardingStep].description}</Text>
        
        <View style={styles.dotsContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentOnboardingStep ? styles.activeDot : styles.inactiveDot
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => setCurrentScreen('login')}
        >
          <Text style={styles.outlineButtonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (currentOnboardingStep < onboardingSteps.length - 1) {
              setCurrentOnboardingStep(currentOnboardingStep + 1);
            } else {
              setCurrentScreen('signup');
            }
          }}
        >
          <Text style={styles.primaryButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // Sign Up Screen Component
  const SignUpScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView style={styles.formContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentScreen('onboarding')}>
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
                      setCurrentScreen('dashboard');
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

  // Login Screen Component
  const LoginScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView style={styles.formContainer}>
        <View style={styles.loginLogoContainer}>
          <Text style={styles.logoIcon}>🚛</Text>
          <Text style={styles.logoText}>Sharporder</Text>
        </View>

        <Text style={styles.loginTitle}>Welcome back</Text>
        <Text style={styles.loginSubtitle}>Sign in to your account to continue shipping</Text>

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

        <View style={styles.loginLinks}>
          <TouchableOpacity>
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentScreen('signup')}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.fullWidthButton}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <Text style={styles.fullWidthButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fingerprintButton}>
          <Text style={styles.fingerprintIcon}>👆</Text>
          <Text style={styles.fingerprintText}>LOGIN WITH FINGERPRINT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  // Dashboard/Booking Screen Component
  const DashboardScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>Map View</Text>
          <Text style={styles.mapLocationText}>📍 Lagos, Nigeria</Text>
        </View>
        
        <View style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>Book your delivery</Text>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Where are we going?"
              onFocus={() => setCurrentScreen('deliveryDetails')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );

  // Delivery Details Screen Component
  const DeliveryDetailsScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView style={styles.formContainer}>
        <Text style={styles.pageTitle}>Delivery details</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Pickup address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter here"
            value={formData.pickupAddress}
            onChangeText={(text) => setFormData({...formData, pickupAddress: text})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Delivery address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter here"
            value={formData.deliveryAddress}
            onChangeText={(text) => setFormData({...formData, deliveryAddress: text})}
          />
        </View>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowTruckSelector(true)}
        >
          <Text style={styles.inputLabel}>Truck type</Text>
          <View style={styles.selectInput}>
            <Text style={styles.selectText}>Select here</Text>
            <Text style={styles.selectArrow}>↓</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Load description</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter here"
            value={formData.loadDescription}
            onChangeText={(text) => setFormData({...formData, loadDescription: text})}
          />
        </View>

        <TouchableOpacity style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Load image (optional)</Text>
          <View style={styles.uploadContainer}>
            <Text style={styles.uploadText}>Upload here</Text>
            <Text style={styles.uploadIcon}>↑</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Recipient's name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter here"
            value={formData.recipientName}
            onChangeText={(text) => setFormData({...formData, recipientName: text})}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Recipient's number</Text>
          <TextInput
            style={styles.input}
            value={formData.recipientNumber}
            onChangeText={(text) => setFormData({...formData, recipientNumber: text})}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>I'm receiving it</Text>
          <View style={styles.toggle} />
        </View>

        <TouchableOpacity
          style={styles.fullWidthButton}
          onPress={() => setCurrentScreen('tripDetails')}
        >
          <Text style={styles.fullWidthButtonText}>CONTINUE</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Truck Selector Modal */}
      <Modal visible={showTruckSelector} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.truckModal}>
            <Text style={styles.modalTitle}>Select your truck</Text>
            <ScrollView>
              {truckTypes.map((truck) => (
                <TouchableOpacity
                  key={truck.id}
                  style={[styles.truckOption, truck.selected && styles.selectedTruckOption]}
                  onPress={() => {
                    setFormData({...formData, truckType: truck.name});
                    setShowTruckSelector(false);
                  }}
                >
                  <Text style={styles.truckIcon}>🚛</Text>
                  <View style={styles.truckDetails}>
                    <Text style={styles.truckName}>{truck.name}</Text>
                    <Text style={styles.truckSpec}>Capacity: {truck.capacity}</Text>
                    <Text style={styles.truckSpec}>Load weight: {truck.weight}</Text>
                    <Text style={styles.truckSpec}>Tyres: {truck.tyres}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );

  // Trip Details Screen Component
  const TripDetailsScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView style={styles.formContainer}>
        <Text style={styles.pageTitle}>Trip details</Text>

        <View style={styles.tripDetailCard}>
          <Text style={styles.inputLabel}>Pickup address</Text>
          <Text style={styles.addressText}>15 Bode Thomas Street, Surulere, Lagos</Text>
        </View>

        <View style={styles.tripDetailCard}>
          <Text style={styles.inputLabel}>Delivery address</Text>
          <Text style={styles.addressText}>35 Hakeem Dickson Street, Lekki Phase 1...</Text>
        </View>

        <View style={styles.truckSelectedCard}>
          <Text style={styles.truckIcon}>🚛</Text>
          <View style={styles.truckDetails}>
            <Text style={styles.truckName}>Standard Rigid Dump Truck</Text>
            <Text style={styles.truckSpec}>Capacity: 10-30 cubic yards</Text>
            <Text style={styles.truckSpec}>Load weight: 15-25 tons</Text>
            <Text style={styles.truckSpec}>Tyres: 6</Text>
          </View>
        </View>

        <View style={styles.tripDetailCard}>
          <Text style={styles.inputLabel}>Load description</Text>
          <Text style={styles.addressText}>Sharp sand for construction</Text>
        </View>

        <View style={styles.tripDetailCard}>
          <Text style={styles.inputLabel}>Load image</Text>
          <Text style={styles.addressText}>img_20250807.jpg ↑</Text>
        </View>

        <View style={styles.tripDetailCard}>
          <Text style={styles.inputLabel}>Recipient's name</Text>
          <Text style={styles.addressText}>Femi Otedola</Text>
        </View>

        <View style={styles.tripDetailCard}>
          <Text style={styles.inputLabel}>Recipient's number</Text>
          <Text style={styles.addressText}>+234 08012345678</Text>
        </View>

        <View style={styles.fareContainer}>
          <Text style={styles.inputLabel}>Fare offer</Text>
          <TextInput
            style={styles.fareInput}
            value={`NGN ${formData.fareOffer}`}
            onChangeText={(text) => setFormData({...formData, fareOffer: text.replace('NGN ', '')})}
          />
        </View>

        <Text style={styles.fareNote}>
          ⓘ Please note that the recommended minimum fare for this trip is NGN 10,000.
        </Text>

        <TouchableOpacity
          style={styles.fullWidthButton}
          onPress={() => setCurrentScreen('driverSearch')}
        >
          <Text style={styles.fullWidthButtonText}>SEARCH FOR DRIVER</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  // Driver Search Screen Component
  const DriverSearchScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.searchContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🔍 Looking for drivers...</Text>
        </View>
        
        <View style={styles.searchingCard}>
          <Text style={styles.searchingTitle}>Looking for an available driver</Text>
          <Text style={styles.searchingSubtitle}>Waiting for an available driver to confirm</Text>
          <Text style={styles.driversCount}>6 drivers are considering your request</Text>
          
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          
          <Text style={styles.fareOffer}>Your fare offer: NGN 10000</Text>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowDriverSelection(true)}
          >
            <Text style={styles.cancelButtonText}>CANCEL REQUEST</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Driver Selection Modal */}
      <Modal visible={showDriverSelection} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.driverSelectionModal}>
            {drivers.map((driver) => (
              <View key={driver.id} style={styles.driverCard}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverAvatarText}>👤</Text>
                </View>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{driver.name}</Text>
                  <Text style={styles.driverRating}>⭐ {driver.rating} {driver.deliveries} successful deliveries</Text>
                  <Text style={styles.driverTime}>{driver.time}</Text>
                  <Text style={styles.driverPrice}>NGN {driver.price.toLocaleString()}</Text>
                </View>
                <View style={styles.driverActions}>
                  <TouchableOpacity style={styles.declineButton}>
                    <Text style={styles.declineButtonText}>DECLINE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => {
                      setShowDriverSelection(false);
                      setShowPaymentModal(true);
                    }}
                  >
                    <Text style={styles.acceptButtonText}>ACCEPT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={styles.cancelRequestButton}
              onPress={() => setShowDriverSelection(false)}
            >
              <Text style={styles.cancelRequestButtonText}>CANCEL REQUEST</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModal}>
            <Text style={styles.modalTitle}>Choose a payment method</Text>
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total amount due</Text>
              <Text style={styles.totalAmount}>NGN 15000</Text>
            </View>
            
            <View style={styles.paymentOption}>
              <Text style={styles.paystackLogo}>≡ paystack</Text>
              <View style={styles.radioSelected} />
            </View>
            
            <TouchableOpacity
              style={styles.fullWidthButton}
              onPress={() => {
                setShowPaymentModal(false);
                setCurrentScreen('driverFound');
              }}
            >
              <Text style={styles.fullWidthButtonText}>CONFIRM AND PAY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );

  // Driver Found Screen Component
  const DriverFoundScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🗺️ Driver Location</Text>
          <Text style={styles.mapLocationText}>📍 Pickup Location</Text>
        </View>
        
        <View style={styles.driverFoundCard}>
          <Text style={styles.driverFoundTitle}>Driver found</Text>
          <Text style={styles.driverFoundSubtitle}>The driver is on the way to you</Text>
          
          <View style={styles.assignedDriverCard}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverAvatarText}>👤</Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>Kunle Alamu</Text>
              <Text style={styles.driverRating}>⭐ 4.8 50 successful deliveries</Text>
              <Text style={styles.driverDetails}>Standard Rigid Dump Truck</Text>
              <Text style={styles.driverDetails}>LSR 123 AB • 10 mins away</Text>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.callButton}>
                <Text style={styles.actionButtonText}>📞 Call driver</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.messageButton}
                onPress={() => {
                  setTimeout(() => setShowDeliveryAlert(true), 2000);
                }}
              >
                <Text style={styles.actionButtonText}>💬 Message</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>CANCEL REQUEST</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Delivery Alert Modal */}
      <Modal visible={showDeliveryAlert} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.alertModal}>
            <Text style={styles.alertTitle}>Delivery alert!</Text>
            
            <View style={[styles.alertCard, alertResolved && styles.resolvedAlert]}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <View style={styles.alertContent}>
                <Text style={styles.alertType}>Route diversion</Text>
                <Text style={styles.alertDescription}>
                  The driver has deviated from the planned route.
                </Text>
                <Text style={styles.alertDetails}>Detected at: 3:28 PM</Text>
                <Text style={styles.alertDetails}>Deviation: 1.5 km off route</Text>
                
                {alertResolved && (
                  <View style={styles.resolvedMessage}>
                    <Text style={styles.resolvedText}>
                      The issue has been resolved and the driver is enroute the right destination.
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.locationDetails}>
              <Text style={styles.locationTitle}>Location details</Text>
              <View style={styles.locationItem}>
                <Text style={styles.locationPin}>📍</Text>
                <View>
                  <Text style={styles.locationLabel}>Current location</Text>
                  <Text style={styles.locationText}>Orile Iganmu</Text>
                </View>
              </View>
              <View style={styles.locationItem}>
                <Text style={styles.locationPin}>📍</Text>
                <View>
                  <Text style={styles.locationLabel}>Expected location</Text>
                  <Text style={styles.locationText}>Hakeem Dickson, Lekki</Text>
                </View>
              </View>
            </View>
            
            {!alertResolved && (
              <View style={styles.quickActions}>
                <Text style={styles.quickActionsTitle}>Quick actions</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.quickActionButton}>
                    <Text style={styles.quickActionText}>📞 Call driver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickActionButton}>
                    <Text style={styles.quickActionText}>💬 Message driver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.ignoreButton}
                    onPress={() => setAlertResolved(true)}
                  >
                    <Text style={styles.ignoreText}>🚫 Ignore</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowDeliveryAlert(false);
                if (alertResolved) {
                  setTimeout(() => setShowSuccessModal(true), 1000);
                }
              }}
            >
              <Text style={styles.closeButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Delivery successful!</Text>
            <Text style={styles.successDescription}>
              Your order was delivered by Kunle Alamu at 3:45 PM. We hope everything met your 
              expectations and would appreciate your feedback to help us improve.
            </Text>
            
            <Text style={styles.rateTitle}>Rate your delivery</Text>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} style={styles.star}>
                  <Text style={styles.starText}>⭐</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => setCurrentScreen('deliveryComplete')}
            >
              <Text style={styles.outlineButtonText}>VIEW RECEIPT</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.fullWidthButton}
              onPress={() => {
                setShowSuccessModal(false);
                setCurrentScreen('deliveryComplete');
              }}
            >
              <Text style={styles.fullWidthButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );

  // Delivery Complete Screen Component
  const DeliveryCompleteScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView style={styles.formContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentScreen('dashboard')}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Delivery complete</Text>
            <Text style={styles.headerSubtitle}>Your package has been successfully delivered.</Text>
          </View>
        </View>

        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🗺️ Delivery Route</Text>
          <Text style={styles.mapLocationText}>📍 Route Completed</Text>
        </View>

        <View style={styles.deliveryCompleteCard}>
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverAvatarText}>👤</Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>Kunle Alamu</Text>
              <Text style={styles.driverDetails}>Standard Rigid Dump Truck</Text>
              <Text style={styles.driverDetails}>LSR 123 AB</Text>
            </View>
            <View style={styles.deliveryMeta}>
              <Text style={styles.deliveryDate}>10/07/2025 12:58 PM</Text>
              <Text style={styles.deliveryPrice}>NGN 12,500</Text>
            </View>
          </View>

          <View style={styles.routeInfo}>
            <View style={styles.routeItem}>
              <Text style={styles.routeIcon}>🟢</Text>
              <View style={styles.routeDetails}>
                <Text style={styles.routeAddress}>15 Bode Thomas Street, Surulere, Lagos</Text>
                <Text style={styles.routeTime}>08:30 AM</Text>
              </View>
            </View>
            <View style={styles.routeItem}>
              <Text style={styles.routeIcon}>🟣</Text>
              <View style={styles.routeDetails}>
                <Text style={styles.routeAddress}>35 Hakeem Dickson Street, Lekki Phase 1...</Text>
                <Text style={styles.routeTime}>12:58 PM</Text>
              </View>
            </View>
          </View>

          <Text style={styles.rateTitle}>Rate your delivery</Text>
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} style={styles.star}>
                <Text style={styles.starText}>⭐</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>🧾</Text>
            </View>
            <Text style={styles.actionText}>Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>🎧</Text>
            </View>
            <Text style={styles.actionText}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>↩️</Text>
            </View>
            <Text style={styles.actionText}>Return trip</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => setCurrentScreen('dashboard')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>🔄</Text>
            </View>
            <Text style={styles.actionText}>Repeat delivery</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // Render current screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'signup':
        return <SignUpScreen />;
      case 'login':
        return <LoginScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'deliveryDetails':
        return <DeliveryDetailsScreen />;
      case 'tripDetails':
        return <TripDetailsScreen />;
      case 'driverSearch':
        return <DriverSearchScreen />;
      case 'driverFound':
        return <DriverFoundScreen />;
      case 'deliveryComplete':
        return <DeliveryCompleteScreen />;
      default:
        return <SplashScreen />;
    }
  };

  // Auto-navigate from splash to onboarding
  React.useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('onboarding');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  return renderCurrentScreen();
};

// Styles
const styles = StyleSheet.create({
  // Base Styles
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  // Splash Screen Styles
  splashContainer: {
    flex: 1,
    backgroundColor: '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  // Onboarding Styles
  skipContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipText: {
    color: '#00BFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  onboardingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  imageContainer: {
    marginBottom: 60,
  },
  onboardingImage: {
    fontSize: 120,
  },
  onboardingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  onboardingDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#00BFFF',
  },
  inactiveDot: {
    backgroundColor: '#E0E0E0',
  },

  // Button Styles
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 15,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#00BFFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#00BFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#00BFFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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

  // Form Styles
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
  selectInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#999999',
  },
  selectArrow: {
    fontSize: 16,
    color: '#00BFFF',
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

  // Login Styles
  loginLogoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
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
  loginLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
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

  // Dashboard/Map Styles
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666666',
  },
  mapLocationText: {
    fontSize: 16,
    color: '#999999',
    marginTop: 10,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  bookingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#F8F8F8',
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
    color: '#999999',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },

  // Modal Styles
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

  // Truck Selection Modal
  truckModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  truckOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedTruckOption: {
    borderColor: '#00BFFF',
    backgroundColor: '#F0F8FF',
  },
  truckIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  truckDetails: {
    flex: 1,
  },
  truckName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  truckSpec: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },

  // Trip Details Styles
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 30,
  },
  tripDetailCard: {
    marginBottom: 20,
  },
  addressText: {
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  truckSelectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#F8F8F8',
  },
  fareContainer: {
    marginBottom: 20,
  },
  fareInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  fareNote: {
    fontSize: 14,
    color: '#FF6B35',
    marginBottom: 30,
    paddingHorizontal: 10,
  },

  // Upload Styles
  uploadContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#999999',
  },
  uploadIcon: {
    fontSize: 16,
    color: '#00BFFF',
  },

  // Toggle Styles
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  toggleText: {
    fontSize: 16,
    color: '#333333',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00BFFF',
  },

  // Driver Search Styles
  searchContainer: {
    flex: 1,
  },
  searchingCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  searchingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  searchingSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  driversCount: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00BFFF',
    borderRadius: 2,
    width: '60%',
  },
  fareOffer: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Driver Selection Modal
  driverSelectionModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: height * 0.8,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  driverAvatarText: {
    fontSize: 20,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  driverRating: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  driverTime: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 5,
  },
  driverPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  driverActions: {
    alignItems: 'flex-end',
  },
  declineButton: {
    borderWidth: 1,
    borderColor: '#00BFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  declineButtonText: {
    color: '#00BFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#00BFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Payment Modal
  paymentModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#00BFFF',
    borderRadius: 10,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 30,
  },
  paystackLogo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00BFFF',
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00BFFF',
  },

  // Driver Found Styles
  driverFoundCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  driverFoundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  driverFoundSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  assignedDriverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  driverDetails: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  callButton: {
    backgroundColor: '#00BFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 5,
  },
  messageButton: {
    backgroundColor: '#00BFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Alert Modal Styles
  alertModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: height * 0.8,
  },
  alertTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  alertCard: {
    flexDirection: 'row',
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFA500',
    borderRadius: 10,
    backgroundColor: '#FFF8E1',
    marginBottom: 20,
  },
  resolvedAlert: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  alertContent: {
    flex: 1,
  },
  alertType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  alertDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  alertDetails: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 2,
  },
  resolvedMessage: {
    backgroundColor: '#C8E6C9',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  resolvedText: {
    fontSize: 14,
    color: '#2E7D32',
  },
  locationDetails: {
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationPin: {
    fontSize: 16,
    marginRight: 15,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  locationText: {
    fontSize: 14,
    color: '#666666',
  },
  quickActions: {
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickActionButton: {
    backgroundColor: '#00BFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  ignoreButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ignoreText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Success Modal Styles
  successModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  successDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  rateTitle: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 15,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 10,
  },
  star: {
    padding: 5,
  },
  starText: {
    fontSize: 24,
  },

  // Delivery Complete Styles
  deliveryCompleteCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  deliveryMeta: {
    alignItems: 'flex-end',
  },
  deliveryDate: {
    fontSize: 12,
    color: '#999999',
  },
  deliveryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  routeInfo: {
    marginBottom: 20,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  routeIcon: {
    fontSize: 16,
    marginRight: 15,
    marginTop: 2,
  },
  routeDetails: {
    flex: 1,
  },
  routeAddress: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5,
  },
  routeTime: {
    fontSize: 14,
    color: '#666666',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },

  // Additional Button Styles
  cancelRequestButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  cancelRequestButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;