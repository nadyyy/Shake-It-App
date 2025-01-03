import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Image, TextInput, StyleSheet, ImageBackground, Modal, TouchableOpacity, ScrollView } from 'react-native';

const CheckIngredients = () => {
  const [ingredientsList, setIngredientsList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [ingredientDetails, setIngredientDetails] = useState(null);  
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch the list of ingredients from TheCocktailDB API
  const fetchIngredients = async () => {
    try {
      const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
      const data = await response.json();
      
      if (data.drinks && data.drinks.length > 0) {
        const ingredients = data.drinks.map((item) => item.strIngredient1);
        setIngredientsList(ingredients);
      } else {
        console.error('No ingredients found in the response!');
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  // Fetch ingredient details from TheCocktailDB API
  const fetchIngredientDetails = async (ingredient) => {
    try {
      const formattedIngredient = ingredient.trim().toLowerCase();
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${formattedIngredient}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch ingredient details');
      }
  
      const data = await response.json();

      if (data.ingredients && data.ingredients.length > 0) {
        setIngredientDetails(data.ingredients[0]);
      } else {
        console.error('No details found for the ingredient!');
        setIngredientDetails(null);
      }
    } catch (error) {
      console.error('Error fetching ingredient details:', error);
      setIngredientDetails(null);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const renderItem = ({ item }) => {
    const imageUrl = `https://www.thecocktaildb.com/images/ingredients/${item}-Small.png`;

    return (
      <TouchableOpacity onPress={() => handleIngredientPress(item)}>
        <View style={styles.ingredientItem}>
          <Image source={{ uri: imageUrl }} style={styles.ingredientImage} />
          <Text style={styles.ingredientText}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleIngredientPress = (ingredient) => {
    fetchIngredientDetails(ingredient);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIngredientDetails(null);
  };

  return (
    <ImageBackground 
      source={require('./assets/ingredientPic.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />

      {/* Title at the top center */}
      <Text style={styles.title}>Check Ingredients</Text>

      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search ingredients..."
          placeholderTextColor="#ddd"
          value={searchText}
          onChangeText={setSearchText}
        />
        <FlatList
          data={ingredientsList.filter((ingredient) =>
            ingredient.toLowerCase().includes(searchText.toLowerCase())
          )}
          renderItem={renderItem}
          keyExtractor={(item, index) => item + index}
        />

        {/* Modal for ingredient details */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {ingredientDetails ? (
                <>
                  <Text style={styles.modalTitle}>{ingredientDetails.strIngredient}</Text>
                  <ScrollView style={styles.scrollView}>
                    <Text style={styles.modalDescription}>
                      {ingredientDetails.strDescription && ingredientDetails.strDescription !== '' 
                        ? ingredientDetails.strDescription 
                        : 'No detailed description available for this ingredient.'}
                    </Text>
                  </ScrollView>
                </>
              ) : (
                <Text style={styles.modalTitle}>No details available</Text>
              )}
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,  
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 10, 
  },
  overlay: {
    position: 'absolute',  
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    position: 'absolute',
    top: 67,
    textAlign: 'center',
    width: '100%',
    zIndex: 2,
    
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'transparent',
    marginTop: 110,
    width: '100%',
  },
  searchInput: {
    height: 50,
    borderColor: 'white',
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
    fontSize: 18,
    color: 'white',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
  },
  ingredientImage: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  ingredientText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 200, 
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CheckIngredients;
