import 'react-native-gesture-handler'; // 항상 맨위
import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {enableScreens} from 'react-native-screens';
// 스크린
import LetterScreen from './src/screens/LetterScreen';
import HomeScreen from './src/screens/HomeScreen';
import LetterDetailScreen from './src/screens/LetterDetailScreen';
import Landing from './src/screens/Landing';
import RecordScreen from './src/screens/RecordScreen';
import AlbumScreen from './src/screens/AlbumScreen';
import MonthlyScreen from './src/screens/MonthlyScreen';

// 네비게이션 최적화 및 오류 방지
enableScreens();
// 스텍 및 네이게이션 탭 생성
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 메인 탭
const MainTabNavigator = () => {
  /* 키보드 열림, 닫힘 이벤트 감지용
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  */

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 97,
          borderTopWidth: 0.5,
          borderColor: '#2ECC71',
          elevation: 50, // Android에서 그림자 깊이
        },
        tabBarIcon: ({focused}) => {
          let iconSource;
          if (route.name === 'Home') {
            iconSource = focused
              ? require('./src/assets/icons/homeIcon.png') // 활성화 상태 이미지
              : require('./src/assets/icons/homeInactivate.png'); // 비활성화 상태 이미지
          } else if (route.name === 'Letter') {
            iconSource = focused
              ? require('./src/assets/icons/letterIcon.png') // 활성화 상태 이미지
              : require('./src/assets/icons/letterInactivate.png'); // 비활성화 상태 이미지
          }
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
              }}>
              {/* 선 */}
              <View
                style={{
                  position: 'absolute',
                  top: -30.5, // 탭바 상단에 맞추기 top: -(97 - 아이콘 높이)/2
                  width: 50,
                  height: 3,
                  backgroundColor: focused ? '#2ECC71' : 'transparent',
                }}
              />
              {/* 아이콘 */}
              <Image
                source={iconSource}
                style={{
                  width: 36,
                  height: 36,
                }}
                resizeMode="contain"
              />
            </View>
          );
        },
        tabBarLabel: () => null, // 아이콘 이름 숨기기
        tabBarIconStyle: {
          marginTop: 25, // 아이콘을 탭 바의 가운데 정렬
        },
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Landing" component={Landing} />
      <Tab.Screen name="Letter" component={LetterScreen} />
    </Tab.Navigator>
  );
};

// 전체 네비게이터
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* MainTabNavigator를 첫 화면으로 설정 */}
        <Stack.Screen
          name="MainTabNavigator"
          component={MainTabNavigator}
          options={{headerShown: false}}
        />
        {/* LetterDetailScreen 추가 */}
        <Stack.Screen
          name="LetterDetailScreen"
          component={LetterDetailScreen}
          options={{headerShown: false}}
        />
        {/* RecordScreen 추가 */}
        <Stack.Screen
          name="RecordScreen"
          component={RecordScreen}
          options={{headerShown: false}}
        />
        {/* AlbumScreen 추가 */}
        <Stack.Screen
          name="AlbumScreen"
          component={AlbumScreen}
          options={{headerShown: false}}
        />
        {/* MonthlyScreen 추가 */}
        <Stack.Screen
          name="MonthlyScreen"
          component={MonthlyScreen}
          options={{headerShown: false}}
        />
        {/* 필요한 화면 추가 */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
