import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Colors } from '../../assets/Colors';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../../config';
import { useIsFocused } from '@react-navigation/native';
import AppointmentDetailsModal from '../../components/Components_for_Calendar/AppointmentDetailsModal';
import NewAppointmentView from '../../components/Components_for_Calendar/NewAppointmentView';

LocaleConfig.locales['bg'] = {
    monthNames: [
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
    ],
    monthNamesShort: ['ян.', 'февр.', 'апр.', 'авг.', 'септ.', 'окт.', 'ноем.', 'дек.'],
    dayNames: ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота', 'Неделя'],
    dayNamesShort: ['Пон', 'Втор', 'Сряда', 'Чет', 'Пет', 'Съб', 'Нед'],
    today: "Днес"
};

LocaleConfig.defaultLocale = 'bg';

function BusinessCalendar({ navigation }) {

    const openDrawer = () => {
        navigation.openDrawer();
    }

    const { userToken } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
        }
    };

    const [items, setItems] = useState({});
    const [allAppointments, setAllAppointments] = useState([]);

    const isFocused = useIsFocused();

    useEffect(() => {
        console.log(1);
        getAppointments();
    }, [isFocused]);

    useEffect(() => {
        console.log(2);
        if (!allAppointments || allAppointments == undefined) {
            console.log(3);
            getAppointments();
        } else {
            console.log('loading items');
            loadItems({ timestamp: new Date().getTime() });
        }
    }, [allAppointments]);


    const [isloading, setisloading] = useState(false);
    const getAppointments = async () => {
        console.log(1.5);
        if (isloading) {
            console.log('get appointment is already loading');
            return;
        }
        setisloading(true);
        try {
            console.log('im in try');
            const cacheBuster = new Date().getTime(); // Generate a unique value for each request
            const response = await axios.get(`${BASE_URL}/business/appointments/getAll?cacheBuster=${cacheBuster}`, config);
            // console.log(response.status, response)
            const result = response.data.data;
            console.log('result:', response.status);
            if (result && result != []) {
                console.log('creating appointments from result');
                const appointments = Object.values(result).map((appointment) => ({
                    id: appointment.id,
                    date: appointment.date,
                    fromCustomer: appointment.customer?.data ? true : false,
                    start_time: appointment.start_time,
                    end_time: appointment.end_time,
                    status: appointment.status,
                    duration: appointment.duration,
                    max_capacity: appointment.max_capacity,
                    count_ppl: appointment.count_ppl,
                    title: appointment.title,
                    description: appointment.description,
                    total_price: appointment.total_price,
                    customer: {
                        name: appointment.customer.data ? appointment.customer.data.name : appointment.customer.name,
                        phoneNumber: appointment.customer.phoneNumber,
                    },
                    services: appointment.services
                }));
                console.log(appointments);
                setAllAppointments(appointments);
            }
        } catch (error) {
            console.log('error');
            console.error(error);
        } finally {
            console.log('finally');
            setisloading(false);
        }
        console.log(1.6);
    };

    const loadItems = (day) => {
        let newItems = {};
        console.log(4);

        if (allAppointments !== undefined) {
            console.log(5);

            allAppointments.forEach((appointment) => {
                const {
                    id, date, fromCustomer,
                    start_time, end_time,
                    status, duration,
                    total_price, customer,
                    services, max_capacity,
                    count_ppl, title, description } = appointment;
                if (!newItems[date]) {
                    newItems[date] = [];
                }
                newItems[date].push({
                    id, date, fromCustomer,
                    start_time, end_time, status,
                    duration, total_price,
                    customer, services,
                    max_capacity, count_ppl,
                    title, description,
                });
            });
        }
        console.log(6);

        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                if (!newItems[strTime]) {
                    newItems[strTime] = [];
                }
            }
            setItems(newItems);
        }, 1000);
    };

    const renderItem = (item) => {
        return (
            <TouchableOpacity style={[
                styles.appointmentContainer,
                item.fromCustomer === true && styles.appointmentContainerCustomer,
                item.max_capacity && { backgroundColor: Colors.highlight },
                item.status !== 'Запазен' && { backgroundColor: '#ccc' }
            ]} onPress={() => appointmentClicked(item)}>
                <Text style={styles.time}>{item.start_time} - {item.end_time}</Text>
                {item.services ?
                    <Text style={styles.info}>Брой услуги: {item.services.count}, Общо време: {item.duration}</Text> :
                    <Text style={styles.info}>Капацитет: {item.max_capacity}, Бр. Записали се:{item.count_ppl}</Text>}
            </TouchableOpacity>
        );
    };

    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text style={styles.emptyDateText}>...</Text>
            </View>
        );
    };

    const rowHasChanged = (r1, r2) => {
        return r1.name !== r2.name;
    };

    const timeToString = (time) => {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    };

    const [selectedDay, setSelectedDay] = useState('');
    const handleDayPress = (day) => {
        setSelectedDay(day.dateString);
    };
    const handleDayChange = (day) => {
        setSelectedDay(day.dateString);
    };

    const [detailsModalVidible, setDetailsModalVisible] = useState(false);
    const [addingNewAppointment, setAddingNewAppointment] = useState(false);
    const [clickedItem, setClickedItem] = useState({});
    const appointmentClicked = (item) => {
        setClickedItem(item);
        setDetailsModalVisible(true);
    }

    const cancleClicked = () => {
        Alert.alert(
            'Отказ на записан час',
            'Сигурни ли сте, че искате да откажете този час? Този час е запазен от ваш клиент и отказът му може да предизвика недоволство.',
            [
                {
                    text: 'не отказвай',
                    style: 'cancel',
                },
                {
                    text: 'Да, откажи',
                    onPress: async () => {
                        try {
                            const response = await axios.patch(`${BASE_URL}/business/appointments/cancel/${clickedItem.id}`, '', config);
                        } catch (error) {
                            console.error(error);
                        } finally {
                            getAppointments();
                            setDetailsModalVisible(false);
                        }
                    },
                },
            ],
        );
    }

    const cancleGroupClicked = () => {
        Alert.alert(
            'Отменяне на групова среща',
            'Сигурни ли сте, че искате да отмените тази групова среща? Всички кленти, запазили място, ще получат имейл с информация за отменянето му.',
            [
                {
                    text: 'не отказвай',
                    style: 'cancel',
                },
                {
                    text: 'Да, откажи',
                    onPress: async () => {
                        try {
                            const response = await axios.patch(`${BASE_URL}/business/group_appointment/cancel/${clickedItem.id}`, '', config);
                        } catch (error) {
                            console.error(error);
                        } finally {
                            getAppointments();
                            setDetailsModalVisible(false);
                        }
                    },
                },
            ],
        );
    }

    const deleteClicked = () => {
        Alert.alert(
            'Изтриване на час',
            'Сигурни ли сте, че искате да изтриете този час?',
            [
                {
                    text: 'Отказ',
                    style: 'cancel',
                },
                {
                    text: 'Изтрий',
                    onPress: async () => {
                        try {
                            const response = await axios.delete(`${BASE_URL}/business/appointments/delete/${clickedItem.id}`, config);
                        } catch (error) {
                            console.error(error);
                        } finally {
                            getAppointments();
                            setDetailsModalVisible(false);
                        }
                    },
                },
            ],
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity
                    style={[styles.button]}
                    onPress={() => setAddingNewAppointment(!addingNewAppointment)}>
                    <Text style={[styles.btntext]}>
                        {!addingNewAppointment ? 'Добави нов час' : 'Отказ'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openDrawer}>
                    <FontAwesomeIcon icon={faBars} size={24} color={Colors.dark} />
                </TouchableOpacity>
            </View>
            <AppointmentDetailsModal
                modalVisible={detailsModalVidible}
                setModalVisible={setDetailsModalVisible}
                clickedItem={clickedItem}
                cancleClicked={cancleClicked}
                deleteClicked={deleteClicked}
                cancleGroupClicked={cancleGroupClicked}
            />
            {addingNewAppointment &&
                <View>
                    <NewAppointmentView
                        setAddingNewAppointment={setAddingNewAppointment}
                        selectedDay={selectedDay}
                        getAppointments={getAppointments}>
                    </NewAppointmentView>
                </View>}
            <View style={{ flex: 1, height: '93%', marginTop: 5 }}>
                <Agenda
                    items={items}
                    renderItem={renderItem}
                    renderEmptyDate={renderEmptyDate}
                    rowHasChanged={rowHasChanged}
                    onDayPress={handleDayPress}
                    onDayChange={handleDayChange}
                />
            </View>
        </View>
    );
}
export default BusinessCalendar;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: Colors.primary,
    },
    nameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.dark,
        marginHorizontal: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    appointmentContainer: {
        width: '90%',
        padding: 5,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.primary,
        backgroundColor: Colors.white,
    },
    appointmentContainerCustomer: {
        backgroundColor: Colors.primary,
    },
    time: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 1,
    },
    info: {
        fontSize: 14,
        color: Colors.darkGray,
    },
    emptyDate: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    emptyDateText: {
        fontSize: 16,
        color: 'gray',
    },
    button: {
        width: '75%',
        height: 30,
        backgroundColor: Colors.highlight,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    btntext: {
        fontSize: 16,
        color: Colors.dark
    },
});