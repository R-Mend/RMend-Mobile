import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export interface ICommonStyles {
  container: object;
  title: object;
  header: object;
  buttonContainer: object;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    color: Colors.mainText,
    textAlign: 'center',
    fontSize: 80,
    fontWeight: 'bold',
    paddingTop: 130,
    justifyContent: 'center',
  },
  header: {
    color: Colors.mainText,
    textAlign: 'center',
    fontSize: 60,
    paddingTop: 130,
    justifyContent: 'center',
  },
  buttonContainer: {
    margin: 25,
  },
});

export default styles;
