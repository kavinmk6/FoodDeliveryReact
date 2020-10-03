import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import LoginScreen from './screens/LoginScreen';
import LoadingScreen from './screens/LoadingScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import { Image } from 'react-native';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import ReceiptScreen from './screens/ReceiptScreen';
import OrderHistoryDetailScreen from './screens/OrderHistoryDetailScreen';
import PickOrderScreen from './screens/PickOrderScreen';

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function TabScreen() {
  return (
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{tabBarIcon: ({ focused }) => <Image source={require('./assets/home.png')} style={{tintColor: focused ? '#007AFF' : '#AEAEB2', width: 24, height: 24}}/>}}
          />
          
          <Tab.Screen 
          name="Orders History" 
          component={OrderHistoryScreen} 
          options={{tabBarIcon: ({ focused }) => <Image source={require('./assets/orders.png')} style={{tintColor: focused ? '#007AFF' : '#AEAEB2', width: 24, height: 24}}/>}}
          />

        <Tab.Screen 
          name="Pick order" 
          component={PickOrderScreen} 
          options={{tabBarIcon: ({ focused }) => <Image source={require('./assets/schedule.png')} style={{tintColor: focused ? '#007AFF' : '#AEAEB2', width: 24, height: 24}}/>}}
          />

      </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Loading' component={LoadingScreen} options={{headerShown: false}}/>
        <Stack.Screen name='Login' component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name='Register' component={RegisterScreen} options={{headerTintColor: '#E8015A', title: 'Create a new account'}}/>
        <Stack.Screen name='TabScreen' component={TabScreen} options={{headerTintColor: '#E8015A'}}/>
        <Stack.Screen name='OrderDetail' component={OrderDetailScreen} options={{headerTintColor: '#E8015A', title: 'Order Detail'}}/>
        <Stack.Screen name='OrderHistoryDetail' component={OrderHistoryDetailScreen} options={{headerTintColor: '#E8015A', title: 'Order Detail'}}/>
        <Stack.Screen name='Receipt' component={ReceiptScreen} options={{headerTintColor: '#E8015A'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;