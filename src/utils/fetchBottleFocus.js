import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../env.js';

export const fetchBottleFocus = async ({mode, year, month, letterId}) => {
  try {
    const guestId = await AsyncStorage.getItem('guestId');

    let url = '';
    if (mode === 'date') {
      url = `${BASE_URL}/api/bottle/focus?year=${year}&month=${month}`;
    } else if (mode === 'recent') {
      url = `${BASE_URL}/api/bottle/focus/${letterId}`;
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'guest-id': '4866bb84-f080-4cee-bccc-004d1e984a5d', // 추후 guestId로 수정
      },
    });
    console.log(`Response Status:`, response.status);

    const responseBody = await response.text(); // 응답 본문 가져오기
    if (response.ok) {
      const responseData = JSON.parse(responseBody);
      const focusLetters =
        mode === 'date'
          ? responseData?.result?.focusList
          : responseData?.result?.focusDetailList;

      const focusLetterCount = responseData?.result?.letterCount;
      console.log('📩 받은 편지 목록:', focusLetters);

      return {focusLetters, focusLetterCount}; // ✅ 데이터를 반환하도록 수정
    } else {
      const errorData = JSON.parse(responseBody);
      console.log(errorData);
      return {focusLetters: [], focusLetterCount: 0}; // 실패 시 빈 배열 반환
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
    return {focusLetters: [], focusLetterCount: 0}; // 네트워크 오류 시 빈 값 반환
  }
};
