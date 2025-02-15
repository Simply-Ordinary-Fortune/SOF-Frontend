import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SignButton from '../components/SignButton'; // SignButton 컴포넌트를 임포트

const LandingPage = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>환영합니다!</Text>
      <Text style={styles.descriptionText}>
        계속하려면 로그인 또는 게스트 계정을 생성 해주세요.
      </Text>
      <SignButton
        buttonName="로그인"
        onPress={() => navigation.navigate('LoginScreen')} // 로그인 페이지로 이동
      />
      <SignButton
        buttonName="회원가입"
        onPress={() => navigation.navigate('SignupScreen')} // 회원가입 페이지로 이동
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default LandingPage;
