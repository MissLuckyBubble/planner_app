import React, { useEffect, useState, useContext } from 'react';
import { Alert, TextInput, TouchableOpacity, Text, StyleSheet, View, ScrollView, ToastAndroid } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import PicutresComponent from '../../components/PicturesComponent';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faPenToSquare, faSquareCheck, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../../assets/Colors';
import BusinessCategoriesComponent from '../../components/BusinessCategoriesComponent';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../../context/AuthContext';

function BusinessHomeScreen({ navigation }) {

    const { userToken } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
        }
    };
    const openDrawer = () => {
        navigation.openDrawer();
    }
    const [editDescription, setEditDescription] = useState(false);
    const [business, setBusiness] = useState([]);
    const [editName, setEditName] = useState(false);
    const [addingCategory, setAddingCategory] = useState(false);
    const [category, onCategoryChange] = useState('');
    const [description, onDescriptionChange] = useState('');
    const [name, onNameChange] = useState('');

    const url = `${BASE_URL}/business/profile`;

    const getBusiness = async () => {
        try {
            const response = await axios.get(url, config);
            const result = response.data.data;
            setBusiness(result);
            onDescriptionChange(result.description);
            onNameChange(result.name);
        } catch (error) {
            console.error(error);
            console.log(error.response.data);
        }
    };

    useEffect(() => {
        getBusiness();
    }, []);



    const cancelEditDescription = (bool) => {
        onDescriptionChange(business.name);
        setEditDescription(bool);
    }
    const saveDescription = async (bool) => {
        try {
            const response = await axios.patch(`${url}/edit?description=${description}`, '', config
            );
        } catch (error) {
            console.error(error);
        } finally {
            getBusiness();
        }

        onDescriptionChange(description);
        setEditDescription(bool);
    };

    const cancelNameEdit = (bool) => {
        onNameChange(business.name);
        setEditName(bool);
    }
    const saveName = async (bool) => {
        try {
            const response = await axios.patch(`${url}/edit?name=${name}`, '', config
            );
        } catch (error) {
            console.error(error);
        } finally {
            getBusiness();
        }

        onNameChange(name);
        setEditName(bool);
    }
    const onDeleteImage = (id) => {
        Alert.alert(
            'Изтриване на снимка',
            'Сигурни ли сте че искате да изтриете тази снимка?',
            [
                {
                    text: 'Отказ',
                    style: 'cancel',
                },
                {
                    text: 'Изтрий',
                    onPress: async () => {
                        try {
                            const response = await axios.delete(`${BASE_URL}/business/picture/delete/${id}`, config
                            );
                        } catch (error) {
                            console.error(error);
                        } finally {
                            getBusiness();
                        }
                    },
                },
            ],
        );
    };
    const handleImageSelection = async (response) => {
        var config = {
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
            },
        };
        if (response.didCancel) {
            console.log('Image selection canceled');
        } else if (response.error) {
            console.error('ImagePicker Error: ', response.error);
        } else {
            const image = response.assets[0]; // Extract the selected image data
            const formData = new FormData();
            formData.append('file', {
                uri: image.uri,
                type: image.type,
                name: image.fileName || 'image.jpg',
            });
            try {
                await axios.post(`${BASE_URL}/business/picture/upload`, formData, config);
            } catch (error) {
                console.error(error);
            } finally {
                getBusiness();
            }
        }
    };

    const saveImage = async () => {
        launchImageLibrary({ mediaType: 'photo' }, handleImageSelection);
    };

    const cancleAddingCategory = (bool) => {
        onCategoryChange('');
        setAddingCategory(bool);
    }
    const saveCategory = async (bool) => {
        try {
            const response = await axios.post(`${BASE_URL}/business/serviceCategory/create`, { title: category }, config
            );
        } catch (error) {
            console.error(error);
        } finally {
            getBusiness();
        }

        onCategoryChange('');
        setAddingCategory(bool);
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            {editName == false ?
                <View style={styles.topContainer}>
                    <Text style={styles.nameText}>{business.name}</Text>
                    <TouchableOpacity style={{ marginRight: 40 }} onPress={() => setEditName(true)}>
                        <FontAwesomeIcon icon={faPenToSquare} size={20} color={Colors.dark} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openDrawer}>
                        <FontAwesomeIcon icon={faBars} size={24} color={Colors.dark} />
                    </TouchableOpacity>
                </View> :
                <View style={styles.topContainer}>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={1}
                        style={{ borderColor: Colors.dark, borderWidth: 1, borderRadius: 10, width: 250, height: 40 }}
                        onChangeText={text => onNameChange(text)}
                        placeholder={business.name}
                        value={name} />
                    <View style={styles.descriptionConteiner}>
                        <TouchableOpacity onPress={() => cancelNameEdit(false)}>
                            <FontAwesomeIcon icon={faRectangleXmark} size={20} color={Colors.error} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => saveName(false)}>
                            <FontAwesomeIcon icon={faSquareCheck} size={20} color={Colors.light} />
                        </TouchableOpacity>
                    </View>
                </View>
            }
            <PicutresComponent
                onDelete={onDeleteImage}
                images={business.picture} />
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={styles.button}
                    onPress={saveImage}>
                    <Text style={styles.btntext}>Качи снимка</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: Colors.dark }]}
                    onPress={() => setAddingCategory(true)}>
                    <Text style={[styles.btntext, { color: Colors.white }]}>Добави категория</Text>
                </TouchableOpacity>
            </View>
            {addingCategory &&
                <View style={styles.descriptionConteiner}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            editable
                            style={styles.input}
                            onChangeText={text => onCategoryChange(text)}
                            placeholder='Името на новата категория..'
                            value={category}
                        />
                        <View style={styles.descriptionConteiner}>
                            <TouchableOpacity onPress={() => cancleAddingCategory(false)}>
                                <FontAwesomeIcon icon={faRectangleXmark} size={20} color={Colors.error} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => saveCategory(false)}>
                                <FontAwesomeIcon icon={faSquareCheck} size={20} color={Colors.light} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>}
            {editDescription == false ?
                <View style={{ backgroundColor: Colors.white, margin: 10 }}>
                    <View style={styles.descriptionConteiner}>
                        <Text style={{ fontSize: 16, color: Colors.dark, marginRight: 10 }}>Вашето описание на бизнеса</Text>
                        <TouchableOpacity onPress={() => setEditDescription(true)}>
                            <FontAwesomeIcon icon={faPenToSquare} size={16} color={Colors.dark} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.descriptionConteiner}>
                        <Text style={styles.descriptiontext}>{business.description} </Text>
                    </View>
                </View> :
                <View style={styles.descriptionConteiner}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            editable
                            multiline
                            numberOfLines={4}
                            style={styles.input}
                            onChangeText={text => onDescriptionChange(text)}
                            placeholder={business.description}
                            value={description}
                        />
                        <View style={styles.descriptionConteiner}>
                            <TouchableOpacity onPress={() => cancelEditDescription(false)}>
                                <FontAwesomeIcon icon={faRectangleXmark} size={20} color={Colors.error} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => saveDescription(false)}>
                                <FontAwesomeIcon icon={faSquareCheck} size={20} color={Colors.light} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
            {
                business.services_category && business.services_category.map(category =>
                    <BusinessCategoriesComponent
                        key={category.id}
                        id={category.id}
                        title={category.title}
                        services={category.services}
                        disabled={true}
                        handleClickedServices={() => { }}
                        refresh={getBusiness}
                    />
                )
            }
        </ScrollView>
    );
}

export default BusinessHomeScreen;
const styles = StyleSheet.create({
    topContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 5,
        backgroundColor: Colors.primary,
    },
    nameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.dark,
        marginHorizontal: 0,
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
    descriptionConteiner: {
        flexDirection: 'row',
        margin: 5,
        paddingHorizontal: 10,
    },
    inputContainer: {
        margin: 12,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: Colors.white,
        borderColor: Colors.dark,
        alignContent: 'flex-end',
        alignItems: 'flex-end',
    },
    input: {
        width: 340,
        padding: 10,
        paddingEnd: 0,
        backgroundColor: Colors.white,
    },
    button: {
        width: 185,
        height: 40,
        backgroundColor: Colors.highlight,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    btntext: {
        fontSize: 18,
        color: Colors.dark
    },
    container: {
        flex: 1
    },
})