import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import firestore from '@react-native-firebase/firestore';
import {useAuth} from '../../context/AuthContext';
import {firebaseShipmentsService, firebaseLoadsService} from '../../services/firebase';

const PAYSTACK_PUBLIC_KEY = 'pk_test_30af70f8d5dc9f7e882da6f7566bbb9f6cf4f69c';

const paystackHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
    />
    <title>Pay with Paystack</title>
  </head>
  <body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;">
    <p>Initializing payment...</p>
    <script src="https://js.paystack.co/v1/inline.js"></script>
    <script>
      function startPayment() {
        var params = window.PAYSTACK_PARAMS || {};
        if (!params.key || !params.email || !params.amount) {
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ event: 'error', message: 'Missing Paystack params' }),
            );
          }
          return;
        }

        var handler = PaystackPop.setup({
          key: params.key,
          email: params.email,
          amount: params.amount,
          metadata: params.metadata || {},
          callback: function (response) {
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ event: 'success', reference: response.reference }),
              );
            }
          },
          onClose: function () {
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ event: 'cancelled' }),
              );
            }
          },
        });

        handler.openIframe();
      }

      window.onload = function () {
        setTimeout(startPayment, 500);
      };
    </script>
  </body>
</html>`;

const PaystackCheckoutScreen = ({navigation, route}) => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const handledRef = useRef(false);

  const {amount, email: routeEmail, loadId, shipmentId, description} =
    route?.params || {};

  const email = routeEmail || user?.email || '';
  const numericAmount =
    typeof amount === 'number' ? amount : parseFloat(String(amount || '0'));
  const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
  const amountInKobo = Math.round(safeAmount * 100);

  const handleResult = useCallback(
    async data => {
      if (handledRef.current) {
        return;
      }

      if (!data || !data.event) {
        return;
      }

      if (data.event === 'success' && data.reference) {
        handledRef.current = true;
        try {
          await firestore().collection('payments').add({
            userId: user?.uid || null,
            loadId: loadId || null,
            shipmentId: shipmentId || null,
            amount: safeAmount,
            currency: 'NGN',
            status: 'completed',
            type: 'debit',
            reference: data.reference,
            gateway: 'paystack',
            description: description || 'Delivery payment',
            createdAt: firestore.FieldValue.serverTimestamp(),
          });

          if (shipmentId) {
            await firebaseShipmentsService.updateShipment(shipmentId, {
              paymentStatus: 'paid',
              status: 'in_transit',
            });
          }

          if (loadId) {
            await firebaseLoadsService.updateLoad(loadId, {
              status: 'in_transit',
            });
          }

          Alert.alert('Payment successful', 'Your payment was completed.', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Dashboard'),
            },
          ]);
        } catch (error) {
          console.error('Error saving payment:', error);
          Alert.alert(
            'Error',
            'Payment was successful but we could not save the record locally.',
          );
          navigation.navigate('Dashboard');
        }
      } else if (data.event === 'cancelled') {
        handledRef.current = true;
        Alert.alert('Payment cancelled', 'You cancelled the payment.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    },
    [navigation, user?.uid, loadId, shipmentId, safeAmount, description],
  );

  const handleMessage = useCallback(
    event => {
      try {
        const parsed = JSON.parse(event?.nativeEvent?.data || '{}');
        handleResult(parsed);
      } catch (error) {
        console.error('Error parsing Paystack WebView message:', error);
      }
    },
    [handleResult],
  );

  if (!PAYSTACK_PUBLIC_KEY || !email || !amountInKobo) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <View style={styles.center}>
          <Text style={styles.errorText}>Invalid payment details.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const safeEmail = (email || '').replace(/'/g, "\\'");

  const injectedParams = `
    window.PAYSTACK_PARAMS = {
      key: '${PAYSTACK_PUBLIC_KEY}',
      email: '${safeEmail}',
      amount: ${amountInKobo},
      metadata: ${JSON.stringify({
        loadId: loadId || null,
        shipmentId: shipmentId || null,
        userId: user?.uid || null,
      })},
    };
    true;
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complete payment</Text>
      </View>
      <View style={styles.webviewContainer}>
        <WebView
          originWhitelist={["*"]}
          source={{html: paystackHtml}}
          injectedJavaScript={injectedParams}
          javaScriptEnabled
          domStorageEnabled
          onMessage={handleMessage}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#00BFFF" />
            <Text style={styles.loadingText}>Loading Paystack...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  webviewContainer: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#333333',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
  },
});

export default PaystackCheckoutScreen;
