import React, { useState, useEffect } from 'react';
import { View, Text, PermissionsAndroid } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const FrontCamera = () => {
  const devices = useCameraDevices();
  const [device, setDevice] = useState(devices[1] ); // Set front camera by default
  const [granted, setGranted] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'We need access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      setGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  
  useEffect(() => {
    if (devices[1]) {
      setDevice(devices[1]);
    }
  }, [devices]);

  if (!device) {
    return <Text>Loading camera...</Text>;
  }

  return (
    <View className='flex-1 justify-center items-center'>
      
      {granted ? <Camera
        style={{flex: 1, width: '100%'}}
        device={device}
        isActive={true}
        photo={true}
      /> : <Text>Camera access denied.</Text>}
    </View>
  );
};

export default FrontCamera;