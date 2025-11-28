import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const ShipperAboutScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'<'} Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>About Sharporder</Text>
        <Text style={styles.subtitle}>Smart freight matching for shippers.</Text>

        <Text style={styles.paragraph}>
          Sharporder is built to help businesses move goods quickly and
          transparently. From a single app you can create shipments, compare
          options, and track your driver in real time.
        </Text>

        <Text style={styles.paragraph}>
          Our goal is to give shippers a clear view of pricing, timing, and
          driver performance so you can focus on your business, not on chasing
          trucks on the phone.
        </Text>

        <Text style={styles.sectionTitle}>Key features</Text>
        <Text style={styles.bullet}>- Real-time map and driver tracking</Text>
        <Text style={styles.bullet}>- Load board with instant offers</Text>
        <Text style={styles.bullet}>- Digital records of trips and shipments</Text>
        <Text style={styles.bullet}>- Simple onboarding for both shippers and drivers</Text>

        <Text style={styles.sectionTitle}>Region</Text>
        <Text style={styles.paragraph}>
          The app is designed for markets like Nigeria and similar regions where
          freight is mostly coordinated via phone calls and messaging. Sharporder
          brings that into a single, structured workflow.
        </Text>
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
});

export default ShipperAboutScreen;
