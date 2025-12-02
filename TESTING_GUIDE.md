# Sharporder Testing Guide

## Quick Testing Checklist

### 🚚 Driver Side Testing

#### 1. Driver Registration
- [ ] Open app → Select "Driver" role
- [ ] Fill personal details (name, email, phone, DOB)
- [ ] Select truck type from Firebase-loaded list
- [ ] Upload profile photo, license, truck photo
- [ ] Submit and verify email verification sent
- [ ] Check Firestore `users` collection for new driver

#### 2. Driver Dashboard
- [ ] Login as driver
- [ ] Verify stats show ₦0 for new driver (not hardcoded)
- [ ] Check "Today's loads" shows 0 (dynamic)
- [ ] Verify rating shows from user profile
- [ ] Tap "GO ONLINE" button
- [ ] Verify available loads appear (if any exist)

#### 3. Load Acceptance & Bidding
- [ ] View available load card
- [ ] Tap arrow to expand
- [ ] Submit bid with counter-offer
- [ ] Verify bid saved in Firestore `bids` collection
- [ ] Check load status updated to 'applied'
- [ ] Wait for shipper to accept bid

#### 4. Delivery Completion
- [ ] Navigate to "On The Way" screen
- [ ] Complete delivery
- [ ] Verify earning created in `earnings` collection
- [ ] Check wallet balance updated
- [ ] Verify today's earnings increased

#### 5. Wallet
- [ ] Navigate to Wallet screen
- [ ] Verify balance matches earnings
- [ ] Check Today/Week/Month breakdown
- [ ] Verify transaction history displays

---

### 📦 Shipper Side Testing

#### 1. Shipper Registration
- [ ] Open app → Select "Shipper" role
- [ ] Fill business details
- [ ] Create account
- [ ] Verify user created in Firestore

#### 2. Create Delivery
- [ ] Login as shipper
- [ ] Search for delivery location on map
- [ ] Fill delivery details form:
  - Pickup address
  - Delivery address
  - Truck type selection
  - Load description
  - Recipient details
- [ ] Proceed to trip details
- [ ] Enter fare offer
- [ ] Submit delivery

#### 3. Payment Flow (CRITICAL)
- [ ] After creating delivery, navigate to payment
- [ ] Verify PaystackCheckout screen opens
- [ ] Use Paystack test card:
  ```
  Card: 4084 0840 8408 4081
  CVV: 408
  Expiry: 01/30
  PIN: 0000
  OTP: 123456
  ```
- [ ] Complete payment
- [ ] Verify success alert appears
- [ ] Check Firestore `payments` collection for record
- [ ] Verify shipment status updated to 'in_transit'

#### 4. My Shipments
- [ ] Navigate to "My Shipments"
- [ ] Verify shipments load from Firebase (not hardcoded)
- [ ] Check shipment details are accurate
- [ ] Test "Repeat" delivery button
- [ ] Test "Rate" button
- [ ] For pending shipments, verify "Pay now" button appears

#### 5. Payment History
- [ ] Navigate to Payments screen
- [ ] Verify transactions load from Firestore
- [ ] Check "Total Spent" calculation
- [ ] Verify "Pending Payments" shows correct amount
- [ ] Pull to refresh and verify updates

---

## 🧪 Paystack Test Cards

### Successful Payment
```
Card Number: 4084 0840 8408 4081
CVV: 408
Expiry: Any future date
PIN: 0000
OTP: 123456
```

### Failed Payment (for testing error handling)
```
Card Number: 5060 6666 6666 6666 6666
CVV: Any 3 digits
Expiry: Any future date
```

---

## 🔥 Firebase Collections to Monitor

### During Testing, Check These Collections:

1. **users**
   - New registrations appear here
   - Check `userType` field (driver/shipper)
   - Verify all profile data saved

2. **loads**
   - Created when shipper makes delivery request
   - Status changes: available → applied → accepted → in_transit → delivered
   - Check `bidders` array when drivers apply

3. **bids**
   - Created when driver submits bid
   - Links to load via `loadId`
   - Status: pending → accepted/rejected

4. **shipments**
   - Created for each delivery
   - Linked to loads
   - Check `paymentStatus` field

5. **payments**
   - Created after successful Paystack payment
   - Contains transaction reference
   - Links to shipment/load

6. **earnings**
   - Created when driver completes delivery
   - Check `amount` and `status` fields
   - Used for wallet calculations

---

## 🐛 Common Issues & Solutions

### Issue: "No shipments found"
**Solution:** Create a new delivery as shipper first

### Issue: "No available loads"
**Solution:** 
1. Create delivery as shipper
2. Go online as driver
3. Loads should appear

### Issue: Payment not working
**Solution:**
1. Check Paystack public key is correct
2. Use test card numbers above
3. Check browser console in WebView
4. Verify internet connection

### Issue: Stats showing ₦0 even after delivery
**Solution:**
1. Check `earnings` collection in Firestore
2. Verify `driverId` matches logged-in user
3. Check `status` is 'completed'
4. Verify `createdAt` is today's date

### Issue: Loads not appearing when online
**Solution:**
1. Check Firebase Realtime Database rules
2. Verify loads exist with status 'available'
3. Check console for subscription errors
4. Ensure user is authenticated

---

## 📊 Expected Data Flow

### Delivery Creation Flow:
```
Shipper Dashboard → Search Location → Delivery Details → 
Trip Details → Payment → Paystack → Success → 
Load Created in Firebase → Driver Sees Load
```

### Driver Acceptance Flow:
```
Driver Online → See Load → Submit Bid → 
Bid Saved → Shipper Accepts → Load Status: accepted →
Driver Navigates to Pickup → Complete Delivery →
Earning Created → Wallet Updated
```

### Payment Flow:
```
Shipper Creates Delivery → Navigate to Payment →
PaystackCheckout Opens → Enter Card Details →
Payment Success → Record in 'payments' →
Shipment Status: in_transit → Navigate to Dashboard
```

---

## ✅ Verification Points

After each test, verify:

1. **Firestore Updated**
   - Check relevant collection
   - Verify timestamps are recent
   - Check all required fields present

2. **UI Updated**
   - Data reflects in UI immediately
   - No cached old data
   - Loading states work

3. **Navigation Works**
   - Proper screen transitions
   - Back button works
   - No navigation errors

4. **Error Handling**
   - Try invalid inputs
   - Test network errors
   - Verify user-friendly messages

---

## 🎯 Critical Test Scenarios

### Scenario 1: Complete Delivery Journey
1. Register as shipper
2. Create delivery with payment
3. Register as driver
4. Go online and accept load
5. Complete delivery
6. Verify earning in wallet

### Scenario 2: Multiple Bids
1. Create load as shipper
2. Have 3 drivers submit bids
3. Accept one bid
4. Verify other bids rejected
5. Check load status updated

### Scenario 3: Payment Failure Recovery
1. Create delivery
2. Attempt payment with invalid card
3. Verify error handling
4. Retry with valid card
5. Verify success

---

## 📱 Device Testing

Test on:
- [ ] iOS Simulator
- [ ] Android Emulator
- [ ] Physical iOS device
- [ ] Physical Android device
- [ ] Different screen sizes

---

## 🔍 Debug Tips

### Enable Detailed Logging:
```javascript
// In Firebase services
console.log('Load created:', loadData);
console.log('Payment successful:', paymentRef.id);
console.log('Earning recorded:', earningData);
```

### Check Network Requests:
- Open React Native Debugger
- Monitor Firestore operations
- Check Paystack API calls

### Firebase Console:
- Monitor Firestore in real-time
- Check Authentication users
- Review Security Rules logs

---

## 📞 Support Resources

- **Firebase Console:** https://console.firebase.google.com
- **Paystack Dashboard:** https://dashboard.paystack.com
- **React Native Docs:** https://reactnative.dev
- **Firestore Docs:** https://firebase.google.com/docs/firestore

---

**Last Updated:** December 2, 2024  
**Version:** 1.0  
**Status:** ✅ Ready for Testing
