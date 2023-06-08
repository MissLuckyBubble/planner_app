import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Modal, TextInput, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../assets/Colors';
import CheckBox from '@react-native-community/checkbox';
import { TextInputMask } from 'react-native-masked-text';
import { isNotEmpty, isPositiveDecimalNumber, isPositiveInt, isValidDate, isValidHour } from './Validations';
import { commonStyles } from '../assets/Styles';

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

    const [titleError, setTitleError] = useState('');
    const [durationError, setDurationError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [maxCapacityError, setMaxCapacityError] = useState('');
    const [dateHourError, setDateHourError] = useState('');

    const [errors, setErrors] = useState(false);

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
        let hasErrors = false;

        if (is_group) {
            if (!isPositiveInt(maxCapacity)) {
                setMaxCapacityError('*');
                hasErrors = true;
            } else setMaxCapacity('');
            if (!isValidDate(date) || !isValidHour(hour) || (!isValidDate(date) && !isValidHour(hour))) {
                setDateHourError('Невалидни дата и/или час')
                hasErrors = true;
            } else setDateHourError('');
        }
        if (!isNotEmpty(title)) {
            setTitleError('Заглавието е задължително поле');
            hasErrors = true;
        } else setTitleError('');
        if (!isNotEmpty(description)) {
            setDescriptionError('Описането е задължително поле');
            hasErrors = true;
        } else setDescriptionError('');
        if (!isPositiveInt(duration)) {
            setDurationError('Невалидно времетраене');
            hasErrors = true;
        } else setDurationError('');
        if (!isPositiveDecimalNumber(price)) {
            setPriceError('Невалидна сума');
            hasErrors = true;
        } else setPrice('');

        if (hasErrors) {
            setErrors(true);
            return;
        }
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

        setTitleError('');
        setDurationError('');
        setDescriptionError('');
        setPriceError('');
        setMaxCapacityError('');
        setDateHourError('');

        setErrors(false);

    };

    return (
        <Modal visible={visible} animationType="slide">
            <ImageBackground style={styles.container} source={require("../assets/bg-simple.jpg")}>
                <Text style={styles.title}>{initialData ? 'Редактиране на услуга' : 'Добавяне на услуга'}</Text>
                {errors && <Text style={commonStyles.errorText}>Моля въведте валидни данни.</Text>}
                {!initialData && <View style={styles.row}>
                    <Text style={styles.text}>Групов час:</Text>
                    <CheckBox
                        value={is_group}
                        onValueChange={(newValue) => setIsGroup(newValue)}
                        style={{ marginBottom: 10 }}
                    />
                    {is_group &&
                        <View style={styles.row}>
                            <Text
                                style={[styles.text,
                                maxCapacityError && commonStyles.errorText]}>
                                {maxCapacityError && maxCapacityError} Брой Хора
                            </Text>
                            <TextInput
                                style={[styles.input, maxCapacityError && styles.errorInput]}
                                value={maxCapacity}
                                min={0}
                                onChangeText={setMaxCapacity}
                                placeholder="2"
                                keyboardType="numeric"
                            />
                        </View>}
                </View>}
                <TextInput
                    style={[styles.input, titleError && styles.errorInput]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Заглавие.."
                />
                <TextInput
                    style={[styles.input, durationError && styles.errorInput]}
                    value={duration}
                    onChangeText={setDurationMinutes}
                    placeholder="Времетраене"
                    keyboardType="numeric"
                />
                <TextInput
                    style={[styles.input, { height: 75 }, descriptionError && styles.errorInput]}
                    maxLength={500}
                    multiline
                    numberOfLines={2}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Описание"
                />
                <TextInput
                    style={[styles.input, priceError && styles.errorInput]}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="Цена"
                    keyboardType="numeric"
                />
                {is_group &&
                    <View>
                        <Text style={commonStyles.errorText}>{dateHourError}</Text>
                        <View style={styles.row}>
                            <Text style={styles.text}>Дата</Text>
                            <TextInputMask
                                type={'datetime'}
                                options={{ format: 'YYYY-MM-DD' }}
                                placeholder={'yyyy-mm-dd'}
                                value={date}
                                onChangeText={setDate}
                                style={[styles.input, dateHourError && styles.errorInput]}
                            />
                            <Text style={styles.text}>Час</Text>
                            <TextInputMask
                                type={'datetime'}
                                options={{ format: 'HH:mm' }}
                                placeholder={'00:00'}
                                value={hour}
                                onChangeText={setHour}
                                style={[styles.input, dateHourError && styles.errorInput]}
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
    },
    errorInput: {
        borderColor: Colors.error
    }
});



export default ModalServiceFormComponent;
