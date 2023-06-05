import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, ToastAndroid } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown, faRectangleXmark, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { faAngleUp, faTrashCan, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../assets/Colors';
import ServicesComponent from './ServicesComponent';
import { AuthContext } from '../context/AuthContext';
import ModalServiceFormComponent from './ModalServiceFormComponent';
import { commonStyles } from '../assets/Styles';
import axios from 'axios';
import { BASE_URL } from '../../config';

function BusinessCategoriesComponent({ id, title, services, handleClickedServices, disabled, refresh }) {

    const { userToken } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
        }
    };
    const patchConfig = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: "application/vnd.api+json",
        }
    };

    const { user } = useContext(AuthContext);
    const [shown, setShow] = useState(false);
    const handleShowServices = () => {
        setShow(!shown);
    }
    const [isModalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState(null);

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setFormData(null);
    };

    const handleAddService = async (data) => {
        console.log(data, id);
        if (data.maxCapacity) {
            addGroupService(data, id);
        } else {
            var data = {
                title: data.title,
                duration: data.duration,
                description: data.description,
                price: data.price,
                service_category_id: id,
            }
            try {
                const response = await axios.post(`${BASE_URL}/business/services/create`, data, config
                );
            } catch (error) {
                console.error(error.response.data);

            } finally {
                refresh();
                handleCloseModal();
            }
        }
    }

    const addGroupService = async (data, id) => {
        var data = {
            title: data.title,
            duration: data.duration,
            description: data.description,
            price: data.price,
            service_category_id: id,
            max_capacity: data.maxCapacity,
            date: data.date,
            start_time: data.hour
        }
        try {
            const response = await axios.post(`${BASE_URL}/business/group_appointment/create`, data, config
            );
        } catch (error) {
            console.error(error.response.data);
        } finally {
            refresh();
            handleCloseModal();

        }
    }
    const handleEditService = (service) => {
        console.log(service);
        setFormData({
            id: service.id,
            title: service.title,
            duration: service.duration.toString(),
            description: service.description,
            price: service.price,
        });
        setModalVisible(true);
    }

    const handleEditForm = async (data) => {
        const formData = {
            'title': data.title,
            'duration': data.duration,
            'description': data.description,
            'price': data.price,
            'service_category_id': id
        }
        try {
            const response = await axios.patch(`${BASE_URL}/business/services/edit/${data.id}`, formData, patchConfig
            );
        } catch (error) {
            console.error(error.response.data);
        } finally {
            refresh();
            handleCloseModal();
        }
    };


    const handleCategoryDelete = () => {
        console.log(id);
        if (services.length > 0) {
            Alert.alert(
                'Изтриване на категория.',
                'Не можете да изтирете категория, която има услуги.'
            )
        }
        else {
            Alert.alert(
                'Изтриване на категория.',
                'Сигурни ли сте, че искате да изтриете тази категория?',
                [
                    {
                        text: 'Отказ',
                        style: 'cancel',
                    },
                    {
                        text: 'Изтрий',
                        onPress: async () => {
                            const url = `${BASE_URL}/business/serviceCategory/delete/${id}`;
                            axios.delete(url, config).then((response) => {
                                ToastAndroid.show(`Успешно изтрита категория`, ToastAndroid.SHORT);
                                refresh();
                            }).catch((error) => {
                                console.error(error)
                            });
                        },
                    },
                ]
            )
        }
    }
    const [categoryTitle, setCategoryTitle] = useState(title);
    const [titleEditing, setTitleEditing] = useState(false);
    const handleCategoryEdit = async () => {
        try {
            await
                axios.patch(`${BASE_URL}/business/serviceCategory/edit/${id}`, { title: categoryTitle }, config)
        }
        catch (error) {
            console.error(error.response.data.message);
        } finally {
            refresh();
            setTitleEditing(false);
        }
    }
    const handleCancelCategoryEdit = () => {
        setTitleEditing(false);
        setCategoryTitle(title);
    }

    const disableService = (serviceId) => {
        console.log(serviceId);
        Alert.alert(
            'Деактивиране на услуга.',
            'Сигурни ли сте, че искате да деактивилате тази услуга? Предстоящите записани часове, съдържащи тази услуга, все още ще трябва да бъдат осъществени.',
            [
                {
                    text: 'Отказ',
                    style: 'cancel',
                },
                {
                    text: 'Деактивирай',
                    onPress: async () => {
                        const url = `${BASE_URL}/business/services/disable/${serviceId}`;
                        axios.patch(url, '', config).then((response) => {
                            ToastAndroid.show(`Успешно деактивирана услуга`, ToastAndroid.SHORT);
                            refresh();
                        }).catch((error) => {
                            console.error(error.response)
                        });
                    },
                },
            ]
        )
    }

    return (
        <View style={styles.container}>
            {titleEditing ?
                <View style={commonStyles.row}>
                    <TextInput
                        style={commonStyles.input}
                        value={categoryTitle}
                        onChangeText={setCategoryTitle} // Use onChangeText instead of onChange
                        placeholder='Ново заглавие..'
                    />
                    <View style={styles.descriptionConteiner}>
                        <TouchableOpacity onPress={handleCancelCategoryEdit}>
                            <FontAwesomeIcon icon={faRectangleXmark} size={20} color={Colors.error} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCategoryEdit}>
                            <FontAwesomeIcon icon={faSquareCheck} size={20} color={Colors.light} />
                        </TouchableOpacity>
                    </View>
                </View>
                : <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                    {user.role_id == 2 &&
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ marginRight: 5 }} onPress={handleOpenModal}>
                                <FontAwesomeIcon icon={faPlus} size={15} color={Colors.light} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => setTitleEditing(true)}>
                                <FontAwesomeIcon icon={faPenToSquare} size={15} color={Colors.dark} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginRight: 5 }} onPress={handleCategoryDelete}>
                                <FontAwesomeIcon icon={faTrashCan} size={15} color={Colors.error} />
                            </TouchableOpacity>
                        </View>
                    }
                    <TouchableOpacity onPress={() => handleShowServices()}>
                        {shown ?
                            <FontAwesomeIcon icon={faAngleUp} size={15} color={Colors.dark} /> :
                            <FontAwesomeIcon icon={faAngleDown} size={15} color={Colors.dark} />
                        }
                    </TouchableOpacity>
                </View>}
            {shown ?
                <ServicesComponent
                    disabled={disabled}
                    services={services}
                    clickedServices={handleClickedServices}
                    handleEditService={handleEditService}
                    onServiceDisable={disableService} />
                : ''
            }
            <ModalServiceFormComponent
                visible={isModalVisible}
                onCancel={handleCloseModal}
                onSave={formData ? handleEditForm : handleAddService}
                initialData={formData}
            />
        </View>
    )
}
export default BusinessCategoriesComponent;
const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark,
    },
});