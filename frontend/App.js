import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import dispositivo from './utilidades/dispositivo';
import Navegacion from './navegacion';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [deviceId, setDeviceId] = useState(null);

  // Inicializar la aplicación - obtener ID de dispositivo
  useEffect(() => {
    const inicializar = async () => {
      try {
        // Obtener ID de dispositivo
        const id = await dispositivo.obtenerIdDispositivo();
        setDeviceId(id);
      } catch (error) {
        console.error('Error al inicializar la app:', error);
      } finally {
        // Simular tiempo de carga para mostrar splash
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    inicializar();
  }, []);

  // Pantalla de carga mientras se inicializa la app
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Cargando...</Text>
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <>
      <Navegacion />
      <StatusBar style="dark" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});