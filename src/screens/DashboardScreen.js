import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Button,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import MapView from 'react-native-maps';
import DeliveryDetailsScreen from './DeliveryDetailsScreen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const BookingSearch = ({ query, setQuery, searchLocation }) => {
  return (
    <View>
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
  );
};

const { height } = Dimensions.get('window');

const DashboardScreen = () => {
  const actionSheetRef = useRef(null);

  useEffect(() => {
    actionSheetRef?.current?.show();
  }, []);

  const [region, setRegion] = useState({
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [step, setStep] = useState(0);

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
        {
          headers: {
            'User-Agent': 'Sharporder/1.0 umerjaved3333@gmail.com', // required by Nominatim
            Accept: 'application/json',
          },
        },
      );

      const text = await response.text();
      console.log('Raw response:', text);
      const results = JSON.parse(text); // parse manually

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
        mapRef.current?.animateToRegion(newRegion, 1000);
        Keyboard.dismiss();
        setTimeout(() => {
          setStep(1);
        }, 3000);
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
        <MapView
          ref={mapRef}
          style={{ width: '100%', flex: 1 }}
          initialRegion={region}
          onRegionChangeComplete={region => onRegionChange(region)}
          showsUserLocation={true}
          showsMyLocationButton={true}
        ></MapView>

        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <ActionSheet
            ref={actionSheetRef}
            gestureEnabled={false}
            closeOnTouchBackdrop={false}
            containerStyle={{
              backgroundColor: 'white',
              maxHeight: height * 0.8,
            }}
            overlayColor="red"
            defaultOverlayOpacity={0}
            bounceOnOpen={true}
            indicatorStyle={{ backgroundColor: '#ccc' }}
            closable={false}
            openAnimationConfig={{ spring: { speed: 14, bounciness: 4 } }}
            keyboardHandlerEnabled={true}
            keyboardAvoidingBehavior="padding" // or "height"
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, padding: 16 }}
              style={styles.bookingCard}
              keyboardShouldPersistTaps="handled"
            >
              {step === 0 ? (
                <BookingSearch
                  query={query}
                  setQuery={setQuery}
                  searchLocation={searchLocation}
                />
              ) : step === 1 ? (
                <DeliveryDetailsScreen />
              ) : null}
            </ScrollView>
          </ActionSheet>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  bookingCard: {},
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
