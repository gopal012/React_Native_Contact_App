import { useNavigation, DrawerActions } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import ContactList from './ContactList';
import CreateContact from './CreateContact';
import FavoriteContact from './FavoriteContact';
import Icon from 'react-native-vector-icons/Entypo'
import { Text, TouchableHighlight, View } from 'react-native';

function AppNavigation() {

    const navigation = useNavigation();
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleStyle: {
                    fontSize: 30,
                    width: '100%',
                    textAlign: 'center',
                },
                headerTitleAlign: 'center',
            }}>
            <Stack.Screen name='Contact Lists' 
                          component={ContactList} 
                          options={{
                              headerLeft: () => 
                              {
                                  return <Icon name='menu' 
                                               size={30} 
                                               color='black'
                                               onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
                              },
                          }} />
            <Stack.Screen name='New Contact' 
                          component={CreateContact} />
            <Stack.Screen name='Update Contact' 
                          component={CreateContact} />
            <Stack.Screen name='Favorite Contact' 
                          component={FavoriteContact} />
        </Stack.Navigator>
    )
}

export const Create = () => {
    <View>
        <TouchableHighlight style={{ padding: 10 }}
                            underlayColor="transparent">
            <Icon name="plus" size={20} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 5 }}>
                Add
            </Text>
        </TouchableHighlight>
    </View>
}

export default AppNavigation
