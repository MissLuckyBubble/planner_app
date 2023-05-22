import React, { useContext, useEffect, useState, } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AppointmentComponent from '../components/AppointmentComponent';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../../config';
import { Colors } from '../assets/Colors';
import { useIsFocused } from '@react-navigation/native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const MyAppointmentsScreen = ({ navigation }) => {
    const isFocused = useIsFocused();
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
        const status = 'Запазен';
        const formattedDate = `${year}/${month}/${day}`;
        try {
            const response = await axios.get(
                `${BASE_URL}/customer/appointments/getAll?date_after=${formattedDate}&status=${status}`,
                config
            );
            const result = response.data.data;
            if (result) {
                setAppointments(result);
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [isFocused]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleCancel = (id)=>{
        const url = `${BASE_URL}/customer/appointments/cancel/${id}`;
        axios.patch(url,'',config).then((response)=>{
            console.log(response.data);
            fetchAppointments();
        }).catch((error)=>{
            console.error(error)
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={handleGoBack}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color={Colors.dark} />
                </TouchableOpacity>
                <Text style={styles.nameText}>Предстоящи часове</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                {appointments && appointments.length > 0 ? (
                    appointments.map((appointment) => (
                        <AppointmentComponent 
                        key={appointment.id} 
                        appointment={appointment} 
                        cancelAppointment={()=>handleCancel(appointment.id)}/>
                    ))
                ) : (
                    <Text style={styles.text}>Нямате предстоящи часове..</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 10,
        backgroundColor: Colors.primary,
    },
    nameText: {
        fontSize: 26,
        marginLeft: '20%',
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
    },
});

export default MyAppointmentsScreen;
