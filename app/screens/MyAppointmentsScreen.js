import React, { useContext, useEffect, useState, } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import AppointmentComponent from '../components/AppointmentComponent';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../../config';
import { Colors } from '../assets/Colors';
import { useIsFocused } from '@react-navigation/native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faBars } from '@fortawesome/free-solid-svg-icons';

const MyAppointmentsScreen = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);

    const openDrawer = () => {
        navigation.openDrawer();
    }

    const [appointments, setAppointments] = useState([]);

    const { userToken } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
        }
    };

    const fetchAppointments = async () => {

        if (loading) {
            console.log('fetchAppointments - stoped');
            return; // Prevent multiple simultaneous calls
        }

        setLoading(true); // Start loading

        console.log('fetchAppointments');
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const status = 'Запазен';
        const formattedDate = `${year}/${month}/${day}`;
        const cacheBuster = new Date().getTime(); // Generate a unique value for each request
        console.log('formattedDate:', formattedDate);
        try {
            const response = await axios.get(
                `${BASE_URL}/customer/appointments/getAll?date_after=${formattedDate}&status=${status}&cacheBuster=${cacheBuster}`,
                config
            );
            console.log(response);
            console.log('Response status:', response.status);
            if (response.data.data) {
                console.log(response.data.data);
                setAppointments(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [isFocused]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleCancel = async (id) => {
        Alert.alert(
            'Отказване на час',
            'Сигурни ли сте, че искате да откажете този час, това ще причини загуби за бизнеса?',
            [
                {
                    text: 'не отказвай',
                    style: 'cancel',
                },
                {
                    text: 'Да, откажи',
                    onPress: async () => {
                        const url = `${BASE_URL}/customer/appointments/cancel/${id}`;
                        axios.patch(url, '', config).then((response) => {
                            ToastAndroid.show(`Успешно отказан час`, ToastAndroid.SHORT);
                            fetchAppointments();
                        }).catch((error) => {
                            console.error(error)
                        });
                    },
                },
            ],
        );
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={handleGoBack}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color={Colors.dark} />
                </TouchableOpacity>
                <Text style={styles.nameText}>Предстоящи часове</Text>
                <TouchableOpacity onPress={openDrawer}>
                    <FontAwesomeIcon icon={faBars} size={24} color={Colors.dark} />
                </TouchableOpacity>
            </View>
            <View style={styles.scrollView}>
                {appointments && appointments.length > 0 ? (
                    appointments.map((appointment) => (
                        <AppointmentComponent
                            key={appointment.id}
                            appointment={appointment}
                            cancelAppointment={() => handleCancel(appointment.id)} />
                    ))
                ) : (
                    <Text style={styles.text}>Нямате предстоящи часове..</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 10,
        backgroundColor: Colors.primary,
    },
    nameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.dark,
        marginHorizontal: 16,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark,
    },
    scrollView: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 25
    },
});

export default MyAppointmentsScreen;
