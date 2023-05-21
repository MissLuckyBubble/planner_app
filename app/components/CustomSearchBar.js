import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Colors } from '../assets/Colors';

const CustomSearchBar = ({ placeholder, url, onSearch }) => {
    const { userToken } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
        }
    };
    const [inputText, setinputText] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const fetchAutocompleteSuggestions = async (inputText) => {
        try {
            const response = await axios.get(`${url}${inputText}`, config);
            const suggestions = response.data.data[0]
                .reduce((acc, curr) => {
                    // Skip suggestions with the same title
                    if (acc.some(s => s.title === curr.title)) return acc;
                    // Limit the suggestions to the first 3
                    if (acc.length === 3) return acc;
                    // Add the suggestion to the list
                    return [...acc, { id: curr.id.toString(), title: curr.title }];
                }, []);
            onSearch(inputText); // update the inputText in the parent component
            setSuggestions(suggestions);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputText) {
                fetchAutocompleteSuggestions(inputText);
                onSearch(inputText);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [inputText, onSearch]);

    const onChangeText = (query) => {
        if (query === "") {
            setinputText("");
        } else {
            setinputText(query);
        }
        onSearch(query);

    };

    const handleClick = (id) => {
        const suggestion = suggestions.find((item) => item.id === id);
        if (suggestion) {
            setinputText(suggestion.title);
            onSearch(inputText);
            setSuggestions([]);
        }
    };
    const handleSubmit = () => {
        setSuggestions([]);
    };
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={inputText}
                    onChangeText={onChangeText}
                    onSubmitEditing={handleSubmit}
                />
            </View>
            {(suggestions.length > 0 && inputText.length > 0) && (
                <View>
                    {suggestions.map((item)=>(
                         <TouchableOpacity key={item.id} style={styles.suggestionItem} onPress={() => handleClick(item.id)} >
                         <Text style={styles.suggestionText}>{item.title}</Text>
                     </TouchableOpacity>
                    ))}
                </View>
            )}

        </View>
    );
};

export default CustomSearchBar;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        margin: 10,
        padding: 1,
        shadowColor: Colors.dark,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    inputContainer: {
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        padding: 0,
    },
    input: {
        fontSize: 16,
        paddingLeft: 10,
    },
    list: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginTop: 1,
        width: '100%',
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
    },
    suggestionText: {
        fontSize: 16,
    },
});
