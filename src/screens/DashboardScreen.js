import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  StatusBar,
  Keyboard,
} from 'react-native';
import MapView from 'react-native-maps';

const DashboardScreen = () => {
  const [region, setRegion] = useState({
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [marker, setMarker] = useState({
    latitude: 6.5244,
    longitude: 3.3792,
  });

  const [query, setQuery] = useState('');
  const mapRef = useRef(null);

  const searchLocation = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query,
        )}&format=json&limit=1`,
      );
      const results = await response.json();

      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        const newRegion = {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        setRegion(newRegion);
        setMarker({ latitude: parseFloat(lat), longitude: parseFloat(lon) });

        // Animate map to searched location
        mapRef.current?.animateToRegion(newRegion, 1000);

        Keyboard.dismiss();
      } else {
        alert('No results found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Error fetching location');
    }
  };

  const onRegionChange = async value => {
    setAddress('Please wait...');
    fetch(
      'https://nominatim.openstreetmap.org/reverse?lat=' +
        value.latitude +
        '&lon=' +
        value.longitude +
        '&format=json',
    )
      .then(response => response.json())
      .then(async responseJson => {
        if (responseJson?.display_name != undefined) {
          let address = responseJson?.address;
          let pin_code = address?.postcode;
        } else {
          setAddress('Google can not fetch your location.');
        }
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.mapContainer}>
        {/* <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          region={region}
        ></MapView> */}

        <MapView
          ref={mapRef}
          style={{ width: '100%', flex: 1 }}
          initialRegion={region}
          onRegionChangeComplete={region => onRegionChange(region)}
          showsUserLocation={true}
          showsMyLocationButton={true}
        ></MapView>

        <View style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>Book your delivery</Text>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Where are we going?"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={searchLocation}
              returnKeyType="search"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  bookingCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  bookingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#F8F8F8',
  },
  searchIcon: { fontSize: 20, marginRight: 10, color: '#999999' },
  searchInput: { flex: 1, fontSize: 16, color: '#333333' },
});

export default DashboardScreen;
