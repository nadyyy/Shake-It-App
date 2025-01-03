import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

const PeoplesCocktails = ({ navigation }) => {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, 'cocktails'));
        const fetchedCocktails = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCocktails(fetchedCocktails);
      } catch (error) {
        console.error('Error fetching cocktails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCocktails();
  }, []);

  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Pdetails', { cocktail: item })}
    >
      <View style={styles.imagePlaceholder} />
      <Text style={styles.cocktailName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const keyExtractor = (item) => item.id;

  if (loading) {
    return <ActivityIndicator size="large" color="#FFA500" style={styles.loading} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>People's Cocktails</Text>
      <FlatList
        data={cocktails}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        extraData={cocktails.length} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 22,
    
    color: 'black',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 50,
    alignItems: 'center',
    width: '48%',
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  imagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  cocktailName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PeoplesCocktails;
