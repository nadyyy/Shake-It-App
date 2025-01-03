import React, { useState, useEffect } from 'react';  
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Keyboard, 
  ScrollView, 
  ImageBackground 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';

const spirits = ['Vodka', 'Gin', 'Rum', 'Tequila', 'Whiskey', 'Brandy', 'Aperol'];
const tastes = ['Sweet', 'Sour', 'Spicy', 'Bitter', 'Herbal', 'Fruity'];
const types = ['Cocktail', 'Shot', 'Mocktail'];

const FindDrinks = () => {
  const [cocktails, setCocktails] = useState([]);
  const [filteredCocktails, setFilteredCocktails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [spiritFilter, setSpiritFilter] = useState('');
  const [tasteFilter, setTasteFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const navigation = useNavigation();

  const fetchCocktails = async () => {
    try {
      const allCocktails = [];
      const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
      for (const letter of alphabet) {
        const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`);
        if (response.data.drinks) {
          allCocktails.push(...response.data.drinks);
        }
      }
      const sortedCocktails = allCocktails.sort((a, b) => a.strDrink.localeCompare(b.strDrink));
      setCocktails(sortedCocktails);
      setFilteredCocktails(sortedCocktails);
    } catch (error) {
      console.error('Error fetching cocktails:', error);
    }
  };

  useEffect(() => {
    fetchCocktails();
  }, []);

  const handleSearch = () => {
    if (searchQuery === '') {
      setFilteredCocktails(cocktails);
    } else {
      const searchResults = cocktails.filter((cocktail) =>
        cocktail.strDrink.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCocktails(searchResults);
    }
  };

  const handleRandom = () => {
    const shuffledCocktails = [...cocktails].sort(() => Math.random() - 0.5);
    setFilteredCocktails(shuffledCocktails);
  };

  const applyFilters = () => {
    let filtered = cocktails;

    // Filter by spirit (e.g., whiskey, rum, brandy)
    if (spiritFilter) {
      filtered = filtered.filter((cocktail) => {
        const ingredients = [
          cocktail.strIngredient1, 
          cocktail.strIngredient2, 
          cocktail.strIngredient3, 
          cocktail.strIngredient4, 
          cocktail.strIngredient5
        ];
        
        if (spiritFilter.toLowerCase() === 'whiskey') {
          const whiskeyTypes = ['bourbon', 'rye', 'blended', 'scotch', 'irish', 'malt'];
          return whiskeyTypes.some((whiskeyType) => 
            ingredients.some((ingredient) => ingredient && ingredient.toLowerCase().includes(whiskeyType))
          );
        }

        if (spiritFilter.toLowerCase() === 'rum') {
          const rumTypes = ['light rum', 'dark rum', 'white rum', 'spiced rum', 'malibu rum'];
          return rumTypes.some((rumType) => 
            ingredients.some((ingredient) => ingredient && ingredient.toLowerCase().includes(rumType))
          );
        }

        if (spiritFilter.toLowerCase() === 'brandy') {
          const brandyTypes = ['brandy', 'cherry brandy'];
          return brandyTypes.some((brandyType) => 
            ingredients.some((ingredient) => ingredient && ingredient.toLowerCase().includes(brandyType))
          );
        }

        return ingredients.some((ingredient) => ingredient && ingredient.toLowerCase() === spiritFilter.toLowerCase());
      });
    }

    // Shot Filter Logic
    if (typeFilter === 'Shot') {
      filtered = filtered.filter((cocktail) => {
        return cocktail.strGlass?.toLowerCase() === 'shot glass';
      });
    }

    // Taste Filter Logic (and Mocktail logic)
    if (tasteFilter || typeFilter === 'Mocktail') {
      filtered = filtered.filter((cocktail) => {
        const ingredients = [
          cocktail.strIngredient1, 
          cocktail.strIngredient2, 
          cocktail.strIngredient3, 
          cocktail.strIngredient4, 
          cocktail.strIngredient5, 
          cocktail.strIngredient6, 
          cocktail.strIngredient7, 
          cocktail.strIngredient8, 
          cocktail.strIngredient9
        ];
        
        let isMatch = false;

        // First, filter by the taste
        switch (tasteFilter) {
          case 'Sweet':
            isMatch = ingredients.some(ingredient => ingredient && (ingredient.toLowerCase().includes('simple syrup') ||
              ingredient.toLowerCase().includes('grenadine') || 
              ingredient.toLowerCase().includes('sugar') || 
              ingredient.toLowerCase().includes('condensed milk') ||
              ingredient.toLowerCase().includes('syrup') ||
              ingredient.toLowerCase().includes('sirup') ||
              ingredient.toLowerCase().includes('irish cream') ||
              ingredient.toLowerCase().includes('powdered sugar') ||
              ingredient.toLowerCase().includes('coconut milk')));
            break;
          case 'Sour':
            isMatch = ingredients.some(ingredient => ingredient && (ingredient.toLowerCase().includes('lemon juice') ||
              ingredient.toLowerCase().includes('lime juice') ||
              ingredient.toLowerCase().includes('lemon')));
            break;
          case 'Spicy':
            isMatch = ingredients.some(ingredient => ingredient && (ingredient.toLowerCase().includes('tabasco') || 
              ingredient.toLowerCase().includes('jalapeno')));
            break;
          case 'Fruity':
            isMatch = ingredients.some(ingredient => ingredient && 
              (['cherry', 'grenadine', 'abricot', 'strawberry', 'passion fruit', 'apple', 'apple juice', 'mango', 
              'mango juice', 'grapefruit', 'grapefruit juice', 'grape juice', 'cranberry', 'orange juice']
              .some(fruit => ingredient.toLowerCase().includes(fruit))));
            break;
          case 'Bitter':
            isMatch = ingredients.some(ingredient => ingredient && (ingredient.toLowerCase().includes('bitters') ||
              ingredient.toLowerCase().includes('campari')));
            break;
          case 'Herbal':
            isMatch = ingredients.some(ingredient => ingredient && (ingredient.toLowerCase().includes('mint') ||
              ingredient.toLowerCase().includes('basil') ||
              ingredient.toLowerCase().includes('rosemary')));
            break;
        }

        // If the type is Mocktail, ensure that it's a non-alcoholic drink
        const isMocktail = typeFilter === 'Mocktail' && !cocktail.strAlcoholic.includes("Alcoholic");

        // Combine both the taste and Mocktail conditions
        return (isMatch && (typeFilter !== 'Mocktail' || isMocktail));
      });
    }

    // If typeFilter is Mocktail but no taste filter is applied, we can filter out the alcoholic drinks
    if (typeFilter === 'Mocktail' && !tasteFilter) {
      filtered = filtered.filter((cocktail) => !cocktail.strAlcoholic.includes("Alcoholic"));
    }

    setFilteredCocktails(filtered);
    setFilterModalVisible(false);
  };
  
  const resetFilters = () => {
    setSpiritFilter('');
    setTasteFilter('');
    setTypeFilter('');
    setFilteredCocktails(cocktails);
  };

  const navigateToDetails = async (cocktail) => {
    try {
      const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktail.idDrink}`);
      navigation.navigate('CocktailDetails', { cocktail: response.data.drinks[0] });
    } catch (error) {
      console.error('Error fetching cocktail details:', error);
    }
  };

  return (
    <ImageBackground source={require('./assets/popular11.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <Text style={styles.searchTitle}>Search Cocktails</Text>
      <View style={styles.container}>
        {/* Added Title */}
       

        <View style={styles.searchBar}>
          <TouchableOpacity onPress={() => {
            handleSearch();
            Keyboard.dismiss(); // Dismiss the keyboard when the search button is pressed
          }} style={styles.searchButton}>
            <FontAwesome name="search" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Search...."
            placeholderTextColor="black" 
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => { // Handles Enter key press
              handleSearch();
              Keyboard.dismiss();
            }}
          />
          <View style={styles.clearRandomWrapper}>
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIconWrapper}>
                <FontAwesome name="times" size={24} color="black" style={styles.icon} />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={handleRandom} style={styles.randomButton}>
              <FontAwesome name="random" size={24} color="black" style={styles.icon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.filterButtonNearRandom}>
            <FontAwesome name="filter" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
        </View>
        
        <Modal 
          isVisible={isFilterModalVisible} 
          onBackdropPress={() => setFilterModalVisible(false)}
          style={styles.modal}
          animationIn="slideInUp" 
          animationOut="slideOutDown" 
          backdropOpacity={0.5}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>Filter Cocktails</Text>

              {/* Type Filter Buttons */}
              <Text style={styles.filterLabel}>Type</Text>
              <View style={styles.buttonGroup}>
                {types.map((type) => (
                  <TouchableOpacity 
                    key={type} 
                    onPress={() => setTypeFilter(typeFilter === type ? '' : type)} 
                    style={[styles.filterButton, typeFilter === type && styles.activeFilter]}
                  >
                    <Text style={styles.filterButtonText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Spirit Filter Buttons */}
              {typeFilter !== 'Mocktail' && (
                <>
                  <Text style={styles.filterLabel}>Spirit</Text>
                  <View style={styles.buttonGroup}>
                    {spirits.map((spirit) => (
                      <TouchableOpacity 
                        key={spirit} 
                        onPress={() => setSpiritFilter(spiritFilter === spirit ? '' : spirit)} 
                        style={[styles.filterButton, spiritFilter === spirit && styles.activeFilter]}
                      >
                        <Text style={styles.filterButtonText}>{spirit}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {/* Taste Filter Buttons */}
              <Text style={styles.filterLabel}>Taste</Text>
              <View style={styles.buttonGroup}>
                {tastes.map((taste) => (
                  <TouchableOpacity 
                    key={taste} 
                    onPress={() => setTasteFilter(tasteFilter === taste ? '' : taste)} 
                    style={[styles.filterButton, tasteFilter === taste && styles.activeFilter]}
                  >
                    <Text style={styles.filterButtonText}>{taste}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Filter Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={applyFilters} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={resetFilters} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>

        <FlatList
          key="flatlist-2" // Added key prop to fix numColumns error
          data={filteredCocktails}
          keyExtractor={(item) => item.idDrink ? item.idDrink.toString() : `unknown-key-${Math.random()}`} // Ensure key is always unique
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigateToDetails(item)} style={styles.cocktailCard}>
              <Image source={{ uri: item.strDrinkThumb }} style={styles.cocktailImage} />
              <Text style={styles.cocktailName}>{item.strDrink}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noResultsText}>No cocktails found</Text>}
          contentContainerStyle={styles.flatListContent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%', // Ensures the background image spans the full width
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Darken the background
  },
  container: {
    flex: 1,
    padding: 16,
    
  },
  searchTitle: { // New Style for the Title
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 69,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    height: 45,
    width: '100%', // Make it full width
    borderWidth: 1.5,
    borderRadius: 7,
    borderColor: 'black',
    backgroundColor: 'transparent',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 16,
    borderRadius: 8,
  },
  searchButton: {
    padding: 5,
  },
  filterButtonNearRandom: {
    padding: 10,
    marginBottom: 7,
    borderRadius: 5,
    backgroundColor: 'transparent', 
    height: 40,
  },
  icon: {
    marginHorizontal: 8,
  },
  clearRandomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    position: 'relative',
    left: 40,
    width: 70, // Adjust width to accommodate icons
  },
  clearIconWrapper: {
    position: 'absolute',
    right: 58,
    top: -2,
    marginRight: 10,
  },
  randomButton: {
    marginLeft: 1,
  },
  modal: {
    justifyContent: 'center',
    margin: 0,
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingBottom: 10,
  },
  modalContent: {
    paddingHorizontal: 14,
    paddingTop: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  filterButton: {
    padding: 10,
    marginBottom: 7,
    borderRadius: 5,
    backgroundColor: '#ff8c00',
    marginRight: 5,
    marginLeft: 5,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeFilter: {
    backgroundColor: '#78909C',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#78909C',
    padding: 10,
    borderRadius: 7,
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
  },
  cocktailCard: {
    width: '48%', 
    marginBottom: 15, 
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Ensures visibility against the background
  },
  cocktailImage: {
    width: '100%', 
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  cocktailName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Spread out items evenly
    paddingHorizontal: 5,
  },
});

export default FindDrinks;
