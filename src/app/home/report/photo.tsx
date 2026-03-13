import { StyleSheet, Text, Image, View, ScrollView, Alert } from 'react-native';
import { ActionSheetIOS, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Header from '@/components/Header';
// import InfoMessage from '../../components/InfoMessage';
import { addImage, removeImage, resetReport } from '@/redux/features/reportSlice';
const imagesPlaceholder = '../../../assets/images/placeholder-dark.jpg';
// import LoadingOverlay from '@/components/LoadingOverlay';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function ReportScreen() {
  const dispatch = useAppDispatch();
  const images = useAppSelector((state) => state.report.images);
  
  const router = useRouter();

  // TODO: [Image Upload Limit] consider adding a limit to the number of photos uploaded
  // const [imageCount, setImageCount] = React.useState(0);
  // const [ready, setReady] = React.useState(false);

  // React.useEffect(() => {
  //   if (images.length > 0) {
  //     setImageCount(images.length);
  //   }
  // }, [images]);

  const getPermissionAsync = async () => {
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (mediaLibraryStatus !== 'granted' && cameraStatus !== 'granted') {
      alert('Sorry, we need camera roll and camera permissions to make this work!');
    }
  };

  React.useEffect(() => {
    getPermissionAsync();
  }, []);

  const _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      dispatch(addImage(result.assets[0].uri));
    }
  };

  const _takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      dispatch(addImage(result.assets[0].uri));
    }
  };

  const photoAlert = () => {
    if (Platform.OS == 'android') {
      Alert.alert('Get a photo from...', '', [
        { text: 'Camera', onPress: () => _takePhoto() },
        { text: 'Take from Library', onPress: () => _pickImage() },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Camera', 'Take from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            _takePhoto();
          } else if (buttonIndex === 2) {
            _pickImage();
          }
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* {isLoading && <LoadingOverlay />} */}
      <Header
        title="Photos"
        navTitleOne="Home"
        navTitleTwo="Next"
        navActionOne={() => {
          dispatch(resetReport());
          router.dismiss();
        }}
        navActionTwo={() => router.navigate('/home/report/location')}
      />
      {/* <InfoMessage message="Include a photo of the incident" /> */}
      <ScrollView
        contentContainerStyle={styles.images}
        horizontal={true}
        directionalLockEnabled={false}
        decelerationRate={0}
        snapToAlignment={'center'}
      >
        {images.length < 1 && (
          <TouchableOpacity onPress={() => photoAlert()}>
            <Image style={styles.image} source={require(imagesPlaceholder)} />
          </TouchableOpacity>
        )}
        {images.map((image, index) => {
          return (
            <View style={styles.imageWrapper} key={index}>
              {/* TODO: Determine if isStatic is needed and if so what to replace it with */}
              {/* <Image source={{ isStatic: true, uri: image }} style={styles.image} /> */}
              <Image source={{ uri: image }} style={styles.image} />
              <View style={styles.imageDeleteContainer}>
                <TouchableOpacity style={styles.imageDelete} onPress={() => dispatch(removeImage(index))}>
                  <AntDesign name="delete" size={wp('5%')} color={'white'} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => photoAlert()}>
        <Text style={{ fontSize: wp('6%'), color: 'white', fontWeight: 'bold' }}>
          {images.length == 0 ? 'Add Photo' : 'Add Another Photo'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    paddingBottom: 80,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  images: {
    height: hp('50%'),
    minWidth: wp('100%'),
    marginTop: hp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    height: hp('50%'),
    width: wp('70%'),
    backgroundColor: '#333',
    borderRadius: 20,
    margin: 10,
    position: 'relative',
  },
  image: {
    height: hp('50%'),
    width: wp('70%'),
    borderRadius: 20,
  },
  imageDelete: {
    width: wp('10%'),
    height: wp('10%'),
    backgroundColor: '#FF5733',
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageDeleteContainer: {
    position: 'absolute',
    right: wp('-2%'),
    top: wp('-2%'),
    zIndex: 10,
  },
  button: {
    width: wp('70%'),
    height: hp('7%'),
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('15%'),
    backgroundColor: '#ff6a30',
  },
});
