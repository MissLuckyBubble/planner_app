import React, { useContext, useEffect, useState } from 'react';
import { TouchableHighlight, TouchableOpacity, Text, StyleSheet, View, ScrollView, ToastAndroid } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../config';
import PicutresComponent from '../components/PicturesComponent';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { Colors } from '../assets/Colors';
import StarRatingComponent from '../components/StarRatingComponent';
import BusinessCategoriesComponent from '../components/BusinessCategoriesComponent';
import MapComponent from '../components/Addresses/MapComponent';
import ModalComponent from '../components/ModalComponent';

function BusinessDetailsScreen({ navigation, route }) {
    const { id } = route.params;

    const handleGoBack = () => {
        navigation.goBack();
    };

    const openCommentsClicked = (businessId) => {
        navigation.navigate("CommentsScreen", { businessId });
    }

    const handleLike = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/customer/favorites/${id}`, '', config);
            const result = response.data;
            if (result == 1) {
                ToastAndroid.show(`Успешно премахнахте ${business.name} от любимите си места`, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(`Успешно добавихте ${business.name} в любимите си места`, ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const { userToken } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
        }
    };
    const [business, setBusines] = useState([]);
    useEffect(() => {
        const getBusiness = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/getBusiness/${id}`, config);
                const result = response.data.data;
                setBusines(result);
            } catch (error) {
                console.error(error);
            }
        };
        getBusiness();
    }, [id]);

    const [clickedServices, setClickedServices] = useState([]);
    const [duration, setDuration] = useState();
    const [services, setServices] = useState([]);
    const [is_group, setIsGroup] = useState(false);

    const handleClickedServices = (selectedServicesIds, duration, selectedServices) => {
        setClickedServices(selectedServicesIds);
        setDuration(duration);
        setServices(selectedServices);
        setError('');
        if (selectedServices.length > 0 && selectedServices[0].max_capacity) {
            setIsGroup(true)
        } else setIsGroup(false);
    };

    const onMakeAppointment = (businessId, name, services, duration, servicesIds) => {
        navigation.navigate('MakeAppointmentScreen', {
            businessId: businessId,
            businessName: name,
            services: services,
            servicesIds: servicesIds,
            duration: duration,
            uniqueId: Date.now().toString()
        });
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');
    const signUpForGroupAppointment = async () => {
        try {
            console.log(`${BASE_URL}/customer/group_appointment/signup/${clickedServices}`);
            const response = await axios.patch(`${BASE_URL}/customer/group_appointment/signup/${clickedServices}`, '', config);
            const result = response.data;
            console.log(result)
            setError('');
            setModalVisible(true);
        } catch (error) {
            console.log( error.response);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                if (errorMessage.includes('капацитет')) {
                    setError('Съжаляваме, няма свободни места.');
                } else if(errorMessage.includes('Вече сте се записали')){
                    setError('Съжаляваме, можете да се запишете само веднъж.');
                } else setError('Съжаляваме, възникна грешка. Моля опитайте отново.');
            }
        }
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={handleGoBack}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color={Colors.dark} />
                </TouchableOpacity>
                <Text style={styles.nameText}>{business.name}</Text>
                <TouchableOpacity onPress={handleLike}>
                    <FontAwesomeIcon icon={faHeart} size={24} color={Colors.error} />
                </TouchableOpacity>
            </View>
            <PicutresComponent images={business.picture} /><View></View>
            <View style={styles.rating}>
                <StarRatingComponent rating={business.rating} size={25} color={Colors.highlight}></StarRatingComponent>
                <TouchableOpacity onPress={() => openCommentsClicked(business.id)} >
                    <Text style={styles.ratingText}>(От {business.review_number} ревюта)</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.descriptionConteiner}>
                <Text style={styles.descriptiontext}>{business.description} </Text>
            </View>
            {
                business.services_category ? business.services_category.map(category =>
                    <BusinessCategoriesComponent key={category.id}
                        title={category.title}
                        services={category.services}
                        handleClickedServices={handleClickedServices}
                    />
                )
                    : ''
            }

            <View style={styles.bottomContainer}>
            {error && <Text style={{color:Colors.error, fontSize:16}}>{error}</Text>}
                <Text style={styles.servicesLengthText}>{clickedServices.length == 1 ? 'Избрана е 1 услуга' : 'Избрани са ' + clickedServices.length + ' услуги'}</Text>
                {!is_group ? <TouchableHighlight
                    disabled={clickedServices.length <= 0}
                    onPress={() => onMakeAppointment(business.id, business.name, services, duration, clickedServices)} style={styles.button}>
                    <Text style={styles.buttonText}>{clickedServices.length <= 0 ? 'Изберете услуги' : 'Запази си час'}</Text>
                </TouchableHighlight> :
                    <TouchableHighlight
                        disabled={clickedServices.length <= 0}
                        onPress={signUpForGroupAppointment} style={styles.button}>
                        <Text style={styles.buttonText}>Запази си място</Text>
                    </TouchableHighlight>
                }
            </View>

            <ModalComponent
                navigation={navigation}
                nav='Appointments'
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title={'Запазихте си място успешно!'}
                text={'Ще получите имейл с потвърждение. Детайли можете да видите и в менюто запазени часове.'}
                btntext={'Продължи'}>
            </ModalComponent>

            <View style={styles.addressContainer}>
                {business.address && (
                    <Text style={styles.addressText}>Адрес: {business.address.description}</Text>
                )}
                {business.address &&
                    business.address.latitude != null &&
                    business.address.latitude != '' && (
                        <View style={styles.mapContainer}>
                            <MapComponent
                                latitude={parseFloat(business.address.latitude)}
                                longitude={parseFloat(business.address.longitude)}
                                height={200}
                                businessName={business.name}
                                businessCategories={business.category}
                            ></MapComponent>
                        </View>
                    )}
            </View>
        </ScrollView>
    );
}

export default BusinessDetailsScreen;
const styles = StyleSheet.create({
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: Colors.primary,
    },
    nameText: {
        fontSize: 22,
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
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 15,
        paddingBottom: 0,
    },
    servicesLengthText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.dark
    },
    descriptionConteiner: {
        margin: 5,
        paddingHorizontal: 10
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.dark,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    addressContainer: {
        marginVertical: 10,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addressText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    mapContainer: {
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
    },
})