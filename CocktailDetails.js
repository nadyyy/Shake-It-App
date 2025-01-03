import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  setDoc,
  increment,
  getDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firestore } from './firebaseConfig';
import { AntDesign } from '@expo/vector-icons';


const unitConversion = {
  oz: 1,
  ml: 30, 
  cl: 3,  
};

const CocktailDetails = ({ route }) => {
  const { cocktail } = route.params;
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [servings, setServings] = useState(1);
  const [unit, setUnit] = useState('oz');
  const [userId, setUserId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRating, setIsRating] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        subscribeToFavorites(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const subscribeToFavorites = (userId) => {
    const userDocRef = doc(firestore, 'USERSinfo', userId);
    onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const favoriteCocktails = userData.Favorites || [];
        setIsFavorite(favoriteCocktails.includes(cocktail.idDrink));
      }
    });
  };

  useEffect(() => {
    const cocktailId = cocktail.idDrink;
    if (!cocktailId) return;

    const ratingDocRef = doc(firestore, 'Ratings', cocktailId);

    const unsubscribe = onSnapshot(ratingDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const ratingsData = docSnapshot.data().ratings;
        const totalRatings = Object.values(ratingsData).reduce((acc, count) => acc + count, 0);
        const weightedSum = Object.entries(ratingsData).reduce(
          (acc, [rating, count]) => acc + parseInt(rating) * count,
          0
        );
        const avg = totalRatings > 0 ? (weightedSum / totalRatings).toFixed(1) : 0;
        setAverageRating(avg);
      } else {
        setAverageRating(0);
      }
    });

    return () => unsubscribe();
  }, [cocktail.idDrink]);

  const renderStar = (index) => (
    <TouchableOpacity key={index} onPress={() => isRating && setRating(index + 1)}>
      <Ionicons
        name={index < rating ? 'star' : 'star-outline'}
        size={24}
        color={index < rating ? '#FFD700' : '#A9A9A9'}
      />
    </TouchableOpacity>
  );

  const convertIngredient = (amount) => {
    const convertedAmount = parseFloat(amount) * unitConversion[unit] * servings;
    return convertedAmount.toFixed(1);
  };

  const handleAddToFavorites = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    const cocktailId = cocktail.idDrink;
    if (!cocktailId) {
      console.error("Cocktail ID is missing or undefined!");
      Alert.alert('Error', 'Cocktail ID is missing!');
      return;
    }

    const userDocRef = doc(firestore, 'USERSinfo', userId);

    try {
      if (isFavorite) {
        await updateDoc(userDocRef, {
          Favorites: arrayRemove(cocktailId),
        });
        setIsFavorite(false);
        Alert.alert('Success', 'Cocktail removed from your favorites!');
      } else {
        await updateDoc(userDocRef, {
          Favorites: arrayUnion(cocktailId),
        });
        setIsFavorite(true);
        Alert.alert('Success', 'Cocktail added to your favorites!');
      }
    } catch (error) {
      console.error("Error updating favorites: ", error);
      Alert.alert('Error', 'Something went wrong while updating favorites.');
    }
  };

  const handleRatingTap = () => {
    setIsRating(true);
  };

  const handleSaveRating = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    const cocktailId = cocktail.idDrink;
    if (!cocktailId) {
      console.error("Cocktail ID is missing or undefined!");
      Alert.alert('Error', 'Cocktail ID is missing!');
      return;
    }

    const ratingValue = rating;
    const cocktailDocRef = doc(firestore, 'Ratings', cocktailId);

    try {
      const docRef = doc(firestore, 'Ratings', cocktailId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(cocktailDocRef, {
          [`ratings.${ratingValue}`]: increment(1),
        });
      } else {
        await setDoc(cocktailDocRef, {
          ratings: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          },
        });

        await updateDoc(cocktailDocRef, {
          [`ratings.${ratingValue}`]: increment(1),
        });
      }

      setIsRating(false);
      Alert.alert('Success', 'Rating saved successfully!');
    } catch (error) {
      console.error("Error saving rating to Firestore: ", error);
      Alert.alert('Error', 'Something went wrong while saving your rating.');
    }
  };

  const handleCancelRating = () => {
    setIsRating(false);
  };


  const parseIngredients = (cocktail) => {
    const ingredients = [];

    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];

      if (ingredient) {
        ingredients.push({
          ingredient,
          measure: measure ? measure.trim() : '',
        });
      }
    }

    return ingredients;
  };

  const ingredients = parseIngredients(cocktail);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cocktail name */}
      <Text style={styles.title}>{cocktail.strDrink}</Text>
      <Text style={styles.subTitle}>{cocktail.strAlcoholic}</Text>

      {/* Cocktail image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: cocktail.strDrinkThumb }} style={styles.image} />
      </View>

 
      <TouchableOpacity style={styles.favoriteButton} onPress={handleAddToFavorites}>
        <AntDesign
          name={isFavorite ? 'heart' : 'hearto'}
          size={24}
          color={isFavorite ? '#FF6347' : 'black'}
        />
        <Text style={styles.favoriteButtonText}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>

      <View style={styles.ratingContainer}>
        <Text style={styles.averageRatingText}> Rating:  
          <Text style={styles.averageRatingColoredText}>  {averageRating} out of 5</Text>
          
        </Text>
        <Text style={styles.yourRatingText}>Your Rating</Text>

       
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, index) => renderStar(index))}
        </View>

        {isRating ? (
          <View style={styles.ratingActions}>
            <TouchableOpacity onPress={handleSaveRating} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Rating</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelRating} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.tapToRateText} onPress={handleRatingTap}>
            Tap to rate
          </Text>
        )}
      </View>

      {/* Ingredients Section */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      <View style={styles.servingsContainer}>
        <View style={styles.servingsGroup}>
          <Text style={styles.servingsTitle}>Servings:</Text>
          <View style={styles.servingOptions}>
            {[1, 2, 4, 8].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.servingButton, servings === option && styles.activeServingButton]}
                onPress={() => setServings(option)}
              >
                <Text style={styles.servingButtonText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Unit Picker */}
        <View style={styles.unitContainer}>
          <Picker
            selectedValue={unit}
            onValueChange={(itemValue) => setUnit(itemValue)}
            style={styles.unitPicker}
            mode="dropdown"
            accessibilityLabel="Select unit of measurement"
          >
            <Picker.Item label="oz" value="oz" />
            <Picker.Item label="ml" value="ml" />
            <Picker.Item label="cl" value="cl" />
          </Picker>
        </View>
      </View>

      {/* Ingredients list */}
      <View style={styles.ingredientsContainer}>
        {ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              {ingredient.measure ? `${convertIngredient(ingredient.measure)} ${unit} ` : ''}
              {ingredient.ingredient}
            </Text>
          ))
        ) : (
          <Text style={styles.noIngredients}>No ingredients found</Text>
        )}
      </View>

      {/* Instructions Section */}
      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.instructions}>{cocktail.strInstructions}</Text>
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
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 45,
    color: '#333',
  },
  subTitle: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: '95%',
    height: 370,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 18,
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  favoriteButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  ratingContainer: {
    alignItems: 'center',
    marginVertical: 6,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  averageRatingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  averageRatingColoredText: {
    color: '#FF6347',
  },
  averageRatingBlackText: {
    color: '#000',
  },
  yourRatingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tapToRateText: {
    color: '#888',
    marginTop: 4,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  ratingActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 12,
    color: '#333',
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  servingsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginRight: 8,
  },
  servingOptions: {
    flexDirection: 'row',
  },
  servingButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#ddd',
  },
  activeServingButton: {
    backgroundColor: '#FF6347',
  },
  servingButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  unitContainer: {
    borderRadius: 8,
    marginTop: 4,
  },
  unitPicker: {
    bottom: 92,
    height: 35,
    width: 90,
    color: '#333',
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowColor: 'transparent',
    elevation: 0,
  },
  ingredientsContainer: {
    marginTop: 25,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  ingredient: {
    fontSize: 16,
    marginVertical: 4,
    color: '#555',
  },
  noIngredients: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
    marginTop: 8,
   
  },
});

export default CocktailDetails;