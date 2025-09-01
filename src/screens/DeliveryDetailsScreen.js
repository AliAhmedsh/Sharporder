import React from 'react';
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
import { useAppContext } from '../context/AppContext';

const DeliveryDetailsScreen = ({ navigation }) => {
  const {
    formData,
    setFormData,
    showTruckSelector,
    setShowTruckSelector,
    truckTypes,
  } = useAppContext();

  const handleContinue = () => {
    navigation.navigate('TripDetails');
  };

  return (
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
            onChangeText={text =>
              setFormData({ ...formData, pickupAddress: text })
            }
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
            onChangeText={text =>
              setFormData({ ...formData, loadDescription: text })
            }
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
            onChangeText={text =>
              setFormData({ ...formData, recipientName: text })
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Recipient's number</Text>
          <TextInput
            style={styles.input}
            value={formData.recipientNumber}
            onChangeText={text =>
              setFormData({ ...formData, recipientNumber: text })
            }
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>I'm receiving it</Text>
          <View style={styles.toggle} />
        </View>

        <TouchableOpacity
          style={styles.fullWidthButton}
          onPress={handleContinue}
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
              {truckTypes.map(truck => (
                <TouchableOpacity
                  key={truck.id}
                  style={[
                    styles.truckOption,
                    truck.selected && styles.selectedTruckOption,
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, truckType: truck.name });
                    setShowTruckSelector(false);
                  }}
                >
                  <Text style={styles.truckIcon}>🚛</Text>
                  <View style={styles.truckDetails}>
                    <Text style={styles.truckName}>{truck.name}</Text>
                    <Text style={styles.truckSpec}>
                      Capacity: {truck.capacity}
                    </Text>
                    <Text style={styles.truckSpec}>
                      Load weight: {truck.weight}
                    </Text>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 30,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  truckModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: 600,
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
});

export default DeliveryDetailsScreen;
