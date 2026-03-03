import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// import AuthScreen from '@/screens/AuthScreens/AuthScreen';
import SignInScreen from '@/screens/AuthScreens/SignInScreen';
import CreateUserScreen from '@/screens/AuthScreens/CreateUserScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export type AuthStackParamList = {
  SignIn: undefined;
  CreateUser: undefined;
};

function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
        // Only used for stack navigation when auth is prompted from profile screen
        // headerStyle: {
        //   backgroundColor: 'black',
        //   borderBottomColor: 'black'
        // },
      }}
    >
      {/* Only used for stack navigation when auth is prompted from profile screen */}
      {/* <Stack.Screen name="Auth" component={AuthScreen} /> */}
      <Stack.Screen 
        name="SignIn" 
        component={SignInScreen}
        // Only used for stack navigation when auth is prompted from profile screen
        // options={{ headerShown: true }}
        options={{ title: 'SignIn' }}
      />
      <Stack.Screen 
        name="CreateUser" 
        component={CreateUserScreen}
        // Only used for stack navigation when auth is prompted from profile screen
        // options={{ headerShown: true }}
        options={{title: 'CreateUser'}}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;