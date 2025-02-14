import React, {useEffect, useRef, useState} from 'react';
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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import FastImage from 'react-native-fast-image';
import {RNCamera} from 'react-native-camera';
import {useStores} from 'app/stores';
import {Button} from 'react-native-elements';
import {launchCamera} from 'react-native-image-picker';
import {launchImageLibrary} from 'react-native-image-picker';

const Camera = () => {
  // useRef로 camera를 위한 ref
  const cameraRef = useRef(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  const takePhoto = async cameraRef => {
    //퀄리티는 0.1~ 1.0 사이로 지정해줍니다.
    const options = {quality: 0.3, base64: false};
    try {
      const data = await cameraRef.current.takePictureAsync(options);
      data.checked = true;
      console.log('data', data);
    } catch (error) {
      console.log('[camera takePicuture Error]', error);
    } finally {
      setIsTakingPhoto(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        width: '100%',
        paddingHorizontal: -20,
      }}>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <RNCamera
          ref={cameraRef}
          style={{width: '100%'}}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          ratio="1:1"
          //captureAudio 를 써주지 않으면 크래시가 난다.
          captureAudio={false}
          //type은 전면/후면 카메라
          type={RNCamera.Constants.Type.back}
        />
      </View>
      <View
        style={{
          justifyContent: 'space-around',
          alignItems: 'center',
          alignContent: 'center',
          flexDirection: 'row',
          flex: 1,
        }}>
        <Button
          type="clear"
          onPress={() => {
            setIsTakingPhoto(true);
            takePhoto(cameraRef);
          }}
          disabled={isTakingPhoto}
          containerStyle={{
            width: 90,
            height: 90,
            borderRadius: 60,
          }}
          buttonStyle={{
            backgroundColor: 'white',
            padding: 0,
            aspectRatio: 1,
            width: 90,
            height: 90,
            borderRadius: 60,
          }}
        />
      </View>
    </View>
  );
};

const TodayPhotoScreen = () => {
  const navigation = useNavigation();
  const [photos, setPhotos] = useState([]);
  const [camera, setCamera] = useState(false);

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          console.log('Selected Photo: ', response.assets[0]);
          navigation.navigate('addRecordScreen', {
            photo: response.assets[0],
            isToday: false,
            today: today,
          });
        } else {
          console.log('No assets returned from image picker');
        }
      },
    );
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: true,
        includeBase64: false, // base64 변환 여부 (필요한 경우 true)
        includeExtra: true, // 추가 데이터 포함 여부
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          console.log('Photo taken: ', response.assets[0]);
          fetchPhotos(); // 새로 찍은 사진 업데이트
        } else {
          console.log('No assets returned from image picker');
        }
      },
    );
  };

  useEffect(() => {
    const requestPermission = async () => {
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
          console.log('Permission denied');
        }
      } else {
        fetchPhotos();
      }
    };

    requestPermission();
    console.log('Hello Xcode!');
  }, []);

  const fetchPhotos = async () => {
    try {
      const result = await CameraRoll.getPhotos({
        first: 50, // 최신 50개 사진 가져오기 (필터링을 위해 범위 넓힘)
        assetType: 'Photos',
      });

      console.log('Fetched Photos:', result.edges);

      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0); // 오늘의 00:00:00 기준으로 설정

      const formattedPhotos = result.edges
        .filter(photo => {
          const photoDate = new Date(photo.node.timestamp * 1000); // 타임스탬프 변환
          photoDate.setHours(0, 0, 0, 0); // 시간 제거하여 날짜만 비교
          return photoDate.getTime() === todayDate.getTime();
        })
        .map(photo => {
          let uri = photo.node.image.uri;
          if (Platform.OS === 'ios' && uri.startsWith('ph://')) {
            uri = `assets-library://asset/asset.JPG?id=${
              uri.split('/')[2]
            }&ext=JPG`;
          }
          return {
            ...photo,
            node: {...photo.node, image: {...photo.node.image, uri}},
          };
        });

      setPhotos(formattedPhotos);
      console.log('Filtered Photos:', formattedPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('RecordScreen')}>
            <Image source={require('../assets/x.png')} style={styles.Icon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{today}</Text>
        </View>
        {camera ? (
          <Camera />
        ) : (
          <>
            {/* 타이틀 */}
            <View style={styles.todayTitle}>
              <Text style={styles.titleText}>오늘의 사진</Text>
            </View>

            {/* 정렬 옵션 */}
            <View style={styles.sortingOption}>
              <Text style={styles.sortingOptionText}>최신순</Text>
              <Image
                source={require('../assets/sorting.png')}
                style={styles.sortingIcon}
              />
            </View>

            {/* 사진 리스트를 ScrollView로 감싸기 */}
            <ScrollView
              contentContainerStyle={styles.photoScroll}
              style={styles.scrollContainer}>
              {photos.length === 0 ? (
                <Text style={styles.noPhotoText}>사진이 없습니다.</Text>
              ) : (
                <View style={styles.photoGrid}>
                  {photos.map((photo, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        navigation.navigate('addRecordScreen', {
                          photo: photo.node.image.uri,
                          isToday: true,
                          today: today,
                        })
                      }
                      style={styles.photo}>
                      <Image
                        source={{uri: photo.node.image.uri}}
                        style={styles.photoImage}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* 하단 고정 영역 */}
            <View style={styles.otherPhoto}>
              <View style={styles.shadowBox}>
                <TouchableOpacity onPress={openCamera} style={styles.optionBox}>
                  <Image
                    source={require('../assets/camera.png')}
                    style={styles.Icon}
                  />
                  <Text style={styles.optionText}>사진 촬영</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={openGallery}
                  style={styles.optionBox}>
                  <Image
                    source={require('../assets/album.png')}
                    style={styles.Icon}
                  />
                  <Text style={styles.optionText}>앨범에서 찾기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TodayPhotoScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  header: {
    width: '100%',
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
  Icon: {
    width: 24,
    height: 24,
  },
  todayTitle: {
    marginTop: 20,
    marginBottom: 16,
    width: '100%',
  },
  titleText: {
    color: '#19191b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sortingOption: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  sortingOptionText: {
    fontSize: 12,
    color: '#959595',
  },
  sortingIcon: {
    width: 9,
    height: 10,
    marginLeft: 4,
  },
  scrollContainer: {
    width: '100%',
    flex: 1,
  },
  photoScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 120,
  },
  noPhotoText: {
    fontSize: 14,
    color: '#959595',
    textAlign: 'center',
    marginTop: 20,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  photo: {
    width: '47%',
    aspectRatio: 1,
    height: 100,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10,
    zIndex: 0,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  otherPhoto: {
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: 10,
    bottom: 0,
    height: 97,
    width: '100%',

    paddingBottom: 20,
  },
  shadowBox: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#2ECC71',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginHorizontal: -20,
  },
  optionBox: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  optionText: {
    color: '#2ECC71',
  },
});
