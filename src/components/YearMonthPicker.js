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

const YearMonthPicker = ({letterData, onDateChange}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // 가능한 년도와 월 추출
  const [filteredLetters, setFilteredLetters] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [modalVisible, setModalVisible] = useState(false);

  // 년/월 데이터를 추출하여 가능한 년도와 월 리스트 생성
  const availableYears = [
    ...new Set(
      letterData.map(letter => new Date(letter.letterDate).getFullYear()),
    ),
  ];
  const availableMonths = [
    ...new Set(
      letterData
        .filter(
          letter => new Date(letter.letterDate).getFullYear() === selectedYear,
        )
        .map(letter => new Date(letter.letterDate).getMonth() + 1),
    ),
  ];

  useEffect(() => {
    const newFilteredLetters = letterData.filter(
      letter =>
        new Date(letter.letterDate).getFullYear() === selectedYear &&
        new Date(letter.letterDate).getMonth() + 1 === selectedMonth,
    );
    setFilteredLetters(newFilteredLetters);
    onDateChange(newFilteredLetters); // 변경된 필터링된 데이터를 상위 컴포넌트에 전달
  }, [selectedYear, selectedMonth, letterData, onDateChange]);

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
      <Text style={styles.letterNumber}>
        행운편지 {filteredLetters.length}개
      </Text>

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
            <TouchableOpacity onPress={() => setModalVisible(false)}>
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
  },
  pickerTitle: {
    fontSize: 35,
  },
  letterNumber: {
    fontSize: 20,
    fontWeight: 'light',
    marginTop: 5,
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
