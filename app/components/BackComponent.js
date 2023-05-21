import {  Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
function BackComponent ({navigation}){
    return(
    <TouchableOpacity
    onPress={() => navigation.goBack()}
    style={styles.back}>
    <Image
        style={{ height: 60, width: 60, }}
        source={require("../assets/back.png")}>
    </Image>
    </TouchableOpacity>
    )
}
export default BackComponent;
const styles = StyleSheet.create({
    back: {
        position: 'absolute',
        bottom: 0,
        left: 20,
    }
});