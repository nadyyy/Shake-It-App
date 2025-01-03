import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [cocktailOfTheDay, setCocktailOfTheDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCocktailOfTheDay = async () => {
      try {
        const storedCocktail = await AsyncStorage.getItem('cocktailOfTheDay');
        const storedDate = await AsyncStorage.getItem('cocktailDate');
        const currentDate = new Date().toDateString();

        if (storedCocktail && storedDate === currentDate) {
          setCocktailOfTheDay(JSON.parse(storedCocktail));
        } else {
          const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
          const data = await response.json();

          if (data.drinks && data.drinks.length > 0) {
            const selectedCocktail = data.drinks[0];
            setCocktailOfTheDay(selectedCocktail);

            await AsyncStorage.setItem('cocktailOfTheDay', JSON.stringify(selectedCocktail));
            await AsyncStorage.setItem('cocktailDate', currentDate);
          }
        }
      } catch (error) {
        console.error('Error fetching cocktail of the day:', error);
      } finally {
        setLoading(false);
      }
    };

    getCocktailOfTheDay();
  }, []);

  return (
    <ImageBackground
      source={require('./assets/popular17.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Shake it Till You Make it</Text>

        {/* Cocktail of the Day */}
        <View style={styles.cocktailOfTheDayContainer}>
          <Text style={styles.cocktailOfTheDayTitle}>Daily Cocktail</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#FFA500" />
          ) : cocktailOfTheDay ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('CocktailDetails', { cocktail: cocktailOfTheDay })}
              style={styles.cocktailCard}
            >
              <Image
                source={{ uri: cocktailOfTheDay.strDrinkThumb }}
                style={styles.cocktailImage}
              />
              <Text style={styles.cocktailName}>{cocktailOfTheDay.strDrink}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.errorText}>Unable to fetch Cocktail of the Day</Text>
          )}
        </View>


        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Popular Cocktails')}
          >
            <Image source={require('./assets/pop.jpg')} style={styles.cardImage} />
            <Text style={styles.cardText}>Popular Cocktails</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Seasonal Cocktails')}
          >
            <Image source={require('./assets/christmas.jpg')} style={styles.cardImage} />
            <Text style={styles.cardText}>Seasonal Cocktails</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Search Cocktails')}
          >
            <Image source={require('./assets/popular3.jpg')} style={styles.cardImage} />
            <Text style={styles.cardText}>Search Cocktails</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Check Ingredients')}
          >
            <Image source={require('./assets/ingredientPic.jpg')} style={styles.cardImage} />
            <Text style={styles.cardText}>Check Ingredients</Text>
          </TouchableOpacity>
        </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  container: {
    marginTop: 55,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 65,
    textAlign: 'center',
    marginLeft: 24,
  },
  cocktailOfTheDayContainer: {
    marginBottom: -50,
    alignItems: 'center',
  },
  cocktailOfTheDayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 10,
  },
  cocktailCard: {
    width: 230, 
    height: 320, 
    alignItems: 'center',
    borderRadius: 10, 
    padding: 10,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
  },
  cocktailImage: {
    width: 170,
    height: 170,
    borderRadius: 15, 
    marginBottom: 10,
  },
  cocktailName: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: 'white',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  card: {
    marginHorizontal: 20, 
    alignItems: 'center',
    width: 170, 
    height: 220, 
    
  },
  cardImage: {
    width: 160, 
    height: 140, 
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: {
    color: 'white', 
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


export default HomeScreen;
