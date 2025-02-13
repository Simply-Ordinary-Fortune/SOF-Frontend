import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import TabNavigator from '../components/TabNavigator';

const LetterDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {letterId} = route.params || {};

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
      <TabNavigator screenProps={{letterId}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191B',
    marginLeft: 100,
  },
});

export default LetterDetailScreen;
