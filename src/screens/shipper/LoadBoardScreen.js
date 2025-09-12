import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import back from '../../assets/icons/back.png';
import emptyStateImage from '../../assets/empty-load-board.png';
import search from '../../assets/icons/search.png';

const LoadBoardScreen = ({ navigation }) => {
  const { 
    formData, 
    loads, 
    addLoad, 
    showLoadDrawer, 
    setShowLoadDrawer, 
    selectedLoad, 
    setSelectedLoad 
  } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const sampleBids = [
    { id: 1, company: 'Oluwatomisin Alamu', amount: 'NGN 15000', rating: '4.5', deliveryTime: '10 mins away' },
    { id: 2, company: 'Oluwatomisin Alamu', amount: 'NGN 15000', rating: '4.5', deliveryTime: '10 mins away' },
    { id: 3, company: 'Oluwatomisin Alamu', amount: 'NGN 15000', rating: '4.5', deliveryTime: '10 mins away' },
    { id: 4, company: 'Oluwatomisin Alamu', amount: 'NGN 15000', rating: '4.5', deliveryTime: '10 mins away' },
  ];
  
  const handleViewBids = (load) => {
    setSelectedLoad(load);
    setShowLoadDrawer(true);
  };

  const closeDrawer = () => {
    setShowLoadDrawer(false);
    setSelectedLoad(null);
  };

  const handlePostLoad = () => {
    addLoad(formData);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Transit': return '#FFA500';
      case 'Cancelled': return '#FF0000';
      case 'Delivered': return '#4CAF50';
      default: return '#FFA500';
    }
  };

  const LoadCard = ({ load }) => (
    <View style={styles.loadCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(load.status) }]}>
          <Text style={styles.statusText}>{load.status}</Text>
        </View>
      </View>
      
      <Text style={styles.loadTitle}>Load #{load.loadNumber} - Lagos → Abuja</Text>
      
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>Abuja</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>🕐</Text>
          <Text style={styles.detailText}>20:50am, 01/09/205</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>🚚</Text>
          <Text style={styles.detailText}>Truck</Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.priceInfo}>
          <Text style={styles.bidsText}>No. of bids: {load.numberOfBids}</Text>
          <Text style={styles.priceText}>₦120,000 - ₦150,000</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.viewBidsButton}
          onPress={() => handleViewBids(load)}
        >
          <Text style={styles.viewBidsText}>View Bids</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Empty State Component
  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image source={emptyStateImage} style={styles.emptyStateImage} />
    </View>
  );

  const BidsDrawer = () => (
    <Modal
      visible={showLoadDrawer}
      animationType="slide"
      transparent={true}
      onRequestClose={closeDrawer}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={closeDrawer}
      >
        <TouchableOpacity 
          style={styles.drawerContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.drawerHandle} />
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Bids</Text>
          </View>
  
          <ScrollView style={styles.drawerContent}>
            {selectedLoad && (
              <View style={styles.bidsSection}>
                {sampleBids.map((bid) => (
                  <View key={bid.id} style={styles.bidCard}>
                    <View style={styles.bidContent}>
                      <View style={styles.bidLeft}>
                        <View style={styles.driverAvatar}>
                          <Text style={styles.driverInitials}>
                            {bid.company.split(' ').map(word => word[0]).join('')}
                          </Text>
                        </View>
                        <View style={styles.driverInfo}>
                          <Text style={styles.driverName}>{bid.company}</Text>
                          <View style={styles.driverStats}>
                            <Text style={styles.rating}>⭐ {bid.rating}</Text>
                            <Text style={styles.deliveries}>50 successful deliveries</Text>
                          </View>
                          <Text style={styles.deliveryTime}>10 mins away</Text>
                          <Text style={styles.bidPrice}>NGN 15000</Text>
                        </View>
                      </View>
                      <View style={styles.bidActions}>
                        <TouchableOpacity style={styles.declineButton}>
                          <Text style={styles.declineButtonText}>DECLINE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.acceptButton}>
                          <Text style={styles.acceptButtonText}>ACCEPT</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Load Board</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Image source={search} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Load Board"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>☰</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.loadsList,
          loads.length === 0 && styles.emptyScrollView
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loads.length > 0 ? (
          loads.map((load) => (
            <LoadCard key={load.id} load={load} />
          ))
        ) : (
          <EmptyState />
        )}
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handlePostLoad}
        >
          <Text style={styles.buttonText}>POST NEW LOAD</Text>
        </TouchableOpacity>
      </View>

      <BidsDrawer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 20,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  loadsList: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyScrollView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  loadCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardHeader: {
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  loadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceInfo: {
    flex: 1,
  },
  bidsText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  viewBidsButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  viewBidsText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // Bottom Sheet Drawer Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawerContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingBottom: 20,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  drawerHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  bidsSection: {
    marginBottom: 24,
  },
  bidCard: {
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
  bidContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bidLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  driverAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverInitials: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  driverStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  rating: {
    fontSize: 13,
    color: '#333',
    marginRight: 8,
  },
  deliveries: {
    fontSize: 9,
    color: '#666',
  },
  deliveryTime: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  bidPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  bidActions: {
    flexDirection: 'column',
    gap: 8,
    minWidth: 90,
  },
  declineButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: 'transparent',
    alignItems: 'center',
    minWidth: 85,
  },
  declineButtonText: {
    color: '#007AFF',
    fontSize: 11,
    fontWeight: '600',
  },
  acceptButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    minWidth: 85,
  },
  acceptButtonText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default LoadBoardScreen;