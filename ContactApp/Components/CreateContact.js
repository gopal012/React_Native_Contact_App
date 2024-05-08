import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/Entypo'

let db = openDatabase({ name: 'ContactDatabase.db' });

function CreateContact() {
    const route = useRoute();
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('')
    const [landlineNumber, setLandlineNumber] = useState('')
    const [contactImage, setContactImage] = useState('')
    const [favorite, setFavorite] = useState('0');

    useEffect(() => {
        db.transaction((txn) => {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
                [],
                (tx, res) => {
                    console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS table_user', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact INT(10), user_landline INT(10), contact_image VARCHAR(255), favorite_contact VARCHAR(5))',
                            []
                        );
                    }
                }
            );
        });
        if (route.params && route.params.data) {
            setName(route.params.data.name);
            setMobileNumber(route.params.data.mobileNumber);
            setLandlineNumber(route.params.data.landlineNumber);
            setContactImage(route.params.data.contactImage)
            setFavorite(route.params.data.favoriteContact)
        }
    }, []);

    const saveData = () => {
        if (route.params && route.params.data) {
            db.transaction(txn => {
                txn.executeSql(
                    'UPDATE table_user set user_name=?,user_contact=?,user_landline=?,contact_image=?, favorite_contact=?  WHERE user_id=' + route.params.data.id, [name, mobileNumber, landlineNumber, contactImage, favorite],
                    (tex, res) => {
                        navigation.goBack();
                    }, (error) => {
                        console.log(error);
                    }
                );
            })
        } else {
            db.transaction(txn => {
                txn.executeSql(
                    'INSERT INTO table_user(user_name, user_contact, user_landline, contact_image,favorite_contact) VALUES(?,?,?,?,?)', [name, mobileNumber, landlineNumber, contactImage, favorite],
                    (tex, res) => {
                        if (res.rowsAffected == 1) {
                            navigation.goBack();
                        }
                        else {
                            console.log(res);
                        }
                    }, (error) => {
                        console.log(error);
                    }
                );
            })

        }
    }

    return (
        <View>
            <View style={{ margin: 5, 
                           marginTop: 10, 
                           marginLeft: 350 
                        }}>
                {favorite == '1' ? <Icon name='star' size={30} color='black' onPress={() => { setFavorite('0'); }} /> : 
                                   <Icon name='star-outlined' size={30} color='black' onPress={() => { setFavorite('1'); }} />}
            </View>
            <TextInput style={[styles.inputField, { marginTop: 30 }]} 
                       placeholder='Enter Name' 
                       value={name} 
                       onChangeText={text => setName(text)} />
            <TextInput style={styles.inputField} 
                       placeholder='Enter Mobile Number' 
                       defaultValue={mobileNumber.toString()} 
                       onChangeText={text => setMobileNumber(text)} 
                       keyboardType='number-pad' 
                       maxLength={10} />
            <TextInput style={styles.inputField} 
                       placeholder='Enter Landline Number' 
                       defaultValue={landlineNumber.toString()} 
                       onChangeText={text => setLandlineNumber(text)} 
                       keyboardType='number-pad' 
                       maxLength={10} />
            <TextInput style={styles.inputField} 
                       placeholder='Enter Image URL' 
                       defaultValue={contactImage} 
                       onChangeText={text => setContactImage(text)} />
            <TouchableOpacity>
                <Text style={styles.saveButton} onPress={() => saveData()}>Save</Text>
            </TouchableOpacity>
        </View>
    )

}
const styles = StyleSheet.create({
    inputField: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        textAlign: 'center',
        margin: 20,
        padding: 10
    },
    saveButton: {
        color: 'white',
        backgroundColor: 'green',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        width: '50%',
        margin: 'auto',
        textAlign: "center",
        padding: 15,
        marginTop: 10
    }
})

export default CreateContact
