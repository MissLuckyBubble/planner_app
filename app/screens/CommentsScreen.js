import React, { useContext, useEffect, useState } from 'react';
import { TouchableHighlight, TouchableOpacity, Text, StyleSheet, View, ScrollView, ToastAndroid } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../config';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { Colors } from '../assets/Colors';
import StarRatingComponent from '../components/StarRatingComponent';
import CommentComponent from '../components/CommentComponent';

function CommentsScreen({ navigation, route }) {
    const { id } = route.params;

    const handleGoBack = () => {
        navigation.navigate('BusinessDetails', { id });
    };
    const handleLike = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/customer/favorites/${id}`, '', config);
            const result = response.data;
            console.log(result);
            console.log(result == 1);
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
                console.log(business.comments);
            } catch (error) {
            } finally {
            }
        };

        getBusiness();
    }, [id]);


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
            <View style={styles.rating}>
                <StarRatingComponent rating={business.rating} size={25} color={Colors.highlight}></StarRatingComponent>
                <Text style={styles.ratingText}>(От {business.review_number} ревюта)</Text>
            </View>
            <View>
                {business.comments ? business.comments.length > 0 ? business.comments.map(comment => (
                        <CommentComponent
                            id={comment.id}
                            comment={comment.comment}
                            rating={comment.rate}
                            customerName={comment.customer_name}
                            customerSex ={comment.customer_sex}
                            customerAge ={comment.customer_age}
                            date ={comment.date}
                        />
                )): '' : ''}
            </View>
            <TouchableHighlight
                onPress={handleGoBack}>
                <Text style={styles.btntext}>BACK</Text>
            </TouchableHighlight>
        </ScrollView>
    );
}

export default CommentsScreen;
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
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.dark,
        marginHorizontal: 16,
    },
    rating: {
        padding: 10,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    ratingText: {
        fontSize: 16,
        color: Colors.primary,
        padding: 5,
    }
})