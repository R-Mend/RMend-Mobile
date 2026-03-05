import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      initialRouteName="signin"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="signin"
        options={{ title: 'SignIn' }}
      />
      <Stack.Screen 
        name="createuser" 
        options={{title: 'CreateUser'}}
      />
    </Stack>
  );
}
