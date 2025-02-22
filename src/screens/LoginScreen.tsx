import React, { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { themeStyles } from '../utils/theme';
import { getPasswordValidationErrorText, getValidationErrorText, setVariable, validateEmail, validatePhoneNumber } from '../utils';
import { compare, hash } from "react-native-simple-bcrypt";
import { useDbContext } from '../contexts/DbContext';
import { useUserContext } from '../contexts/UserContext';
import Info from '../components/Info';

function Login({ navigation }: any): React.JSX.Element {

  const distanceInit = 76;
  const registrationInit = 150;
  const rounds = 11;

  const [login, setLogin] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const showInfo = useRef<(err: string, color?: string) => void>(undefined)

  const open = { login: true, registration: false };
  const [distance] = useState(new Animated.Value(0));
  const [registration] = useState(new Animated.Value(-registrationInit));

  const { addUser, getUser } = useDbContext();

  const { initUser } = useUserContext();

  const loginTouched = () => {
    let l = login.trim();
    if (open.login && l) {
      if (!loginPassword) {
        showInfo.current!('Password not set');
        return;
      }
      getUser([l, l], (row: { id: number, email: string, phoneNumber: string, password: string }[]) => {
        if (!row) {
          showInfo.current!('Login failed')
          return
        }
        compare(loginPassword, row[0].password).then(res => {
          if (!res) {
            showInfo.current!('Login failed')
            return;
          }
          showInfo.current!('You were logged in.', 'green');
          setLogin('');
          setLoginPassword('');
          initUser(row[0]);
          navigation.navigate('User')
          return
        })
      })
      showInfo.current!('Login failed')
      return;
    }
    open.login = !open.login;
    setVariable(distance, open.login ? distanceInit : 0);
  }

  const resetRegister = () => {
    setEmail('')
    setPhone('')
    setPassword('')
    setConfirm('')
  }

  const validateRegistration = () => {
    const err = getValidationErrorText(email, phone)
      + getPasswordValidationErrorText(password, confirm);
    if (err !== '') {
      showInfo.current!(err);
      return
    }
    hash(password, rounds).then((res) => {
      const inputs: (string|null)[] = [email.trim(), phone.trim(), res];
      [0,1].forEach(i => {if(!inputs[i]) inputs[i] = null;});
      addUser(inputs,
        (id: number) => {
          if (typeof id === 'undefined')
            showInfo.current!('Email or PhoneNumber is alredy taken');
          else {
            showInfo.current!('You were registered successfuly.', 'green');
            resetRegister();
          }
        }
      )
    });
  }

  const registrationTouched = () => {
    if (open.registration && (email || phone)) {
      validateRegistration();
      return;
    }
    open.registration = !open.registration;
    setVariable(registration, open.registration ? 0 : -registrationInit);
  }

  const gpo = " gap-1 overflow-hidden"

  return (
    <ScrollView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         className='min-h-full flex-column justify-center items-center'
      >
          <Info showInfoRef={showInfo} />
          <View className={themeStyles.threePx}>
            <View className={"flex-column h-35" + gpo}>
              <Animated.View style={{ transform: [{ translateY: distance }] }} className={gpo}>
                <TextInput
                  autoCapitalize="none"
                  placeholder={'E-mail or Phone'}
                  value={login}
                  onChangeText={setLogin}
                  placeholderTextColor={'gray'}
                  className={themeStyles.textInput}
                />
                <TextInput
                  className={themeStyles.textInput}
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  secureTextEntry={true}
                  placeholder="Password"
                />
              </Animated.View>
              <TouchableWithoutFeedback onPress={loginTouched}>
                <Text className={themeStyles.button}>Sign in</Text>
              </TouchableWithoutFeedback>
            </View>
            <View className="overflow-hidden">
              <Animated.View style={{ transform: [{ translateY: registration }] }} className={gpo}>
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
                <TextInput
                  className={themeStyles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  placeholder="Password"
                />
                <TextInput
                  className={themeStyles.textInput}
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry={true}
                  placeholder="Confirm password"
                />
                <TouchableWithoutFeedback onPress={registrationTouched}>
                  <Text className={themeStyles.button}>Register</Text>
                </TouchableWithoutFeedback>
              </Animated.View>
            </View>
          </View>
      </KeyboardAvoidingView>
    </ScrollView>

  );
}

export default Login;
