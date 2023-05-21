import { React, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Image, ImageBackground, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Colors } from '../assets/Colors';
import { BASE_URL } from '../../config';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';


function CustomDrawer(props) {
    const {logout} = useContext(AuthContext);
    const [userName, setUsername] = useState();
    const { user, userToken } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
        }
    };
    if (user.role_id == 1) {
        //get Customer
        axios.get(
            `${BASE_URL}/customer/profile`,
            config
        ).then((response) => {
            const result = response.data.data;
            setUsername(result.info.name);
        }).catch((error) => {
            console.error(error);
        })
    } else {
        //getBusiness
        axios.get(
            `${BASE_URL}/business/profile`,
            config
        ).then((response) => {
            const result = response.data;
            setUsername(result.name);
        }).catch((error) => {
            console.error(error);
        })
    }
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                contentContainerStyle={styles.container}
            >
                <ImageBackground source={require('../assets/menu.jpg')} style={styles.menu}>
                    <Image source={require('../assets/profile.png')} style={styles.menu_image}></Image>
                    <Text style={styles.menu_text}>{userName}</Text>
                </ImageBackground>
                <View style={styles.list_container}>
                    <DrawerItemList {...props}></DrawerItemList>
                </View>
            </DrawerContentScrollView>
            <View style={styles.end_container}>
                <TouchableOpacity onPress={logout} style={styles.end_click}>
                <FontAwesomeIcon icon={faSignOut} size={24} color={Colors.dark}/>
                    <Text style={styles.end_click_text}>Изход</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}

export default CustomDrawer;
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary
    },
    menu: {
        padding: 20
    },
    menu_image: {
        width: 80, height: 80,
        marginBottom: 10,
        borderRadius: 40,
    },
    menu_text: {
        color: Colors.dark,
        fontSize: 22,
        fontWeight: 600,
    },
    list_container: {
        backgroundColor: Colors.white,
        paddingTop: 10,
    },
    end_container: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.primary,
    },
    end_click:{
        flexDirection:'row',
        padding:5
    },
    end_click_text:{
        paddingLeft:10,
        fontWeight:500,
        fontSize:20,
        color:Colors.dark
    }
});