import React, { useEffect, useState } from 'react'
import { Button, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo'

let db = openDatabase({ name: 'ContactDatabase.db' });


function ContactList() {

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [contactList, setContactList] = useState([]);
    const [search, setSearch] = useState([]);
    const [oldContactList, setOldContactList] = useState()

    const deleteContact = (id) => {
        db.transaction(txn => {
            txn.executeSql('DELETE from table_user where user_id=?', 
            [id], 
            (tx, res) => {
                getContact();
            })
        })
    }

    const onSearch = (text) => {
        if (text == '') {
            setSearch(text);
            setContactList(oldContactList)
        }else {
            setSearch(text);
            let tempList = contactList.filter(item => {
                return item.user_name.toLowerCase().indexOf(text.toLowerCase()) > -1
            })
            setContactList(tempList);
        }
    }

    const getContact = () => {
        db.transaction(txn => {
            txn.executeSql('SELECT * FROM table_user', [], (txn, res) => {
                let temp = [];
                for (let i = 0; i < res.rows.length; ++i) {
                    temp.push(res.rows.item(i));
                }
                let tempList = temp.sort((a, b) => {
                    if (a.user_name.toLowerCase() < b.user_name.toLowerCase()) {
                        return -1;
                    }
                    if (a.user_name.toLowerCase() > b.user_name.toLowerCase()) {
                        return 1;
                    }
                    return 0;
                });
                setContactList(tempList);
                setOldContactList(tempList);
            })
        })
    }

    useEffect(() => {
        getContact()
    }, [isFocused])

    return (
        <View>
            <ScrollView>
                <View>
                    <TextInput style={styles.searchInput} 
                               placeholder='Search Contact' 
                               value={search} 
                               onChangeText={txt => { onSearch(txt); setSearch(txt) }} 
                    />
                    <FlatList data={contactList} 
                                renderItem={({ item, index }) => {
                                    return (
                                        <Swipeable renderRightActions={() => (
                                            <View style={styles.swipeBar}>
                                                <Text style={{ color: 'white', 
                                                               backgroundColor: 'green', 
                                                               padding: 8 
                                                            }} 
                                                            onPress={() => navigation.navigate('Update Contact', {
                                                                    data: {
                                                                        name: item.user_name,
                                                                        mobileNumber: item.user_contact,
                                                                        landlineNumber: item.user_landline,
                                                                        contactImage: item.contact_image,
                                                                        favoriteContact: item.favorite_contact,
                                                                        id: item.user_id
                                                                    }
                                                            })}> Update
                                                </Text>
                                                <Text style={{ color: 'white', 
                                                               backgroundColor: 'red', 
                                                               padding: 8 
                                                            }} 
                                                            onPress={() => deleteContact(item.user_id)}>
                                                            Delete
                                                </Text>
                                            </View>
                                        )}>
                                            <TouchableOpacity onPress={() => navigation.navigate('Update Contact', {
                                                data: {
                                                    name: item.user_name,
                                                    mobileNumber: item.user_contact,
                                                    contactImage: item.contact_image,
                                                    landlineNumber: item.user_landline,
                                                    favoriteContact: item.favorite_contact,
                                                    id: item.user_id
                                                }
                                            })}>
                                                <View style={{ 
                                                        flex: 1, 
                                                        flexDirection: 'row', 
                                                        justifyContent: 'flex-start', 
                                                        alignItems: 'center', 
                                                        paddingLeft: 60 
                                                    }}>
                                                    <Image source={{ uri: item.contact_image || 'data:image/png;base64,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' }} style={{ height: 50, width: 50, borderRadius: 50 }} />
                                                    <Text style={styles.contacts}>{item.user_name}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </Swipeable>
                                    )
                                }} 
                     />
                </View>
            </ScrollView>
            <Text style={styles.plus} onPress={() => navigation.navigate('New Contact')}>
                <Icon name='plus' size={40} color='black' />
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    contacts: {
        margin: 5,
        marginLeft: 10,
        padding: 15,
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchInput: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 25,
        fontSize: 20,
        margin: 10,
        padding: 10,
        paddingHorizontal: 20
    },
    swipeBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    plus: {
        width: 60,
        position: 'absolute',
        top: 520,
        right: 40,
        padding: 4,
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 10,
        shadowColor: 'black',
        elevation: 5,
    }
})

export default ContactList
