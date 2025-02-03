import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import PhotoScreen from '../screens/PhotoScreen'; // 사진 화면
import ListScreen from '../screens/ListScreen'; // 리스트 화면
import CalenderScreen from '../screens/CalenderScreen'; // 달력 화면
console.log('PhotoScreen:', PhotoScreen);
console.log('ListScreen:', ListScreen);
console.log('CalenderScreen:', CalenderScreen);
import {PhotoIcon, ListIcon, CalenderIcon} from './NavigationIcon'; // 아이콘 임포트
console.log('Icon:', PhotoIcon, ListIcon, CalenderIcon);

const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  console.log('탭네비게이터 랜더링합니다...');
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {backgroundColor: 'white'},
      }}>
      <Tab.Screen
        name="Photo"
        component={PhotoScreen}
        options={{
          tabBarIcon: () => <PhotoIcon />, // 사진 아이콘
          title: '사진',
        }}
      />
      <Tab.Screen
        name="List"
        component={ListScreen}
        options={{
          tabBarIcon: () => <ListIcon />, // 목록 아이콘
          title: '행운의 편지',
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalenderScreen}
        options={{
          tabBarIcon: () => <CalenderIcon />, // 달력 아이콘
          title: '달력',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
