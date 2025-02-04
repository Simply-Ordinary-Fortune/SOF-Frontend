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
        tabBarShowLabel: false,
        tabBarStyle: {backgroundColor: 'white'},
        tabBarIndicatorStyle: {
          backgroundColor: '#2ECC71',
          height: 3, // 선 두께 조정
          width: 65,
          marginLeft: 37,
        },
      }}>
      <Tab.Screen
        name="Photo"
        component={PhotoScreen}
        options={{
          tabBarIcon: ({focused}) => <PhotoIcon focused={focused} />, // 아이콘 크기 조정
        }}
      />
      <Tab.Screen
        name="List"
        component={ListScreen}
        options={{
          tabBarIcon: ({focused}) => <ListIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalenderScreen}
        options={{
          tabBarIcon: ({focused}) => <CalenderIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
