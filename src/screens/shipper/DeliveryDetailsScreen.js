import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAppContext} from '../../context/AppContext';
import {Formik, useFormikContext} from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  pickupAddress: Yup.string().required('Pickup address is required'),
  deliveryAddress: Yup.string().required('Delivery address is required'),
  truckType: Yup.string().required('Please select a truck type'),
  loadDescription: Yup.string().required('Load description is required'),
  recipientName: Yup.string().required("Recipient's name is required"),
  recipientNumber: Yup.string()
    .matches(/^\+?\d{10,15}$/, 'Enter a valid phone number')
    .required("Recipient's number is required"),
});

// ✅ Truck Selector Modal that consumes Formik context
const TruckSelector = ({showTruckSelector, setShowTruckSelector}) => {
  const {values, setFieldValue} = useFormikContext();

  const handleSelect = truckType => {
    setFieldValue('truckType', truckType);
    setShowTruckSelector(false);
  };

  return (
    <Modal visible={showTruckSelector} transparent animationType="slide">
      <View style={styles.truckModalOverlay}>
        <TouchableOpacity
          style={styles.truckBackdrop}
          activeOpacity={1}
          onPress={() => setShowTruckSelector(false)}
        />
        <View style={styles.truckModal}>
          <View style={styles.dragHandle} />
          <Text style={styles.modalTitle}>Select your truck</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.truckScrollContent}>
            {[
              {
                name: 'Standard Rigid Dump Truck',
                specs: [
                  'Capacity: 10-30 cubic yards',
                  'Load weight: 15-25 tons',
                  'Tyres: 6',
                ],
              },
              {
                name: 'Articulated Dump Truck',
                specs: [
                  'Capacity: 25-45 cubic yards',
                  'Load weight: 35-45 tons',
                  'Tyres: 10',
                ],
              },
              {
                name: 'Transfer Dump Truck',
                specs: [
                  'Capacity: 15-25 cubic yards',
                  'Load weight: 20-30 tons combined',
                  'Tyres: 8',
                ],
              },
              {
                name: 'Super Dump Truck',
                specs: [
                  'Capacity: 20-30 cubic yards',
                  'Load weight: 26-33 tons',
                  'Tyres: 12',
                ],
              },
              {
                name: 'Semi-trailer End Dump Truck',
                specs: [
                  'Capacity: 20-30 cubic yards',
                  'Load weight: 20-25 tons',
                  'Tyres: 8',
                ],
              },
              {
                name: 'Double/Triple Bottom Dump',
                specs: [
                  'Capacity: 30-40 cubic yards',
                  'Load weight: 40-50 tons',
                  'Tyres: 14',
                ],
              },
            ].map(truck => (
              <TouchableOpacity
                key={truck.name}
                style={[
                  styles.truckOption,
                  values.truckType === truck.name && styles.selectedTruckOption,
                ]}
                onPress={() => handleSelect(truck.name)}>
                <View style={styles.truckIconContainer}>
                  <Text style={styles.truckIcon}>🚛</Text>
                </View>
                <View style={styles.truckDetails}>
                  <Text style={styles.truckName}>{truck.name}</Text>
                  {truck.specs.map((s, i) => (
                    <Text key={i} style={styles.truckSpec}>
                      {s}
                    </Text>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const DeliveryDetailsScreen = ({
  visible,
  onClose = () => {},
  onContinue = () => {},
}) => {
  const {showTruckSelector, setShowTruckSelector} = useAppContext();
  const navigation = useNavigation();
  const [isReceiving, setIsReceiving] = useState(false);

  const handleContinue = values => {
    onClose();
    if (typeof onContinue === 'function') {
      onContinue(values);
      return;
    }
    navigation.navigate('TripDetails');
  };

  const handleClose = () => {
    onClose();
    navigation.navigate('Dashboard');
  };

  return (
    <>
      {/* Main Delivery Details Modal */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={handleClose}
          />
          <View style={styles.modalContainer}>
            <View style={styles.dragHandle} />

            <Formik
              initialValues={{
                pickupAddress: '',
                deliveryAddress: '',
                truckType: '',
                loadDescription: '',
                recipientName: '',
                recipientNumber: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleContinue}>
              {({handleChange, handleSubmit, values, errors, touched}) => (
                <>
                  <ScrollView
                    style={styles.formContainer}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    <Text style={styles.pageTitle}>Delivery details</Text>

                    {/* Pickup Address */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Pickup address</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter here"
                        value={values.pickupAddress}
                        onChangeText={handleChange('pickupAddress')}
                        placeholderTextColor="#C0C0C0"
                      />
                      {touched.pickupAddress && errors.pickupAddress && (
                        <Text style={{color: 'red'}}>
                          {errors.pickupAddress}
                        </Text>
                      )}
                    </View>

                    {/* Delivery Address */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Delivery address</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter here"
                        value={values.deliveryAddress}
                        onChangeText={handleChange('deliveryAddress')}
                        placeholderTextColor="#C0C0C0"
                      />
                      {touched.deliveryAddress && errors.deliveryAddress && (
                        <Text style={{color: 'red'}}>
                          {errors.deliveryAddress}
                        </Text>
                      )}
                    </View>

                    {/* Truck Type */}
                    <TouchableOpacity
                      style={styles.inputContainer}
                      onPress={() => setShowTruckSelector(true)}>
                      <Text style={styles.inputLabel}>Truck type</Text>
                      <View style={styles.selectInput}>
                        <Text
                          style={[
                            styles.selectText,
                            values.truckType && styles.selectedText,
                          ]}>
                          {values.truckType || 'Select here'}
                        </Text>
                        <Text style={styles.selectArrow}>⌄</Text>
                      </View>
                      {touched.truckType && errors.truckType && (
                        <Text style={{color: 'red'}}>{errors.truckType}</Text>
                      )}
                    </TouchableOpacity>

                    {/* Load Description */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Load description</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter here"
                        value={values.loadDescription}
                        onChangeText={handleChange('loadDescription')}
                        placeholderTextColor="#C0C0C0"
                      />
                      {touched.loadDescription && errors.loadDescription && (
                        <Text style={{color: 'red'}}>
                          {errors.loadDescription}
                        </Text>
                      )}
                    </View>

                    {/* Load Image */}
                    <TouchableOpacity style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>
                        Load image (optional)
                      </Text>
                      <View style={styles.uploadContainer}>
                        <Text style={styles.uploadText}>Upload here</Text>
                        <Text style={styles.uploadIcon}>↗</Text>
                      </View>
                    </TouchableOpacity>

                    {/* Recipient Name */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Recipient's name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter here"
                        value={values.recipientName}
                        onChangeText={handleChange('recipientName')}
                        placeholderTextColor="#C0C0C0"
                      />
                      {touched.recipientName && errors.recipientName && (
                        <Text style={{color: 'red'}}>
                          {errors.recipientName}
                        </Text>
                      )}
                    </View>

                    {/* Recipient Number */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Recipient's number</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="+234 08012345678"
                        value={values.recipientNumber}
                        onChangeText={handleChange('recipientNumber')}
                        keyboardType="phone-pad"
                        placeholderTextColor="#C0C0C0"
                      />
                      {touched.recipientNumber && errors.recipientNumber && (
                        <Text style={{color: 'red'}}>
                          {errors.recipientNumber}
                        </Text>
                      )}
                    </View>

                    {/* Toggle */}
                    <View style={styles.toggleContainer}>
                      <Text style={styles.toggleText}>I'm receiving it</Text>
                      <TouchableOpacity
                        style={[
                          styles.toggle,
                          isReceiving && styles.toggleActive,
                        ]}
                        onPress={() => setIsReceiving(!isReceiving)}>
                        <View
                          style={[
                            styles.toggleThumb,
                            isReceiving && styles.toggleThumbActive,
                          ]}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                      style={styles.fullWidthButton}
                      onPress={handleSubmit}>
                      <Text style={styles.fullWidthButtonText}>CONTINUE</Text>
                    </TouchableOpacity>
                  </ScrollView>

                  {/* Truck Selector Modal lives inside Formik ✅ */}
                  <TruckSelector
                    showTruckSelector={showTruckSelector}
                    setShowTruckSelector={setShowTruckSelector}
                    styles={styles}
                  />
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    paddingTop: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333333',
  },
  selectInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#C0C0C0',
  },
  selectedText: {
    color: '#333333',
  },
  selectArrow: {
    fontSize: 16,
    color: '#007AFF',
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#C0C0C0',
  },
  uploadIcon: {
    fontSize: 16,
    color: '#007AFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  toggleText: {
    fontSize: 16,
    color: '#333333',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#007AFF',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  fullWidthButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  fullWidthButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  truckModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  truckBackdrop: {
    flex: 1,
  },
  truckModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 20,
    height: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  truckScrollContent: {
    paddingBottom: 30,
  },
  truckOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  selectedTruckOption: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
    borderWidth: 2,
  },
  truckIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  truckIcon: {
    fontSize: 24,
    color: '#007AFF',
  },
  truckDetails: {
    flex: 1,
  },
  truckName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  truckSpec: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 1,
    lineHeight: 18,
  },
});

export default DeliveryDetailsScreen;
