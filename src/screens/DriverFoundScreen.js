import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Modal } from 'react-native';
import { useAppContext } from '../context/AppContext';

const DriverFoundScreen = ({ navigation }) => {
  const { 
    showDeliveryAlert, 
    setShowDeliveryAlert, 
    showSuccessModal, 
    setShowSuccessModal, 
    alertResolved, 
    setAlertResolved 
  } = useAppContext();

  const handleDeliveryComplete = () => {
    navigation.navigate('DeliveryComplete');
  };

  return (
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
            onPress={handleDeliveryComplete}
          >
            <Text style={styles.outlineButtonText}>VIEW RECEIPT</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.fullWidthButton}
            onPress={() => {
              setShowSuccessModal(false);
              handleDeliveryComplete();
            }}
          >
            <Text style={styles.fullWidthButtonText}>CLOSE</Text>
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
  driverDetails: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  driverActions: {
    alignItems: 'flex-end',
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
  alertModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: 600,
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
  outlineButton: {
    borderWidth: 2,
    borderColor: '#00BFFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 30,
  },
  outlineButtonText: {
    color: '#00BFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fullWidthButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  fullWidthButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DriverFoundScreen;
