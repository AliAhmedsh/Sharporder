import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const DriverAboutScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'<'} Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>About Sharporder</Text>
        <Text style={styles.subtitle}>Built to help drivers earn more, safely.</Text>

        <Text style={styles.paragraph}>
          Sharporder connects you to loads from verified shippers so you spend
          less time waiting and more time on the road. You can see where the
          load starts, where it ends, and what you will be paid before you
          accept.
        </Text>

        <Text style={styles.paragraph}>
          The driver experience is designed to be simple: go online, see
          available loads, apply or submit a counter-offer, and keep the shipper
          updated as you move.
        </Text>

        <Text style={styles.sectionTitle}>What we focus on</Text>
        <Text style={styles.bullet}>- Transparent routes and pricing</Text>
        <Text style={styles.bullet}>- Simple onboarding and document upload</Text>
        <Text style={styles.bullet}>- Real-time updates for shippers</Text>
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

export default DriverAboutScreen;
