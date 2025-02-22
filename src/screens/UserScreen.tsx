import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Layout from '../_layout'; // Import the Layout component
import { themeStyles } from '../utils/theme';
import { useUserContext } from '../contexts/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { cityInit, getValidationErrorText } from '../utils';
import Info from '../components/Info';
import { useDbContext } from '../contexts/DbContext';
import City from '../components/City';

const UserScreen = () => {

  const { user, actual } = useUserContext();
  const { updateUser } = useDbContext();

  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phoneNumber || '');
  const [init, setInit] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setEmail(user.email || '');
      setPhone(user.phoneNumber || '');
    }, []));


  const showInfo = useRef<(err: string, color?: string) => void>(undefined)

  getValidationErrorText(email, phone)

  const updateUserData = () => {
    const err = getValidationErrorText(email.trim(), phone).trim();
    if (err !== '') {
      showInfo.current!(err);
      return
    }
    updateUser([user.id, email.trim(), phone.trim(), user.password],
      (id: number) => {
        if (typeof id === 'undefined')
          showInfo.current!('Email or PhoneNumber is alredy taken');
        else {
          showInfo.current!('Data changed successfuly.', 'green');
        }
      })
  }

  useEffect(() => {setInit(true)}, [])

  const cityList = useMemo(() => (
    <View className={themeStyles.threePx + ' self-center mt-10'}>
      {Object.values(user.cities).map((i) => (
        <City key={i.id} city={i} showInfo={showInfo.current} />
      ))}
      <City city={{...cityInit}} showInfo={showInfo.current} />
    </View>
  ), [user.cities, actual, init])

  return (
    <Layout>
      <Info showInfoRef={showInfo} />
      <View className={themeStyles.threePx + ' self-center mt-10'}>
        <Text>You can change inputs you use for login.</Text>
        <TextInput
          autoCapitalize="none"
          placeholder={'E-mail'}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={'gray'}
          className={themeStyles.textInput}
        />
        <TextInput
          autoCapitalize="none"
          placeholder={'Phone'}
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor={'gray'}
          className={themeStyles.textInput}
        />
        <TouchableOpacity onPress={updateUserData}>
          <Text className={themeStyles.button}>Update data</Text>
        </TouchableOpacity>
      </View>
      {cityList}
    </Layout>
  );
};
export default UserScreen;