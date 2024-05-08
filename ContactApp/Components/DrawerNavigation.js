import React from 'react'
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ContactList from './ContactList';
import DrawerContent from './DrawerContent';
import AppNavigation from './AppNavigation';
import { NavigationContainer } from '@react-navigation/native'

function DrawerNavigation() {
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={()=><DrawerContent/>} initialRouteName="Contact Lists" 
                        screenOptions={{
                            headerShown:false
                        }}>
        <Drawer.Screen name="Contact Lists" component={AppNavigation} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default DrawerNavigation
