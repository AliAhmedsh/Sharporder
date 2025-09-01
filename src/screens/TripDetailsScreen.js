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
} from 'react-native';
import { useAppContext } from '../context/AppContext';

const TripDetailsScreen = ({ navigation }) => {
  const { formData, setFormData } = useAppContext();

  const handleSearchDriver = () => {
    navigation.navigate('DriverSearch');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView style={styles.formContainer}>
        <Text style={styles.pageTitle}>Trip details</Text>

        <View style={styles.tripDetailCard}>
          <Text style={styles.inputLabel}>Pickup address</Text>
          <Text style={styles.addressText}>
            15 Bode Thomas Street, Surulere, Lagos
          </Text>
        </View>

        <View style={styles.tripDetailCard}>
          <Text style={styles.inputLabel}>Delivery address</Text>
          <Text style={styles.addressText}>
            35 Hakeem Dickson Street, Lekki Phase 1...
          </Text>
        </View>

        <View style={styles.truckSelectedCard}>
          <Text style={styles.truckIcon}>🚛</Text>
          <View style={styles.truckDetails}>
            <Text style={styles.truckName}>Standard Rigid Dump Truck</Text>
            <Text style={styles.truckSpec}>Capacity: 10-30 cubic yards</Text>
            <Text style={styles.truckSpec}>Load weight: 15-25 tons</Text>
            <Text style={styles.truckSpec}>Tyres: 6</Text>
          </View>
        </View>

        <View style={styles.tripDetailCard}>
          <Text style={styles.inputLabel}>Load description</Text>
          <Text style={styles.addressText}>Sharp sand for construction</Text>
        </View>

        <View style={styles.tripDetailCard}>
          <Text style={styles.inputLabel}>Load image</Text>
          <Text style={styles.addressText}>img_20250807.jpg ↑</Text>
        </View>

        <View style={styles.tripDetailCard}>
          <Text style={styles.inputLabel}>Recipient's name</Text>
          <Text style={styles.addressText}>Femi Otedola</Text>
        </View>

        <View style={styles.tripDetailCard}>
          <Text style={styles.inputLabel}>Recipient's number</Text>
          <Text style={styles.addressText}>+234 08012345678</Text>
        </View>

        <View style={styles.fareContainer}>
          <Text style={styles.inputLabel}>Fare offer</Text>
          <TextInput
            style={styles.fareInput}
            value={`NGN ${formData.fareOffer}`}
            onChangeText={text =>
              setFormData({ ...formData, fareOffer: text.replace('NGN ', '') })
            }
          />
        </View>

        <Text style={styles.fareNote}>
          ⓘ Please note that the recommended minimum fare for this trip is NGN
          10,000.
        </Text>

        <TouchableOpacity
          style={styles.fullWidthButton}
          onPress={handleSearchDriver}
        >
          <Text style={styles.fullWidthButtonText}>SEARCH FOR DRIVER</Text>
        </TouchableOpacity>
      </ScrollView>
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
  tripDetailCard: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
  },
  addressText: {
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  truckSelectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#F8F8F8',
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
  fareContainer: {
    marginBottom: 20,
  },
  fareInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  fareNote: {
    fontSize: 14,
    color: '#FF6B35',
    marginBottom: 30,
    paddingHorizontal: 10,
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
});

export default TripDetailsScreen;
