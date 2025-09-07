import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import back from '../../assets/icons/back.png';

const MyShipmentsScreen = ({ navigation }) => {
  const { shipments, addShipment, formData } = useAppContext();

  const handleRepeatDelivery = (shipment) => {
    // Create a new shipment based on the existing one
    const newShipmentData = {
      deliveryAddress: shipment.address,
      fareOffer: shipment.price.replace('NGN ', '').replace(',', ''),
    };
    
    addShipment(newShipmentData);
    
    Alert.alert(
      'Delivery Repeated',
      'A new delivery has been created based on this shipment.',
      [{ text: 'OK' }]
    );
  };

  const handleRateDelivery = (shipment) => {
    Alert.alert(
      'Rate Delivery',
      'How would you rate this delivery experience?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '⭐⭐⭐⭐⭐ 5 Stars', onPress: () => console.log('5 stars') },
        { text: '⭐⭐⭐⭐ 4 Stars', onPress: () => console.log('4 stars') },
        { text: '⭐⭐⭐ 3 Stars', onPress: () => console.log('3 stars') },
      ]
    );
  };

  const ShipmentCard = ({ shipment }) => (
    <View style={styles.shipmentCard}>
      <View style={styles.shipmentContent}>
        <View style={styles.shipmentInfo}>
          <Text style={styles.addressText}>{shipment.address}</Text>
          <Text style={styles.dateText}>{shipment.date}</Text>
          <Text style={styles.priceText}>{shipment.price}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.repeatButton}
            onPress={() => handleRepeatDelivery(shipment)}
          >
            <Text style={styles.repeatButtonText}>🔄 Repeat delivery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.rateButton}
            onPress={() => handleRateDelivery(shipment)}
          >
            <Text style={styles.rateButtonText}>⭐ Rate delivery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image style={styles.backButtonImage} source={back} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My shipments</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {shipments.map((shipment) => (
          <ShipmentCard key={shipment.id} shipment={shipment} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  shipmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  shipmentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  shipmentInfo: {
    flex: 1,
    marginRight: 12,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  dateText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  actionButtons: {
    alignItems: 'flex-end',
    gap: 8,
  },
  repeatButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  repeatButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  rateButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rateButtonText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MyShipmentsScreen;