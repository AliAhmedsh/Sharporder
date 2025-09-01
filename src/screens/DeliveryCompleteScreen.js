import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const DeliveryCompleteScreen = ({ navigation }) => {
  const handleBack = () => {
    navigation.navigate('Dashboard');
  };

  const handleRepeatDelivery = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <ScrollView style={styles.formContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Delivery complete</Text>
            <Text style={styles.headerSubtitle}>
              Your package has been successfully delivered.
            </Text>
          </View>
        </View>

        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🗺️ Delivery Route</Text>
          <Text style={styles.mapLocationText}>📍 Route Completed</Text>
        </View>

        <View style={styles.deliveryCompleteCard}>
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverAvatarText}>👤</Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>Kunle Alamu</Text>
              <Text style={styles.driverDetails}>
                Standard Rigid Dump Truck
              </Text>
              <Text style={styles.driverDetails}>LSR 123 AB</Text>
            </View>
            <View style={styles.deliveryMeta}>
              <Text style={styles.deliveryDate}>10/07/2025 12:58 PM</Text>
              <Text style={styles.deliveryPrice}>NGN 12,500</Text>
            </View>
          </View>

          <View style={styles.routeInfo}>
            <View style={styles.routeItem}>
              <Text style={styles.routeIcon}>🟢</Text>
              <View style={styles.routeDetails}>
                <Text style={styles.routeAddress}>
                  15 Bode Thomas Street, Surulere, Lagos
                </Text>
                <Text style={styles.routeTime}>08:30 AM</Text>
              </View>
            </View>
            <View style={styles.routeItem}>
              <Text style={styles.routeIcon}>🟣</Text>
              <View style={styles.routeDetails}>
                <Text style={styles.routeAddress}>
                  35 Hakeem Dickson Street, Lekki Phase 1...
                </Text>
                <Text style={styles.routeTime}>12:58 PM</Text>
              </View>
            </View>
          </View>

          <Text style={styles.rateTitle}>Rate your delivery</Text>
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} style={styles.star}>
                <Text style={styles.starText}>⭐</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>🧾</Text>
            </View>
            <Text style={styles.actionText}>Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>🎧</Text>
            </View>
            <Text style={styles.actionText}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>↩️</Text>
            </View>
            <Text style={styles.actionText}>Return trip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleRepeatDelivery}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>🔄</Text>
            </View>
            <Text style={styles.actionText}>Repeat delivery</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 30,
  },
  backArrow: {
    fontSize: 24,
    color: '#00BFFF',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 20,
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
  deliveryCompleteCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  driverRow: {
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
  driverDetails: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  deliveryMeta: {
    alignItems: 'flex-end',
  },
  deliveryDate: {
    fontSize: 12,
    color: '#999999',
  },
  deliveryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  routeInfo: {
    marginBottom: 20,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  routeIcon: {
    fontSize: 16,
    marginRight: 15,
    marginTop: 2,
  },
  routeDetails: {
    flex: 1,
  },
  routeAddress: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5,
  },
  routeTime: {
    fontSize: 14,
    color: '#666666',
  },
  rateTitle: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 15,
  },
  starContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  star: {
    padding: 5,
  },
  starText: {
    fontSize: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
});

export default DeliveryCompleteScreen;
