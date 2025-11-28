import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {firebaseShipmentsService} from '../../services/firebase';
import back from '../../assets/icons/back.png';

const MyShipmentsScreen = ({navigation}) => {
  const {user} = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time shipments for this shipper
  useEffect(() => {
    if (!user?.uid) {
      setShipments([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = firebaseShipmentsService.subscribeToShipments(
      user.uid,
      fetchedShipments => {
        setShipments(fetchedShipments || []);
        setLoading(false);
      },
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid]);

  const handleRepeatDelivery = async shipment => {
    if (!user?.uid) {
      return;
    }

    try {
      const newShipmentData = {
        pickupAddress: shipment.pickupAddress || shipment.address || '',
        deliveryAddress: shipment.deliveryAddress || shipment.address || '',
        shipperId: user.uid,
        truckType: shipment.truckType || 'Truck',
        loadDescription: shipment.loadDescription || shipment.cargoType || '',
        fareOffer: shipment.fare || shipment.price || 0,
      };

      const result = await firebaseShipmentsService.createShipment(newShipmentData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create shipment');
      }

      Alert.alert(
        'Delivery Repeated',
        'A new delivery has been created based on this shipment.',
        [{text: 'OK'}],
      );
    } catch (error) {
      console.error('Error repeating delivery:', error);
      Alert.alert('Error', 'Failed to repeat delivery. Please try again.');
    }
  };

  const handleRateDelivery = (shipment) => {
    // Navigate to rating screen with shipment/trip ID
    navigation.navigate('Rating', {
      tripId: shipment.id || shipment.tripId,
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '#4CAF50';
      case 'in_transit': return '#FFA500';
      case 'pending': return '#2196F3';
      case 'cancelled': return '#FF0000';
      default: return '#666';
    }
  };

  const formatPrice = shipment => {
    const raw =
      typeof shipment.price === 'number'
        ? shipment.price
        : shipment.fare ||
          parseInt(
            String(shipment.price || '0')
              .replace('NGN', '')
              .replace('₦', '')
              .replace(/,/g, '') || '0',
            10,
          );

    return `₦${(raw || 0).toLocaleString('en-NG')}`;
  };

  const ShipmentCard = ({shipment}) => (
    <View style={styles.shipmentCard}>
      <View style={styles.shipmentContent}>
        <View style={styles.shipmentInfo}>
          <Text style={styles.addressText}>
            {shipment.pickupAddress || shipment.address || 'No address'}
          </Text>
          <Text style={styles.dateText}>
            {shipment.createdAt
              ? new Date(shipment.createdAt).toLocaleString('en-NG', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : shipment.date}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{formatPrice(shipment)}</Text>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: getStatusColor(shipment.status)},
              ]}>
              <Text style={styles.statusText}>{shipment.status || 'Unknown'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.repeatButton}
            onPress={() => handleRepeatDelivery(shipment)}
          >
            <Text style={styles.repeatButtonText}>🔄 Repeat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => handleRateDelivery(shipment)}
          >
            <Text style={styles.rateButtonText}>⭐ Rate</Text>
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
          onPress={() => navigation.goBack()}>
          <Image style={styles.backButtonImage} source={back} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My shipments</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading shipments...</Text>
          </View>
        ) : shipments.length > 0 ? (
          shipments.map(shipment => (
            <ShipmentCard key={shipment.id} shipment={shipment} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No shipments found</Text>
            <Text style={styles.emptySubtext}>
              Your deliveries will appear here
            </Text>
          </View>
        )}
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
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