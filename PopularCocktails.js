import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, ImageBackground, Image } from 'react-native';

const cocktailIds = [
  "11416", "178323", "17181", "11009", "11005", "11003", "17212", 
  "11004", "11001", "17196", "11007", "11006", "17253", "11288", "17197"
];

const PopularCocktails = ({ navigation }) => {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCocktailDetails = async () => {
      try {
        const cocktailDetailsPromises = cocktailIds.map(async (id) => {
          const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
          const data = await response.json();
          return data.drinks ? data.drinks[0] : null;
        });

        const cocktailsData = await Promise.all(cocktailDetailsPromises);
        setCocktails(cocktailsData.filter((cocktail) => cocktail !== null));
      } catch (error) {
        console.error("Error fetching cocktail details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCocktailDetails();
  }, []);

  const renderCocktailItem = ({ item }) => {
    if (!item || !item.strDrink) {
      return null;
    }
  
    return (
      <TouchableOpacity
        style={styles.cocktailItem}
        onPress={() => navigation.navigate('CocktailDetails', { cocktail: item })}
      >
        <Image source={{ uri: item.strDrinkThumb }} style={styles.cocktailImage} />
        <Text style={styles.cocktailText}>
          {item.strDrink || 'Unknown Cocktail'}
        </Text>
      </TouchableOpacity>
    );
  };
  
  if (loading) {
    return <ActivityIndicator size="large" color="#FFA500" style={styles.loader} />;
  }

  return (
    <ImageBackground source={require('./assets/home-background1.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Popular Cocktails</Text>
        <FlatList
          data={cocktails}
          renderItem={renderCocktailItem}
          keyExtractor={(item) => item.idDrink ? item.idDrink.toString() : 'unknown-key'}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    marginTop: 50,
  },
  columnWrapper: {
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  cocktailItem: {
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  cocktailImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  cocktailText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PopularCocktails;
