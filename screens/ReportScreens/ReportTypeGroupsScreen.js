import React from 'react';
import { Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Entypo } from '@expo/vector-icons';

class ReportTypeGroupsScreen extends React.Component {
  render() {
    const {
      navigation: { navigate, state },
    } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          contentContainerStyle={styles.list}
          data={state.params.issueGroups}
          renderItem={(item) => {
            const { name, types, iconName, authority } = item.item;
            return (
              <TouchableOpacity
                style={styles.selector}
                onPress={() => navigate('ReportTypes', { types, iconName, authority })}
              >
                <Entypo
                  name={iconName}
                  size={wp('7%')}
                  color="#ff6a30"
                  style={{ marginLeft: wp('2%') }}
                />
                <Text style={styles.selectorText}>{name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    );
  }
}

export default ReportTypeGroupsScreen;

const styles = StyleSheet.create({
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
