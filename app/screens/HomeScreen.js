import React, { useState, useContext, useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import BusinessListItem from '../components/BusinessListItem';
import { Colors } from '../assets/Colors';
import CategoryComponent from '../components/CaregoriesComponent';
import { BASE_URL } from '../../config';
import axios from 'axios';
import CustomSearchBar from '../components/CustomSearchBar';

function HomeScreen({ navigation }) {
    const businessClicked = (id) => {
        navigation.navigate("BusinessDetails", { id });
    }
    const { userToken } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
        }
    };

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/categories`, config);
                const result = response.data;
                setCategories(result);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
        getBusinesses();
    }, []);


    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

    const handleCategoryClick = (categoryId) => {
        if (selectedCategoryIds.includes(categoryId)) {
            setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== categoryId));
        } else {
            setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
        }
    };

    useEffect(()=>{
        getBusinesses();
    },[selectedCategoryIds]);

    const [inputSearch, setInputSearch] = useState('');
    const handleSearch = (query) => {
        setInputSearch(query);
    };
    const [businesses, setBusinesses] = useState([]);
    const getBusinesses = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/getAllBusinesses?search=${inputSearch}&category=${selectedCategoryIds}`,
                config);
            result = response.data.data[0];
            if (result)
                setBusinesses(result && result.length > 0 ? result.map(business => {
                    const categoryTitles = business.business_category.map(c => c.title);
                    const categoryString = categoryTitles.length > 3
                        ? `${categoryTitles.slice(0, 3).join(', ')}...`
                        : categoryTitles.join(', ');
                    return {
                        id: business.id,
                        name: business.name,
                        address: business.address,
                        rating: business.rating,
                        numRatings: business.review_number,
                        services: business.services_category !=undefined && business.services_category[0] && Array.isArray(business.services_category[0].services) ? business.services_category[0].services.slice(0, 2).map(s => ({
                            id: s.id,
                            name: s.title,
                            price: s.price
                        })) : [],
                        category: categoryString,
                        image: business.picture.length > 0 ? business.picture[business.picture.length - 1].name : ''
                    };
                }) : []);
        } catch (error) {
            console.error(error);
        }

    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <ScrollView horizontal={true} style={{ height: businesses.length > 0 ? 210 : 500}}>
                {categories.map(category => (
                    <TouchableOpacity
                        key={category.id}
                        activeOpacity={0.8}
                        onPress={() => handleCategoryClick(category.id)}
                        style={[
                            styles.categoryButton,
                            selectedCategoryIds.includes(category.id) && styles.selectedCategoryButton,
                        ]}
                    >
                        <CategoryComponent
                            style={businesses.length === 0 && { marginTop: 40, }}
                            id={category.id}
                            title={category.title}
                            description={category.description}
                            image={category.icon}
                            isSelected={selectedCategoryIds.includes(category.id)}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', position: 'relative' }}>
                <CustomSearchBar
                    placeholder="Търсете по услуга или по име.."
                    url={`${BASE_URL}/getAllServices?title=`}
                    onSearch={handleSearch}
                />
                <TouchableHighlight style={styles.button} onPress={getBusinesses}>
                    <Text style={styles.text}>Търсене</Text>
                </TouchableHighlight>
            </View>
            {businesses.length > 0 ? (
                <View>
                    {businesses.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => businessClicked(item.id)}>
                            <BusinessListItem
                                id={item.id}
                                name={item.name}
                                address={item.address}
                                rating={item.rating}
                                services={item.services}
                                numRatings={item.numRatings}
                                image={item.image}
                                style={{ zIndex: 1 }}
                                category={item.category}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <Text style={styles.noBusinessesText}>Няма бизнеси по търсените критерии..</Text>
            )}
        </ScrollView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
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
    button: {
        width: '25%',
        height: 50,
        backgroundColor: Colors.primary,
        margin: 5,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    text: {
        fontSize: 18,
        color: Colors.dark
    },
    noBusinessesText: {
        height: '60%',
        color: Colors.dark,
        padding: 10,
        fontSize: 25
    }
});
