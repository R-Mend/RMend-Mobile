import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Location from 'expo-location';
import { geo } from '../../config/FirebaseApp';
import { get } from 'geofirex';
import Colors from '../../constants/Colors';

export default class NearbyScreen extends React.Component {
  state = { reports: [], isLoaded: false, refreshing: false };

  componentDidMount() {
    this._getReportsAsync();
  }

  _getReportsAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const reports = geo.collection('reports');
      const center = geo.point(latitude, longitude);
      const query = await reports.within(center, 2, 'geoData');
      const nearby = await get(query);
      this.setState({ reports: nearby, isLoaded: true });
    }
  };

  handleRefresh = async () => {
    this.setState({ refreshing: true });
    await setTimeout(() => {}, 3000);
    await this._getReportsAsync();
    this.setState({ refreshing: false });
  };
  // componentDidMount() {
  //     var lisenter = firebaseApp
  //       .firestore()
  //       .collection('reports')
  //       .onSnapshot(snapShot => {
  //         const reports = [];
  //         snapShot.forEach(report => reports.push(report.data()));
  //         this.setState({ reports });
  //       });
  //     this.setState({ lisenter });
  // }

  // componentWillUnmount() {
  //     this.state.lisenter();
  // }

  renderReports = () => {
    const reports = this.state.reports;
    return reports.map((report) => {
      const { details, images } = report;
      return (
        <TouchableOpacity style={styles.reportWrapper}>
          <View style={styles.reportInfo}>
            <Image source={images[0].imageUrl} style={styles.reportImage} />
            <View>
              <Text style={styles.reportType}>{details.type}</Text>
              <Text style={styles.reportAuth}>{details.authority}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  renderPage = () => {
    let reports = this.state.reports;
    const { navigate } = this.props.navigation;
    return (
      <FlatList
        style={{ marginTop: '22%' }}
        contentContainerStyle={styles.list}
        data={reports}
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
        renderItem={(item) => {
          const { details, images } = item.item;
          return (
            <TouchableOpacity
              style={styles.reportInfo}
              onPress={() => navigate('ReportInfo', { report: item.item })}
            >
              <Image source={{ uri: images[0].imageUrl }} style={styles.reportImage} />
              <View>
                <Text style={styles.reportType}>{details.type}</Text>
                <Text style={styles.reportAuth}>{details.authority}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => {
          return (
            <View style={styles.emptyContainer}>
              <Image
                style={styles.emptyImage}
                source={require('../../assets/images/group_of_field_workers.png')}
              />
              <Text style={styles.emptyText}>Couldn't find any nearby reports at this time</Text>
            </View>
          );
        }}
      />
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <Text style={styles.headerText}>Nearby</Text>
        </View>
        {this.renderPage()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: hp('100%'),
    alignItems: 'center',
    backgroundColor: '#EEEE',
  },
  headerWrapper: {
    width: wp('100%'),
    height: hp('14.5%'),
    justifyContent: 'flex-end',
    backgroundColor: 'black',
    padding: wp('1%'),
    zIndex: 100,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerText: {
    color: 'white',
    fontSize: wp('10%'),
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: hp('10%'),
  },
  emptyImage: {
    height: hp('40%'),
    width: hp('40%'),
    borderRadius: wp('50%'),
  },
  emptyText: {
    marginTop: hp('5%'),
    fontSize: wp('4%'),
    color: '#888',
  },
  list: {
    paddingBottom: hp('20%'),
    width: wp('100%'),
    alignItems: 'center',
  },
  reportWrapper: {
    width: wp('90%'),
    height: hp('11%'),
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    marginTop: hp('1%'),
    padding: wp('1%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#222',
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    elevation: 1,
  },
  reportInfo: {
    width: wp('70%'),
    height: hp('13%'),
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    marginTop: hp('2%'),
    paddingLeft: wp('15%'),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  reportImage: {
    width: hp('10%'),
    height: hp('10%'),
    marginRight: wp('5%'),
    borderRadius: wp('3%'),
    position: 'absolute',
    left: wp('-5%'),
  },
  reportType: {
    fontSize: wp('5%'),
    color: '#222',
  },
  reportAuth: {
    fontSize: wp('3%'),
    color: '#666',
  },
});
