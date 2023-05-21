import React , {useState, useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator, View, Text, TextInput, StyleSheet, ImageBackground, Image, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Colors } from '../assets/Colors';
import axios from 'axios';
import { BASE_URL } from '../../config';
function LoginScreen({ navigation }) {
    const {login} = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const loginClick = () => {
        setIsSubmitting(true);
        const url = `${BASE_URL}/login`;
        if(email == '' || email == null || password =='' || password==null){
            setMessage("Всички данни са задължителни.")
            setIsSubmitting(false);
        }
        else axios
            .post(
                url,
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/vnd.api+json",
                        Accept: "application/vnd.api+json",
                    },
                }
            )
            .then((response) => {
                const result = response.data;    
                if (!response.status) {
                    setMessage("Грешни данни за вход.");
                } else {
                    login(JSON.stringify(result.data.token), result.data.user);
                }
            })
            .catch((error) => {
                setIsSubmitting(false);
                if(error == 'AxiosError: Request failed with status code 422' || 
                    error== 'AxiosError: Request failed with status code 401'){
                    setMessage('Невалидни данни.')
                }
                else {
                    setMessage('Грешка при вписване, моля опитайте отново');
                }
            });
    };

    const register = () =>{
        navigation.navigate("Register")
    }
    const forgotPassword = () =>{
        navigation.navigate("ForgotPassword");
    }
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
    return (
        <ImageBackground
            style={styles.background}
            source={require("../assets/bg-simple.jpg")}>
            <Image
                style={styles.icon}
                source={require("../assets/icon.png")}>
            </Image>
            <View style={styles.main}>
                <Text style={styles.title}>Добре дошли отново!</Text>
                <Text style={{color:Colors.error}}>{message}</Text>
            <View style={styles.inputContainer}>
            <Image style={styles.inputIcon} source={require("../assets/user.png")}></Image>
            <TextInput
                    style={styles.input}
                    onChangeText={(text)=>setEmail(text)}
                    value={email}
                    placeholder="Email"
                />
            </View>
            <View style={styles.inputContainer}>
                        <Image style={styles.inputIcon} source={require("../assets/pass.png")}></Image>
                        <TextInput
                            style={[styles.input, { width: 210 }]}
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Парола"
                            secureTextEntry={state.password}
                        />
                        <TouchableOpacity onPress={changeIcon}>
                            <Image style={[styles.inputIcon, { width: 20, height: 20, margin: 5 }]} source={state.icon}></Image>
                        </TouchableOpacity>
                    </View>
                
                {isSubmitting == false && <TouchableHighlight style={styles.loginButton} onPress={loginClick}>
                    <Text style={styles.btntext}>Вход</Text>
                </TouchableHighlight>}
               {isSubmitting ==true && <TouchableHighlight style={styles.loginButton}>
                    <ActivityIndicator size='large' color={Colors.dark}></ActivityIndicator>
                </TouchableHighlight>}
                <TouchableOpacity onPress={register}>
                    <Text style={styles.links}>Нямате регистрация?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={forgotPassword}>
                    <Text style={styles.links}>Забравена парола?</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.back}
                onPress={() => navigation.goBack()}>
                <Image
                    style={{ height: 60, width: 60, }}
                    source={require("../assets/back.png")}>
                </Image>
            </TouchableOpacity>
        </ImageBackground>
    );
}

export default LoginScreen;
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
    inputContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        margin:12,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: Colors.dark
    },
    inputIcon:{
        height: 40,
        width:60,
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
    btntext:{
        fontSize:18,
        color:Colors.dark
    },
    links:{
        color:Colors.primary
    },
    back: {
        position: 'absolute',
        bottom: 30,
        left: 20,
    }
})