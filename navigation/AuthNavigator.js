import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreens/AuthScreen';
import SignInScreen from '../screens/AuthScreens/SignInScreen';
import CreateUserScreen from '../screens/AuthScreens/CreateUserScreen';

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
        // Only used for stack navigaton when auth is promted from profile screen
        // headerStyle: {
        //   backgroundColor: 'black',
        //   borderBottomColor: 'black'
        // },
      }}
    >
      {/* Only used for stack navigaton when auth is promted from profile screen */}
      {/* <Stack.Screen name="Auth" component={AuthScreen} /> */}
      <Stack.Screen 
        name="SignIn" 
        component={SignInScreen}
        // Only used for stack navigaton when auth is promted from profile screen
        // options={{ headerShown: true }}
      />
      <Stack.Screen 
        name="CreateUser" 
        component={CreateUserScreen}
        // Only used for stack navigaton when auth is promted from profile screen
        // options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
