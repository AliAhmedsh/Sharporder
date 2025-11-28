# Sharporder App - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- React Native development environment set up
- Firebase project configured
- iOS/Android development tools

### Installation

1. **Install Dependencies**
   ```bash
   cd /Users/apple/Documents/GitHub/Sharporder
   yarn install
   # or
   npm install
   ```

2. **iOS Setup** (if running on iOS)
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Run the App**
   ```bash
   # iOS
   yarn ios
   # or
   npm run ios

   # Android
   yarn android
   # or
   npm run android
   ```

---

## 📱 New Features Overview

### For Shippers

#### 1. Payment Screen
- **Access**: Dashboard → Menu → Payments
- **Features**:
  - View total spent
  - Track pending payments
  - See transaction history
  - Add payment methods
  - Pull to refresh

#### 2. Notifications
- **Access**: Dashboard → Notifications (add button to header)
- **Features**:
  - Real-time notifications
  - Filter by all/unread/read
  - Mark as read/delete
  - Navigate to related screens

#### 3. Rating System
- **Access**: After completing a delivery
- **Features**:
  - Rate drivers (1-5 stars)
  - Leave reviews
  - Quick review tags
  - Skip option

### For Drivers

#### 1. Wallet Screen
- **Access**: Dashboard → Menu → Wallet
- **Features**:
  - View available balance
  - Track daily/weekly/monthly earnings
  - See pending earnings
  - Add bank accounts
  - Withdraw funds
  - Earnings history

#### 2. Trip History
- **Access**: Dashboard → Menu → My trips
- **Features**:
  - View all trips
  - Filter by status
  - See earnings per trip
  - Trip details
  - Pull to refresh

#### 3. Notifications
- **Access**: Dashboard → Notifications (add button to header)
- **Features**:
  - Real-time notifications
  - Filter by all/unread/read
  - Mark as read/delete
  - Navigate to related screens

#### 4. Rating System
- **Access**: After completing a delivery
- **Features**:
  - Rate shippers (1-5 stars)
  - Leave reviews
  - Quick review tags
  - Skip option

---

## 🔧 Firebase Setup Required

### Collections to Create

1. **payments** (for shippers)
   ```javascript
   {
     userId: string,
     amount: number,
     status: 'pending' | 'completed' | 'failed',
     type: 'credit' | 'debit',
     description: string,
     createdAt: timestamp
   }
   ```

2. **earnings** (for drivers)
   ```javascript
   {
     driverId: string,
     amount: number,
     status: 'pending' | 'completed',
     tripId: string,
     description: string,
     createdAt: timestamp
   }
   ```

3. **trips**
   ```javascript
   {
     driverId: string,
     shipperId: string,
     pickupAddress: string,
     deliveryAddress: string,
     status: 'pending' | 'in_progress' | 'completed' | 'cancelled',
     fare: number,
     distance: number,
     duration: number,
     shipperName: string,
     driverName: string,
     rated_by_shipper: boolean,
     rated_by_driver: boolean,
     createdAt: timestamp
   }
   ```

4. **notifications**
   ```javascript
   {
     userId: string,
     title: string,
     message: string,
     type: 'delivery' | 'payment' | 'message' | 'alert' | 'success',
     read: boolean,
     action: string, // navigation route
     createdAt: timestamp
   }
   ```

5. **ratings**
   ```javascript
   {
     tripId: string,
     fromUserId: string,
     fromUserType: 'shipper' | 'driver',
     toUserId: string,
     toUserType: 'shipper' | 'driver',
     rating: number, // 1-5
     review: string,
     createdAt: timestamp
   }
   ```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Payments collection
    match /payments/{paymentId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }
    
    // Earnings collection
    match /earnings/{earningId} {
      allow read: if request.auth != null && 
                     resource.data.driverId == request.auth.uid;
      allow write: if request.auth != null;
    }
    
    // Trips collection
    match /trips/{tripId} {
      allow read: if request.auth != null && 
                     (resource.data.driverId == request.auth.uid || 
                      resource.data.shipperId == request.auth.uid);
      allow write: if request.auth != null;
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }
    
    // Ratings collection
    match /ratings/{ratingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               resource.data.fromUserId == request.auth.uid;
    }
  }
}
```

### Firestore Indexes

Create these composite indexes in Firebase Console:

1. **payments**
   - Collection: `payments`
   - Fields: `userId` (Ascending), `createdAt` (Descending)

2. **earnings**
   - Collection: `earnings`
   - Fields: `driverId` (Ascending), `createdAt` (Descending)

3. **trips**
   - Collection: `trips`
   - Fields: `driverId` (Ascending), `createdAt` (Descending)
   - Fields: `shipperId` (Ascending), `createdAt` (Descending)
   - Fields: `driverId` (Ascending), `status` (Ascending), `createdAt` (Descending)

4. **notifications**
   - Collection: `notifications`
   - Fields: `userId` (Ascending), `createdAt` (Descending)
   - Fields: `userId` (Ascending), `read` (Ascending), `createdAt` (Descending)

---

## 🎯 Testing Checklist

### Shipper Flow
- [ ] Login as shipper
- [ ] Navigate to Payments screen
- [ ] View payment history
- [ ] Navigate to Notifications
- [ ] Filter notifications
- [ ] Complete a delivery and rate driver
- [ ] Check all menu items work

### Driver Flow
- [ ] Login as driver
- [ ] Navigate to Wallet screen
- [ ] View earnings breakdown
- [ ] Navigate to Trip History
- [ ] Filter trips by status
- [ ] Navigate to Notifications
- [ ] Complete a delivery and rate shipper
- [ ] Check all menu items work

### Crash Testing
- [ ] Leave app idle for 5+ minutes
- [ ] Trigger an error in a component
- [ ] Verify ErrorBoundary catches it
- [ ] Test "Try Again" functionality
- [ ] Verify app doesn't crash

### Performance Testing
- [ ] Test with slow network
- [ ] Test with no network
- [ ] Check memory usage
- [ ] Verify no memory leaks
- [ ] Test real-time updates

---

## 🐛 Troubleshooting

### App Crashes on Startup
1. Clear cache: `yarn start --reset-cache`
2. Reinstall dependencies: `rm -rf node_modules && yarn install`
3. Clean build: `cd ios && pod install && cd ..`

### Firebase Connection Issues
1. Check `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
2. Verify Firebase project configuration
3. Check internet connection
4. Verify Firestore security rules

### Navigation Issues
1. Clear navigation state
2. Restart app
3. Check route names match exactly

### Real-time Updates Not Working
1. Check Firebase listener setup
2. Verify Firestore security rules
3. Check network connection
4. Verify user authentication

---

## 📊 Performance Tips

1. **Optimize Images**
   - Use appropriate image sizes
   - Implement lazy loading
   - Cache images locally

2. **Reduce Firebase Reads**
   - Use pagination
   - Implement proper caching
   - Limit query results

3. **Improve Responsiveness**
   - Use debouncing for search
   - Implement throttling for scroll events
   - Optimize re-renders

4. **Memory Management**
   - Clean up listeners
   - Clear timeouts/intervals
   - Avoid memory leaks

---

## 🔐 Security Best Practices

1. **Never commit sensitive data**
   - Keep API keys in environment variables
   - Use `.gitignore` for config files

2. **Validate user input**
   - Sanitize all inputs
   - Use proper validation schemas

3. **Secure Firebase**
   - Use proper security rules
   - Enable authentication
   - Limit data access

4. **Handle errors gracefully**
   - Don't expose sensitive error details
   - Log errors securely
   - Provide user-friendly messages

---

## 📝 Next Steps

1. **Add Unit Tests**
   - Test critical functions
   - Test components
   - Test navigation

2. **Add E2E Tests**
   - Test complete user flows
   - Test error scenarios
   - Test edge cases

3. **Implement Analytics**
   - Track user behavior
   - Monitor performance
   - Identify issues

4. **Add Push Notifications**
   - Set up FCM
   - Handle notifications
   - Test on devices

5. **Optimize for Production**
   - Enable ProGuard (Android)
   - Optimize bundle size
   - Enable Hermes

---

## 🎉 Congratulations!

Your Sharporder app is now fully enhanced with:
- ✅ Payment tracking
- ✅ Wallet & earnings
- ✅ Trip history
- ✅ Notifications
- ✅ Rating system
- ✅ Crash prevention
- ✅ Performance optimizations
- ✅ Better UX

For detailed information about all improvements, see [IMPROVEMENTS.md](./IMPROVEMENTS.md)

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the improvements documentation
3. Check Firebase console for errors
4. Review app logs

Happy coding! 🚀
