import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {TailwindProvider} from 'tailwind-rn';
import utilities from './tailwind.json';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Scan from './src/screens/scan';
import Result from './src/screens/result';




const Stack = createStackNavigator();

function SafeQRStack() {
  return (
    <TailwindProvider utilities={utilities}>
    <Stack.Navigator>
      <Stack.Screen 
        name="Scan" 
        component={Scan} 
        options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="Result" 
        component={Result} 
        options={{ headerShown: false}} 
      />
    </Stack.Navigator>
    </TailwindProvider>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <SafeQRStack />
    </NavigationContainer>
  );
}
