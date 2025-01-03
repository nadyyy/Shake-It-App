import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons'; 
import CustomDrawerContent from './CustomDrawerContent';
import Login from './Login';
import SignUp from './SignUp';
import HomeScreen from './HomeScreen';
import FindDrinks from './FindDrinks';
import CocktailDetails from './CocktailDetails';
import SeasonalCocktails from './Seasonal';
import PopularCocktails from './PopularCocktails';
import Favorites from './Favorites';
import RecommendedCocktails from './RecommendedCocktails'; 
import CheckIngredients from './CheckIngredients';
import IngredientDetails from './IngredientDetails';
import SpDetails from './spDetails';
import { TouchableOpacity } from 'react-native';
import AddCocktail from './AddCocktail';
import PeoplesCocktails from './PeoplesCocktails';
import Pdetails from './Pdetails';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: '#ff8c00',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          drawerLabel: 'Home',
          drawerIcon: () => <Ionicons name="home" size={24} color="black" />,
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16, marginTop: 26 }}>
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />

      <Drawer.Screen
        name="Search Cocktails"
        component={FindDrinks}
        options={({ navigation }) => ({
          drawerLabel: 'Find Drinks',
          drawerIcon: () => <Ionicons name="search" size={30} color="black" />,
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16, marginTop: 26 }}>
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />

      <Drawer.Screen
        name="Seasonal Cocktails"
        component={SeasonalCocktails}
        options={({ navigation }) => ({
          drawerLabel: 'Seasonal Cocktails',
          drawerIcon: () => <Ionicons name="gift" size={24} color="green" />,
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16, marginTop: 26 }}>
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />

      <Drawer.Screen
        name="Popular Cocktails"
        component={PopularCocktails}
        options={({ navigation }) => ({
          drawerLabel: 'Popular Cocktails',
          drawerIcon: () => <Ionicons name="star" size={24} color="gold" />,
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16, marginTop: 26 }}>
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />

      <Drawer.Screen
        name="Recommended Cocktails"
        component={RecommendedCocktails}
        options={({ navigation }) => ({
          drawerLabel: 'Recommended Cocktails',
          drawerIcon: () => <Ionicons name="flash" size={24} color="blue" />,
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16, marginTop: 26 }}>
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />

      <Drawer.Screen
        name="Check Ingredients"
        component={CheckIngredients}
        options={({ navigation }) => ({
          drawerLabel: 'Check Ingredients',
          drawerIcon: () => <Ionicons name="list" size={24} color="purple" />,
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16, marginTop: 26 }}>
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="AddCocktail"
        component={AddCocktail}
        options={({ navigation }) => ({
          drawerLabel: 'Submit Your Recipe',
          drawerIcon: () => <Ionicons name="add-circle" size={25} color="black" />,
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16, marginTop: 26 }}>
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="PeoplesCocktails"
        component={PeoplesCocktails}
        options={({ navigation }) => ({
          drawerLabel: 'PeoplesCocktails',
          drawerIcon: () => <Ionicons name="people" size={25} color="black" />,
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16, marginTop: 26 }}>
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />


      <Drawer.Screen
        name="Favorites"
        component={Favorites}
        options={({ navigation }) => ({
          drawerLabel: 'Favorites',
          drawerIcon: () => <Ionicons name="heart" size={24} color="red" />,
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16, marginTop: 26 }}>
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="CocktailDetails" component={CocktailDetails} options={{ title: 'Cocktail Details', headerShown: false }} />
        <Stack.Screen name="SpDetails" component={SpDetails} options={{ title: 'Cocktail Details', headerShown: false }} />
        <Stack.Screen name="Pdetails" component={Pdetails} options={{ title: 'Cocktail Details', headerShown: false }} />
        <Stack.Screen name="IngredientDetails" component={IngredientDetails} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
