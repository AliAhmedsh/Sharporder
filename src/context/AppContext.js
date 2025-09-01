import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showTruckSelector, setShowTruckSelector] = useState(false);
  const [showDriverSelection, setShowDriverSelection] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeliveryAlert, setShowDeliveryAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [alertResolved, setAlertResolved] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '+234 08012345678',
    password: '',
    confirmPassword: '',
    pickupAddress: '',
    deliveryAddress: '',
    truckType: '',
    loadDescription: '',
    recipientName: '',
    recipientNumber: '+234 08012345678',
    fareOffer: '10000',
  });

  const onboardingSteps = [
    {
      title: 'Ship with ease',
      description: 'Send packages anywhere with just a few taps. Our platform connects you with trusted drivers in your area.',
      image: '🚛',
    },
    {
      title: 'Choose your driver',
      description: 'Browse verified drivers, check their ratings, and select the perfect match for your delivery needs.',
      image: '📋',
    },
    {
      title: 'Real-time tracking',
      description: 'Track your package every step of the way with live updates and GPS monitoring for peace of mind.',
      image: '📍',
    },
    {
      title: 'Secure and reliable',
      description: 'Your packages are protected with insurance coverage and verified driver background checks.',
      image: '🔒',
    },
  ];

  const truckTypes = [
    {
      id: 1,
      name: 'Standard Rigid Dump Truck',
      capacity: '10-30 cubic yards',
      weight: '15-25 tons',
      tyres: '6',
      selected: true,
    },
    {
      id: 2,
      name: 'Articulated Dump Truck',
      capacity: '25-45 cubic yards',
      weight: '35-45 tons',
      tyres: '10',
      selected: false,
    },
    {
      id: 3,
      name: 'Transfer Dump Truck',
      capacity: '15-25 cubic yards',
      weight: '20-30 tons combined',
      tyres: '8',
      selected: false,
    },
    {
      id: 4,
      name: 'Super Dump Truck',
      capacity: '20-30 cubic yards',
      weight: '26-33 tons',
      tyres: '12',
      selected: false,
    },
    {
      id: 5,
      name: 'Semi-trailer End Dump Truck',
      capacity: '20-30 cubic yards',
      weight: '20-25 tons',
      tyres: '8',
      selected: false,
    },
  ];

  const drivers = [
    { id: 1, name: 'Kunle Alamu', rating: 4.5, deliveries: 50, price: 15000, time: '10 mins away' },
    { id: 2, name: 'Mohammed Babaginda', rating: 4.8, deliveries: 120, price: 12000, time: '10 mins away' },
    { id: 3, name: 'Chukwuebube Osinachi', rating: 4.8, deliveries: 120, price: 12000, time: '10 mins away' },
    { id: 4, name: 'Oghenetega Atufe', rating: 4.8, deliveries: 120, price: 12000, time: '10 mins away' },
    { id: 5, name: 'Oluwatomisin Alamu', rating: 4.5, deliveries: 50, price: 15000, time: '10 mins away' },
  ];

  const value = {
    currentOnboardingStep,
    setCurrentOnboardingStep,
    showOTPModal,
    setShowOTPModal,
    showTruckSelector,
    setShowTruckSelector,
    showDriverSelection,
    setShowDriverSelection,
    showPaymentModal,
    setShowPaymentModal,
    showDeliveryAlert,
    setShowDeliveryAlert,
    showSuccessModal,
    setShowSuccessModal,
    alertResolved,
    setAlertResolved,
    formData,
    setFormData,
    onboardingSteps,
    truckTypes,
    drivers,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
