import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { firestore } from './firebaseConfig'; // Your Firestore config

const unitConversion = {
  oz: 1,
  ml: 30,
  cl: 3,
};

const Pdetails = ({ route }) => {
  const { cocktail } = route.params;
  const [servings, setServings] = useState(1);
  const [unit, setUnit] = useState('ml');
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        checkIfFavorite(user.uid);
      }
    });

    fetchAverageRating();

    return () => unsubscribe();
  }, []);

  // Check if cocktail is a favorite
  const checkIfFavorite = async (uid) => {
    const userRef = doc(firestore, 'USERSinfo', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const favorites = userSnap.data().Favorites || [];
      setIsFavorite(favorites.includes(cocktail.id));
    }
  };

  // Toggle Favorite
  const toggleFavorite = async () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to save favorites.');
      return;
    }
  
    const userRef = doc(firestore, 'USERSinfo', userId);
    try {
      if (isFavorite) {
        // Remove from favorites using uniqueId
        await updateDoc(userRef, { Favorites: arrayRemove(cocktail.uniqueId) });
        setIsFavorite(false);
      } else {
        // Add to favorites using uniqueId
        await updateDoc(userRef, { Favorites: arrayUnion(cocktail.uniqueId) });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };
  

  // Fetch Average Rating
  const fetchAverageRating = async () => {
    const ratingRef = doc(firestore, 'Ratings', cocktail.id);
    const ratingSnap = await getDoc(ratingRef);
    if (ratingSnap.exists()) {
      const ratings = ratingSnap.data().ratings;
      const totalRatings = Object.values(ratings).reduce((a, b) => a + b, 0);
      const weightedSum = Object.entries(ratings).reduce(
        (acc, [rate, count]) => acc + parseInt(rate) * count,
        0
      );
      const avg = totalRatings > 0 ? (weightedSum / totalRatings).toFixed(1) : 0;
      setAverageRating(avg);
    }
  };

  // Save User Rating
  const saveRating = async (selectedRating) => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to rate.');
      return;
    }

    const ratingRef = doc(firestore, 'Ratings', cocktail.id);
    try {
      await updateDoc(ratingRef, {
        [`ratings.${selectedRating}`]: increment(1),
      });
      setRating(selectedRating);
      fetchAverageRating();
      Alert.alert('Success', 'Your rating has been saved!');
    } catch {
      await setDoc(ratingRef, { ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
      await updateDoc(ratingRef, { [`ratings.${selectedRating}`]: increment(1) });
      setRating(selectedRating);
      fetchAverageRating();
    }
  };

  const convertIngredient = (amount) => {
    const converted = parseFloat(amount) * unitConversion[unit] * servings;
    return converted.toFixed(1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{cocktail.name}</Text>

      <View style={styles.imageContainer}>
        <Image
          source={require('./assets/popular1.jpg')}
          style={styles.image}
        />
      </View>

      {/* Favorite Button */}
      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <AntDesign
          name={isFavorite ? 'heart' : 'hearto'}
          size={24}
          color={isFavorite ? '#FF6347' : 'black'}
        />
        <Text style={styles.favoriteButtonText}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>

      {/* Rating Section */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Rating: {averageRating} out of 5</Text>
        <Text style={styles.yourRatingText}>Your Rating</Text>
        <View style={styles.starContainer}>
          {[...Array(5)].map((_, index) => (
            <Ionicons
              key={index}
              name={index < rating ? 'star' : 'star-outline'}
              size={24}
              color={index < rating ? '#FFD700' : '#A9A9A9'}
              onPress={() => saveRating(index + 1)}
            />
          ))}
        </View>
        <Text style={styles.tapToRate}>Tap to rate</Text>
      </View>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      <View style={styles.servingsContainer}>
        <Text style={styles.servingsText}>Servings:</Text>
        <View style={styles.servingOptions}>
          {[1, 2, 4, 8].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.servingButton,
                servings === option && styles.activeServingButton,
              ]}
              onPress={() => setServings(option)}
            >
              <Text style={styles.servingButtonText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Picker
          selectedValue={unit}
          onValueChange={(value) => setUnit(value)}
          style={styles.unitPicker}
        >
          <Picker.Item label="oz" value="oz" />
          <Picker.Item label="ml" value="ml" />
          <Picker.Item label="cl" value="cl" />
        </Picker>
      </View>

      <View style={styles.ingredientsContainer}>
        {cocktail.recipe.map((item, index) => (
          <Text key={index} style={styles.ingredientText}>
            {convertIngredient(item.number)} {unit} {item.ingredient}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.instructions}>{cocktail.instructions}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 15, marginTop:45, },
  imageContainer: { alignItems: 'center', marginBottom: 16 },
  image: { width: '95%',
    height: 370,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,},
  favoriteButton: { flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#f0f0f0', 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2, },
  favoriteButtonText: {  color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,},
  ratingContainer: {  alignItems: 'center',
    marginVertical: 6,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,},
  ratingText: {  fontSize: 16,
    fontWeight: '600',
    color: '#555', },
  yourRatingText: {  fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,marginBottom:5,},
  starContainer: { flexDirection: 'row', justifyContent: 'center', marginTop:4 },
  tapToRate: { textAlign: 'center', color: '#888', marginTop: 8, textDecorationLine: 'underline' },
  sectionTitle: {fontSize: 20,
    fontWeight: '700',
    marginVertical: 12,
    color: '#333',},
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  servingsText: { fontSize: 16, fontWeight: '600', marginRight: 8,  color: '#555',},
  servingOptions: { flexDirection: 'row', marginRight: 8 },
  servingButton: { paddingVertical: 13, 
    paddingHorizontal: 16,
    borderRadius: 7, 
    marginHorizontal: 4,
    backgroundColor: '#ddd', },
  activeServingButton: { backgroundColor: '#FF6347' },
  servingButtonText: { fontSize: 16,
    color: '#fff',
    fontWeight: '600', },
  unitPicker: { bottom: 90,
    height: 35,
    width: 90,
    color: '#333',
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowColor: 'transparent',
    elevation: 0,},
  ingredientsContainer: {  marginTop: 25,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1, },
  ingredientText: { fontSize: 16,
    marginVertical: 4,
    color: '#555',},
  instructions: { fontSize: 16,
    lineHeight: 22,
    color: '#555',
    marginTop: 12, },
});

export default Pdetails;
