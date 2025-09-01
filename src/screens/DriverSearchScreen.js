import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Modal, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';

const DriverSearchScreen = ({ navigation }) => {
  const { 
    showDriverSelection, 
    setShowDriverSelection, 
    showPaymentModal, 
    setShowPaymentModal, 
    drivers 
  } = useAppContext();

  const handleDriverFound = () => {
    navigation.navigate('DriverFound');
  };

  return (
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
              handleDriverFound();
            }}
          >
            <Text style={styles.fullWidthButtonText}>CONFIRM AND PAY</Text>
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
  searchContainer: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  driverSelectionModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: 600,
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
  paymentModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
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
  fullWidthButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  fullWidthButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DriverSearchScreen;
