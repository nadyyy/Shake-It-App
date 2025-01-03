import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const IngredientDetails = ({ route }) => {
  const { ingredientName } = route.params;
  const [ingredientDetails, setIngredientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngredientDetails = async () => {
      try {
        // Fetch the ingredient details from the API
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${ingredientName}`);

        // Log the response status and body
        console.log('API Response Status:', response.status);
        const responseBody = await response.text();  // Read the response body as text
        console.log('API Response Body:', responseBody);

        // Check if the response is valid
        if (!response.ok) {
          throw new Error('Failed to fetch ingredient details');
        }

        // If the body is empty or invalid, show an error
        if (!responseBody) {
          throw new Error('Received empty response');
        }

        // Parse the response as JSON
        const data = JSON.parse(responseBody);  // Try parsing the text as JSON
        

        // Check if we have valid ingredient data
        if (data && data.ingredients && data.ingredients.length > 0) {
          setIngredientDetails(data.ingredients[0]);  // Assuming the response contains an array of ingredients
        } else {
          setError('No ingredient details found.');
        }
      } catch (err) {
        console.error('Error fetching ingredient details:', err);
        setError('Failed to load ingredient details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredientDetails();
  }, [ingredientName]);

  if (loading) {
    return <Text>Loading ingredient details...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!ingredientDetails) {
    return <Text>No details available for this ingredient.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{ingredientDetails.strIngredient}</Text>
      {ingredientDetails.strImageURL && (
        <Image source={{ uri: ingredientDetails.strImageURL }} style={styles.image} />
      )}
      <Text style={styles.description}>{ingredientDetails.strDescription}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
  },
});

export default IngredientDetails;
