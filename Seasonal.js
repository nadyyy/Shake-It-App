import React from 'react'; 
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

const SeasonalCocktails = ({ navigation }) => {
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

    const renderCocktail = ({ item }) => (
        <TouchableOpacity
            style={styles.cocktailItem}
            onPress={() => navigation.navigate('SpDetails', { sp: item })} // Navigate to SpDetails screen with the selected cocktail data
        >
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.cocktailImage} />
            </View>
            <Text style={styles.cocktailName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <ImageBackground source={require('./assets/season.jpg')} style={styles.backgroundImage}>
            {/* Add Overlay View */}
            <View style={styles.overlay} />
            <View style={styles.container}>
                <Text style={styles.title}>Seasonal Cocktails</Text>
                <FlatList
                    data={seasonalCocktails}
                    renderItem={renderCocktail}
                    keyExtractor={(item) => item.id}
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
        opacity: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Dark overlay for contrast
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        marginTop: 50,
    },
    title: {
        fontSize: 28, // Same as Popular Cocktails title size
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-around', // Same space distribution as Popular Cocktails
    },
    cocktailItem: {
        marginBottom: 20,
        width: '45%', // Ensures consistent square sizing for each item
        alignItems: 'center',
    },
    imageContainer: {
        marginBottom: 10,
    },
    cocktailImage: {
        width: 150, // Same width as the images in Popular Cocktails
        height: 150, // Same height to keep the square format
        borderRadius: 10, // Matching rounded corners from Popular Cocktails
    },
    cocktailName: {
        color: 'white',
        fontSize: 16, // Same font size as Popular Cocktails
        textAlign: 'center',
    },
});

export default SeasonalCocktails;
