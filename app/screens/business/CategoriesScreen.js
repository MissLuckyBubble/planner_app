import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../assets/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import CategoryComponent from '../../components/CaregoriesComponent';

const CategoriesScreen = ({ navigation }) => {

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

    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [businessCategories, setBusinessCategories] = useState([]);
    const [selectedBusinessCategories, setSelectedBusinessCategories] = useState([]);
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/business/categories/getAll`, config);
            const businessCategories = response.data.data.map((item) => item.category);
            const businessCategoryIds = new Set(businessCategories.map((businessCategory) => businessCategory.id));
            const allCategoriesResponse = await axios.get(`${BASE_URL}/categories`, config);
            const allCategories = allCategoriesResponse.data;
            setBusinessCategories(allCategories.filter((category) => businessCategoryIds.has(category.id.toString())));
            setAllCategories(allCategories.filter((category) => !businessCategoryIds.has(category.id.toString())));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId) => {
        setSelectedCategories((prevSelectedCategories) => {
            if (prevSelectedCategories.includes(categoryId)) {
                return prevSelectedCategories.filter((id) => id !== categoryId);
            } else {
                return [...prevSelectedCategories, categoryId];
            }
        });
    };

    const handleBusinessCategoryClick = (categoryId) => {
        setSelectedBusinessCategories((prevSelectedCategories) => {
            if (prevSelectedCategories.includes(categoryId)) {
                return prevSelectedCategories.filter((id) => id !== categoryId);
            } else {
                return [...prevSelectedCategories, categoryId];
            }
        });
    };

    const addCategories = async () => {
        try {
            await axios.post(`${BASE_URL}/business/categories/set`,
                { category_id: selectedCategories.join(',') },
                config);
        } catch (error) {
            console.error(error);
        } finally {
            setSelectedCategories([]);
            fetchCategories();
        }
    }
    const removeCategories = async () => {
        try {
            await axios.patch(`${BASE_URL}/business/categories/remove`,
                { category_id: selectedBusinessCategories.join(',') },
                config);
        } catch (error) {
            console.error(error);
        } finally {
            setSelectedBusinessCategories([]);
            fetchCategories();
        }
    }
    return (
        <ScrollView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.nameText}>Настройки на бизнеса</Text>
                <TouchableOpacity onPress={openDrawer}>
                    <FontAwesomeIcon icon={faBars} size={24} color={Colors.dark} />
                </TouchableOpacity>
            </View>
            <View style={{ margin: 10 }}>
                <Text style={styles.label}>Категориите на вашия бизнес</Text>
                <ScrollView horizontal={true} style={{ marginVertical: 10 }}>
                    {businessCategories.map(category => (
                        <TouchableOpacity
                            key={category.id}
                            activeOpacity={0.8}
                            onPress={() => handleBusinessCategoryClick(category.id)}
                            style={[
                                styles.categoryButton,
                                selectedBusinessCategories.includes(category.id) && styles.selectedCategoryButton,
                            ]}>
                            <CategoryComponent
                                id={category.id}
                                title={category.title}
                                description={category.description}
                                image={category.icon}
                                isSelected={selectedBusinessCategories.includes(category.id)}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <TouchableOpacity style={styles.button}
                    onPress={removeCategories}>
                    <Text style={styles.btntext}>Премахни избраните Категории</Text>
                </TouchableOpacity>
                <Text style={styles.label}>Други Категории</Text>
                <ScrollView horizontal={true} style={{ marginVertical: 10 }}>
                    {allCategories.map(category => (
                        <TouchableOpacity
                            key={category.id}
                            activeOpacity={0.8}
                            onPress={() => handleCategoryClick(category.id)}
                            style={[
                                styles.categoryButton,
                                selectedCategories.includes(category.id) && styles.selectedCategoryButton,
                            ]}>
                            <CategoryComponent
                                id={category.id}
                                title={category.title}
                                description={category.description}
                                image={category.icon}
                                isSelected={selectedCategories.includes(category.id)}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <TouchableOpacity style={styles.button}
                    onPress={addCategories}>
                    <Text style={styles.btntext}>Добави избраните Категории</Text>
                </TouchableOpacity>
            </View>
        </ScrollView >

    );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
        color: Colors.dark,
        backgroundColor: Colors.highlight,
        padding: 10,
        borderRadius: 5,
        textAlign: 'center'
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: Colors.dark,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 15
    },
    btntext: {
        fontSize: 18,
        color: Colors.white
    },
    categoryButton: {
        height: 205,
        paddingBottom: 5,
        paddingRight: 5,
        margin: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
      },
      selectedCategoryButton: {
        borderColor: Colors.dark,
        backgroundColor: Colors.primary,
      },
});