import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from 'react';
import { Colors } from '../../assets/Colors';
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { TextInputMask } from 'react-native-masked-text';
import BusinessCategoriesComponent from "../BusinessCategoriesComponent";
import { Picker } from "@react-native-picker/picker";
import { isValidDate, isValidHour } from "../Validations";

function NewAppointmentView({ setAddingNewAppointment, selectedDay, getAppointments }) {

    const [date, setDate] = useState('');
    const [hour, setHour] = useState('');
    const [error, setError] = useState('');

    const { userToken } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
        }
    };
    const [business, setBusiness] = useState([]);
    const getBusiness = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/business/profile/`, config);
            setBusiness(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getBusiness();
    }, []);

    useEffect(() => {
        setDate(selectedDay);
    }, [selectedDay])

    const [clickedServices, setClickedServices] = useState([]);
    const [duration, setDuration] = useState();
    const [services, setServices] = useState([]);
    const [is_group, setIsGroup] = useState(false);

    const handleClickedServices = (selectedServicesIds, duration, selectedServices) => {
        setError('');
        setClickedServices(selectedServicesIds);
        setDuration(duration);
        setServices(selectedServices);
        if (selectedServices.length > 0 && selectedServices[0].max_capacity) {
            setIsGroup(true);
            setDate(selectedServices[0].date)
            setHour(selectedServices[0].start_time)
        } else {
            setIsGroup(false);
        }
    };

    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [count, setCount] = useState('1');

    const saveAppointment = async () => {
        console.log(clickedServices);
        if (!isValidDate(date) || !isValidHour(hour)) {
            setError('Невалидни данни.')
            return;
        } else setError('');
        var form = {
            date: selectedDay,
            start_time: hour,
            services: clickedServices.join(', '),
            name: name ? name : '',
            phoneNumber: phoneNumber ? phoneNumber.substring(1) : ''
        }
        try {
            const response = await axios.post(`${BASE_URL}/business/appointments/create/`, form, config);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            getAppointments();
            setAddingNewAppointment(false);
        }
    }

    const add_clients = async () => {
        if (+parseInt(services[0].count_ppl, 10) + parseInt(count) > parseInt(services[0].max_capacity) || parseInt(count) <= 0) {
            setError('Надвишавате максималтия капацитет.')
            return;
        } else setError('');
        try {
            await axios.patch(`${BASE_URL}/business/group_appointment/add_clients/${services[0].id}`, { count }, config);
        } catch (error) {
            console.error(error);
        } finally {
            getAppointments();
            setAddingNewAppointment(false);
        }
    }

    return (
        <ScrollView style={{ flex: 0 }}>
            <View style={[styles.topContainer, { flex: 0 }]}>
                <Text style={styles.nameText}>{is_group ? 'Групов час' : 'Записване на час'}</Text>
                {is_group && <Text style={styles.nameText}>Добавяне/премахване на избран брой хора</Text>}
            </View>
            <View style={styles.container}>
                <Text style={[styles.text, { color: Colors.error, textAlign: 'center' }]}>{error}</Text>
                <View style={styles.row}>
                    <Text style={styles.text}>Дата: </Text>
                    {is_group ? <Text>{date}</Text> :
                        <TextInputMask
                            type={'datetime'}
                            options={{ format: 'YYYY-MM-DD' }}
                            placeholder={'yyyy-mm-dd'}
                            value={date}
                            onChangeText={setDate}
                            style={styles.editInput}
                        />}
                    <Text style={styles.text}>, Час: </Text>
                    {is_group ? <Text>{hour}</Text> :
                        <TextInputMask
                            type={'datetime'}
                            options={{ format: 'HH:mm' }}
                            placeholder={'00:00'}
                            value={hour}
                            onChangeText={setHour}
                            style={styles.editInput}
                        />}
                </View>
                {is_group ?
                    <View>
                        <Text>Капацитет: {services[0].max_capacity}, Записани хора: {services[0].count_ppl}</Text>
                        <View style={styles.row}>
                            <TextInput
                                value={count}
                                keyboardType="numeric"
                                onChangeText={setCount}
                                style={styles.editInput}
                            />
                            <TouchableOpacity
                                style={[styles.button, { width: '25%' }]}
                                onPress={add_clients}>
                                <Text style={[styles.btntext]}>Добави</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { width: '25%', backgroundColor: Colors.error }]}
                                onPress={saveAppointment}>
                                <Text style={[styles.btntext]}> Премахи</Text>
                            </TouchableOpacity>
                        </View>
                    </View> :
                    <View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Име на клиент:</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                style={styles.editInput}
                            />
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Телефонен номер на клиент:</Text>
                            <TextInputMask
                                type="custom"
                                options={{
                                    mask: "0999999999"
                                }}
                                placeholder={'0999999999'}
                                value={phoneNumber}
                                onChangeText={(formatted, extracted) => {
                                    setPhoneNumber(formatted);
                                    console.log(formatted)
                                    console.log(extracted)
                                }}
                                style={styles.editInput}
                            />
                        </View>
                        <Text style={styles.text}>{clickedServices.length == 1 ? 'Избрана е 1 услуга' : `Избрани са ${clickedServices.length} услуги`}, Времетраене: {duration}</Text>
                        {!is_group && <TouchableOpacity
                            disabled={clickedServices == []}
                            style={[styles.button]}
                            onPress={saveAppointment}>
                            <Text style={[styles.btntext]}> Запази час</Text>
                        </TouchableOpacity>}
                    </View>}
                {

                    business.services_category && business.services_category.map(category =>
                        <BusinessCategoriesComponent key={category.id}
                            title={category.title}
                            services={category.services}
                            handleClickedServices={handleClickedServices}
                        />
                    )
                }
            </View>
        </ScrollView>
    )
}
export default NewAppointmentView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 5,
        backgroundColor: Colors.primary,
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark,
        textAlign: 'center'
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    editInput: {
        flex: 1,
        height: 30,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 4,
        padding: 5,
        fontSize: 14,
        margin: 1.5
    },
    button: {
        width: '100%',
        height: 30,
        backgroundColor: Colors.dark,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    btntext: {
        fontSize: 16,
        color: Colors.white
    },
});