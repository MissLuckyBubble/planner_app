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


function BusinessDetailsScreen({ navigation, route }) {
    const { id } = route.params;

    const handleGoBack = () => {
        navigation.goBack();
    };

    const openCommentsClicked = (id) => {
        navigation.navigate("CommentsScreen", { id });
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
        } finally {
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
                const result = response.data.data[0];
                setBusines(result);
            } catch (error) {
            } finally {
            }
        };
        getBusiness();
    }, [id]);

    const [clickedServices, setClickedServices] = useState([]);
    const [duration, setDuration] = useState();
    const [services, setServices] = useState([]);
    
    const handleClickedServices = (selectedServicesIds, duration, selectedServices) => {
      setClickedServices(selectedServicesIds);
      setDuration(duration);
      setServices(selectedServices);
    };
    
    const onMakeAppointment = (businessId,name,services,duration,servicesIds) => {
        navigation.navigate('MakeAppointmentScreen', {
          businessId: businessId,
          businessName: name,
          services: services,
          servicesIds: servicesIds,
          duration: duration,
          uniqueId: Date.now().toString()
        });
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
            {
                business.services_category ? business.services_category.map(category=>
                    <BusinessCategoriesComponent key={category.id}
                        title={category.title}
                        services={category.services}
                        handleClickedServices={handleClickedServices}
                    />
                )
                 : ''
            }

            <View style={styles.bottomContainer}>
                <Text style={styles.servicesLengthText}>Избрани са {clickedServices.length} услуги</Text>
                <TouchableHighlight
                disabled={clickedServices.length<=0}
                onPress={()=>onMakeAppointment(business.id,business.name,services,duration,clickedServices)} style={styles.button}>
                    <Text style={styles.buttonText}>{clickedServices.length<=0 ? 'Изберете услуги' : 'Запази си час'}</Text>
                </TouchableHighlight>
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
})