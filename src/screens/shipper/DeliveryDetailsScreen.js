import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';

const DeliveryDetailsScreen = ({ visible, onClose = () => {}, onContinue = () => {} }) => {
  const {
    formData,
    setFormData,
    showTruckSelector,
    setShowTruckSelector,
    truckTypes,
  } = useAppContext();
  
  const navigation = useNavigation();
  const [isReceiving, setIsReceiving] = useState(false);

  const handleContinue = () => {
    onClose();
    // If parent provided a custom continue handler (modal step flow), use it
    if (typeof onContinue === 'function') {
      onContinue();
      return;
    }
    // Fallback to navigating to TripDetails screen
    navigation.navigate('TripDetails');
  };

  const handleClose = () => {
    onClose();
    navigation.navigate('Dashboard');
  };

  return (
    <>
      {/* Main Delivery Details Modal */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.backdrop}
            activeOpacity={1}
            onPress={handleClose}
          />
          <View style={styles.modalContainer}>
            <View style={styles.dragHandle} />
            
            <ScrollView 
              style={styles.formContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.pageTitle}>Delivery details</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Pickup address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter here"
                  value={formData.pickupAddress}
                  onChangeText={text =>
                    setFormData({ ...formData, pickupAddress: text })
                  }
                  placeholderTextColor="#C0C0C0"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Delivery address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter here"
                  value={formData.deliveryAddress}
                  onChangeText={text =>
                    setFormData({ ...formData, deliveryAddress: text })
                  }
                  placeholderTextColor="#C0C0C0"
                />
              </View>

              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShowTruckSelector(true)}
              >
                <Text style={styles.inputLabel}>Truck type</Text>
                <View style={styles.selectInput}>
                  <Text style={[styles.selectText, formData.truckType && styles.selectedText]}>
                    {formData.truckType || 'Select here'}
                  </Text>
                  <Text style={styles.selectArrow}>⌄</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Load description</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter here"
                  value={formData.loadDescription}
                  onChangeText={text =>
                    setFormData({ ...formData, loadDescription: text })
                  }
                  placeholderTextColor="#C0C0C0"
                />
              </View>

              <TouchableOpacity style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Load image (optional)</Text>
                <View style={styles.uploadContainer}>
                  <Text style={styles.uploadText}>Upload here</Text>
                  <Text style={styles.uploadIcon}>↗</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Recipient's name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter here"
                  value={formData.recipientName}
                  onChangeText={text =>
                    setFormData({ ...formData, recipientName: text })
                  }
                  placeholderTextColor="#C0C0C0"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Recipient's number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+234 08012345678"
                  value={formData.recipientNumber}
                  onChangeText={text =>
                    setFormData({ ...formData, recipientNumber: text })
                  }
                  keyboardType="phone-pad"
                  placeholderTextColor="#C0C0C0"
                />
              </View>

              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>I'm receiving it</Text>
                <TouchableOpacity 
                  style={[styles.toggle, isReceiving && styles.toggleActive]}
                  onPress={() => setIsReceiving(!isReceiving)}
                >
                  <View style={[styles.toggleThumb, isReceiving && styles.toggleThumbActive]} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.fullWidthButton}
                onPress={handleContinue}
              >
                <Text style={styles.fullWidthButtonText}>CONTINUE</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Truck Selector Modal - Separate from main modal */}
      <Modal visible={showTruckSelector} transparent animationType="slide">
        <View style={styles.truckModalOverlay}>
          <TouchableOpacity 
            style={styles.truckBackdrop}
            activeOpacity={1}
            onPress={() => setShowTruckSelector(false)}
          />
          <View style={styles.truckModal}>
            <View style={styles.dragHandle} />
            <Text style={styles.modalTitle}>Select your truck</Text>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.truckScrollContent}
            >
              <TouchableOpacity
                style={[
                  styles.truckOption,
                  formData.truckType === 'Standard Rigid Dump Truck' && styles.selectedTruckOption,
                ]}
                onPress={() => {
                  setFormData({ ...formData, truckType: 'Standard Rigid Dump Truck' });
                  setShowTruckSelector(false);
                }}
              >
                <View style={styles.truckIconContainer}>
                  <Text style={styles.truckIcon}>🚛</Text>
                </View>
                <View style={styles.truckDetails}>
                  <Text style={styles.truckName}>Standard Rigid Dump Truck</Text>
                  <Text style={styles.truckSpec}>Capacity: 10-30 cubic yards</Text>
                  <Text style={styles.truckSpec}>Load weight: 15-25 tons</Text>
                  <Text style={styles.truckSpec}>Tyres: 6</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.truckOption,
                  formData.truckType === 'Articulated Dump Truck' && styles.selectedTruckOption,
                ]}
                onPress={() => {
                  setFormData({ ...formData, truckType: 'Articulated Dump Truck' });
                  setShowTruckSelector(false);
                }}
              >
                <View style={styles.truckIconContainer}>
                  <Text style={styles.truckIcon}>🚛</Text>
                </View>
                <View style={styles.truckDetails}>
                  <Text style={styles.truckName}>Articulated Dump Truck</Text>
                  <Text style={styles.truckSpec}>Capacity: 25-45 cubic yards</Text>
                  <Text style={styles.truckSpec}>Load weight: 35-45 tons</Text>
                  <Text style={styles.truckSpec}>Tyres: 10</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.truckOption,
                  formData.truckType === 'Transfer Dump Truck' && styles.selectedTruckOption,
                ]}
                onPress={() => {
                  setFormData({ ...formData, truckType: 'Transfer Dump Truck' });
                  setShowTruckSelector(false);
                }}
              >
                <View style={styles.truckIconContainer}>
                  <Text style={styles.truckIcon}>🚛</Text>
                </View>
                <View style={styles.truckDetails}>
                  <Text style={styles.truckName}>Transfer Dump Truck</Text>
                  <Text style={styles.truckSpec}>Capacity: 15-25 cubic yards</Text>
                  <Text style={styles.truckSpec}>Load weight: 20-30 tons combined</Text>
                  <Text style={styles.truckSpec}>Tyres: 8</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.truckOption,
                  formData.truckType === 'Super Dump Truck' && styles.selectedTruckOption,
                ]}
                onPress={() => {
                  setFormData({ ...formData, truckType: 'Super Dump Truck' });
                  setShowTruckSelector(false);
                }}
              >
                <View style={styles.truckIconContainer}>
                  <Text style={styles.truckIcon}>🚛</Text>
                </View>
                <View style={styles.truckDetails}>
                  <Text style={styles.truckName}>Super Dump Truck</Text>
                  <Text style={styles.truckSpec}>Capacity: 20-30 cubic yards</Text>
                  <Text style={styles.truckSpec}>Load weight: 26-33 tons</Text>
                  <Text style={styles.truckSpec}>Tyres: 12</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.truckOption,
                  formData.truckType === 'Semi-trailer End Dump Truck' && styles.selectedTruckOption,
                ]}
                onPress={() => {
                  setFormData({ ...formData, truckType: 'Semi-trailer End Dump Truck' });
                  setShowTruckSelector(false);
                }}
              >
                <View style={styles.truckIconContainer}>
                  <Text style={styles.truckIcon}>🚛</Text>
                </View>
                <View style={styles.truckDetails}>
                  <Text style={styles.truckName}>Semi-trailer End Dump Truck</Text>
                  <Text style={styles.truckSpec}>Capacity: 20-30 cubic yards</Text>
                  <Text style={styles.truckSpec}>Load weight: 20-25 tons</Text>
                  <Text style={styles.truckSpec}>Tyres: 8</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.truckOption,
                  formData.truckType === 'Double/Triple Bottom Dump' && styles.selectedTruckOption,
                ]}
                onPress={() => {
                  setFormData({ ...formData, truckType: 'Double/Triple Bottom Dump' });
                  setShowTruckSelector(false);
                }}
              >
                <View style={styles.truckIconContainer}>
                  <Text style={styles.truckIcon}>🚛</Text>
                </View>
                <View style={styles.truckDetails}>
                  <Text style={styles.truckName}>Double/Triple Bottom Dump</Text>
                  <Text style={styles.truckSpec}>Capacity: 30-40 cubic yards</Text>
                  <Text style={styles.truckSpec}>Load weight: 40-50 tons</Text>
                  <Text style={styles.truckSpec}>Tyres: 14</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    paddingTop: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333333',
  },
  selectInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#C0C0C0',
  },
  selectedText: {
    color: '#333333',
  },
  selectArrow: {
    fontSize: 16,
    color: '#007AFF',
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#C0C0C0',
  },
  uploadIcon: {
    fontSize: 16,
    color: '#007AFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  toggleText: {
    fontSize: 16,
    color: '#333333',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#007AFF',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  fullWidthButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  fullWidthButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  truckModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  truckBackdrop: {
    flex: 1,
  },
  truckModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 20,
    height: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  truckScrollContent: {
    paddingBottom: 30,
  },
  truckOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  selectedTruckOption: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
    borderWidth: 2,
  },
  truckIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  truckIcon: {
    fontSize: 24,
    color: '#007AFF',
  },
  truckDetails: {
    flex: 1,
  },
  truckName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  truckSpec: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 1,
    lineHeight: 18,
  },
});

export default DeliveryDetailsScreen;