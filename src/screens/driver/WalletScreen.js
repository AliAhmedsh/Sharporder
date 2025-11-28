import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';

const {width} = Dimensions.get('window');

const WalletScreen = ({navigation}) => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [walletData, setWalletData] = useState({
    balance: 0,
    pendingEarnings: 0,
    totalEarnings: 0,
    todayEarnings: 0,
    weekEarnings: 0,
    monthEarnings: 0,
    transactions: [],
  });

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      
      // Fetch wallet data from Firestore
      const earningsRef = firestore()
        .collection('earnings')
        .where('driverId', '==', user?.uid);
      
      const snapshot = await earningsRef.get();
      
      let balance = 0;
      let pendingEarnings = 0;
      let totalEarnings = 0;
      let todayEarnings = 0;
      let weekEarnings = 0;
      let monthEarnings = 0;
      const transactions = [];

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      snapshot.forEach(doc => {
        const data = doc.data();
        const amount = data.amount || 0;
        const createdAt = data.createdAt?.toDate?.() || new Date(0);

        transactions.push({
          id: doc.id,
          ...data,
        });

        if (data.status === 'completed') {
          totalEarnings += amount;
          balance += amount;

          if (createdAt >= todayStart) {
            todayEarnings += amount;
          }
          if (createdAt >= weekStart) {
            weekEarnings += amount;
          }
          if (createdAt >= monthStart) {
            monthEarnings += amount;
          }
        } else if (data.status === 'pending') {
          pendingEarnings += amount;
        }
      });

      // Sort transactions by date (newest first)
      transactions.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      setWalletData({
        balance,
        pendingEarnings,
        totalEarnings,
        todayEarnings,
        weekEarnings,
        monthEarnings,
        transactions: transactions.slice(0, 20),
      });
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWalletData();
  };

  const formatCurrency = amount => {
    return `₦${(amount || 0).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = timestamp => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return '#00C896';
      case 'pending':
        return '#FFA500';
      case 'failed':
        return '#FF4444';
      default:
        return '#999';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00C896" />
          <Text style={styles.loadingText}>Loading wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Main Balance Card */}
        <View style={styles.mainBalanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.mainBalance}>
            {formatCurrency(walletData.balance)}
          </Text>
          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
          </TouchableOpacity>
        </View>

        {/* Earnings Summary */}
        <View style={styles.earningsGrid}>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>Today</Text>
            <Text style={styles.earningsAmount}>
              {formatCurrency(walletData.todayEarnings)}
            </Text>
          </View>

          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>This Week</Text>
            <Text style={styles.earningsAmount}>
              {formatCurrency(walletData.weekEarnings)}
            </Text>
          </View>

          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>This Month</Text>
            <Text style={styles.earningsAmount}>
              {formatCurrency(walletData.monthEarnings)}
            </Text>
          </View>

          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>Pending</Text>
            <Text style={[styles.earningsAmount, {color: '#FFA500'}]}>
              {formatCurrency(walletData.pendingEarnings)}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Navigate to add bank account
            }}>
            <Text style={styles.actionIcon}>🏦</Text>
            <Text style={styles.actionText}>Add Bank Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Navigate to earnings report
            }}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Earnings Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Navigate to withdrawal history
            }}>
            <Text style={styles.actionIcon}>💸</Text>
            <Text style={styles.actionText}>Withdrawals</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Earnings</Text>

          {walletData.transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>💰</Text>
              <Text style={styles.emptyStateTitle}>No earnings yet</Text>
              <Text style={styles.emptyStateText}>
                Complete deliveries to start earning
              </Text>
            </View>
          ) : (
            walletData.transactions.map(transaction => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionCard}
                onPress={() => {
                  // Navigate to transaction details
                }}>
                <View style={styles.transactionLeft}>
                  <View style={styles.transactionIcon}>
                    <Text style={styles.transactionIconText}>📦</Text>
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>
                      {transaction.description || 'Delivery Completed'}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDate(transaction.createdAt)}
                    </Text>
                    {transaction.tripId && (
                      <Text style={styles.transactionId}>
                        Trip #{transaction.tripId.slice(-6)}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmount}>
                    +{formatCurrency(transaction.amount)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: getStatusColor(transaction.status),
                      },
                    ]}>
                    <Text style={styles.statusText}>
                      {transaction.status || 'pending'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Bank Accounts */}
        <View style={styles.bankAccountsSection}>
          <Text style={styles.sectionTitle}>Bank Accounts</Text>
          
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🏦</Text>
            <Text style={styles.emptyStateTitle}>No bank account linked</Text>
            <Text style={styles.emptyStateText}>
              Add a bank account to withdraw your earnings
            </Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add Bank Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  mainBalanceCard: {
    backgroundColor: '#00C896',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  mainBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  withdrawButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  withdrawButtonText: {
    color: '#00C896',
    fontSize: 16,
    fontWeight: '600',
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  earningsCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  earningsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00C896',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  actionText: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
  },
  transactionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionId: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00C896',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  bankAccountsSection: {
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#00C896',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WalletScreen;
