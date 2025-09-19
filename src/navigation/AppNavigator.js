import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Import screens
import {
  SplashScreen,
  OnboardingScreen,
  LoginScreen,
  SignUpScreen,
  RoleSelectionScreen,
  DashboardScreen,
  DeliveryDetailsScreen,
  TripDetailsScreen,
  DriverSearchScreen,
  DriverFoundScreen,
  DeliveryCompleteScreen,
  LoadBoardScreen,
  MyShipmentsScreen,
  DriverSignupScreen,
  DriverDashboardScreen,
  DriverLoadBoardScreen,
  DriverOnTheWayScreen,
  DriverDeliveryCompleteScreen,
} from '../screens';

const Stack = createNativeStackNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="DriverSignup" component={DriverSignupScreen} />
  </Stack.Navigator>
);

// Shipper Stack
const ShipperStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="DeliveryDetails" component={DeliveryDetailsScreen} />
    <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
    <Stack.Screen name="DriverSearch" component={DriverSearchScreen} />
    <Stack.Screen name="DriverFound" component={DriverFoundScreen} />
    <Stack.Screen name="DeliveryComplete" component={DeliveryCompleteScreen} />
    <Stack.Screen name="LoadBoard" component={LoadBoardScreen} />
    <Stack.Screen name="MyShipments" component={MyShipmentsScreen} />
  </Stack.Navigator>
);

// Driver Stack
const DriverStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="DriverDashboard" component={DriverDashboardScreen} />
    <Stack.Screen name="DriverLoadBoard" component={DriverLoadBoardScreen} />
    <Stack.Screen name="DriverOnTheWay" component={DriverOnTheWayScreen} />
    <Stack.Screen
      name="DriverDeliveryComplete"
      component={DriverDeliveryCompleteScreen}
    />
    <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
  </Stack.Navigator>
);

// Loading component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

const AppNavigator = () => {
  const { user, userType, loading, setNavigation } = useAuth();
  const navigationRef = useNavigationContainerRef();

  // Set navigation reference in AuthContext
  useEffect(() => {
    if (navigationRef.current) {
      setNavigation(navigationRef.current);
    }
  }, [navigationRef.current]);

  const [appIsReady, setAppIsReady] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Handle initial app loading and authentication state
  useEffect(() => {
    // Only show splash screen for initial app load
    const timer = setTimeout(() => {
      setAppIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Update initializing state when auth state is determined
  useEffect(() => {
    if (!loading) {
      setInitializing(false);
    }
  }, [loading]);

  // Determine the initial route based on authentication state
  const getInitialRouteName = () => {
    if (!user) return 'Auth';
    return userType === 'shipper' ? 'ShipperApp' : 'DriverApp';
  };

  // Show splash screen while app is initializing
  if (!appIsReady) {
    return <SplashScreen />;
  }

  // Show loading indicator while checking auth state
  if (loading && initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="ShipperApp" component={ShipperStack} />
        <Stack.Screen name="DriverApp" component={DriverStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
