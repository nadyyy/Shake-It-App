import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { firestore } from './firebaseConfig';
import {
  doc,
  updateDoc,
  setDoc,
  getDocs,
  collection,
} from 'firebase/firestore';

export default function AddCocktail() {
  const [cocktailName, setCocktailName] = useState('');
  const [type, setType] = useState('Cocktail');
  const [recipe, setRecipe] = useState([
    { number: '', ingredient: '' },
    { number: '', ingredient: '' },
  ]);
  const [instructions, setInstructions] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [open, setOpen] = useState(false);

  const addIngredientRow = () => {
    if (recipe.length < 10) {
      setRecipe([...recipe, { number: '', ingredient: '' }]);
    }
  };

  const deleteIngredientRow = (index) => {
    if (recipe.length > 2) {
      const updatedRecipe = recipe.filter((_, i) => i !== index);
      setRecipe(updatedRecipe);
    }
  };

  const handleRecipeChange = (index, field, value) => {
    const updatedRecipe = [...recipe];
    updatedRecipe[index][field] = value;
    setRecipe(updatedRecipe);
  };

 
const generateUniqueId = async () => {
  try {
    const snapshot = await getDocs(collection(firestore, 'cocktails'));
    const allIds = snapshot.docs
      .map((doc) => doc.data().uniqueId)
      .filter((id) => typeof id === 'number');
    const maxId = allIds.length > 0 ? Math.max(...allIds) : 49; // Start from 50
    return maxId + 1;
  } catch (error) {
    console.error("Error fetching IDs: ", error);
    return 50; 
  }
};


const saveCocktailToFirestore = async () => {
  if (!cocktailName.trim()) {
    alert("Please enter the cocktail name.");
    return;
  }

  const validIngredients = recipe.filter(
    (item) => item.number.trim() && item.ingredient.trim()
  );
  if (validIngredients.length < 2) {
    alert("Please fill in at least 2 rows of ingredients with quantities.");
    return;
  }

  if (instructions.trim().length === 0) {
    alert("Please enter at least one character in the instructions.");
    return;
  }

  try {
    const uniqueId = await generateUniqueId(); 
    
    // Generate document ID based on the cocktail name
    const documentId = cocktailName
      .toLowerCase()
      .replace(/\s+/g, '-')   // Replaces spaces with hyphens
      .replace(/[^a-z0-9-]/g, ''); // Removes non-alphanumeric characters

    const cocktailDocRef = doc(firestore, 'cocktails', documentId);

    // Check if the cocktail name already exists in Firestore
    const existingDoc = await getDocs(collection(firestore, 'cocktails'));
    const nameExists = existingDoc.docs.some(
      (doc) => doc.data().name === cocktailName
    );

    if (nameExists) {
      alert("Cocktail with this name already exists. Please choose another name.");
      return;
    }

    // Save the document with the generated ID
    await setDoc(cocktailDocRef, {
      uniqueId: uniqueId,
      name: cocktailName,
      type: type,
      recipe: recipe,
      instructions: instructions,
    });

    alert("Cocktail saved successfully!");

    // Reset form
    setCocktailName('');
    setType('Cocktail');
    setRecipe([
      { number: '', ingredient: '' },
      { number: '', ingredient: '' },
    ]);
    setInstructions('');
    setResetKey((prevKey) => prevKey + 1);
  } catch (e) {
    console.error("Error adding cocktail: ", e);
    alert("Error adding cocktail: " + e.message);
  }
};



  const renderItem = ({ item }) => {
    switch (item.id) {
      case 'cocktailName':
        return (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cocktail Name:</Text>
            <TextInput
              style={styles.input}
              value={cocktailName}
              onChangeText={setCocktailName}
              placeholder="Enter cocktail name"
            />
          </View>
        );
      case 'type':
        return (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type:</Text>
            <DropDownPicker
              open={open}
              value={type}
              items={[
                { label: 'Cocktail', value: 'Cocktail' },
                { label: 'Mocktail', value: 'Mocktail' },
                { label: 'Shot', value: 'Shot' },
              ]}
              setOpen={setOpen}
              setValue={setType}
              containerStyle={styles.dropdownContainer}
              style={styles.dropdown}
            />
          </View>
        );
      case 'recipe':
        return (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipe (in oz):</Text>
            {recipe.map((item, index) => (
              <View key={index} style={styles.recipeRow}>
                <TextInput
                  style={[styles.recipeInput, styles.quantityInput]}
                  value={item.number}
                  onChangeText={(text) => handleRecipeChange(index, 'number', text)}
                  placeholder="Quantity"
                  keyboardType="numeric"
                  placeholderTextColor="#B0B0B0"
                />
                <TextInput
                  style={[styles.recipeInput, styles.ingredientInput]}
                  value={item.ingredient}
                  onChangeText={(text) => handleRecipeChange(index, 'ingredient', text)}
                  placeholder="Ingredient"
                  placeholderTextColor="#B0B0B0"
                />
                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    recipe.length <= 2 && { backgroundColor: 'red' },
                  ]}
                  onPress={() => deleteIngredientRow(index)}
                  disabled={recipe.length <= 2}
                >
                  <Ionicons name="trash" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            {recipe.length < 10 && (
              <TouchableOpacity style={styles.addButton} onPress={addIngredientRow}>
                <Ionicons name="add" size={24} color="white" />
                <Text style={styles.addButtonText}>Add Ingredient</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      case 'instructions':
        return (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instructions:</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Enter instructions"
              multiline={true}
              numberOfLines={4}
            />
          </View>
        );
      case 'submit':
        return (
          <View style={styles.submitButton}>
            <Button title="Submit Cocktail" onPress={saveCocktailToFirestore} />
          </View>
        );
      default:
        return null;
    }
  };

  const data = [
    { id: 'cocktailName' },
    { id: 'type' },
    { id: 'recipe' },
    { id: 'instructions' },
    { id: 'submit' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Submit Your Recipe</Text>
      <FlatList
        key={resetKey}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollView}
      />
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 20,
    paddingVertical: 35,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    marginTop: 2,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 10,
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  recipeInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginRight: 10,
  },
  quantityInput: {
    flex: 0.3,  
  },
  ingredientInput: {
    flex: 0.7,  
  },
  dropdownContainer: {
    height: 40,
    width: 190,
  },
  dropdown: {
    backgroundColor: '#f4f4f4',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff8c00',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 8,
    marginLeft: 10,
  },
  submitButton: {
    marginTop: 5,
    paddingBottom: 200,
  },
});
