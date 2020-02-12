import React from 'react';
import { Text, StyleSheet, ScrollView, View, Dimensions, Image, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableHighlight, TextInput } from 'react-native-gesture-handler';
import Header from '../../components/Header';
import Colors from '../../constants/Colors';

class ReportSendScreen extends React.Component {
  
    render() {
      const { navigation } = this.props;
      return (
        <SafeAreaView style={styles.container}>
          <Header title="Send" {...this.props}
            navTitleOne="Home" navTitleTwo="Send"
            navActionOne={() => navigation.navigate('Home')}
            navActionTwo={() => print('Send')}/>
          <ScrollView style={styles.content}>
            <Text style={styles.header}>Authority</Text>
            <Text style={styles.subHeader}>This report will be sent to:</Text>
            <TouchableHighlight style={styles.authInfoWrapper}>
              <View style={styles.authInfo}>
                <Image source={require('../../assets/images/placeholder-dark.jpg')} style={styles.authInfoImage}/>
                <View>
                  <Text style={styles.authInfoText}>Barren County Road Department</Text>
                  <Text style={styles.authInfoType}>Council</Text>
                </View>
              </View>
            </TouchableHighlight>
            <Text style={styles.warring}>If this is an emergency, please call emergency services.</Text>
            <Text style={styles.header}>My Details</Text>
            <Text style={styles.subHeader}>Required</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput style={styles.input} placeholder="Required"/>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput style={styles.input} placeholder="Required"/>
            </View>
            <View style={{height: 30}}></View>
            <Text style={styles.subHeader}>Optional</Text>
            <View style={styles.inputWrapperSmall}>
              <Text style={styles.inputLabel}>Telephone</Text>
              <TextInput style={styles.input} placeholder="Optional"/>
            </View>
            <View style={styles.inputWrapperSmall}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput style={styles.input} placeholder="Optional"/>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
  }
}

const styles = StyleSheet.create({
    container: {
      padding: 20,
      alignItems: 'center',
      backgroundColor: '#000',
      height: Dimensions.get('window').height
    },
    content: {
      height: Dimensions.get('window').height,
    },
    header: {
      width: Dimensions.get('window').width,
      fontSize: 25, color: Colors.mainText,
      fontFamily: 'Arial-BoldMT', padding: 5, 
      paddingLeft: 10, marginTop: 25
    },
    subHeader: {
      width: Dimensions.get('window').width,
      fontSize: 15, color: '#444', paddingLeft: 10,
      paddingBottom: 10, fontFamily: 'Arial'
    },
    authInfoWrapper: {
      width: Dimensions.get('window').width, height: 100,
      backgroundColor: '#333',
    },
    authInfo: {
      width: Dimensions.get('window').width, height: 100,
      flexDirection: 'row', alignItems: 'center',
    },
    authInfoImage: {
      width: 60, height: 60,
      margin: 10, borderRadius: 10
    },
    authInfoText: {
      fontSize: 20, color: 'white'
    },
    authInfoType: {
      color:'#666'
    },
    warring: {
      width: 300, marginTop: 20,
      color: '#444', paddingRight: 10,
      alignSelf: 'flex-start'
    },
    inputWrapper: {
      width: Dimensions.get('window').width, height: 75,
      backgroundColor: '#333', flexDirection: 'row', 
      justifyContent: 'space-around', alignItems: 'center',
      borderBottomColor: '#444', borderBottomWidth: 1
    },
    input: {
      width: 200, fontSize: 22, color: 'white',
      textAlign: 'right',
    },
    inputLabel: {
      width: 111, fontSize: 22, color: 'white',
    },
    inputWrapperSmall: {
      width: Dimensions.get('window').width, height: 60,
      backgroundColor: '#333', flexDirection: 'row', 
      justifyContent: 'space-around', alignItems: 'center',
      borderBottomColor: '#444', borderBottomWidth: 1
    }
});

ReportSendScreen.navigationOptions = {
  tabBarIcon: ({focused}) => (
    <View style={{width: 55, height: 55, 
                  borderRadius: 42, 
                  justifyContent: 'center', alignItems: 'center', 
                  backgroundColor: focused ? '#33C7FF':'#FFE633'}}>
        <MaterialIcons name="send" size={30} color={focused?"#FFF":'#666'} />
    </View>
  ),
  tabBarLabel: () => {return null},
};

export default ReportSendScreen;