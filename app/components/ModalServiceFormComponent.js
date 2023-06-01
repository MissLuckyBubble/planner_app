import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Modal, TextInput, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../assets/Colors';

const ModalServiceFormComponent = ({ visible, onCancel, onSave, initialData }) => {
    const [title, setTitle] = useState('');
    const [duration_minutes, setDurationMinutes] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDurationMinutes(initialData.duration_minutes);
            setDescription(initialData.description);
            setPrice(initialData.price);
        }
    }, [initialData]);

    const handleCancel = () => {
        clearForm();
        onCancel();
    };

    const handleSave = () => {
        onSave({
            title,
            duration_minutes,
            description,
            price,
        });
        clearForm();
    };


    const clearForm = () => {
        setTitle('');
        setDurationMinutes('');
        setDescription('');
        setPrice('');
    };

    return (
        <Modal visible={visible} animationType="slide">
            <ImageBackground  style={styles.container} source={require("../assets/bg-simple.jpg")}>
                <Text style={styles.title}>Добавяне на услуга</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Заглавие.."
                />
                <TextInput
                    style={styles.input}
                    value={duration_minutes}
                    onChangeText={setDurationMinutes}
                    placeholder="Времетраене"
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Описание"
                />
                <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="Цена"
                    keyboardType="numeric"
                />

                <TouchableOpacity style={styles.button} onPress={handleCancel}>
                    <Text style={styles.buttonText}>Отказ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: Colors.dark }]} onPress={handleSave}>
                    <Text style={[styles.buttonText, { color: Colors.white }]}>Запази</Text>
                </TouchableOpacity>
            </ImageBackground>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.dark,
        backgroundColor: Colors.primary,
        padding: 10,
        textAlign: 'center',
        borderRadius: 5
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 10
    },
    button: {
        width: '95%',
        height: 40,
        backgroundColor: Colors.highlight,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    buttonText: {
        fontSize: 18,
        color: Colors.dark
    },
});



export default ModalServiceFormComponent;
