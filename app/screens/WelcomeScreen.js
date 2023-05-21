import React, {useContext} from 'react';
import { TouchableHighlight, Image, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../assets/Colors'
import { AuthContext } from '../context/AuthContext';

function WelcomeScreen({ navigation }) {
    const {isLoading, userToken} = useContext(AuthContext);
    const login = () =>{
        navigation.navigate("Login")
    }
    const register = () =>{
        navigation.navigate("Register")
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                style={styles.background}
                source={require("../assets/bg.jpg")}>
                <View style={styles.logoConteiner}>
                    <Image style={styles.logo} source={require("../assets/icon.png")}></Image>
                    <Text style={styles.title}>Час за вас</Text>
                    <Text style={styles.title}>{userToken}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight style={styles.loginButton} onPress={login}>
                        <Text style={styles.btntext}>Вход</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.registerButton} onPress={register}>
                    <Text style={styles.btntext}>Регистрация</Text>
                    </TouchableHighlight>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    logo: {
        width: 200,
        height: 200,
        marginLeft:20
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.dark
    },
    logoConteiner: {
        position: 'absolute',
        top: 100,
        alignItems: 'center'
    },
    buttonContainer: {
        width: "100%",
        bottom: 150,
        alignItems: "center"
    },
    loginButton: {
        width: "100%",
        width: '90%',
        height: 50,
        backgroundColor: Colors.dark,
        margin: 5,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 20
    },
    registerButton: {
        width: "100%",
        width: '90%',
        height: 50,
        backgroundColor: Colors.light,
        margin: 5,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 20
    },
    btntext:{
        fontSize:20,
        color: Colors.white
    }
})

export default WelcomeScreen;