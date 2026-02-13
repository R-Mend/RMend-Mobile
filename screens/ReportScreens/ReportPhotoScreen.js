import { StyleSheet, Text, Image, View, ScrollView, Alert } from 'react-native';
import { ActionSheetIOS, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Header from '../../components/Header';
import InfoMessage from '../../components/InfoMessage';
import { addImage, removeImage, resetReport } from '../../redux/actions';
const imagesPlaceholder = '../../assets/images/placeholder-dark.jpg';
import LoadingOverlay from '../../components/LoadingOverlay';

class ReportScreen extends React.Component {
  state = { images: [], imageCount: 0, ready: false };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (mediaLibraryStatus !== 'granted' && cameraStatus !== 'granted') {
      alert('Sorry, we need camera roll and camera permissions to make this work!');
    }
  };

  _pickImage = async () => {
    const { addImage } = this.props;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      addImage(result.uri);
    }
  };

  _takePhoto = async () => {
    const { addImage } = this.props;
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      addImage(result.uri);
    }
  };

  photoAlert = () => {
    if (Platform.OS == 'android') {
      Alert.alert('Get a photo from...', '', [
        { text: 'Camera', onPress: () => this._takePhoto() },
        { text: 'Take from Library', onPress: () => this._pickImage() },
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
            this._takePhoto();
          } else if (buttonIndex === 2) {
            this._pickImage();
          }
        }
      );
    }
  };

  render() {
    const { navigation, images, removeImage, isLoading } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {isLoading && <LoadingOverlay />}
        <Header
          title="Photos"
          {...this.props}
          navTitleOne="Home"
          navTitleTwo="Next"
          navActionOne={() => {
            this.props.resetReport();
            navigation.navigate('Home');
          }}
          navActionTwo={() => navigation.navigate('Location')}
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
            <TouchableOpacity
              onPress={() => {
                this.photoAlert();
              }}
            >
              <Image style={styles.image} source={require(imagesPlaceholder)} />
            </TouchableOpacity>
          )}
          {images.map((image, index) => {
            return (
              <View style={styles.imageWrapper} key={index}>
                <Image source={{ isStatic: true, uri: image }} style={styles.image} />
                <View style={styles.imageDeleteContainer}>
                  <TouchableOpacity style={styles.imageDelete} onPress={() => removeImage(index)}>
                    <AntDesign name="delete" size={wp('5%')} color={'white'} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={this.photoAlert}>
          <Text style={{ fontSize: wp('6%'), color: 'white', fontWeight: 'bold' }}>
            {images.length == 0 ? 'Add Photo' : 'Add Another Photo'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ report }) => {
  return {
    images: report.images,
    isLoading: report.isLoading,
  };
};
export default connect(mapStateToProps, { addImage, removeImage, resetReport })(ReportScreen);

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    paddingTop: 20,
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
