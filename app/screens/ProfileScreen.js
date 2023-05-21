import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors } from '../assets/Colors';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = ({navigation}) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [info, setInfo] = useState('');
    const { userToken } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
        }
    };
    useEffect(()=>{
        const url = `${BASE_URL}/customer/profile`;
        axios.get(url,config).then((response)=>{
            setInfo(response.data.data);
            console.log(info);
        }).catch((error)=>{
            console.error(error);
        })
    },[]);
    const handleChangePassword = () => {
        // Logic to handle changing password here
        // ...
    };

    const handleChangePhoneNumber = () => {
        // Logic to handle changing phone number here
        // ...
    };

    const handleChangeEmail = () => {
        // Logic to handle changing email here
        // ...
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Профил</Text>
            <View style={styles.infoConteiner}>
            <Text style={styles.text}>Име: { info.info!=undefined ? info.info.name : ''}</Text>
            <Text style={styles.text}>Години: { info.info!=undefined ? info.info.age : ''}</Text>
            <Text style={styles.text}>Email: {info!='' ? info.user.email : ''}</Text>
            <Text style={styles.text}>Тел: {info!=''? info.user.phoneNumber : ''}</Text>
            </View>
            <Text style={styles.sectionTitle}>Смяна на парола</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Стара Парола"
                value={oldPassword}
                onChangeText={setOldPassword}
            />
            <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Нова Парола"
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Потвърждение на Новата Парола"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Смяна на парола</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Смяна на Телефонен Номер</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Парола"
                value={oldPassword}
                onChangeText={setOldPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Нов телефонен номер"
                value={newPhoneNumber}
                onChangeText={setNewPhoneNumber}
            />
            <TouchableOpacity style={styles.button} onPress={handleChangePhoneNumber}>
                <Text style={styles.buttonText}>Смяна на номера</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Смяна на Имейл</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Парола"
                value={oldPassword}
                onChangeText={setOldPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Нов Имейл"
                value={newEmail}
                onChangeText={setNewEmail}
            />
            <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
                <Text style={styles.buttonText}>Смяна на Имейл</Text>
            </TouchableOpacity>

            <View style={styles.infoConteiner}> 
            <Text>Деактивирането на акаунт не е възвращаемо, ще загубите всичките си данни, история и предстоящи записани часове.</Text>
            <TouchableOpacity style={[styles.button,{backgroundColor:Colors.error}]}onPress={handleChangeEmail}>
                <Text style={styles.buttonText}>Деактивиране на Акаунт</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark
    },
    text:{
        fontSize:20,
        padding:1,
        color:Colors.primary
    },
    infoConteiner:{
        padding: 20,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginBottom:20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop:10
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 8,
        paddingHorizontal: 8,
        backgroundColor: Colors.white,
        borderColor: Colors.primary
    },
    button: {
        height: 40,
        backgroundColor: Colors.dark,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
