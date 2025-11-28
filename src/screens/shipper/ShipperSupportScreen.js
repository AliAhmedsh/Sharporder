import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const ShipperSupportScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'<'} Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Support</Text>
        <Text style={styles.subtitle}>Were here to help you move freight smoothly.</Text>

        <Text style={styles.sectionTitle}>How we can help</Text>
        <Text style={styles.paragraph}>
          Sharporder connects shippers with reliable drivers so you can book and
          track loads in real time. If you run into any issues while creating
          shipments, tracking drivers, or managing payments, reach out to us.
        </Text>

        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.paragraph}>Email: support@sharporder.app</Text>
        <Text style={styles.paragraph}>Phone/WhatsApp: +234 000 000 0000</Text>

        <Text style={styles.sectionTitle}>Common issues</Text>
        <Text style={styles.bullet}>- Trouble logging in or signing up</Text>
        <Text style={styles.bullet}>- Issues creating or editing a shipment</Text>
        <Text style={styles.bullet}>- Driver not moving or map not updating</Text>
        <Text style={styles.bullet}>- Payment or pricing questions</Text>

        <Text style={styles.footer}>Our team typically responds within 24 hours.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  headerRow: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 14,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#111827',
  },
  paragraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  footer: {
    marginTop: 24,
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default ShipperSupportScreen;
