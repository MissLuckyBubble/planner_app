import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ImageBackground, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../assets/Colors';
import ModalComponent from '../../components/ModalComponent';
import { BASE_URL } from '../../../config';
import axios from 'axios';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleSendResetLink = () => {
        setIsSubmitting(true);
        const url = `${BASE_URL}/login/forgot_password`;
        if(email == '' || email == null ){
            setMessage("Полето имейл е задължително.")
            setIsSubmitting(false);
        }
        else axios
            .post(
                url,
                { email},
                {
                    headers: {
                        "Content-Type": "application/vnd.api+json",
                        Accept: "application/vnd.api+json",
                    },
                }
            )
            .then((response) => {
                const result = response.data;    
                setModalVisible(true);
            })
            .catch((error) => {
                setIsSubmitting(false);
                console.error(error);
            });
    };

    const resetPassword = () => {
        navigation.navigate("ResetPassword");
    }

    const login = () => {
        navigation.navigate("Login")
    }

    return (
        <ImageBackground style={styles.background}
            source={require("../../assets/bg-simple.jpg")}>
            <Image
                style={styles.icon}
                source={require("../../assets/icon.png")}>
            </Image>
            <View style={styles.main}>
                <Text style={styles.title}>Забравена парола</Text>
                <Text style={{ color: Colors.error }}>{message}</Text>
            </View>
            <View style={styles.inputContainer}>
                <Image style={styles.inputIcon} source={require("../../assets/user.png")}></Image>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="Email"
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSendResetLink}>
                {isSubmitting == false ?
                    <Text style={styles.btntext}>Изпрати код за възстановяване</Text> :
                    <ActivityIndicator size='large' color={Colors.dark}></ActivityIndicator>}
            </TouchableOpacity>
            <TouchableOpacity onPress={resetPassword}>
                <Text style={styles.links}>Вече имате код?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={login}>
                <Text style={styles.links}>Вход.</Text>
            </TouchableOpacity>
            <ModalComponent
                navigation={navigation}
                nav='ResetPassword'
                modalVisible={modalVisible}
                title={'Успешно изпратена заявка!'}
                text={'Ако имейлът e валиден ще получите код за възстановяване.'}
                btntext={'Продължи'}>
            </ModalComponent>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: "center"
    },
    icon: {
        width: 100,
        height: 100,
        marginTop: 60
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.dark
    },
    main: {
        margin: 50,
        borderRadius: 20,
        marginTop: 35,
        marginBottom: 10,
        alignItems: "center"
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 12,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: Colors.dark
    },
    inputIcon: {
        height: 40,
        width: 60,
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        borderColor: Colors.primary
    },
    input: {
        height: 40,
        width: 240,
        padding: 10,
        backgroundColor: Colors.white,
        borderColor: Colors.primary
    },
    button: {
        width: 40,
        width: 300,
        height: 50,
        backgroundColor: Colors.highlight,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    btntext: {
        fontSize: 18,
        color: Colors.dark
    },
    links: {
        color: Colors.primary
    },

});

export default ForgotPasswordScreen;