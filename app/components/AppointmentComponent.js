import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Colors } from '../assets/Colors';
import ServicesComponent from './ServicesComponent';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot, faCheck, faPhone, faMoneyBill1Wave, faClock, faCalendarCheck, faUser, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

const AppointmentComponent = ({ appointment, cancelAppointment }) => {
    const { user } = useContext(AuthContext);
    const handlePhoneCall = () => {
        const phoneNumber = 0 + appointment.business.phoneNumber;
        const phoneUrl = `tel:${phoneNumber}`;
        Linking.canOpenURL(phoneUrl)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(phoneUrl);
                }
                throw new Error(`Phone number ${phoneNumber} cannot be opened.`);
            })
            .catch((error) => console.log(error));
    };
    const handleAddressPress = () => {
        const address = appointment.business.address;
        const addressUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        Linking.canOpenURL(addressUrl)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(addressUrl);
                }
                throw new Error(`Address ${address} cannot be opened in Google Maps.`);
            })
            .catch((error) => console.log(error));
    };
    const [showServices, setShowServices] = useState(false);

    const handleToggleServices = () => {
        setShowServices(!showServices);
    };

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <FontAwesomeIcon icon={faCalendarCheck} style={styles.icon} size={16} color={Colors.highlight} />
                <Text style={styles.text}>Дата: {appointment.date}</Text>
            </View>
            <View style={styles.rowContainer}>
                <FontAwesomeIcon icon={faClock} style={styles.icon} size={16} color={Colors.primary} />
                <Text style={styles.text}>Час: {appointment.start_time}</Text>
            </View>
            <View style={styles.rowContainer}>
                <FontAwesomeIcon icon={faCheck} style={styles.icon} size={16} color={Colors.light} />
                <Text style={styles.text}>Статус: {appointment.status}</Text>
            </View>
            <View style={styles.rowContainer}>
                <FontAwesomeIcon icon={faClock} style={styles.icon} size={16} color={Colors.dark} />
                <Text style={styles.text}>Продължителност: {appointment.duration} минути</Text>
            </View>
            <View style={styles.rowContainer}>
                <FontAwesomeIcon icon={faMoneyBill1Wave} style={styles.icon} size={16} color={Colors.light} />
                <Text style={styles.text}>Цена: {appointment.total_price}</Text>
            </View>
            <TouchableOpacity style={styles.servicesTitle} onPress={handleToggleServices}>
                <Text style={styles.text}>Услуги</Text>
                {showServices ?
                    <FontAwesomeIcon icon={faAngleUp} size={15} color={Colors.dark} /> :
                    <FontAwesomeIcon icon={faAngleDown} size={15} color={Colors.dark} />
                }
            </TouchableOpacity>
            {showServices && (
                <ServicesComponent
                    disabled={true}
                    services={appointment.services.data}
                    clickedServices={() => { }}
                />
            )}
            <View style={styles.infoContainer}>
                {user.role_id === 1 ? (
                    <View>
                        <Text style={[styles.text, styles.titleText]}>
                            Информация за мястото:
                        </Text>
                        <Text style={styles.text}>
                            <FontAwesomeIcon icon={faUser} style={styles.icon} size={16} />
                            Име: {appointment.business.data.name}
                        </Text>
                        <TouchableOpacity onPress={handleAddressPress}>
                            <Text style={[styles.text, styles.linkText]}>
                                <FontAwesomeIcon icon={faLocationDot} style={styles.icon} size={16} />
                                Адрес: {appointment.business.address}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePhoneCall}>
                            <Text style={[styles.text, styles.linkText]}>
                                <FontAwesomeIcon icon={faPhone} style={styles.icon} size={16} />
                                Тел: 0{appointment.business.phoneNumber}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <Text style={[styles.text, styles.titleText]}>
                            Информация за клиента:
                        </Text>
                        <Text style={styles.text}>
                            <FontAwesomeIcon icon={faUser} style={styles.icon} size={16} />
                            Име: {appointment.customer.data.name}
                        </Text>
                        <Text style={styles.text}>
                            <FontAwesomeIcon icon={faPhone} style={styles.icon} size={16} />
                            Тел: 0{appointment.customer.phoneNumber}
                        </Text>
                    </View>
                )}
            </View>
            <TouchableOpacity style={styles.cancel} onPress={cancelAppointment}>
                <Text style={styles.cancel_text} >Откажи</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 10,
        paddingTop: 16,
        backgroundColor: "#FFFF",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    icon: {
        marginRight: 8,
    },
    servicesTitle: {
        borderRadius: 5,
        padding: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.primary
    },
    text: {
        fontSize: 16,
        color: "black",
    },
    infoContainer: {
        marginVertical: 10,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        padding: 8,
    },
    titleText: {
        fontWeight: "bold",
    },
    linkText: {
        textDecorationLine: "underline",
    },
    cancel: {
        borderRadius: 5,
        padding: 5,
        marginBottom: 10,
        alignItems: 'center',
        backgroundColor: Colors.dark
    },
    cancel_text: {
        color:Colors.white,
        fontSize:16,
    }
});
export default AppointmentComponent;
