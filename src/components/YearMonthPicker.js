import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const YearMonthPicker = ({letterCount, onDateChange}) => {
  console.log('행운의편지 개수:', letterCount);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // 가능한 년도와 월 추출
  const [filteredLetters, setFilteredLetters] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [modalVisible, setModalVisible] = useState(false);

  // 📌 2023년 ~ 2025년까지 모든 년도와 월을 하드코딩
  const availableYears = [2023, 2024, 2025];
  const availableMonths = Array.from({length: 12}, (_, i) => i + 1); // 1~12월

  const handleConfirm = () => {
    setModalVisible(false);
    onDateChange({
      year: selectedYear.toString(),
      month: selectedMonth.toString(),
    });
  };

  /*useEffect(() => {
    const newFilteredLetters = letterData.filter(
      letter =>
        new Date(letter.letterDate).getFullYear() === selectedYear &&
        new Date(letter.letterDate).getMonth() + 1 === selectedMonth,
    );
    setFilteredLetters(newFilteredLetters);
    onDateChange(newFilteredLetters); // 변경된 필터링된 데이터를 상위 컴포넌트에 전달
  }, [selectedYear, selectedMonth, letterData, onDateChange]);*/

  return (
    <View>
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => setModalVisible(true)}>
        <Text
          style={
            styles.pickerTitle
          }>{`${selectedYear}년 ${selectedMonth}월`}</Text>
        <Image
          source={require('../assets/icons/downArrowIcon.png')}
          style={{width: 20, height: 20, marginLeft: 10, marginTop: 15}}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {/* 선택된 월에 해당하는 편지 개수 표시 */}
      <Text style={styles.letterNumber}>행운편지 {letterCount}개</Text>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>날짜 선택</Text>

            {/* 년도 선택 */}
            <Picker
              selectedValue={selectedYear}
              onValueChange={setSelectedYear}>
              {availableYears.map(year => (
                <Picker.Item key={year} label={`${year}년`} value={year} />
              ))}
            </Picker>

            {/* 월 선택 (선택된 년도에 해당하는 월만 표시) */}
            <Picker
              selectedValue={selectedMonth}
              onValueChange={setSelectedMonth}>
              {availableMonths.map(month => (
                <Picker.Item key={month} label={`${month}월`} value={month} />
              ))}
            </Picker>

            {/* 닫기 버튼 */}
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.closeButton}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default YearMonthPicker;

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  pickerTitle: {
    fontSize: 35,
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191B',
  },
  letterNumber: {
    fontSize: 20,
    fontWeight: 'light',
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191B',
    marginTop: 5,
    marginLeft: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    textAlign: 'center',
    color: '#2ECC71',
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
