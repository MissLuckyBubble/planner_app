import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableHighlight, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AuthContext } from '../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import CalendarPicker from 'react-native-calendar-picker';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { Colors } from '../assets/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import ServicesComponent from '../components/ServicesComponent';
import ModalComponent from '../components/ModalComponent';

function MakeAppointmentScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = useState(false);
    const businessName = route.params.businessName;
    const businessId = route.params.businessId;
    const uniqueId = route.params.uniqueId;
    const [duration, setDuration] = useState(route.params.duration);
    const [services, setServices] = useState(route.params.services);
    const [servicesIds, setServicesIds] = useState(route.params.servicesIds);
    useEffect(() => {
        setDuration(route.params.duration);
        setServices(route.params.services);
        setServicesIds(route.params.servicesIds);
    }, [uniqueId])
    const [modalVisible, setModalVisible] = useState(false);

    const { userToken } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleLike = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/customer/favorites/${businessId}`, '', config);
            const result = response.data;
            if (result == 1) {
                ToastAndroid.show(`Успешно премахнахте ${businessName} от любимите си места`, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(`Успешно добавихте ${businessName} в любимите си места`, ToastAndroid.SHORT);
            }
        } catch (error) {
        } finally {
        }
    }
    const [offDays, setOffDays] = useState([]);
    const [firstWorkDate, setFWD] = useState();
    const [lastWorkDate, setLWD] = useState();

    useEffect(() => {
        const getScheduele = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/getTwoWeekSchedule/${businessId}`, config);
                const result = response.data;

                const updatedOffDays = [];
                const updatedWorkDays = [];

                result.forEach((day) => {
                    if (day.is_off) {
                        updatedOffDays.push(day.date);
                    } else {
                        updatedWorkDays.push(day);
                    }
                });
                setOffDays(updatedOffDays);
                setFWD(updatedWorkDays[0].date);
                setLWD(updatedWorkDays[updatedWorkDays.length - 1].date);

            } catch (error) {
                console.log(error);
            } finally {
            }
        };
        getScheduele();
    }, [businessId]);

    useEffect(()=>{
        handleTimeSlotClick(selectedTimeSlot);
    },[duration])

    const [selectedDate, setselectedDate] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const onDateChange = async (date, Type) => {
        const formattedDate = new Date(date).toLocaleDateString();
        setselectedDate(formattedDate);
        try {
            const response = await axios.get(`${BASE_URL}/getBusinessHoursForDay/${businessId}?date=${formattedDate}`, config);
            const result = response.data;
            setTimeSlots(result)
        } catch (error) {
            console.log(error);
        }

    };
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedTimeSlotsRange, setSelectedTimeSlotsRange] = useState([]);

    const handleTimeSlotClick = (timeSlot) => {
        const index = timeSlots.indexOf(timeSlot);
        const nextTimeSlots = timeSlots.slice(index, index + duration / 10);
        setSelectedTimeSlot(timeSlot);
        setSelectedTimeSlotsRange(nextTimeSlots);
    };

    const isTimeSlotAvailable = (timeSlot) => {
        const endTimeSlot = moment(timeSlot, "HH:mm").add(duration - 10, 'minutes').format("HH:mm");
        return timeSlots.includes(endTimeSlot);
    };

    const handleServiceRemoved = (service) => {
        setDuration(duration - service.duration_minutes)
        setServicesIds(servicesIds.filter((id) => id !== service.id))
        setServices(services.filter((s) => s !== service));
    };

    const [erros, setError] = useState('');
    const onMakeAppointment = async () => {
        setIsLoading(true);
        try {
            const dateParts = selectedDate.split('/');
            const formattedDate
                = `${dateParts[2]}/${dateParts[0].padStart(2, '0')}/${dateParts[1].padStart(2, '0')}`;
            const response = await axios.post(
                `${BASE_URL}/customer/appointments/create/${businessId}`,
                {
                    date: formattedDate,
                    start_time: selectedTimeSlot,
                    services: servicesIds.join(', ')
                },
                config);
            setModalVisible(true);
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                setError(error.response.data.message);
            } else {
                console.log(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <ScrollView style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={handleGoBack}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color={Colors.dark} />
                </TouchableOpacity>
                <Text style={styles.nameText}>{businessName}</Text>
                <TouchableOpacity onPress={handleLike}>
                    <FontAwesomeIcon icon={faHeart} size={24} color={Colors.error} />
                </TouchableOpacity>
            </View>

            <View>
                <CalendarPicker
                    startFromMonday={true}
                    allowRangeSelection={false}
                    minDate={new Date(firstWorkDate)}
                    maxDate={new Date(lastWorkDate)}
                    disabledDates={offDays}
                    weekdays={
                        [
                            'Пон',
                            'Втор',
                            'Срядя',
                            'Чет',
                            'Пет',
                            'Съб',
                            'Нед'
                        ]}
                    months={[
                        'Януари',
                        'Февруари',
                        'Март',
                        'Април',
                        'Май',
                        'Юни',
                        'Юли',
                        'Август',
                        'Септеври',
                        'Октомври',
                        'Ноември',
                        'Декември',
                    ]}
                    previousTitle="Назад"
                    nextTitle="Напред"
                    todayBackgroundColor={Colors.primary}
                    selectedDayColor={Colors.dark}
                    selectedDayTextColor={Colors.primary}
                    scaleFactor={375}
                    onDateChange={onDateChange}
                />
                <View style={styles.TimeSlotContainer}>
                    <Text style={styles.TimeSlotTitle}>{selectedDate == null ? 'Моля изберете дата от календара' : `Изберете час за избрана дата(${selectedDate})`}</Text>
                    {timeSlots.map((timeSlot, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.timeSlotButton,
                                selectedTimeSlot === timeSlot && styles.selectedTimeSlotButton,
                                !isTimeSlotAvailable(timeSlot) && styles.disabledTimeSlotButton,
                                selectedTimeSlotsRange.includes(timeSlot) && styles.selectedTimeSlotsRangeButton,
                            ]}
                            onPress={() => handleTimeSlotClick(timeSlot)}
                            disabled={!isTimeSlotAvailable(timeSlot)}
                        >
                            <Text style={styles.timeSlotText}>{timeSlot}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Информация за избраните от вас детайли</Text>
                    {erros ?
                        <Text style={[styles.infoText, { color: Colors.error, textAlign: 'center' }]}>
                            {erros}
                        </Text>
                        : ''}
                    <Text style={styles.infoText}>Фирма: {businessName}</Text>
                    <Text style={styles.infoText}>Дата: {selectedDate}</Text>
                    <Text style={styles.infoText}>Начален Час: {selectedTimeSlot}</Text>
                    <Text style={styles.infoText}>Избрани услуги:</Text>
                    <ServicesComponent
                        clickedServices={() => { }}
                        onServiceRemoved={handleServiceRemoved}
                        disabled={true}
                        style={{ padding: 10 }}
                        services={services} />
                    <TouchableHighlight
                        disabled={selectedTimeSlot == null || duration <= 0 || services.length <= 0 || isLoading}
                        onPress={onMakeAppointment}
                        style={[styles.button, isLoading && styles.buttonLoading]}>
                        {isLoading ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <Text style={styles.buttonText}>{'Запази си час'}</Text>
                        )}
                    </TouchableHighlight>
                </View>
            </View>
            <ModalComponent
                navigation={navigation}
                nav='Home'
                modalVisible={modalVisible}
                title={'Запазихте си час успешно!'}
                text={'Ще получите имейл с потвърждение. Детайли можете да видите и в менюто моите запазени часове.'}
                btntext={'Продължи'}>
            </ModalComponent>
        </ScrollView>
    );
}

export default MakeAppointmentScreen;
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
        backgroundColor: Colors.primary,
    },
    nameText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.dark,
        marginHorizontal: 16,
    },
    rating: {
        padding: 10,
        flexDirection: 'row'
    },
    ratingText: {
        fontSize: 16,
        color: Colors.primary,
        padding: 5,
        textDecorationLine: 'underline'
    },
    TimeSlotTitle: {
        width: '100%',
        textAlignVertical: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    TimeSlotContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    timeSlotButton: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        margin: 5,
    },
    timeSlotText: {
        fontSize: 16,
        color: '#fff',
    },
    selectedTimeSlotButton: {
        backgroundColor: Colors.dark,
    },
    selectedTimeSlotsRangeButton: {
        backgroundColor: Colors.dark,
    },
    disabledTimeSlotButton: {
        backgroundColor: 'gray',
    },
    infoContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.dark
    },
    infoText: {
        fontSize: 16,
        marginBottom: 5,
    },
    button: {
        backgroundColor: Colors.dark,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});