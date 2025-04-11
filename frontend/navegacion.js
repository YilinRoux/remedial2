import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Importar pantallas
import FeedScreen from './app/FeedScreen';
import SubirScreen from './app/SubirScreen';
import PerfilScreen from './app/PerfilScreen';
import ComentariosScreen from './app/ComentariosScreen';

// Crear navegadores
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Navegador de la pantalla de Feed
const FeedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FeedPrincipal" component={FeedScreen} />
    <Stack.Screen 
      name="Comentarios" 
      component={ComentariosScreen}
      options={{
        headerShown: false,
        presentation: 'modal',
        animationTypeForReplace: 'push',
      }}
    />
  </Stack.Navigator>
);

// Navegador de la pantalla de Perfil
const PerfilStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PerfilPrincipal" component={PerfilScreen} />
    <Stack.Screen 
      name="MisVideos" 
      component={FeedScreen} 
      options={{
        headerShown: true,
        title: 'Mis Videos',
      }}
    />
    <Stack.Screen 
      name="MisLikes" 
      component={FeedScreen}
      options={{
        headerShown: true,
        title: 'Videos que me gustan',
      }}
    />
  </Stack.Navigator>
);

// Navegador principal (tabs)
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Feed') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Subir') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
        } else if (route.name === 'Perfil') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007BFF',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 5,
      },
    })}
  >
    <Tab.Screen name="Feed" component={FeedStack} />
    <Tab.Screen name="Subir" component={SubirScreen} />
    <Tab.Screen name="Perfil" component={PerfilStack} />
  </Tab.Navigator>
);

// Navegador principal de la aplicación
const Navegacion = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default Navegacion;