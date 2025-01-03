import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { signOut } from 'firebase/auth'; 
import { auth } from './firebaseConfig'; 

const CustomDrawerContent = (props) => {

  
  const handleLogout = async () => {
    try {
      await signOut(auth); 
      props.navigation.replace('Login'); 
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <View style={styles.drawerContent}>
     
      <DrawerItemList {...props} />
      
   
      <View style={styles.logoutSection}>
        <DrawerItem 
          label="Logout"
          onPress={handleLogout} 
          labelStyle={styles.logoutLabel} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 65,  
  },
  logoutSection: {
    borderTopWidth: 1,  
    borderColor: '#ccc',
    paddingVertical: 10,
    marginTop: 185,  
  },
  logoutLabel: {
    fontSize: 18, 
    color: 'red',  
   
  },
});

export default CustomDrawerContent;
