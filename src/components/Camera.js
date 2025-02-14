import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {RNCamera} from 'react-native-camera';

const TodayPhotoScreen = () => {
  const navigation = useNavigation();
  const [photos, setPhotos] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const permission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(permission, {
          title: '사진 접근 권한 요청',
          message: '사진을 가져오기 위해 갤러리 접근 권한이 필요합니다.',
          buttonNeutral: '나중에',
          buttonNegative: '취소',
          buttonPositive: '확인',
        });

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          fetchPhotos();
        } else {
          console.log('사진 접근 권한 거부됨');
        }
      } else {
        fetchPhotos();
      }

      // 카메라 권한 요청
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: '카메라 접근 권한 요청',
          message: '사진을 촬영하기 위해 카메라 권한이 필요합니다.',
          buttonNeutral: '나중에',
          buttonNegative: '취소',
          buttonPositive: '확인',
        },
      );

      if (cameraPermission === PermissionsAndroid.RESULTS.GRANTED) {
        setHasCameraPermission(true);
      } else {
        console.log('카메라 권한 거부됨');
        setHasCameraPermission(false);
      }
    };

    requestPermissions();
  }, []);

  const fetchPhotos = async () => {
    try {
      const result = await CameraRoll.getPhotos({
        first: 10,
        assetType: 'Photos',
      });
      setPhotos(result.edges);
    } catch (error) {
      console.error('사진 가져오기 오류:', error);
    }
  };

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (isCameraOpen) {
    return <CameraScreen onClose={() => setIsCameraOpen(false)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('RecordScreen')}>
            <Image source={require('../assets/x.png')} style={styles.Icon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{today}</Text>
        </View>

        <View style={styles.todayTitle}>
          <Text style={styles.titleText}>오늘의 사진</Text>
        </View>

        <View style={styles.sortingOption}>
          <Text style={styles.sortingOptionText}>최신순</Text>
          <Image
            source={require('../assets/sorting.png')}
            style={styles.sortingIcon}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.photoScroll}
          style={styles.scrollContainer}>
          {photos.length === 0 ? (
            <Text style={styles.noPhotoText}>사진이 없습니다.</Text>
          ) : (
            <View style={styles.photoGrid}>
              {photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{uri: photo.node.image.uri}}
                  style={styles.photo}
                />
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.otherPhoto}>
          <View style={styles.shadowBox}>
            <TouchableOpacity
              style={styles.optionBox}
              onPress={() => setIsCameraOpen(true)}>
              <Image
                source={require('../assets/camera.png')}
                style={styles.Icon}
              />
              <Text style={styles.optionText}>사진 촬영</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBox}>
              <Image
                source={require('../assets/album.png')}
                style={styles.Icon}
              />
              <Text style={styles.optionText}>앨범에서 찾기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// 카메라 화면 컴포넌트
const CameraScreen = ({onClose}) => {
  const cameraRef = useRef(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  const takePhoto = async () => {
    if (!cameraRef.current || isTakingPhoto) {
      return;
    }

    setIsTakingPhoto(true);
    try {
      const options = {quality: 0.3, base64: false};
      const data = await cameraRef.current.takePictureAsync(options);
      console.log('사진 촬영됨:', data.uri);
    } catch (error) {
      console.log('사진 촬영 오류:', error);
    } finally {
      setIsTakingPhoto(false);
      onClose(); // 사진 촬영 후 카메라 화면 닫기
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>닫기</Text>
      </TouchableOpacity>

      <RNCamera
        ref={cameraRef}
        style={{flex: 1}}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: '카메라 접근 허용',
          message: '카메라를 사용하려면 권한이 필요합니다.',
          buttonPositive: '확인',
          buttonNegative: '취소',
        }}
      />

      <View style={styles.cameraBottom}>
        <Button title="📸 촬영" onPress={takePhoto} disabled={isTakingPhoto} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#FFFFFF'},
  container: {flex: 1, alignItems: 'center', paddingHorizontal: 20},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19191b',
    textAlign: 'center',
    flex: 1,
  },
  Icon: {width: 24, height: 24},
  todayTitle: {marginTop: 20, marginBottom: 16},
  titleText: {fontSize: 18, fontWeight: 'bold', color: '#19191b'},
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photo: {width: '47%', aspectRatio: 1, borderRadius: 10, marginVertical: 5},
  otherPhoto: {position: 'absolute', bottom: 0, width: '100%', height: 97},
  closeButton: {position: 'absolute', top: 20, left: 20, zIndex: 10},
  closeText: {color: 'white', fontSize: 18},
  cameraBottom: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
});

export default TodayPhotoScreen;
