  import React, { useState } from 'react';
  import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Switch } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { auth, firestore } from './firebaseConfig';
  import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // Import serverTimestamp
  const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState(''); // Added state for fullName
    const [isOver18, setIsOver18] = useState(false);
    const navigation = useNavigation();

    const handleSignUp = async () => {
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      if (!isOver18) {
        alert("You must be over 18 to sign up.");
        return;
      }
      if (!fullName) {
        alert("Please provide your full name.");
        return;
      }

      try {
       
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

       
        await setDoc(doc(firestore, 'USERSinfo', userId), {
          email,
          fullName,
          isOver18,
          createdAt: serverTimestamp(),
        });

       
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainDrawer' }], 
        });

      } catch (error) {
        console.error('Error during sign-up:', error);
        alert('Sign-up failed: ' + error.message);
      }
    };

    return (
      <ImageBackground source={require('./assets/cocktail-background.jpg')} style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>Create an Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#fff"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* Age Confirmation */}
          <View style={styles.ageConfirmationContainer}>
            <Text style={styles.ageConfirmationText}>
              Are you over 18 years old?
            </Text>
            <Switch
              value={isOver18}
              onValueChange={setIsOver18}
              trackColor={{ false: '#767577', true: '#ffcc00' }}
              thumbColor={isOver18 ? '#ff4500' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <Text
            style={styles.toggleText}
            onPress={() => navigation.replace('Login')}
          >
            Already have an account? Sign In
          </Text>
        </View>
      </ImageBackground>
    );
  };
  const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    title: {
      fontSize: 30,
      color: '#ffcc00',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30,
    },
    input: {
      height: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 8,
      marginBottom: 20,
      paddingHorizontal: 10,
      color: '#fff',
    },
    button: {
      backgroundColor: '#ff4500',
      borderRadius: 8,
      padding: 15,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    toggleText: {
      color: '#ffcc00',
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
    },
    ageConfirmationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    ageConfirmationText: {
      color: '#fff',
      fontSize: 16,
      marginRight: 10,
    },
  });

  export default SignUp;
