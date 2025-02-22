import React, { Fragment, JSX, useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Layout from '../_layout';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import ReAnimated, { useSharedValue } from 'react-native-reanimated';
import { themeStyles } from '../utils/theme';
import { useUserContext } from '../contexts/UserContext';

const WeatherScreen = () => {

  const keys = { postCode: "Post code", dt: "Day time", name: "City name" };
  const initText = (
    <View className="p-10">
      <Text className="text-xl">Pressing screen anywhere toggles dialog.</Text>
    </View>);

  const { user, actual } = useUserContext();

  const [name, setName] = useState('');
  const [data, setData] = useState<JSX.Element>(initText);
  const [detail, setDetail] = useState<JSX.Element>(<></>);
  const [visible, setVisible] = useState(false);

  const useDetail = (i: number) => {
    setDetail(
      <View className='p-4 border-b w-full'>
        {process(user.cities[i])}
      </View>);
    load(user.cities[i].name);
  }

  const list = useMemo(() =>
    <View className="w-full">
      {Object.values(user.cities).map((i, idx, arr) => (
        <TouchableOpacity key={i.id}
          onPress={() => { useDetail(i.id!) }}
          className={idx + 1 < arr.length ? "border-b  " : ""}>
          <Text className="text-xl py-4">
            {i.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    , [user.cities, actual])

  const translateX = useSharedValue(16);
  const translateY = useSharedValue(120);

  const x = useSharedValue(16);
  const y = useSharedValue(120);

  const panGesture = Gesture.Pan()
    .minDistance(1)
    .onUpdate((e) => {
      translateX.value = x.value + e.translationX;
      translateY.value = y.value + e.translationY;
    })
    .onEnd(() => {
      x.value = translateX.value;
      y.value = translateY.value;
    });

  const translate = (k: string, i: string | number): string =>
    ['sunrise', 'sunset', 'dt'].includes(k) ?
      //@ts-ignore
      new Date(i * 1000).toLocaleString() :
      (i as any).toString()


  const transKey = (k: string) =>
    //@ts-ignore
    keys.hasOwnProperty(k) ? keys[k] : k.replaceAll('_', ' ');


  const process = (data: any) => {
    return (
      <View>
        {Object.entries(data).filter(([k, v]) => !['id', 'type']
          .includes(k) && !!v).map(([k, i], idx) => (
            <Fragment key={idx}>{
              ['number', 'string'].includes(typeof i) ?
                <View className="flex-row">
                  <Text className="w-24">{transKey(k)}</Text>
                  <Text className="font-bold">{translate(k, i as any)}</Text>
                </View>
                : process(i)}
            </Fragment>
          ))}
      </View>
    )
  }

  const load = async (input = name) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input.trim())}&appid=91a8b0d4c5d50d9617d0cce89862204e`);
    const data = await response.json();
    setData(
      <View className="p-4">
        {process(data)}
      </View>);
  }

  return (
    <GestureHandlerRootView>
      <Layout>
        <TouchableWithoutFeedback onPress={() => { setVisible(prev => !prev) }}>
          <View className='min-h-full'>
            {detail}
            {data}
            <GestureDetector gesture={panGesture}>
              <ReAnimated.View
                style={{
                  top: translateY,
                  left: translateX,
                }}
                className="absolute"
              >
                {visible && <View
                  className={themeStyles.border + " bg-[#ffe] w-auto p-2 pt-8"}
                  style={{ elevation: 10 }}>
                  <View className="flex-row gap-1 justify-center items-center">
                    <TextInput
                      autoCapitalize="words"
                      placeholder={'City name'}
                      value={name}
                      onChangeText={setName}
                      placeholderTextColor={'gray'}
                      className={themeStyles.textInput + ' h-11 w-40'
                      }
                    />
                    <TouchableOpacity onPress={() => { setDetail(<></>); load() }}>
                      <Text className={themeStyles.button}>Show</Text>
                    </TouchableOpacity>
                  </View>
                  {list}
                </View>}
              </ReAnimated.View>
            </GestureDetector>
          </View>
        </TouchableWithoutFeedback>
      </Layout>
    </GestureHandlerRootView>
  );
};

export default WeatherScreen;