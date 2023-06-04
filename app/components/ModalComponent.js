import { Image, StyleSheet, Pressable, Modal, View, Text } from "react-native";
import React from 'react';
import { Colors } from '../assets/Colors';

//,title,btn,text,btnColor
function ModalComponent({navigation, nav, modalVisible, setModalVisible, title, text, btntext, btnColor, titleColor, btntextColor}) {
    const btnClick = () => {
        navigation.navigate(nav)
        setModalVisible(false);
    }
    return (<Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Image
                    style={[styles.icon, { margin: 0 }]}
                    source={require("../assets/icon.png")}>
                </Image>
                <Text style={[styles.title, { margin: 5,  color:titleColor ? titleColor : Colors.dark }]}>{title}</Text>
                {text ? <Text style={[styles.text, { margin: 5,  color:titleColor ? titleColor : Colors.dark }]}>{text}</Text> : ''}
                <Pressable
                    style={[styles.button, {backgroundColor:btnColor? btnColor : Colors.highlight}]}
                    onPress={btnClick}>
                    <Text style={[styles.btntext, {color:btntextColor? btntextColor : Colors.dark}]}>{btntext}</Text>
                </Pressable>
            </View>
        </View>
    </Modal>)
}
export default ModalComponent;
const styles = StyleSheet.create({
    icon: {
        width: 60,
        height: 60,
        marginTop: 30,
        marginStart: 5,
        alignSelf: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color:Colors.dark
    },
    text:{
        fontSize: 16,
        textAlign: 'center',
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: Colors.dark,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        textAlign: 'center'
    },
    btntext: {
        fontSize: 18,
        color: Colors.dark
    }
});