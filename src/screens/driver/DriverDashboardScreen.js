import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Animated,
  Easing,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';

import MapView from 'react-native-maps';
import hamburger from '../../assets/icons/hamburger.png';
import headset from '../../assets/icons/headset.png';
import help from '../../assets/icons/help.png';
// import logout from '../../assets/icons/logout.png';
import wallet from '../../assets/icons/wallet.png';
import trips from '../../assets/icons/trips.png';
import loadboard from '../../assets/icons/loadboard.png';
import previous from '../../assets/icons/previous.png';
import next from '../../assets/icons/next.png';

const DriverStats = () => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>Today's earnings</Text>
        <TouchableOpacity>
          <Text style={styles.statsLink}>Earnings</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.statsValue}>₦500,000</Text>
      <View style={styles.statsDivider} />
      
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>Today's loads</Text>
        <TouchableOpacity>
          <Text style={styles.statsLink}>Loads</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.statsValue}>20</Text>
      <View style={styles.statsDivider} />
      
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>Current rating</Text>
        <TouchableOpacity>
          <Text style={styles.statsLink}>Ratings</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.statsValue}>4.65</Text>
    </View>
  );
};

const LoadCard = ({ load }) => {
  return (
    <View style={styles.loadCard}>
      <View style={styles.loadHeader}>
        <View style={styles.loadRoute}>
          <Text style={styles.loadRouteIcon}>✈️</Text>
          <Text style={styles.loadRouteText}>Lagos → Abuja</Text>
        </View>
      </View>
      
      <View style={styles.loadDetails}>
        <View style={styles.loadDetailItem}>
          <Text style={styles.loadDetailIcon}>🕒</Text>
          <Text style={styles.loadDetailText}>20:50am, 01/09/205</Text>
        </View>
        <View style={styles.loadDetailItem}>
          <Text style={styles.loadDetailIcon}>📦</Text>
          <Text style={styles.loadDetailText}>134 Kg</Text>
        </View>
        <View style={styles.loadDetailItem}>
          <Text style={styles.loadDetailIcon}>🚛</Text>
          <Text style={styles.loadDetailText}>Truck</Text>
        </View>
      </View>
      
      <View style={styles.customerInfo}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/40' }} 
          style={styles.customerAvatar} 
        />
        <View style={styles.customerDetails}>
          <Text style={styles.customerName}>Chukwuebube Osinachi</Text>
          <View style={styles.customerRating}>
            <Text style={styles.customerStar}>⭐</Text>
            <Text style={styles.customerRatingText}>4.8</Text>
            <Text style={styles.customerDeliveries}>120 successful deliveries</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.loadFooter}>
        <Text style={styles.loadPrice}>₦120,000 - ₦150,000</Text>
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const OnlineLoadCard = ({ load, onAccept, onDeny, showActions = false, onArrowPress }) => {
  return (
    <View style={styles.onlineLoadCard}>
      <View style={styles.onlineLoadContent}>
        <View style={styles.onlineLoadHeader}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/40' }} 
            style={styles.onlineCustomerAvatar} 
          />
          <View style={styles.onlineLoadInfo}>
            <View style={styles.onlineNameRow}>
              <Text style={styles.onlineCustomerName}>Kunle Alamu</Text>
              <View style={styles.onlineRating}>
                <Text style={styles.onlineStar}>⭐</Text>
                <Text style={styles.onlineRatingText}>4.5</Text>
              </View>
            </View>
            <Text style={styles.onlineTime}>10 mins away</Text>
            <Text style={styles.onlineCapacity}>Load capacity: 10-30 cubic yards</Text>
          </View>
        </View>
        
        <View style={styles.onlineLocations}>
          <View style={styles.onlineLocationItem}>
            <View style={styles.greenDot} />
            <Text style={styles.onlineLocationText}>15 Bode Thomas Street, Surulere, Lagos</Text>
          </View>
          <View style={styles.onlineLocationItem}>
            <View style={styles.purpleDot} />
            <Text style={styles.onlineLocationText}>35 Hakeem Dickson Street, Lekki Phase 1...</Text>
          </View>
        </View>
        
        <Text style={styles.onlinePrice}>NGN 15,000</Text>
      </View>
      
      {showActions ? (
        <View style={styles.onlineActions}>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.acceptText}>ACCEPT</Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity style={styles.denyButton} onPress={onDeny}>
            <Text style={styles.denyText}>DENY</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.onlineArrowButton} onPress={onArrowPress}>
          <Text style={styles.onlineArrow}>›</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const { height, width: screenWidth } = Dimensions.get('window');

const DriverDashboardScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await auth().signOut();
      // Clear any local storage if needed
      await AsyncStorage.multiRemove(['@user', '@userType']);
      // Navigate to login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
      console.error('Logout error:', error);
    }
  };
  const bottomSheetHeight = Math.round(height * 0.95);
  const PEEK_HEIGHT = 350;
  const bottomSheetTranslateY = useRef(new Animated.Value(bottomSheetHeight - PEEK_HEIGHT)).current;
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [activeLoadIndex, setActiveLoadIndex] = useState(null); // Track which load shows actions
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const DRAWER_WIDTH = Math.round(screenWidth * 0.75);
  const drawerTranslateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // Sample loads data
  const [availableLoads, setAvailableLoads] = useState([
    { id: 1, customer: 'Kunle Alamu', rating: 4.5, time: '10 mins away' },
    { id: 2, customer: 'Kunle Alamu', rating: 4.5, time: '10 mins away' },
    { id: 3, customer: 'Kunle Alamu', rating: 4.5, time: '10 mins away' },
    { id: 4, customer: 'Kunle Alamu', rating: 4.5, time: '10 mins away' },
    { id: 5, customer: 'Kunle Alamu', rating: 4.5, time: '10 mins away' },
  ]);

  useEffect(() => {
    bottomSheetTranslateY.setValue(bottomSheetHeight - PEEK_HEIGHT);
    setIsSheetOpen(false);
  }, [bottomSheetHeight]);

  useEffect(() => {
    // When going online, hide the bottom sheet completely
    if (isOnline) {
      Animated.timing(bottomSheetTranslateY, {
        toValue: bottomSheetHeight,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      // When going offline, show the bottom sheet at peek height
      Animated.timing(bottomSheetTranslateY, {
        toValue: bottomSheetHeight - PEEK_HEIGHT,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [isOnline]);

  const openBottomSheet = () => {
    if (isSheetOpen || isOnline) return;
    
    Animated.timing(bottomSheetTranslateY, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setIsSheetOpen(true));
  };

  const closeBottomSheet = () => {
    Animated.timing(bottomSheetTranslateY, {
      toValue: bottomSheetHeight - PEEK_HEIGHT,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setIsSheetOpen(false));
  };

  const [region, setRegion] = useState({
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const mapRef = useRef(null);

  const openSidePanel = () => {
    setShowSidePanel(true);
    
    Animated.parallel([
      Animated.timing(drawerTranslateX, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      })
    ]).start();
  };

  const closeSidePanel = () => {
    overlayOpacity.setValue(0);
    
    Animated.timing(drawerTranslateX, {
      toValue: -DRAWER_WIDTH,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setShowSidePanel(false));
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    setActiveLoadIndex(null); // Reset active load when toggling status
    setShowAcceptModal(false);
  };

  const handleAcceptLoad = (loadId) => {
    console.log('Accepted load:', loadId);
    setActiveLoadIndex(null); // Hide actions after accept
    const load = availableLoads.find(l => l.id === loadId) || null;
    setSelectedLoad(load);
    setShowAcceptModal(true); // Show confirmation modal and hide cards
  };

  const handleDenyLoad = (loadId) => {
    console.log('Denied load:', loadId);
    setActiveLoadIndex(null); // Hide actions after deny
    // Handle deny logic here
  };

  const handleArrowPress = (loadId, index) => {
    // Toggle the actions for this specific load
    setActiveLoadIndex(activeLoadIndex === index ? null : index);
  };

  const sampleLoad = {
    id: 1,
    route: 'Lagos → Abuja',
    time: '20:50am, 01/09/205',
    weight: '134 Kg',
    vehicle: 'Truck',
    customer: 'Chukwuebube Osinachi',
    rating: 4.8,
    deliveries: 120,
    priceRange: '₦120,000 - ₦150,000'
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* Header with Go Online/Offline Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={[
            styles.goOnlineButton, 
            { backgroundColor: isOnline ? '#FF4444' : '#00C896' }
          ]}
          onPress={toggleOnlineStatus}
        >
          <Text style={styles.goOnlineText}>
            {isOnline ? 'GO OFFLINE AND TAKE A BREAK' : 'GO ONLINE AND START EARNING'}
          </Text>
          <Image source={isOnline ? previous : next} style={styles.goOnlineArrow} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={{ width: '100%', flex: 1 }}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        />
        
        {/* Online Load Cards - Show when driver is online */}
        {isOnline && !showAcceptModal && (
          <ScrollView 
            style={styles.onlineLoadsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.onlineLoadsContent}
          >
            {availableLoads.map((load, index) => (
              <OnlineLoadCard
                key={load.id}
                load={load}
                showActions={index === activeLoadIndex}
                onAccept={() => handleAcceptLoad(load.id)}
                onDeny={() => handleDenyLoad(load.id)}
                onArrowPress={() => handleArrowPress(load.id, index)}
              />
            ))}
          </ScrollView>
        )}
        
        {/* Bottom Sheet - Hidden when online */}
        {!isOnline && isSheetOpen && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeBottomSheet}
            style={[styles.sheetOverlay, { bottom: bottomSheetHeight }]}
          />
        )}
        
        <Animated.View
          style={[
            styles.bottomSheet,
            { 
              height: bottomSheetHeight,
              transform: [{ translateY: bottomSheetTranslateY }] 
            },
          ]}
          pointerEvents={isOnline ? 'none' : 'auto'}
        >
          <TouchableOpacity 
            style={styles.sheetHandle}
            onPress={isSheetOpen ? closeBottomSheet : openBottomSheet}
          />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 16 }}
            style={styles.sheetContent}
          >
            <DriverStats />
            <View style={styles.availableLoadsSection}>
              <Text style={styles.availableLoadsTitle}>Available Loads</Text>
              <LoadCard load={sampleLoad} />
            </View>
          </ScrollView>
        </Animated.View>
      </View>

      {/* Side Panel Overlay */}
      {showSidePanel && (
        <Animated.View
          style={[
            styles.overlay, 
            { 
              left: DRAWER_WIDTH,
              opacity: overlayOpacity 
            }
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeSidePanel}
            style={{ flex: 1 }}
          />
        </Animated.View>
      )}

      {/* Side Drawer */}
      <Animated.View
        pointerEvents={showSidePanel ? 'auto' : 'none'}
        style={[
          styles.drawerContainer,
          {
            width: DRAWER_WIDTH,
            transform: [{ translateX: drawerTranslateX }],
          },
        ]}
      >
        <ScrollView contentContainerStyle={{ paddingTop: 60 }}>
          <View style={styles.drawerProfile}>
            <View style={styles.drawerAvatar}>
              <Text style={styles.drawerAvatarText}>OO</Text>
            </View>
            <View style={styles.drawerInfo}>
              <Text style={styles.drawerBusinessName}>Onyinyechukwu Balogun</Text>
              <View style={styles.drawerRating}>
                <Text style={styles.drawerStar}>⭐</Text>
                <Text style={styles.drawerRatingText}>4.89</Text>
              </View>
            </View>
          </View>
          <View style={styles.drawerMenu}>
            {[
              { 
                id: 'loadboard', 
                title: 'Load board', 
                icon: loadboard,
                onPress: () => {
                  closeSidePanel();
                  navigation.navigate('DriverLoadBoard');
                }
              },
              { 
                id: 'trips', 
                title: 'My trips', 
                icon: trips,
                onPress: () => {
                  closeSidePanel();
                }
              },
              { 
                id: 'wallet', 
                title: 'Wallet', 
                icon: wallet,
                onPress: () => {
                  closeSidePanel();
                }
              },
              { 
                id: 'support', 
                title: 'Support', 
                icon: headset,
                onPress: closeSidePanel
              },
              { 
                id: 'about', 
                title: 'About', 
                icon: help,
                onPress: closeSidePanel
              },
              { 
                id: 'logout', 
                title: 'Logout', 
                icon: 'x',
                onPress: handleLogout,
                isLogout: true
              },
            ].map((item, idx, arr) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.drawerItem}
                  activeOpacity={0.7}
                  onPress={item.onPress}
                >
                  <Image style={styles.drawerItemIcon} source={item.icon} />
                  <Text style={[styles.drawerItemText, item.isLogout && styles.logoutText]}>{item.title}</Text>
                </TouchableOpacity>
                {idx < arr.length - 1 && <View style={styles.drawerSeparator} />}
              </View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Hamburger Button */}
      {!showSidePanel && (
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={openSidePanel}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={styles.hamburgerButtonContainer}>
            <Image source={hamburger} style={styles.hamburgerIcon} />
          </View>
        </TouchableOpacity>
      )}

      {/* Accept Offer Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={showAcceptModal}
        onRequestClose={() => setShowAcceptModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setShowAcceptModal(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeaderRow}>
                <Image 
                  source={{ uri: 'https://via.placeholder.com/40' }} 
                  style={styles.onlineCustomerAvatar} 
                />
                <View style={{ flex: 1 }}>
                  <View style={styles.onlineNameRow}>
                    <Text style={styles.onlineCustomerName}>{selectedLoad?.customer || 'Kunle Alamu'}</Text>
                    <View style={styles.onlineRating}>
                      <Text style={styles.onlineStar}>⭐</Text>
                      <Text style={styles.onlineRatingText}>{(selectedLoad?.rating || 4.5).toString()}</Text>
                    </View>
                  </View>
                  <Text style={styles.onlineTime}>{selectedLoad?.time || '10 mins away'}</Text>
                  <Text style={styles.onlineCapacity}>Load capacity: 10-30 cubic yards</Text>
                </View>
              </View>

              <View style={styles.onlineLocations}>
                <View style={styles.onlineLocationItem}>
                  <View style={styles.greenDot} />
                  <Text style={styles.onlineLocationText}>15 Bode Thomas Street, Surulere, Lagos</Text>
                </View>
                <View style={styles.onlineLocationItem}>
                  <View style={styles.purpleDot} />
                  <Text style={styles.onlineLocationText}>35 Hakeem Dickson Street, Lekki Phase 1, Lagos</Text>
                </View>
              </View>

              <Text style={styles.modalPrice}>NGN 15,000</Text>

              <TouchableOpacity 
              style={styles.modalAcceptButton} 
              onPress={() => {
                setShowAcceptModal(false);
                navigation.navigate('DriverOnTheWay', { price: 'NGN 15,000', load: selectedLoad });
              }}
            >
              <Text style={styles.modalAcceptText}>ACCEPT NGN 15,000</Text>
            </TouchableOpacity>

              <View style={styles.modalDivider} />
              <Text style={styles.modalAltText}>Or select your preferred fare offer</Text>
              <View style={styles.offerRow}>
                {['NGN 15,500','NGN 16,000','NGN 17,000','NGN 18,000'].map(val => (
                <TouchableOpacity 
                  key={val} 
                  style={styles.offerChip} 
                  onPress={() => {
                    setShowAcceptModal(false);
                    navigation.navigate('DriverOnTheWay', { price: val, load: selectedLoad });
                  }}
                >
                  <Text style={styles.offerChipText}>{val}</Text>
                </TouchableOpacity>
              ))}
              </View>

              <TouchableOpacity onPress={() => setShowAcceptModal(false)}>
                <Text style={styles.modalCloseLink}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
  headerContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 20,
  },
  goOnlineButton: {
    backgroundColor: '#00C896',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  goOnlineText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  goOnlineArrow: {
   width: 20,
   height: 20,
   marginLeft: 10,
   resizeMode: 'contain',
  },
  mapContainer: { 
    flex: 1 
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsTitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
  },
  statsLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  statsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  statsDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginBottom: 20,
  },
  availableLoadsSection: {
    marginTop: 10,
  },
  availableLoadsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  loadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  loadHeader: {
    marginBottom: 12,
  },
  loadRoute: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadRouteIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  loadRouteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  loadDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  loadDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  loadDetailIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  loadDetailText: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  customerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerStar: {
    fontSize: 12,
    marginRight: 4,
  },
  customerRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    marginRight: 6,
  },
  customerDeliveries: {
    fontSize: 12,
    color: '#666666',
  },
  loadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
  },
  viewDetailsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Online Load Card Styles - Updated to match the image
  onlineLoadsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    maxHeight: '70%',
    zIndex: 999,
  },
  onlineLoadsContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    gap: 8, // Reduced gap between cards
  },
  onlineLoadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'stretch',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    overflow: 'hidden',
    marginBottom: 8,
    marginHorizontal: 2,
    position: 'relative',
  },
  onlineLoadContent: {
    flex: 1,
    padding: 12,
  },
  onlineLoadHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  onlineCustomerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  onlineLoadInfo: {
    flex: 1,
  },
  onlineNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  onlineCustomerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 6,
  },
  onlineRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineStar: {
    fontSize: 12,
    marginRight: 1,
    color: '#FFB800',
  },
  onlineRatingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  onlineTime: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 2,
  },
  onlineCapacity: {
    fontSize: 11,
    color: '#888888',
  },
  onlineLocations: {
    marginBottom: 8,
  },
  onlineLocationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00D084',
    marginRight: 8,
    marginTop: 5,
    flexShrink: 0,
  },
  purpleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
    marginRight: 8,
    marginTop: 5,
    flexShrink: 0,
  },
  onlineLocationText: {
    fontSize: 12,
    color: '#444444',
    flex: 1,
    lineHeight: 16,
  },
  onlinePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
  },
  onlineArrowButton: {
    width: 36,
    backgroundColor: '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#EEEEEE',
  },
  onlineArrow: {
    fontSize: 20,
    color: '#666666',
    fontWeight: 'bold',
  },
  onlineActions: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    width: 150, // Fixed width for both buttons
    zIndex: 2,
  },
  acceptButton: {
    backgroundColor: '#00BFFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  denyButton: {
    backgroundColor: '#00BFFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  denyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hamburgerButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 30000,
    elevation: 20,
  },
  hamburgerButtonContainer: {
    width: 20,
    height: 20,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  hamburgerIcon: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
  // Modal styles
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E5EA',
    alignSelf: 'center',
    marginBottom: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 6,
    marginBottom: 8,
  },
  modalAcceptButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  modalAcceptText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#EDEDED',
    marginVertical: 12,
  },
  modalAltText: {
    textAlign: 'center',
    color: '#666666',
    marginBottom: 10,
  },
  offerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  offerChip: {
    borderWidth: 1,
    borderColor: '#00BFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  offerChipText: {
    color: '#00BFFF',
    fontWeight: '700',
  },
  modalCloseLink: {
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 20000,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 300,
    backgroundColor: '#FFFFFF',
    zIndex: 25000,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  drawerProfile: {
    flexDirection: 'row',        
    alignItems: 'center',        
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  drawerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00C896',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  drawerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  drawerBusinessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  drawerMenu: {
    paddingTop: 20,
  },
  drawerItem: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerItemIcon: {
    marginRight: 16,
    fontSize: 24,
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutText: {
    color: '#FF4444',
  },
  drawerSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 60,
    marginRight: 20,
  },
  drawerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerStar: {
    fontSize: 16,
    marginRight: 6,
  },
  drawerRatingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 5000,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 4000,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCC',
    alignSelf: 'center',
    marginVertical: 8,
  },
  sheetContent: {
    flex: 1,
  },
});

export default DriverDashboardScreen;