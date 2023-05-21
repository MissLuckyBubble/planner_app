import React, {useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../config";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [user, setUser] = useState();
    const login = (token, user) => {
        setUser(user);
        setUserToken(token.replace(/"/g, ''));
        AsyncStorage.setItem('userToken',token.replace(/"/g, ''));
        AsyncStorage.setItem('user',JSON.stringify(user));
    }
    const logout = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/vnd.api+json",
                Accept: "application/vnd.api+json",
            }
        };
        axios.post(
            `${BASE_URL}/logout`,
            null,
            config
        ).then((response) => {
            setUserToken(null);
            AsyncStorage.removeItem('userToken')
        }).catch((error) => {
            console.error(error.response);
        });
    }

    const isLoggedIn = async() => {
        try{
            let userToken = await AsyncStorage.getItem('userToken');
            let userFromStorage = await AsyncStorage.getItem('user');
            let jsonUser = JSON.parse(userFromStorage);
            if(jsonUser)
            setUser(jsonUser);
            if(userToken)
            setUserToken(userToken.replace(/"/g, '')); // set the userToken state variable to the value retrieved from AsyncStorage
        } catch(e) {
            console.log(`isLoggedIn error: ${e}`);
        }
    }

    useEffect(()=>
    {
        isLoggedIn();

    },[]);

    return (
        <AuthContext.Provider value={{ login, logout, userToken, user }}>
            {children}
        </AuthContext.Provider>
    );
}