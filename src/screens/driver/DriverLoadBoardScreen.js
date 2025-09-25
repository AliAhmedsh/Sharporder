import React, { useState, useEffect, useRef } from 'react';

import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';
import back from '../../assets/icons/back.png';
import emptyloadboard2 from '../../assets/empty-load-board-2.png';
import search from '../../assets/icons/search.png';
import filter from '../../assets/icons/filter.png';
import menu from '../../assets/icons/menu.png';
import { realTimeService, firebaseLoadsService } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import auth from '@react-native-firebase/auth';

const { width: screenWidth } = Dimensions.get('window');

const DriverLoadBoardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [acceptedLoads, setAcceptedLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Load accepted loads for this driver
  useEffect(() => {
    const loadAcceptedLoads = async () => {
      if (!user?.uid) return;

      setLoading(true);
      try {
        const result = await firebaseLoadsService.getMyAcceptedLoads(user.uid);
        if (result.success) {
          const ui = result.data.map((load) => ({
            id: load.id,
            _loadId: load.id,
            route: `${load.pickupAddress || '-'} → ${load.deliveryAddress || '-'}`,
            time: load.acceptedAt ? new Date(load.acceptedAt).toLocaleString() : 'Just accepted',
            weight: load.weight ? `${load.weight} Kg` : '—',
            dimensions: load.dimensions || '—',
            vehicleType: load.truckType || 'Truck',
            shipper: {
              name: load.shipperName || 'Shipper',
              rating: load.shipperRating || 4.5,
              deliveries: load.shipperDeliveries || 0,
            },
            priceRange: typeof load.fareOffer === 'number' ? `₦${(load.fareOffer.toLocaleString?.() || load.fareOffer)}` : (load.fareOffer || '—'),
            status: load.status,
            acceptedAt: load.acceptedAt,
            pickupAddress: load.pickupAddress,
            deliveryAddress: load.deliveryAddress,
          }));
          setAcceptedLoads(ui);
        }
      } catch (error) {
        console.error('Error loading accepted loads:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAcceptedLoads();
  }, [user?.uid]);

  // Animate modal entrance
  useEffect(() => {
    if (showDetailsModal) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(300);
    }
  }, [showDetailsModal]);

  const LoadCard = ({ load }) => (
    <TouchableOpacity
      style={styles.loadCard}
      onPress={() => {
        setSelectedLoad(load);
        setShowDetailsModal(true);
      }}
      activeOpacity={0.95}
    >
      <View style={styles.routeContainer}>
        <View style={styles.routeIconWrapper}>
          <Text style={styles.routeIcon}>✅</Text>
        </View>
        <Text style={styles.routeText}>{load.route}</Text>
        <View style={[styles.statusBadge, { backgroundColor: load.status === 'accepted' ? '#4CAF50' : '#FF9800' }]}>
          <Text style={styles.statusText}>{load.status === 'accepted' ? 'ACCEPTED' : 'PENDING'}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>⏰</Text>
          <Text style={styles.detailText}>{load.time.split(',')[0]}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>📦</Text>
          <Text style={styles.detailText}>{load.weight}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>🚚</Text>
          <Text style={styles.detailText}>{load.vehicleType}</Text>
        </View>
      </View>

      <View style={styles.shipperContainer}>
        <View style={styles.shipperAvatar}>
          <Text style={styles.shipperInitials}>
            {load.shipper.name.split(' ').map(word => word[0]).join('')}
          </Text>
        </View>
        <View style={styles.shipperInfo}>
          <Text style={styles.shipperName}>{load.shipper.name}</Text>
          <View style={styles.shipperStats}>
            <Text style={styles.rating}>⭐ {load.shipper.rating}</Text>
            <Text style={styles.deliveries}>{load.shipper.deliveries} successful deliveries</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.priceText}>{load.priceRange}</Text>
        <View style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateTitle}>No Accepted Loads</Text>
      <Text style={styles.emptyStateMessage}>
        You haven't accepted any loads yet. Browse the Load Board to find available loads and submit bids.
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('DriverLoadBoard')}
        activeOpacity={0.8}
      >
        <Text style={styles.browseButtonText}>BROWSE LOAD BOARD</Text>
      </TouchableOpacity>
    </View>
  );

  const DetailsModal = () => {
    if (!selectedLoad) return null;

    return (
      <Modal
        visible={showDetailsModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowDetailsModal(false)}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowDetailsModal(false)}
        >
          <View style={styles.detailsModalWrapper} onStartShouldSetResponder={() => true}>
            <Animated.View
              style={[
                styles.detailsModalContent,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={styles.modalPullBar} />
              <View style={styles.detailsHeader}>
                <TouchableOpacity
                  onPress={() => setShowDetailsModal(false)}
                  style={styles.backButtonModal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.detailsTitle}>{selectedLoad.route}</Text>
                <View style={styles.headerSpacer} />
              </View>

              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
              >
                <ScrollView
                  style={styles.detailsScrollView}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.detailsScrollContent}
                >
                  <View style={styles.mapContainer}>
                    <View style={styles.mapPlaceholder}>
                      <View style={styles.pickupCircle}>
                        <View style={styles.pickupIcon}>
                          <Text style={styles.pickupEmoji}>📍</Text>
                        </View>
                        <Text style={styles.pickupLabel}>Pickup</Text>
                      </View>

                      <View style={styles.deliveryCircle}>
                        <View style={styles.deliveryIcon}>
                          <Text style={styles.deliveryEmoji}>🏁</Text>
                        </View>
                        <Text style={styles.deliveryLabel}>Delivery</Text>
                      </View>

                      <View style={styles.routeLine} />
                    </View>
                  </View>

                  <View style={styles.detailsInfo}>
                    <View style={styles.detailsIconRow}>
                      <View style={styles.detailsIconContainer}>
                        <View style={styles.iconBadge}>
                          <Text style={styles.detailsIcon}>📦</Text>
                        </View>
                        <Text style={styles.detailsLabel}>{selectedLoad.weight}</Text>
                      </View>
                      <View style={styles.detailsIconContainer}>
                        <View style={styles.iconBadge}>
                          <Text style={styles.detailsIcon}>📐</Text>
                        </View>
                        <Text style={styles.detailsLabel}>{selectedLoad.dimensions || '12"x12"'}</Text>
                      </View>
                      <View style={styles.detailsIconContainer}>
                        <View style={styles.iconBadge}>
                          <Text style={styles.detailsIcon}>🚚</Text>
                        </View>
                        <Text style={styles.detailsLabel}>{selectedLoad.vehicleType}</Text>
                      </View>
                      <View style={styles.detailsIconContainer}>
                        <View style={styles.iconBadge}>
                          <Text style={styles.detailsIcon}>⏰</Text>
                        </View>
                        <Text style={styles.detailsLabel}>Accepted: {selectedLoad.time.split(',')[0]}</Text>
                      </View>
                    </View>

                    <View style={styles.loadDetails}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailTitle}>Pickup Address:</Text>
                        <Text style={styles.detailValue}>{selectedLoad.pickupAddress || 'Not specified'}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailTitle}>Delivery Address:</Text>
                        <Text style={styles.detailValue}>{selectedLoad.deliveryAddress || 'Not specified'}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailTitle}>Fare:</Text>
                        <Text style={styles.detailValue}>{selectedLoad.priceRange}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailTitle}>Status:</Text>
                        <View style={[styles.statusBadgeLarge, { backgroundColor: selectedLoad.status === 'accepted' ? '#4CAF50' : '#FF9800' }]}>
                          <Text style={styles.statusTextLarge}>{selectedLoad.status === 'accepted' ? 'ACCEPTED' : 'PENDING'}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.contactButtons}>
                      <TouchableOpacity style={styles.callButton} activeOpacity={0.8}>
                        <Text style={styles.callIcon}>📞</Text>
                        <Text style={styles.callText}>Call Shipper</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.messageButton} activeOpacity={0.8}>
                        <Text style={styles.messageIcon}>💬</Text>
                        <Text style={styles.messageText}>Message</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.startDeliveryButton}
                        activeOpacity={0.9}
                        onPress={() => {
                          setShowDetailsModal(false);
                          navigation.navigate('DriverOnTheWay', {
                            loadId: selectedLoad._loadId,
                            load: selectedLoad
                          });
                        }}
                      >
                        <Text style={styles.startDeliveryText}>🚚 START DELIVERY</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const FilterModal = () => {
    const [tempFilters, setTempFilters] = useState(filters);

    const handleFilterChange = (filterType, value) => {
      setTempFilters({...tempFilters, [filterType]: value});
    };

    const applyFilters = () => {
      setFilters(tempFilters);
      setShowFilterModal(false);
    };

    const handleBackdropPress = (e) => {
      // Only close if the press is on the backdrop, not on the modal content
      if (e.target === e.currentTarget) {
        setShowFilterModal(false);
      }
    };

    const clearTempFilters = () => {
      const clearedFilters = {
        vehicleType: '',
        minPrice: '',
        maxPrice: '',
        route: '',
        minRating: ''
      };
      setTempFilters(clearedFilters);
    };

    return (
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity 
          style={styles.filterModalOverlay} 
          activeOpacity={1}
          onPress={handleBackdropPress}
        > 
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Loads</Text>
              <TouchableOpacity 
                onPress={() => {
                  setTempFilters(filters);
                  setShowFilterModal(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Vehicle Type</Text>
                <View style={styles.filterOptions}>
                  {['All', 'Truck', 'Van', 'Bike'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterOption,
                        tempFilters.vehicleType === (type === 'All' ? '' : type) && styles.filterOptionActive
                      ]}
                      onPress={() => handleFilterChange('vehicleType', type === 'All' ? '' : type)}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        tempFilters.vehicleType === (type === 'All' ? '' : type) && styles.filterOptionTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Price Range</Text>
                <View style={styles.priceInputContainer}>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Min Price"
                    placeholderTextColor="#999"
                    value={tempFilters.minPrice}
                    onChangeText={(text) => handleFilterChange('minPrice', text)}
                    keyboardType="numeric"
                  />
                  <Text style={styles.priceInputSeparator}>-</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Max Price"
                    placeholderTextColor="#999"
                    value={tempFilters.maxPrice}
                    onChangeText={(text) => handleFilterChange('maxPrice', text)}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Minimum Rating</Text>
                <View style={styles.filterOptions}>
                  {['All', '4.0+', '4.5+', '4.8+'].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.filterOption,
                        tempFilters.minRating === (rating === 'All' ? '' : rating) && styles.filterOptionActive
                      ]}
                      onPress={() => handleFilterChange('minRating', rating === 'All' ? '' : rating)}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        tempFilters.minRating === (rating === 'All' ? '' : rating) && styles.filterOptionTextActive
                      ]}>
                        {rating}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.clearFiltersButton} 
                onPress={clearTempFilters}
                activeOpacity={0.8}
              >
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyFiltersButton} 
                onPress={applyFilters}
                activeOpacity={0.9}
              >
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
  };

  const applyFiltersToLoads = (loads) => {
    return loads.filter(load => {
      const matchesSearch =
        load.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.shipper.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  };

  const filteredLoads = applyFiltersToLoads(acceptedLoads);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Image source={back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Loads</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Image source={search} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search my loads"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.menuButton} activeOpacity={0.8}>
          <Image source={menu} style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your accepted loads...</Text>
        </View>
      ) : filteredLoads.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.loadsList}
          showsVerticalScrollIndicator={false}
        >
          {filteredLoads.map((load) => (
            <LoadCard key={load.id} load={load} />
          ))}
        </ScrollView>
      )}

      <DetailsModal />
    </View>
  );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  backButton: {
    padding: 8,
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
    flex: 1,
    textAlign: 'start',
  },
  headerSpacer: {
    width: 36,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  searchIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#666',
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#333',
  },
  filterIconActive: {
    color: '#FFF',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  menuButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#333',
  },
  scrollView: {
    flex: 1,
  },
  loadsList: {
    padding: 16,
    paddingBottom: 100,
  },
  loadCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  routeIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  routeIcon: {
    fontSize: 16,
  },
  routeText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
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
    fontWeight: '400',
  },
  shipperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  shipperAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shipperInitials: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  shipperInfo: {
    flex: 1,
  },
  shipperName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  shipperStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 13,
    color: '#333',
    marginRight: 12,
    fontWeight: '500',
  },
  deliveries: {
    fontSize: 13,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  viewDetailsButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  viewDetailsText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateImage: {
    width: 300,
    height: 300,
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginBottom: 16,
  },
  refreshButtonText: {
    textAlign: 'center',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    padding: 4,
  },
  filterContent: {
    padding: 20,
  },
  filterGroup: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: '#F8F8F8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#FFF',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333',
  },
  priceInputSeparator: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFF',
  },
  clearFiltersButton: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingVertical: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  clearFiltersText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyFiltersButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
  },
  applyFiltersText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  // Details Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailsModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  detailsModalWrapper: {
    height: '80%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  detailsModalContent: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalPullBar: {
    width: 40,
    height: 4,
    backgroundColor: '#D0D0D0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  detailsHeader: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  detailsScrollView: {
    flex: 1,
  },
  detailsScrollContent: {
    paddingBottom: 30,
  },
  mapContainer: {
    height: 150,
    backgroundColor: '#F0F0F0',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsInfo: {
    padding: 20,
  },
  detailsIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  detailsIconContainer: {
    alignItems: 'center',
    flex: 1,
  },
  iconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailsIcon: {
    fontSize: 24,
  },
  detailsLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  contactButtons: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginRight: 10,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  callIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  callText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginLeft: 10,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  messageIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  fareSection: {
    marginTop: 10,
  },
  fareLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  fareInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
    color: '#333',
  },
  preferredFareLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  fareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  fareOption: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginHorizontal: 3,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  fareOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  fareOptionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  fareOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  sendOfferButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sendOfferText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DriverLoadBoardScreen;