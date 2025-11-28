import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';

const {width} = Dimensions.get('window');

const ReportsScreen = ({navigation}) => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // week, month, year
  const [reportData, setReportData] = useState({
    totalSpent: 0,
    totalTrips: 0,
    avgTripCost: 0,
    completedTrips: 0,
    cancelledTrips: 0,
    topRoutes: [],
    spendingByCategory: [],
    monthlyTrend: [],
  });

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    loadReportData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [period]);

  const loadReportData = async () => {
    try {
      setLoading(true);

      const now = new Date();
      let startDate;

      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Fetch trips
      const tripsSnapshot = await firestore()
        .collection('trips')
        .where('shipperId', '==', user?.uid)
        .where('createdAt', '>=', startDate)
        .get();

      let totalSpent = 0;
      let completedTrips = 0;
      let cancelledTrips = 0;
      const routes = {};
      const monthlyData = {};

      tripsSnapshot.forEach(doc => {
        const trip = doc.data();
        const amount = trip.fare || trip.amount || 0;

        totalSpent += amount;

        if (trip.status === 'completed') {
          completedTrips++;
        } else if (trip.status === 'cancelled') {
          cancelledTrips++;
        }

        // Track routes
        const route = `${trip.pickupAddress} → ${trip.deliveryAddress}`;
        routes[route] = (routes[route] || 0) + 1;

        // Track monthly trend
        const month = trip.createdAt?.toDate?.()?.getMonth() || 0;
        monthlyData[month] = (monthlyData[month] || 0) + amount;
      });

      const totalTrips = tripsSnapshot.size;
      const avgTripCost = totalTrips > 0 ? totalSpent / totalTrips : 0;

      // Top routes
      const topRoutes = Object.entries(routes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([route, count]) => ({route, count}));

      // Monthly trend
      const monthlyTrend = Object.entries(monthlyData)
        .map(([month, amount]) => ({
          month: getMonthName(parseInt(month)),
          amount,
        }));

      setReportData({
        totalSpent,
        totalTrips,
        avgTripCost,
        completedTrips,
        cancelledTrips,
        topRoutes,
        monthlyTrend,
      });
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month] || '';
  };

  const formatCurrency = (amount) => {
    return `₦${(amount || 0).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const exportReport = () => {
    // Placeholder for export functionality
    alert('Export feature coming soon!');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5A9F" />
          <Text style={styles.loadingText}>Generating report...</Text>
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
        <Text style={styles.headerTitle}>Reports & Analytics</Text>
        <TouchableOpacity style={styles.exportButton} onPress={exportReport}>
          <Text style={styles.exportIcon}>📊</Text>
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {['week', 'month', 'year'].map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodTab, period === p && styles.periodTabActive]}
            onPress={() => setPeriod(p)}>
            <Text
              style={[
                styles.periodText,
                period === p && styles.periodTextActive,
              ]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        opacity={fadeAnim}>
        
        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, styles.primaryCard]}>
            <Text style={styles.summaryIcon}>💰</Text>
            <Text style={styles.summaryValue}>{formatCurrency(reportData.totalSpent)}</Text>
            <Text style={styles.summaryLabel}>Total Spent</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>🚚</Text>
            <Text style={styles.summaryValue}>{reportData.totalTrips}</Text>
            <Text style={styles.summaryLabel}>Total Trips</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>📈</Text>
            <Text style={styles.summaryValue}>{formatCurrency(reportData.avgTripCost)}</Text>
            <Text style={styles.summaryLabel}>Avg Trip Cost</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>✅</Text>
            <Text style={styles.summaryValue}>{reportData.completedTrips}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
        </View>

        {/* Trip Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, {backgroundColor: '#00C896'}]} />
                <Text style={styles.statusLabel}>Completed</Text>
              </View>
              <Text style={styles.statusValue}>{reportData.completedTrips}</Text>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, {backgroundColor: '#FF4444'}]} />
                <Text style={styles.statusLabel}>Cancelled</Text>
              </View>
              <Text style={styles.statusValue}>{reportData.cancelledTrips}</Text>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, {backgroundColor: '#FFA500'}]} />
                <Text style={styles.statusLabel}>Success Rate</Text>
              </View>
              <Text style={styles.statusValue}>
                {reportData.totalTrips > 0
                  ? `${((reportData.completedTrips / reportData.totalTrips) * 100).toFixed(1)}%`
                  : '0%'}
              </Text>
            </View>
          </View>
        </View>

        {/* Top Routes */}
        {reportData.topRoutes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Routes</Text>
            <View style={styles.routesCard}>
              {reportData.topRoutes.map((item, index) => (
                <View key={index} style={styles.routeItem}>
                  <View style={styles.routeRank}>
                    <Text style={styles.routeRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeText} numberOfLines={2}>
                      {item.route}
                    </Text>
                    <Text style={styles.routeCount}>{item.count} trips</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Monthly Trend */}
        {reportData.monthlyTrend.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spending Trend</Text>
            <View style={styles.chartCard}>
              {reportData.monthlyTrend.map((item, index) => {
                const maxAmount = Math.max(...reportData.monthlyTrend.map(d => d.amount));
                const barHeight = maxAmount > 0 ? (item.amount / maxAmount) * 150 : 0;
                
                return (
                  <View key={index} style={styles.chartBar}>
                    <View style={styles.barContainer}>
                      <View style={[styles.bar, {height: barHeight}]}>
                        <Text style={styles.barValue}>
                          {formatCurrency(item.amount)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.barLabel}>{item.month}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightsCard}>
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>💡</Text>
              <Text style={styles.insightText}>
                {reportData.completedTrips > reportData.cancelledTrips
                  ? 'Great job! You have a high completion rate.'
                  : 'Consider reviewing your cancelled trips to improve efficiency.'}
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>📊</Text>
              <Text style={styles.insightText}>
                Your average trip cost is {formatCurrency(reportData.avgTripCost)}
              </Text>
            </View>
            {reportData.topRoutes.length > 0 && (
              <View style={styles.insightItem}>
                <Text style={styles.insightIcon}>🎯</Text>
                <Text style={styles.insightText}>
                  Your most frequent route: {reportData.topRoutes[0].route}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Animated.ScrollView>
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
  exportButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportIcon: {
    fontSize: 24,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  periodTabActive: {
    backgroundColor: '#8B5A9F',
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  summaryCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  primaryCard: {
    width: width - 40,
    backgroundColor: '#8B5A9F',
  },
  summaryIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  routesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  routeRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5A9F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeRankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  routeCount: {
    fontSize: 12,
    color: '#666',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 40,
    backgroundColor: '#8B5A9F',
    borderRadius: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
  },
  barValue: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 8,
  },
  insightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default ReportsScreen;
