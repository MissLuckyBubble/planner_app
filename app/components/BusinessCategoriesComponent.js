import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faAngleUp, faTrashCan, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../assets/Colors';
import ServicesComponent from './ServicesComponent';
import { AuthContext } from '../context/AuthContext';
import ModalServiceFormComponent from './ModalServiceFormComponent';

function BusinessCategoriesComponent({ id, title, services, handleClickedServices, disabled, addService, onServiceDelete }) {
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

    const handleSaveForm = (data) => {
        console.log(data);
        handleCloseModal();
    };

    const handleEditForm = (data) => {
        setFormData(data);
        setModalVisible(true);
    };

    const handleCategoryDelete = () => {
        console.log('deleteclicked', id);
    }
    const handleCategoryEdit = () => {
        console.log('editclicked', id);
    }
    const handleAddService = (data) => {
        addService(data, id);
        handleCloseModal();
    }


    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                {user.role_id == 2 &&
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginRight: 5 }} onPress={handleOpenModal}>
                            <FontAwesomeIcon icon={faPlus} size={15} color={Colors.light} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginRight: 5 }} onPress={handleCategoryEdit}>
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
            </View>
            {shown ?
                <ServicesComponent
                    disabled={disabled}
                    services={services}
                    clickedServices={handleClickedServices}
                    onServiceDelete={onServiceDelete} />
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