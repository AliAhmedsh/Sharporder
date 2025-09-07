import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Modal, ScrollView, Image } from 'react-native';
import { useAppContext } from '../context/AppContext';

const DriverSearchScreen = ({ navigation }) => {
  const { 
    showDriverSelection, 
    setShowDriverSelection, 
    showPaymentModal, 
    setShowPaymentModal, 
    drivers 
  } = useAppContext();

  const [searchProgress, setSearchProgress] = useState(0);
  const [visibleDrivers, setVisibleDrivers] = useState([]);

  // Automatically show driver selection after a delay
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          // Show drivers one by one after search completes
          setTimeout(() => {
            showDriversOneByOne();
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(progressTimer);
  }, []);

  const showDriversOneByOne = () => {
    drivers.forEach((driver, index) => {
      setTimeout(() => {
        setVisibleDrivers(prev => [...prev, driver]);
      }, index * 2000); // Show each driver 2 seconds apart
    });
  };

  const removeDriver = (driverId) => {
    setVisibleDrivers(prev => prev.filter(driver => driver.id !== driverId));
  };

  const handleCancelRequest = () => {
    navigation.navigate('TripDetails');
  };

  const handleDriverFound = () => {
    navigation.navigate('DriverFound');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      {/* Map Area */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          {/* Pickup Location Circle */}
          <View style={styles.pickupCircle}>
            <Image source={require('../assets/pickup.png')} style={styles.pickupImage} />
          </View>
        </View>
      </View>
      
      {/* Bottom Card */}
      <View style={styles.bottomCard}>
        <Text style={styles.searchingTitle}>Looking for an available driver</Text>
        <Text style={styles.searchingSubtitle}>Waiting for an available driver to confirm</Text>
        
        <View style={styles.driversRow}>
          <Text style={styles.driversCount}>6 drivers are considering your request</Text>
          <View style={styles.driverAvatars}>
            <View style={styles.avatar} />
            <View style={styles.avatar} />
            <View style={styles.avatar} />
            <View style={styles.avatar} />
          </View>
        </View>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${searchProgress}%` }]} />
        </View>
        
        <Text style={styles.fareOffer}>Your fare offer: NGN 10000</Text>
        
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelRequest}
        >
          <Text style={styles.cancelButtonText}>CANCEL REQUEST</Text>
        </TouchableOpacity>
      </View>

      {/* Driver Notification Cards - appear as individual toasts */}
      {visibleDrivers.slice(0, 4).map((driver, index) => (
        <View 
          key={driver.id} 
          style={[
            styles.driverNotificationCard,
            { bottom: 120 + (index * 85) } 
          ]}
        >
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>👤</Text>
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.driverRating}>⭐ {driver.rating}</Text>
              <Text style={styles.deliveriesText}>{driver.deliveries} deliveries</Text>
            </View>
            <Text style={styles.driverTime}>{driver.time}</Text>
            <Text style={styles.driverPrice}>NGN {driver.price.toLocaleString()}</Text>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity 
              style={styles.declineButton}
              onPress={() => removeDriver(driver.id)}
            >
              <Text style={styles.declineButtonText}>DECLINE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => {
                removeDriver(driver.id);
                setShowPaymentModal(true);
              }}
            >
              <Text style={styles.acceptButtonText}>ACCEPT</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Payment Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.paymentBackdrop} 
            onPress={() => setShowPaymentModal(false)}
            activeOpacity={1}
          />
          <View style={styles.paymentModal}>
            <View style={styles.modalDragHandle} />
            <Text style={styles.modalTitle}>Choose a payment method</Text>
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total amount due</Text>
              <Text style={styles.totalAmount}>NGN 15000</Text>
            </View>
            
            <View style={styles.paymentOption}>
              <View style={styles.paystackContainer}>
                <Text style={styles.paystackLogo}>≡ paystack</Text>
              </View>
              <View style={styles.radioSelected} />
            </View>
            
            <TouchableOpacity
              style={styles.confirmPayButton}
              onPress={() => {
                setShowPaymentModal(false);
                handleDriverFound();
              }}
            >
              <Text style={styles.confirmPayButtonText}>CONFIRM AND PAY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: '#00BFFF',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mapPlaceholder: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#E8E8E8',
  },
  pickupCircle: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 191, 255, 0.3)',
    transform: [{ translateX: -100 }, { translateY: -100 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickupImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  deliveryLocation: {
    position: 'absolute',
    top: '20%',
    right: '10%',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
  },
  bottomCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  searchingSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  driversRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  driversCount: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  driverAvatars: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    marginLeft: -4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00BFFF',
    borderRadius: 3,
  },
  fareOffer: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backdrop: {
    flex: 1,
  },
  paymentBackdrop: {
    flex: 1,
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  driverNotificationCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    height: 75,
  },
  driversList: {
    flex: 1,
  },
  driversScrollContent: {
    paddingBottom: 20,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  driverAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  driverAvatarText: {
    fontSize: 16,
  },
  driverInfo: {
    flex: 1,
    marginRight: 8,
  },
  driverName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  driverRating: {
    fontSize: 11,
    color: '#333333',
    marginRight: 6,
  },
  deliveriesText: {
    fontSize: 10,
    color: '#666666',
  },
  driverTime: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 2,
  },
  driverPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  driverActions: {
    alignItems: 'flex-end',
  },
  declineButton: {
    borderWidth: 1,
    borderColor: '#00BFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 4,
    minWidth: 70,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#00BFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#00BFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 70,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  cancelRequestButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
  },
  cancelRequestButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 20,
    height: '45%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 24,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#00BFFF',
    borderRadius: 8,
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 32,
  },
  paystackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paystackLogo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00BFFF',
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00BFFF',
  },
  confirmPayButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmPayButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DriverSearchScreen;