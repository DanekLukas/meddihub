import { Animated } from "react-native";

const durationInit = 500;

export const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email.trim());
}

export const validatePhoneNumber = (phoneNumber: string) => {
    const regex = /^(?:\+?(\d{1,3}))?[\s\.-]?\(?(\d{1,4})\)?[\s\.-]?(\d{1,4})[\s\.-]?(\d{1,4})$/;
    return regex.test(phoneNumber.trim());
}

export const getValidationErrorText = (email: string, phone: string) => {
    let err = '';
    if (email === '' && phone === '')
        err += 'Email or Phone has to be set. '
    if (email && !validateEmail(email))
        err += 'Email is not valid. ';
    if (phone && !validatePhoneNumber(phone))
        err += 'Phone number is not valid. ';
    return err;
}

export const getPasswordValidationErrorText = (password: string, confirm: string) => {
    let err = '';
    if (password === '')
        err += 'Password is not set. ';
    if (password !== confirm)
        err += 'Passwords do not match.';
    return err;
}

export const setVariable = (variable: Animated.Value, value: number, duration = durationInit) => {
    Animated.timing(variable, {
      toValue: value,
      duration,
      useNativeDriver: true,
    }).start();
  };

export const cityInit = {
      name: "",
      address: {
        postCode: ""
      }
    };
  
  