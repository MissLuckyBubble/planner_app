import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ScrollView, ToastAndroid, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../config';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { Colors } from '../assets/Colors';
import StarRatingComponent from '../components/StarRatingComponent';
import CommentComponent from '../components/CommentComponent';

function CommentsScreen({ navigation, route }) {
    const { userToken, user } = useContext(AuthContext);

    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
        }
    };

    const [business, setBusiness] = useState([]);

    const { appointmentId, businessId } = route.params ? route.params : { appointmentId: '', businessId: '' };

    useEffect(() => {
        const getBusiness = async () => {
            if (user.role_id == 1) {
                try {
                    const response = await axios.get(`${BASE_URL}/getBusiness/${businessId}`, config);
                    const result = response.data.data;
                    const sortedComments = Object.values(result.comments).sort((a, b) => b.id - a.id);
                    result.comments = sortedComments;
                    setBusiness(result);
                } catch (error) { }
            }
        };
        getBusiness();
    }, [businessId, appointmentId]);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');


    const handleLike = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/customer/favorites/${businessId}`, '', config);
            const result = response.data;
            if (result == 1) {
                ToastAndroid.show(`Успешно премахнахте ${business.name} от любимите си места`, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(`Успешно добавихте ${business.name} в любимите си места`, ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleCommentChange = (text) => {
        setComment(text);
    };

    const handlePostComment = () => {
        if (rating <= 0) {
            setError('Моля изберете оценка')
        } else {
            leaveRate();
            navigation.navigate("CommentsScreen", { businessId });
        }
    };

    const leaveRate = async () => {
        try {
            const response = await
                axios.post(`${BASE_URL}/customer/appointments/rate/${appointmentId}`, { rate: rating, comment },
                    config);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const getBusiness = async () => {
            if(user.role_id != 1)
            try {
                const response = await axios.get(`${BASE_URL}/business/profile`, config);
                const result = response.data.data;
                const sortedComments = Object.values(result.comments).sort((a, b) => b.id - a.id);
                result.comments = sortedComments;
                setBusiness(result);
            } catch (error) {
                console.error(error);
            }
        }
        getBusiness();
    }, []);


    const handleGoBack = () => {
        if (user.role_id == 1) {
            navigation.navigate('BusinessDetails', { id: businessId });
        } else {
            navigation.goBack();
        }
    };
    const openDrawer = () => {
        navigation.openDrawer();
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={handleGoBack}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color={Colors.dark} />
                </TouchableOpacity>
                {user.role_id == 1 ?
                    <Text style={styles.nameText}>{business.name}</Text> :
                    <Text style={styles.nameText}>Вашите оценки</Text>}
                {user.role_id == 1 ?
                    <TouchableOpacity onPress={handleLike}>
                        <FontAwesomeIcon icon={faHeart} size={24} color={Colors.error} />
                    </TouchableOpacity> :
                    <TouchableOpacity onPress={openDrawer}>
                        <FontAwesomeIcon icon={faBars} size={24} color={Colors.dark} />
                    </TouchableOpacity>
                }
            </View>
            <View style={styles.rating}>
                <Text style={styles.ratingText}>Общ рейтинг</Text>
                <StarRatingComponent rating={business.rating} size={25} color={Colors.highlight}></StarRatingComponent>
                <Text style={styles.ratingText}>(От {business.review_number} ревюта)</Text>
            </View>
            {user.role_id == 1 && appointmentId ?
                <View style={styles.container}>
                    <Text style={styles.title}>Оставете вашата оценка </Text>
                    {error ? <Text style={{ color: Colors.error }}>{error}</Text> : ''}
                    <StarRatingComponent rating={rating} size={24} color="gold" onPress={handleRatingChange} />
                    <TextInput
                        placeholder="Оставете коментар.."
                        onChangeText={handleCommentChange}
                        value={comment}
                        style={styles.input}
                        multiline />
                    <TouchableOpacity style={styles.button} onPress={handlePostComment}>
                        <Text style={styles.buttonText}>Сподели</Text>
                    </TouchableOpacity>
                </View>
                : ''}
            <View>
                {business.comments &&
                    business.comments
                        .map(comment => (
                            <CommentComponent
                                key={comment.id}
                                id={comment.id}
                                comment={comment.comment}
                                rating={comment.rate}
                                customerName={comment.customer_name}
                                customerSex={comment.customer_sex}
                                customerAge={comment.customer_age}
                                date={comment.date}
                            />
                        ))}
            </View>

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
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    button: {
        backgroundColor: Colors.dark,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
})