import { ScrollView, StyleSheet, TouchableOpacity, Modal, View, Text, ImageBackground } from "react-native";
import React from 'react';
import { Colors } from '../../assets/Colors';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AppointmentComponent from "../AppointmentComponent";

function AppointmentDetailsModal({ modalVisible, setModalVisible, clickedItem, cancleClicked, deleteClicked, cancleGroupClicked }) {

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
        >
            <ImageBackground style={styles.container} source={require("../../assets/bg-simple.jpg")}>
                <View style={[styles.topContainer, { flex: 0 }]}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <FontAwesomeIcon icon={faArrowLeft} size={24} color={Colors.dark} />
                    </TouchableOpacity>
                    {clickedItem.fromCustomer ?
                        <Text style={[styles.nameText, { fontSize: 16, marginRight: 50 }]}>Този час е запазен от ваш клиент</Text> :
                        <Text style={[styles.nameText, { fontSize: 16, marginRight: 60 }]}>Този час сте го записали вие</Text>}
                </View>
                <View style={styles.modalContainer}>
                    <ScrollView >
                        {clickedItem.customer !== undefined &&
                            <AppointmentComponent appointment={clickedItem}
                            />}
                    </ScrollView>
                    {clickedItem.status == 'Запазен' &&
                        <View>{clickedItem.fromCustomer ?
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: Colors.error }]}
                                onPress={cancleClicked}>
                                <Text style={[styles.btntext, { color: Colors.white }]}>Откажи</Text>
                            </TouchableOpacity>
                            : <View>
                                {clickedItem.max_capacity ?
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: Colors.error }]}
                                    onPress={cancleGroupClicked}>
                                    <Text style={[styles.btntext, { color: Colors.white }]}>Отмени груповата среща</Text>
                                </TouchableOpacity> :
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: Colors.error }]}
                                    onPress={deleteClicked}>
                                    <Text style={[styles.btntext, { color: Colors.white }]}>Изтрий</Text>
                                </TouchableOpacity>}
                            </View>
                        }</View>}
                </View>
            </ImageBackground>
        </Modal>
    )
}
export default AppointmentDetailsModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 5,
        backgroundColor: Colors.primary,
    },
    nameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.dark,
        marginHorizontal: 0,
    },
    modalContainer: {
        flex: 1,
        padding: 10
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: Colors.dark,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    btntext: {
        fontSize: 18,
        color: Colors.white
    },
});