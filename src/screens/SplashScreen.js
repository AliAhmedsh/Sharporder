import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';

const SplashScreen = () => {
  // No navigation logic here, just render the splash screen UI

  return (
    <View style={styles.splashContainer}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.logoContainer}>
        <Image source={require('../assets/splash.png')} style={styles.logoIcon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    width: 250,
    height: 250,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
