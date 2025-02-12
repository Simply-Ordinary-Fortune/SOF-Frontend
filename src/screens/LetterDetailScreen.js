import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import TabNavigator from '../components/TabNavigator';

const LetterDetailScreen = () => {
  const navigation = useNavigation();
  console.log('행운편지보관함 세부 화면 랜더링입니다...');

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon
          onPress={() => navigation.goBack()}
          name="angle-left"
          size={40}
          color="#959595"
        />
        <Text style={styles.title}>행운편지 보관함</Text>
      </View>
      {/* 탭 네비게이터 아래에 추가 */}
      <TabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 100,
  },
});

export default LetterDetailScreen;
