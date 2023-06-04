import React, { useContext, useState } from 'react';
import { View, ActivityIndicator, Text, TextInput, StyleSheet, ImageBackground, Image, TouchableHighlight, Pressable, TouchableOpacity } from 'react-native';
import { Colors } from '../../assets/Colors';
import { BASE_URL } from '../../../config';
import { ScrollView } from 'react-native-gesture-handler';
import ModalComponent from '../../components/ModalComponent';
import axios from 'axios';
import { TextInputMask } from 'react-native-masked-text';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCakeCandles } from '@fortawesome/free-solid-svg-icons';

function RegisterScreen({ navigation }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const register = () => {
        {
            var date = new Date(birthDate);
            const url = `${BASE_URL}/register`;
            setIsSubmitting(true);
            if (phoneNumber == "" || phoneNumber == null ||
                email == "" || email == null ||
                password == "" || password == null ||
                password_confirmation == "" || password_confirmation == null ||
                birthDate == "" || birthDate == null) {
                setErrors("Всички полета са задължителни!")
                setIsSubmitting(false);
            } else if (password.toString().length < 8) {
                setErrors("Паролата трябва да съдържа поне 8 символа");
                setIsSubmitting(false);
            }
            else if (password_confirmation != password) {
                setErrors("Паролите не съвпадат");
                setIsSubmitting(false);
            } else if (!date instanceof Date) {
                setErrors("Невалидна рожденна дата.");
                setIsSubmitting(false);
            } else if (date.getFullYear() >= new Date().getFullYear() - 13) {
                setErrors("Трябва да сте на поне 13 години.");
                setIsSubmitting(false);
            }
            else
                axios.post(
                    url,
                    {
                        phoneNumber, email, password, password_confirmation, birth_day:birthDate
                    }, {
                    headers: {
                        "Content-Type": "application/vnd.api+json",
                        Accept: "application/vnd.api+json",
                    },
                }
                ).then((response) => {
                    if (!response.status) {
                        setErrors("Невалидни данни");
                    } else {
                        setModalVisible(true);
                    }
                }
                ).catch((error) => {
                    setIsSubmitting(false);
                    console.log(error.response.data);
                    if (error.response.data.errors.email) {
                        setErrors("Невалиден или съществуващ имейл.");
                    }
                    else if (error.response.data.errors.phoneNumber) {
                        setErrors("Невалиден или съществуващ телефонен номер.");
                    }
                    else setErrors("Грешка при регистрацията, моля опитайте отново!");
                });
        }
    }
    const [errors, setErrors] = useState(null);
    const [phoneNumber, onChangeNumber] = useState(null);
    const [email, onChangeEmail] = useState(null);
    const [password, onChangePass] = useState(null);
    const [password_confirmation, onChangePassConf] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const login = () => {
        navigation.navigate("Login")
    }
    const registerBusiness = () => {
        navigation.navigate("RegisterBusiness")
    }
    const [state, setState] = useState({
        icon: require("../../assets/eye-off.png"),
        password: true
    })
    changeIcon = () => {
        if (state.password == true) {
            setState({
                icon: require("../../assets/eye-on.png"),
                password: false
            });
        } else {
            setState({
                icon: require("../../assets/eye-off.png"),
                password: true
            });
        }
    }
    return (

        <ImageBackground
            style={styles.background}
            source={require("../../assets/bg-simple.jpg")}>
            <ScrollView>
                <Image
                    style={styles.icon}
                    source={require("../../assets/icon.png")}>
                </Image>
                <View style={styles.main}>
                    <Text style={styles.title}>Нов профил</Text>
                    <Text style={styles.error}> {errors != null ? errors : ''}</Text>
                    <ModalComponent
                        navigation={navigation}
                        nav='Login'
                        modalVisible={modalVisible}
                        title={'Регистрирахне се успешно!'}
                        btntext={'Вход'}>
                    </ModalComponent>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputIcon}>+359</Text>
                        <TextInput
                            style={styles.input}
                            maxLength={9}
                            onChangeText={onChangeNumber}
                            value={phoneNumber}
                            placeholder="Телефонен номер"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Image style={styles.inputIcon} source={require("../../assets/user.png")}></Image>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeEmail}
                            value={email}
                            placeholder="Email"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Image style={styles.inputIcon} source={require("../../assets/pass.png")}></Image>
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
                        <Image style={styles.inputIcon} source={require("../../assets/pass.png")}></Image>
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
                        <FontAwesomeIcon icon={faCakeCandles} size={24} color={Colors.dark} />
                        <TextInputMask
                            type={'datetime'}
                            options={{ format: 'YYYY-MM-DD' }}
                            placeholder={'Рожденна дата'}
                            value={birthDate}
                            onChangeText={setBirthDate}
                            style={[styles.input, { width: 283 }]} />
                    </View>
                    {isSubmitting == false && <TouchableHighlight style={styles.loginButton}
                        onPress={register}>
                        <Text style={styles.btntext}>Регистрация</Text>
                    </TouchableHighlight>}
                    {isSubmitting == true && <TouchableHighlight style={styles.loginButton}>
                        <ActivityIndicator size='large' color={Colors.dark}></ActivityIndicator>
                    </TouchableHighlight>}
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={login}>
                            <Text style={styles.links}>Вече имате профил?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={registerBusiness}>
                            <Text style={styles.links}>Регистрирай фирма.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

export default RegisterScreen;
const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: "center"
    },
    icon: {
        width: 80,
        height: 80,
        marginTop: 30,
        marginStart: 5,
        alignSelf: 'center'
    },
    error: {
        color: Colors.error,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.dark
    },
    main: {
        margin: 20,
        borderRadius: 20,
        marginTop: 5,
        marginBottom: 10,
        alignItems: "center",
        alignSelf: 'center'
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
    loginButton: {
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
        color: Colors.primary,
        textAlign: 'right'
    },

})