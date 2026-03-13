import React from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList, View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Entypo } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { updateDetails, updateAuthority } from '@/redux/features/reportSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';


export default function ReportTypesScreen() {
  const dispatch = useAppDispatch();
  const details = useAppSelector((state) => state.report.details);

  const router = useRouter();
  const { types, iconName, authority } = useLocalSearchParams(); // TODO: replace with state management due to expo-router limitations

  return (
    <View style={styles.container}>
      {authority && (
        <FlatList
          contentContainerStyle={styles.list}
          data={types}
          renderItem={(item) => {
            const type = item.item;
            return (
              <TouchableOpacity
                style={styles.selector}
                onPress={() => {
                  dispatch(updateAuthority(authority));
                  dispatch(updateDetails({ ...details, type, iconName }));
                  router.navigate('/home/report/details'); // TODO: replace with state management due to expo-router limitations
                }}
              >
                <Entypo
                  name={iconName as any}
                  size={wp('7%')}
                  color="#ff6a30"
                  style={{ marginLeft: wp('2%') }}
                />
                <Text style={styles.selectorText}>{type}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
      {!authority && (
        <View style={styles.placeholder}>
          <Text>Location Required for Issue Types</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#000',
    height: hp('100%'),
  },
  selector: {
    width: wp('100%'),
    height: hp('8%'),
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#555',
    borderBottomWidth: 1,
    borderBottomStartRadius: wp('10%'),
    borderBottomRightRadius: wp('10%'),
    padding: wp('1%'),
  },
  selectorText: {
    fontSize: wp('5%'),
    color: '#FFF',
    marginLeft: wp('3%'),
  },
  list: {
    marginTop: hp('2%'),
    backgroundColor: '#181818',
  },
});
