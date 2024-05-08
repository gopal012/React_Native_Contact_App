import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { DrawerItem } from '@react-navigation/drawer';
import { View } from 'react-native';

const DrawerList = [
    { label: 'Contact Lists', navigateTo: 'Contact Lists' },
    { label: 'Favorite Contact', navigateTo: 'Favorite Contact' },
];

const DrawerLayout = ({ label, navigateTo }) => {
    const navigation = useNavigation();

    return (
        <DrawerItem
            label={label}
            onPress={() => {
                navigation.navigate(navigateTo);
            }}
        />
    );
};

const DrawerItems = () => {
    return DrawerList.map((el, i) => {
        return (
            <DrawerLayout
                key={i}
                label={el.label}
                navigateTo={el.navigateTo}
            />
        );
    });
};

function DrawerContent() {
    return (
        <View>
            <DrawerItems />
        </View>
    );
}

export default DrawerContent;
