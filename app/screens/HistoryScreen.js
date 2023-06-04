import React, { useContext, useEffect, useState, } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AppointmentComponent from '../components/AppointmentComponent';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../../config';
import { Colors } from '../assets/Colors';
import { useIsFocused } from '@react-navigation/native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faBars } from '@fortawesome/free-solid-svg-icons';

const HistoryScreen = ({ navigation }) => {
    const isFocused = useIsFocused();

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
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}/${month}/${day}`;
        console.log(formattedDate);

        try {
            const response = await axios.get(
                `${BASE_URL}/customer/appointments/getAll?date_before=${formattedDate}`,
                config
            );
            const result = response.data.data;
            console.log(result);
            if (response.data.data) {
                console.log(response.data.data);
                const appointmentsArray = Object.values(response.data.data);
                setAppointments(appointmentsArray);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [isFocused]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const rateAppiontment = (appointmentId, businessId) => {
        navigation.navigate("CommentsScreen", {appointmentId, businessId });
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={handleGoBack}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color={Colors.dark} />
                </TouchableOpacity>
                <Text style={styles.nameText}>История</Text>
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
                            rateAppiontment={() => rateAppiontment(appointment.id, appointment.business.data.id)} />
                    ))
                ) : (
                    <Text style={styles.text}>Нямате история все още..</Text>
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
        marginHorizontal:25
    },
});

export default HistoryScreen;
