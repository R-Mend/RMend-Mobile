import React from 'react';
import { StyleSheet, View } from 'react-native';
import { featureEach, booleanContains, point } from '@turf/turf';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Header from '@/components/Header';
import mapStyle from '@/constants/MapStyle';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateLocation, updateCounty, resetReport } from '@/redux/features/reportSlice';
import currentAuthJSON from '@/constants/json/current_rmend_counties.json' with { type: 'json' };
// import LoadingOverlay from '@/components/LoadingOverlay';
import { useRouter } from 'expo-router';


export default function ReportLocationScreen() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [latitude, setLatitude] = React.useState(null);
  const [longitude, setLongitude] = React.useState(null);
  
  const dispatch = useAppDispatch();
  const location = useAppSelector((state) => state.report.location);

  const router = useRouter();

  React.useEffect(() => {
    _getLocationAsync();
  }, []);

  const _getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      updateRegion(location.coords);
    }
    setIsLoaded(true);
  };

  const updateRegion = (region) => {
    const { latitude, longitude } = region;
    dispatch(updateLocation({ latitude, longitude }));
    updateReportsCounty(latitude, longitude);
  };

  const updateReportsCounty = async (latitude, longitude) => {
    const coordinate = point([longitude, latitude]);
    var found = false;
    featureEach(currentAuthJSON as any, (feature) => {
      if (booleanContains(feature, coordinate)) {
        found = true;
        const county = feature.properties.NAME;
        dispatch(updateCounty(county));
      }
    });
    if (!found) {
      dispatch(updateCounty(''));
    }
  };

  return (
    <View style={styles.scrollContainer}>
      {/* {isLoading && <LoadingOverlay />} */}
      <Header
        title="Location"
        navTitleOne="Home"
        navTitleTwo="Next"
        navActionOne={() => {
          dispatch(resetReport());
          router.dismiss();
        }}
        navActionTwo={() => router.navigate('/home/report/details')}
      />
      {/* <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter a location near you"
          placeholderTextColor="#666"
        />
      </View> */}
      {isLoaded && (
        <MapView
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
          initialRegion={{ ...location, latitudeDelta: 0.09, longitudeDelta: 0.09 }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onRegionChange={({ latitude, longitude }) => {
            setLatitude(latitude);
            setLongitude(longitude);
          }}
          onRegionChangeComplete={(region) => updateRegion(region)}
          style={styles.map}
        >
          <Marker
            coordinate={
              longitude
                ? {
                    latitude,
                    longitude,
                  }
                : location
            }
            image={require('../../../assets/images/location_icon.jpg')}
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
    backgroundColor: '#000',
  },
  map: {
    height: hp('78%'),
    width: wp('100%'),
    backgroundColor: '#545454',
    position: 'relative',
  },
  mapMarker: {
    height: hp('5.5%'),
    width: hp('5.5%'),

    position: 'absolute',
    top: hp('32.5%'),
    left: wp('45%'),
  },
  inputWrapper: {
    width: wp('95%'),
    height: hp('5%'),
    backgroundColor: '#222',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 42,
    padding: wp('1%'),
  },
  input: {
    width: wp('90%'),
    fontSize: wp('3%'),
    color: '#666',
  },
});
