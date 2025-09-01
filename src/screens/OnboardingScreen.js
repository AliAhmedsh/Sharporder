import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAppContext } from '../context/AppContext';

const OnboardingScreen = ({ navigation }) => {
  const { currentOnboardingStep, setCurrentOnboardingStep, onboardingSteps } =
    useAppContext();

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const handleNext = () => {
    if (currentOnboardingStep < onboardingSteps.length - 1) {
      setCurrentOnboardingStep(currentOnboardingStep + 1);
    } else {
      navigation.navigate('SignUp');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.onboardingContent}>
        <View style={styles.imageContainer}>
          <Text style={styles.onboardingImage}>
            {onboardingSteps[currentOnboardingStep].image}
          </Text>
        </View>

        <Text style={styles.onboardingTitle}>
          {onboardingSteps[currentOnboardingStep].title}
        </Text>
        <Text style={styles.onboardingDescription}>
          {onboardingSteps[currentOnboardingStep].description}
        </Text>

        <View style={styles.dotsContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentOnboardingStep
                  ? styles.activeDot
                  : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.outlineButton} onPress={handleLogin}>
          <Text style={styles.outlineButtonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
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
});

export default OnboardingScreen;
