import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, ImageBackground, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../assets/Colors';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import ModalComponent from '../components/ModalComponent';
import { BASE_URL } from '../../config';
import axios from 'axios';

const ResetPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [password, onChangePass] = useState(null);
    const [password_confirmation, onChangePassConf] = useState(null);
    const [token, setToken] = useState(null);
    const [state, setState] = useState({
        icon: require("../assets/eye-off.png"),
        password: true
    })
    changeIcon = () => {
        if (state.password == true) {
            setState({
                icon: require("../assets/eye-on.png"),
                password: false
            });
        } else {
            setState({
                icon: require("../assets/eye-off.png"),
                password: true
            });
        }
    }
    const [modalVisible, setModalVisible] = useState(false);

    const handleResetPassword = () => {
        setIsSubmitting(true);
        const url = `${BASE_URL}/login/reset_password`;
        if (
            email == "" || email == null ||
            password == "" || password == null ||
            password_confirmation == "" || password_confirmation == null ||
            token == "" || token == null) {
            setMessage("Всички полета са задължителни.")
            setIsSubmitting(false);
        }
        else axios
            .post(
                url,
                { email, password, password_confirmation, token },
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
                setMessage('Невалидни данни');
                setIsSubmitting(false);
                console.log(error.message);
            });
    };

    const forgotPassoword = () => {
        navigation.navigate("ForgotPassword")
    }

    const login = () => {
        navigation.navigate("Login")
    }

    return (
        <ImageBackground style={styles.background}
            source={require("../assets/bg-simple.jpg")}>
            <Image
                style={styles.icon}
                source={require("../assets/icon.png")}>
            </Image>
            <View style={styles.main}>
                <Text style={styles.title}>Възстановяване на парола</Text>
                <Text style={{ color: Colors.error }}>{message}</Text>
            </View>
            <View style={styles.inputContainer}>
                <Image style={styles.inputIcon} source={require("../assets/user.png")}></Image>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="Email"
                />
            </View>
            <View style={styles.inputContainer}>
                <Image style={styles.inputIcon} source={require("../assets/pass.png")}></Image>
                <TextInput
                    style={[styles.input, { width: 210 }]}
                    onChangeText={onChangePass}
                    value={password}
                    placeholder="Парола"
                    secureTextEntry={state.password}
                />
                <TouchableOpacity onPress={changeIcon}>
                    <Image style={[styles.inputIcon, { width: 20, height: 20, margin: 5 }]} source={state.icon}></Image>
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <Image style={styles.inputIcon} source={require("../assets/pass.png")}></Image>
                <TextInput
                    style={[styles.input, { width: 210 }]}
                    onChangeText={onChangePassConf}
                    value={password_confirmation}
                    placeholder="Повторете паролата"
                    secureTextEntry={state.password}
                />
                <TouchableOpacity onPress={changeIcon}>
                    <Image style={[styles.inputIcon, { width: 20, height: 20, margin: 5 }]} source={state.icon}></Image>
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <Image style={styles.inputIcon} source={require("../assets/pass.png")}></Image>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setToken(text)}
                    value={token}
                    keyboardType='number-pad'
                    placeholder="Код за въстановяване"
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                {isSubmitting == false ?
                    <Text style={styles.btntext}>Възстанови</Text> :
                    <ActivityIndicator size='large' color={Colors.dark}></ActivityIndicator>}
            </TouchableOpacity>
            <TouchableOpacity onPress={forgotPassoword}>
                <Text style={styles.links}>Нямате код?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={login}>
                <Text style={styles.links}>Вход.</Text>
            </TouchableOpacity>
            <ModalComponent
                navigation={navigation}
                nav='Login'
                modalVisible={modalVisible}
                title={'Успешно възстановена парола!'}
                text={'Вече може да влезнете с новата си парола.'}
                btntext={'Вход'}>
            </ModalComponent>
        </ImageBackground>
    );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: "center"
    },
    icon: {
        width: 100,
        height: 100,
        marginTop: 50
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark
    },
    main: {
        margin: 50,
        borderRadius: 20,
        marginTop: 10,
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
