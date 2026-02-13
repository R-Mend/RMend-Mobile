import React from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import { updateDetails, updateAuthority } from '../../redux/actions';

class ReportTypesScreen extends React.Component {
  render() {
    const {
      navigation: { navigate },
      route: {
        params: { types, iconName, authority },
      },
      details,
      updateDetails,
      updateAuthority,
    } = this.props;
    return (
      <SafeAreaView style={styles.container}>
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
                    updateAuthority(authority);
                    updateDetails({ ...details, type, iconName });
                    navigate('Report');
                  }}
                >
                  <Entypo
                    name={iconName}
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
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ report }) => {
  return {
    details: report.details,
  };
};

export default connect(mapStateToProps, { updateDetails, updateAuthority })(ReportTypesScreen);

const styles = StyleSheet.create({
  placeholder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
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
