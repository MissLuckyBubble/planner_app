import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../assets/Colors';
import { AuthContext } from '../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../../config';
import axios from 'axios';

const MAX_DESCRIPTION_LENGTH = 80;

const ServicesComponent = ({ services, clickedServices, style, disabled, onServiceRemoved , onServiceDelete}) => {
    const [servicesList, setServices] = useState(services);
    
    const { user } = useContext(AuthContext);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedServicesIds, setSelectedServicesIds] = useState([]);
    const [serviceDuration, setServiceDuration] = useState(0);

    const handleServiceClick = (serviceId, duration, service) => {
        if (selectedServicesIds.includes(serviceId)) {
            setSelectedServices(selectedServices.filter((s) => s != service));
            setServiceDuration(serviceDuration - duration);
            setSelectedServicesIds(selectedServicesIds.filter((id) => id !== serviceId));
        } else {
            setSelectedServices([...selectedServices, service]);
            setServiceDuration(serviceDuration + duration);
            setSelectedServicesIds([...selectedServicesIds, serviceId]);
        }
    };

    useEffect(() => {
        clickedServices(selectedServicesIds, serviceDuration, selectedServices);
    }, [selectedServicesIds, serviceDuration, selectedServices]);

    const { userToken } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
        }
    }

    return (
        <View style={[styles.flex_container, style]}>
            {servicesList.map((service) => (
                <TouchableHighlight
                    disabled={disabled}
                    key={service.id}
                    activeOpacity={0.8}
                    onPress={() => handleServiceClick(service.id, service.duration_minutes, service)}
                    style={[
                        styles.serviceButton,
                        selectedServicesIds.includes(service.id) && styles.selectedServiceButton,
                    ]}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.serviceContainer}>
                            <View style={styles.serviceInfo}>
                                <Text style={styles.serviceTitle}>{service.title}</Text>
                                <Text style={styles.servicePrice}>{service.price} лева</Text>
                            </View>
                            <View style={styles.serviceInfo}>
                                {onServiceRemoved ? <TouchableHighlight onPress={() => onServiceRemoved(service)}>
                                    <Text style={styles.remove}>Премахни</Text>
                                </TouchableHighlight> : ''}
                                <Text style={styles.serviceDuration}>
                                    {service.duration_minutes} минути
                                </Text>
                            </View>
                            <Text style={styles.serviceDescription}>
                                {isExpanded
                                    ? service.description
                                    : `${service.description.slice(
                                        0,
                                        MAX_DESCRIPTION_LENGTH
                                    )}...`}
                            </Text>
                            {service.description.length > MAX_DESCRIPTION_LENGTH && (
                                <TouchableOpacity
                                    style={styles.readMoreLink}
                                    onPress={toggleExpand}
                                >
                                    <Text style={styles.readMoreText}>
                                        {isExpanded ? 'Покажи по-малко' : 'Прочети повече'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {user.role_id == 2 && (
                            <View style={styles.iconContainer}>
                                <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => handleEditService(service)}>
                                    <FontAwesomeIcon icon={faPenToSquare} size={16} color={Colors.dark} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onServiceDelete(service.id)}>
                                    <FontAwesomeIcon icon={faTrashCan} size={16} color={Colors.error} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </TouchableHighlight>
            ))}
        </View>
    );
};
export default ServicesComponent;

const styles = StyleSheet.create({
    flex_container: {
        flex: 1,
    },
    serviceContainer: {
        width: '87%',
        padding: 5,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    serviceButton: {
        paddingBottom: 1,
        paddingRight: 0,
        margin: 1,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    selectedServiceButton: {
        borderColor: Colors.dark,
        backgroundColor: Colors.primary,
    },
    serviceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    serviceTitle: {
        color: Colors.dark,
        fontWeight: 'bold',
        fontSize: 18,
    },
    remove: {
        color: Colors.error,
        fontSize: 16,
        fontWeight: 500,
        marginRight: 0
    },
    serviceDuration: {
        alignSelf: 'flex-end',
        fontSize: 16,
        color: Colors.dark,
    },
    servicePrice: {
        fontSize: 16,
        borderRadius: 10,
        padding: 1,
        backgroundColor: Colors.primary,
        color: Colors.dark,
        alignSelf: 'flex-end'
    },
    serviceDescription: {
        marginTop: 1,
        marginBottom: 5,
        fontSize: 14,
    },
    readMoreLink: {
        alignSelf: 'flex-end',
    },
    readMoreText: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
});
