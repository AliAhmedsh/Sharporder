import React, {useEffect, useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {Platform} from 'react-native';

// Reusable date picker component built on react-native-date-picker
// Props:
// - show: boolean to control visibility
// - setShow: function to update visibility
// - initialDate: optional Date to initialize picker
// - onDateChange: callback(Date) when user confirms a date
const DateTimePickerCom = ({onDateChange, show, setShow, initialDate}) => {
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );
  const eightyYearsAgo = new Date(
    today.getFullYear() - 80,
    today.getMonth(),
    today.getDate(),
  );

  // Default to 18 years ago if no initial date is provided
  const [date, setDate] = useState(initialDate || eighteenYearsAgo);

  useEffect(() => {
    if (initialDate instanceof Date) {
      setDate(initialDate);
    } else if (initialDate) {
      const parsed = new Date(initialDate);
      if (!isNaN(parsed.getTime())) {
        setDate(parsed);
      }
    }
  }, [initialDate]);

  const handleConfirm = selectedDate => {
    setShow(false);
    if (selectedDate && onDateChange) {
      setDate(selectedDate);
      onDateChange(selectedDate);
    }
  };

  const handleCancel = () => {
    setShow(false);
  };

  return (
    <DatePicker
      modal
      open={show}
      date={date}
      mode="date"
      minimumDate={eightyYearsAgo}
      maximumDate={eighteenYearsAgo}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      locale={Platform.OS === 'ios' ? undefined : 'en'}
    />
  );
};

export default DateTimePickerCom;
