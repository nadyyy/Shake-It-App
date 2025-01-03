import React, { useState, useEffect } from 'react';  
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Button, 
  Image,
  ImageBackground 
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const RecommendedCocktails = () => {
  const [cocktails, setCocktails] = useState([]);
  const [filteredCocktails, setFilteredCocktails] = useState([]);
  const [spiritAnswer, setSpiritAnswer] = useState('');
  const [tasteAnswer, setTasteAnswer] = useState('');
  const [typeAnswer, setTypeAnswer] = useState('');
  const [caffeineAnswer, setCaffeineAnswer] = useState('');
  const [glasswareAnswer, setGlasswareAnswer] = useState('');
  const [dietaryAnswer, setDietaryAnswer] = useState('');
  const [seasonAnswer, setSeasonAnswer] = useState('');
  const navigation = useNavigation(); // Initialize navigation

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

  const applyRecommendations = () => {
    let filtered = cocktails;

    // Spirit filter
    if (spiritAnswer) {
      filtered = filtered.filter(cocktail => {
        const ingredients = [
          cocktail.strIngredient1,
          cocktail.strIngredient2,
          cocktail.strIngredient3,
          cocktail.strIngredient4,
          cocktail.strIngredient5
        ].filter(ingredient => ingredient); // Filter out null or undefined ingredients

        return ingredients.some(ingredient => ingredient.toLowerCase().includes(spiritAnswer.toLowerCase()));
      });
    }

    // Taste filter
    if (tasteAnswer) {
      filtered = filtered.filter(cocktail => {
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
        ].filter(ingredient => ingredient); // Filter out null or undefined ingredients

        let isMatch = false;

        switch (tasteAnswer) {
          case 'Sweet':
            isMatch = ingredients.some(ingredient => ingredient.toLowerCase().includes('syrup') || ingredient.toLowerCase().includes('sugar'));
            break;
          case 'Sour':
            isMatch = ingredients.some(ingredient => ingredient.toLowerCase().includes('lemon juice') || ingredient.toLowerCase().includes('lime juice'));
            break;
          case 'Spicy':
            isMatch = ingredients.some(ingredient => ingredient.toLowerCase().includes('tabasco') || ingredient.toLowerCase().includes('jalapeno'));
            break;
          case 'Fruity':
            isMatch = ingredients.some(ingredient => ['cherry', 'grenadine', 'strawberry', 'orange', 'mango', 'grapefruit']
              .some(fruit => ingredient.toLowerCase().includes(fruit)));
            break;
          case 'Bitter':
            isMatch = ingredients.some(ingredient => ingredient.toLowerCase().includes('bitters'));
            break;
          case 'Herbal':
            isMatch = ingredients.some(ingredient => ingredient.toLowerCase().includes('mint') || ingredient.toLowerCase().includes('basil'));
            break;
        }

        return isMatch;
      });
    }

    // Type filter (Cocktail, Mocktail, or Shot)
    if (typeAnswer) {
      if (typeAnswer === 'Mocktail') {
        filtered = filtered.filter(cocktail => cocktail.strAlcoholic === 'Non_Alcoholic');
      } else if (typeAnswer === 'Shot') {
        filtered = filtered.filter(cocktail => cocktail.strGlass && cocktail.strGlass.toLowerCase().includes('shot'));
      } else {
        filtered = filtered.filter(cocktail => cocktail.strAlcoholic === 'Alcoholic');
      }
    }

    // Caffeine content filter
    if (caffeineAnswer !== '') {
      filtered = filtered.filter(cocktail => {
        const hasCaffeine = ['strIngredient1', 'strIngredient2', 'strIngredient3', 'strIngredient4', 'strIngredient5']
          .some(key => {
            const ingredient = cocktail[key] ? cocktail[key].toLowerCase() : '';
            return ingredient.includes('coffee') || ingredient.includes('espresso') || ingredient.includes('kahlua');
          });

        return caffeineAnswer === 'Yes' ? hasCaffeine : !hasCaffeine;
      });
    }

    // Glassware filter
    if (glasswareAnswer) {
      filtered = filtered.filter(cocktail => cocktail.strGlass && cocktail.strGlass.toLowerCase().includes(glasswareAnswer.toLowerCase()));
    }

    // Dietary restrictions filter
    if (dietaryAnswer) {
      filtered = filtered.filter(cocktail => {
        const ingredients = [
          cocktail.strIngredient1,
          cocktail.strIngredient2,
          cocktail.strIngredient3,
          cocktail.strIngredient4,
          cocktail.strIngredient5
        ].filter(ingredient => ingredient); // Filter out null or undefined ingredients

        let isMatch = false;

        switch (dietaryAnswer) {
          case 'Vegan':
            isMatch = ingredients.every(ingredient => !ingredient.toLowerCase().includes('egg') && !ingredient.toLowerCase().includes('milk'));
            break;
          case 'Gluten-Free':
            isMatch = ingredients.every(ingredient => !ingredient.toLowerCase().includes('wheat') && !ingredient.toLowerCase().includes('barley'));
            break;
          case 'Low-Calorie':
            isMatch = ingredients.some(ingredient => ingredient.toLowerCase().includes('diet') || ingredient.toLowerCase().includes('soda'));
            break;
          case 'No Dairy':
            isMatch = ingredients.every(ingredient => !ingredient.toLowerCase().includes('milk') && !ingredient.toLowerCase().includes('cream'));
            break;
        }

        return isMatch;
      });
    }

    // Season filter
    if (seasonAnswer) {
      filtered = filtered.filter(cocktail => {
        const ingredients = [
          cocktail.strIngredient1,
          cocktail.strIngredient2,
          cocktail.strIngredient3,
          cocktail.strIngredient4,
          cocktail.strIngredient5
        ].filter(ingredient => ingredient); // Filter out null or undefined ingredients

        let isMatch = false;

        switch (seasonAnswer) {
          case 'Winter':
            isMatch = ingredients.some(ingredient => ['cinnamon', 'nutmeg', 'ginger'].some(spice => ingredient.toLowerCase().includes(spice)));
            break;
          case 'Summer':
            isMatch = ingredients.some(ingredient => ['lemon', 'lime', 'mint'].some(fruit => ingredient.toLowerCase().includes(fruit)));
            break;
          case 'Spring':
            isMatch = ingredients.some(ingredient => ['berry', 'herb'].some(fruit => ingredient.toLowerCase().includes(fruit)));
            break;
          case 'Fall':
            isMatch = ingredients.some(ingredient => ['apple', 'pumpkin', 'spice'].some(fruit => ingredient.toLowerCase().includes(fruit)));
            break;
        }

        return isMatch;
      });
    }

    setFilteredCocktails(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity >
      <View style={styles.cocktailItem}>
        <Image source={{ uri: item.strDrinkThumb }} style={styles.cocktailImage} />
        <Text style={styles.cocktailName}>{item.strDrink}</Text>
        <Text style={styles.cocktailCategory}>{item.strCategory}</Text>
        <Text style={styles.cocktailGlass}>{item.strGlass}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderQuestion = (question, options, setAnswer, currentAnswer) => (
    <View style={styles.questionContainer}>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity 
            key={option} 
            onPress={() => setAnswer(option)}
            style={[styles.option, currentAnswer === option && styles.selectedOption]}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

return (
  <ImageBackground 
      source={require('./assets/popular15.jpg')} // Set the background image path
      style={styles.backgroundImage}
    >
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Cocktail Recommendations</Text>

      <FlatList
        data={[
          {
            type: 'question',
            content: renderQuestion('What\'s your favorite spirit?', ['Vodka', 'Gin', 'Rum', 'Whiskey', 'Brandy'], setSpiritAnswer, spiritAnswer)
          },
          {
            type: 'question',
            content: renderQuestion('What\'s your preferred taste?', ['Sweet', 'Sour', 'Spicy', 'Fruity', 'Bitter', 'Herbal'], setTasteAnswer, tasteAnswer)
          },
          {
            type: 'question',
            content: renderQuestion('What type of drink would you prefer?', ['Cocktail', 'Mocktail', 'Shot'], setTypeAnswer, typeAnswer)
          },
          {
            type: 'question',
            content: renderQuestion('Do you want caffeine content in your drink?', ['Yes', 'No'], setCaffeineAnswer, caffeineAnswer)
          },
          {
            type: 'question',
            content: renderQuestion('What type of glassware do you prefer?', ['Cocktail Glass', 'Highball Glass', 'Shot Glass', 'Martini Glass', 'Mug', 'Whiskey Glass'], setGlasswareAnswer, glasswareAnswer)
          },
          {
            type: 'question',
            content: renderQuestion('Do you have any dietary preferences or restrictions?', ['Vegan', 'Gluten-Free', 'Low-Calorie', 'No Dairy'], setDietaryAnswer, dietaryAnswer)
          },
          {
            type: 'question',
            content: renderQuestion('What season would you prefer for your drink?', ['Winter', 'Spring', 'Summer', 'Fall'], setSeasonAnswer, seasonAnswer)
          },
          {
            type: 'button',
            content: (
              <Button title="Get Recommendations" onPress={applyRecommendations} color="#007bff" />
            )
          },
          {
            type: 'cocktailList',
            content: (
              <FlatList
                data={filteredCocktails}
                renderItem={renderItem}
                keyExtractor={(item) => item.idDrink.toString()}
              />
            )
          }
        ]}
        renderItem={({ item }) => item.content}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Optional: to add a dark overlay to the background image
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50,
    marginLeft:25,
  },
  questionContainer: {
    marginBottom: 15,
    marginTop:35,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    padding: 10,
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedOption: {
    backgroundColor: '#007bff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  cocktailItem: {
    marginBottom: 15,
    alignItems: 'center',
  },
  cocktailImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  cocktailName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  cocktailCategory: {
    fontSize: 14,
    color: '#777',
  },
  cocktailGlass: {
    fontSize: 12,
    color: '#aaa',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
});

export default RecommendedCocktails;
