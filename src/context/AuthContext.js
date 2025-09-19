import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import auth from '@react-native-firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  writeBatch,
} from '@react-native-firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  deleteUser,
} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'shipper' or 'driver'
  const [loading, setLoading] = useState(true);
  const navigationRef = useRef();
  const [initializing, setInitializing] = useState(true);

  // Load user data from storage on initial load
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userString = await AsyncStorage.getItem('@user');
        const userTypeString = await AsyncStorage.getItem('@userType');

        if (userString && userTypeString) {
          setUser(JSON.parse(userString));
          setUserType(userTypeString);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setInitializing(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Set navigation reference
  const setNavigation = navigation => {
    navigationRef.current = navigation;
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        setUser(user);
        // Get user type from Firestore
        try {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', user.uid));

          if (userDoc.exists && userDoc.data()) {
            const userData = userDoc.data();
            if (!userData || typeof userData !== 'object') {
              console.error('Invalid user data format:', userData);
              throw new Error('Invalid user data format');
            }

            if (!userData.userType) {
              console.warn(
                'User document exists but userType is missing. User data:',
                userData,
              );
              // Handle case where userType is missing
              await AsyncStorage.setItem('@user', JSON.stringify(user));
              // Consider redirecting to a screen to complete profile or set userType
              if (navigationRef.current) {
                navigationRef.current.navigate('RoleSelection');
              }
              return;
            }

            setUserType(userData.userType);
            // Save to AsyncStorage
            await AsyncStorage.setItem('@user', JSON.stringify(user));
            await AsyncStorage.setItem('@userType', userData.userType);
          } else {
            console.log('User document does not exist for UID:', user.uid);
            // Handle case where user document doesn't exist
            // This could happen if user registration didn't complete properly
            await AsyncStorage.setItem('@user', JSON.stringify(user));
            if (navigationRef.current) {
              navigationRef.current.navigate('RoleSelection');
            }
          }
        } catch (error) {
          console.error('Error in auth state change handler:', {
            error: error.message,
            stack: error.stack,
            userUid: user?.uid,
          });

          // Set a default user type or handle the error appropriately
          setUserType(null);
          try {
            await AsyncStorage.multiRemove(['@user', '@userType']);
          } catch (storageError) {
            console.error('Error clearing storage on error:', storageError);
          }
          if (navigationRef.current) {
            navigationRef.current.navigate('Login');
          }
        }
      } else {
        // User is signed out
        console.log('User signed out');
        setUser(null);
        setUserType(null);
        // Clear storage on sign out
        try {
          await AsyncStorage.multiRemove(['@user', '@userType']);
        } catch (storageError) {
          console.error('Error clearing storage on sign out:', storageError);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();

    return unsubscribe;
  }, []);

  // Save user data to Firestore
  const saveUserToFirestore = async (uid, userData) => {
    const db = getFirestore();
    const userRef = doc(db, 'users', uid);

    await setDoc(
      userRef,
      {
        ...userData,
        updatedAt: serverTimestamp(),
      },
      {merge: true},
    );

    return true;
  };

  // Sign up function for both shipper and driver
  const signUp = async (email, password, userData, type) => {
    try {
      setLoading(true);

      // Create user with email and password using the auth instance
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const {user} = userCredential;

      if (!user) {
        throw new Error('User creation failed');
      }

      // Prepare user data for Firestore
      const displayName =
        userData.businessName ||
        `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
      const userProfile = {
        uid: user.uid,
        email: user.email,
        userType: type,
        displayName,
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Save user data to Firestore
      await saveUserToFirestore(user.uid, userProfile);

      // Update user profile with display name
      await user.updateProfile({
        displayName,
      });

      // Create a clean user object with updated profile
      const updatedUser = {
        ...user,
        ...userProfile,
      };

      // Update local state
      setUser(updatedUser);
      setUserType(type);

      // Save to AsyncStorage
      await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
      await AsyncStorage.setItem('@userType', type);

      return {
        success: true,
        user: updatedUser,
        userType: type,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: getAuthErrorMessage(error.code),
      };
    } finally {
      setLoading(false);
    }
  };

  // Get user data from Firestore
  const getUserDataFromFirestore = async uid => {
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, 'users', uid));

    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    return userDoc.data();
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);

      // Sign in with email and password using the auth instance
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const {user} = userCredential;

      if (!user) {
        throw new Error('No user returned from authentication');
      }

      try {
        // Get user data from Firestore
        const userData = await getUserDataFromFirestore(user.uid);
        const userType = userData.userType || 'shipper'; // Default to shipper if not set

        // Create updated user object with profile data
        const updatedUser = {
          ...user,
          ...userData,
          displayName:
            userData.displayName || user.displayName || email.split('@')[0],
        };

        // Update local state
        setUser(updatedUser);
        setUserType(userType);

        // Save to AsyncStorage
        await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
        await AsyncStorage.setItem('@userType', userType);

        return {
          success: true,
          user: updatedUser,
          userType,
        };
      } catch (firestoreError) {
        console.error('Firestore error during sign in:', firestoreError);
        const minimalUser = {
          ...user,
          displayName: user.displayName || email.split('@')[0],
        };

        setUser(minimalUser);
        await AsyncStorage.setItem('@user', JSON.stringify(minimalUser));

        return {
          success: true,
          user: minimalUser,
          userType: 'shipper', // Default user type
          warning: 'Limited functionality: Could not load full user profile',
        };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error:
          getAuthErrorMessage(error.code) ||
          'Failed to sign in. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Password reset function
  const resetPassword = async email => {
    try {
      if (!email || !email.trim()) {
        throw new Error('Email is required');
      }

      // Use the modular API for sending password reset email
      await sendPasswordResetEmail(auth, email.trim());

      return {
        success: true,
        message:
          'Password reset email sent successfully. Please check your inbox.',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error:
          getAuthErrorMessage(error.code) ||
          'Failed to send password reset email. Please try again.',
      };
    }
  };

  // Update user profile
  const updateProfile = async userData => {
    try {
      if (user) {
        await getFirestore()
          .collection('users')
          .doc(user.uid)
          .update({
            ...userData,
            updatedAt: serverTimestamp(),
          });
        return {success: true};
      }
      return {success: false, error: 'No user logged in'};
    } catch (error) {
      console.error('Update profile error:', error);
      return {success: false, error: error.message};
    }
  };

  // Get user data from Firestore
  const getUserData = async () => {
    try {
      if (user) {
        const userDoc = await getFirestore()
          .collection('users')
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          return {success: true, data: userDoc.data()};
        }
      }
      return {success: false, error: 'User not found'};
    } catch (error) {
      console.error('Get user data error:', error);
      return {success: false, error: error.message};
    }
  };

  // Helper function to get readable error messages
  const getAuthErrorMessage = errorCode => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email address is already registered. Please use a different email or try signing in.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user && !!userType;

  const value = {
    user,
    userType,
    loading: loading || initializing,
    isAuthenticated,
    signUp,
    signIn,
    resetPassword,
    updateProfile,
    getUserData,
    setNavigation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
