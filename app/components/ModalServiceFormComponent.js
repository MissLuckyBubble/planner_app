import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Modal, TextInput, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../assets/Colors';
import CheckBox from '@react-native-community/checkbox';
import { TextInputMask } from 'react-native-masked-text';

const ModalServiceFormComponent = ({ visible, onCancel, onSave, initialData }) => {
    const [title, setTitle] = useState('');
    const [duration, setDurationMinutes] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [is_group, setIsGroup] = useState(false);
    const [date, setDate] = useState('');
    const [hour, setHour] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');
    const [id, setId] = useState('');
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDurationMinutes(initialData.duration);
            setDescription(initialData.description);
            setPrice(initialData.price);
            setId(initialData.id);
        }
    }, [initialData]);

    const handleCancel = () => {
        clearForm();
        onCancel();
    };

    const handleSave = () => {
        onSave({
            title,
            duration,
            description,
            price,
            maxCapacity,
            date,
            hour,
            id
        });
        clearForm();
    };


    const clearForm = () => {
        setTitle('');
        setDurationMinutes('');
        setDescription('');
        setPrice('');
        setIsGroup(false);
        setMaxCapacity('');
        setDate('');
        setHour('');
    };

    return (
        <Modal visible={visible} animationType="slide">
            <ImageBackground style={styles.container} source={require("../assets/bg-simple.jpg")}>
                <Text style={styles.title}>Добавяне на услуга</Text>
                {!initialData && <View style={styles.row}>
                    <Text style={styles.text}>Групов час:</Text>
                    <CheckBox
                        value={is_group}
                        onValueChange={(newValue) => setIsGroup(newValue)}
                        style={{ marginBottom: 10 }}
                    />
                    {is_group &&
                        <View style={styles.row}>
                            <Text style={styles.text}> Брой Хора</Text>
                            <TextInput
                                style={styles.input}
                                value={maxCapacity}
                                min={0}
                                onChangeText={setMaxCapacity}
                                placeholder="2"
                                keyboardType="numeric"
                            />
                        </View>}
                </View>}
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Заглавие.."
                />
                <TextInput
                    style={styles.input}
                    value={duration}
                    onChangeText={setDurationMinutes}
                    placeholder="Времетраене"
                    keyboardType="numeric"
                />
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    maxLength={500}
                    multiline
                    numberOfLines={2}
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
                {is_group &&
                    <View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Дата</Text>
                            <TextInputMask
                                type={'datetime'}
                                options={{ format: 'YYYY-MM-DD' }}
                                placeholder={'yyyy-mm-dd'}
                                value={date}
                                onChangeText={setDate}
                                style={styles.input}
                            />
                            <Text style={styles.text}>Час</Text>
                            <TextInputMask
                                type={'datetime'}
                                options={{ format: 'HH:mm' }}
                                placeholder={'00:00'}
                                value={hour}
                                onChangeText={setHour}
                                style={styles.input}
                            />
                        </View>
                    </View>}

                <TouchableOpacity style={[styles.button, { backgroundColor: Colors.dark }]} onPress={handleSave}>
                    <Text style={[styles.buttonText, { color: Colors.white }]}>Запази</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleCancel}>
                    <Text style={styles.buttonText}>Отказ</Text>
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    text: {
        marginHorizontal: 10,
        marginLeft: 20,
        marginBottom: 10
    }
});



export default ModalServiceFormComponent;
