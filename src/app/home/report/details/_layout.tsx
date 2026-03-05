import { Stack } from 'expo-router';


export default function DetailsLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerStyle: {
          backgroundColor: 'black'
        },
        headerTintColor: '#ff6a30'
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="typegroups"
        options={{
          headerShown: true
        }}
      />
      <Stack.Screen
        name="types"
        options={{
          headerShown: true,
          headerTitle: 'Types'
        }}
      />
    </Stack>
  );
}
