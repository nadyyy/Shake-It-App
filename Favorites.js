import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground, Image, ActivityIndicator } from 'react-native';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from './firebaseConfig'; 


const seasonalCocktails = [
  { id: '21', name: 'Winter Wonderland', image: require('./assets/Seasonal1.jpg'), recipe: '1 oz Vodka, 1 oz Cranberry juice, 0.5 oz Lime juice', isSeasonal: true, instructions: 'Mix ingredients and serve chilled.' },
  { id: '22', name: 'Spiced Apple Cider', image: require('./assets/Seasonal2.jpg'), recipe: '1 oz Rum, 4 oz Apple cider, Cinnamon stick', isSeasonal: true, instructions: 'Heat cider, mix with rum and garnish with cinnamon.' },
  { id: '23', name: 'Mistletoe Martini', image: require('./assets/Seasonal3.jpg'), recipe: '2 oz Gin, 1 oz Vermouth, Olive', isSeasonal: true, instructions: 'Stir with ice and strain into a chilled glass.' },
  { id: '24', name: 'Frosty Fizz', image: require('./assets/Seasonal4.jpg'), recipe: '1 oz Champagne, 0.5 oz Elderflower liqueur, Lemon twist', isSeasonal: true, instructions: 'Pour champagne, add elderflower and garnish with lemon.' },
  { id: '25', name: 'Gingerbread Mule', image: require('./assets/Seasonal5.jpg'), recipe: '2 oz Vodka, 4 oz Ginger beer, Lime juice', isSeasonal: true, instructions: 'Mix vodka, ginger beer, and lime juice. Serve in a mule cup.' },
  { id: '26', name: 'Holiday Punch', image: require('./assets/Seasonal6.jpg'), recipe: '1 oz Brandy, 4 oz Orange juice, 2 oz Cranberry juice', isSeasonal: true, instructions: 'Mix ingredients in a punch bowl and serve over ice.' },
  { id: '27', name: 'Cranberry Cosmo', image: require('./assets/Seasonal7.jpg'), recipe: '1 oz Vodka, 1 oz Triple sec, 0.5 oz Cranberry juice', isSeasonal: true, instructions: 'Shake ingredients with ice and strain into a chilled glass.' },
  { id: '28', name: 'Snowy Night', image: require('./assets/Seasonal8.jpg'), recipe: '2 oz Bourbon, 1 oz Honey syrup, Lemon twist', isSeasonal: true, instructions: 'Mix bourbon and honey syrup. Garnish with lemon twist.' },
];

const Favorite = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [cocktailDetails, setCocktailDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const db = getFirestore(firebaseApp);
  const auth = getAuth();
  const user = auth.currentUser;

  const fetchCocktailDetails = async (idDrink) => {
    try {
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`);
      const text = await response.text();

      if (!response.ok) {
        console.error("API returned an error response:", text);
        setError("Failed to fetch data from API.");
        return null;
      }

      try {
        const data = JSON.parse(text);
        if (data.drinks && data.drinks.length > 0) {
          return data.drinks[0];
        } else {
          return null;
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError, "Raw response:", text);
        setError("Error parsing cocktail details from the API.");
        return null;
      }
    } catch (fetchError) {
      console.error("Error fetching cocktail details:", fetchError);
      setError("Error fetching cocktail details from the API.");
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'USERSinfo', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          if (userData.Favorites && userData.Favorites.length > 0) {
            setFavorites(userData.Favorites);
          } else {
            setFavorites([]);
          }
        } else {
          console.log('No user data found.');
          setError('No user data found.');
        }
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
      setError('No authenticated user.');
    }
  }, [user, db]);

  useEffect(() => {
    const fetchCocktails = async () => {
      if (favorites.length > 0) {
      
        const reversedFavorites = [...favorites].reverse();

        
        const fetchedCocktails = await Promise.all(
          reversedFavorites.map((idDrink) => fetchCocktailDetails(idDrink))
        );
        const validCocktails = fetchedCocktails.filter(cocktail => cocktail !== null);

        
        const seasonalMap = seasonalCocktails.reduce((map, cocktail) => {
          map[cocktail.id] = cocktail;
          return map;
        }, {});

        
        const mergedList = reversedFavorites.map(favId => {
      
          const seasonal = seasonalMap[favId];
          if (seasonal) return seasonal;

          const apiCocktail = validCocktails.find(c => c.idDrink === favId);
          return apiCocktail || null;
        }).filter(item => item !== null);

        setCocktailDetails(mergedList);
      } else {
        setCocktailDetails([]);
      }
      setLoading(false);
    };

    fetchCocktails();
  }, [favorites]);

  const renderFavorite = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => {
        if (item.id >= 21 && item.id <= 28) {
          navigation.navigate('SpDetails', { sp: item });
        } else {
          navigation.navigate('CocktailDetails', { cocktail: item });
        }
      }}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image || { uri: item.strDrinkThumb }} style={styles.favoriteImage} />
      </View>
      <Text style={styles.favoriteName}>{item.name || item.strDrink}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#FFA500" style={styles.loading} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('./assets/Seasonal-background1.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <Text style={styles.title}>Favorites</Text>
      <View style={styles.container}>
        {cocktailDetails.length > 0 ? (
          <FlatList
            data={cocktailDetails}
            renderItem={renderFavorite}
            keyExtractor={(item) => item.id || item.idDrink}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
          />
        ) : (
          <Text style={styles.noFavoritesText}>No favorites yet!</Text>
        )}
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
  title: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 70,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    marginTop:25,
  },
  columnWrapper: {
    justifyContent: 'space-around',
  },
  favoriteItem: {
    marginBottom: 20,
    width: '45%',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 10,
  },
  favoriteImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  favoriteName: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  noFavoritesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#f00',
    textAlign: 'center',
  },
});

export default Favorite;
