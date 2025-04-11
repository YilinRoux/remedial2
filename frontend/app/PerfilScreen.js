import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../servicios/api';
import dispositivo from '../utilidades/dispositivo';

const PerfilScreen = ({ navigation }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalLikes: 0,
    totalComentarios: 0
  });

  // Obtener el ID del dispositivo y estadísticas al cargar la pantalla
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const id = await dispositivo.obtenerIdDispositivo();
        setDeviceId(id);
        
        // Aquí podrías cargar estadísticas del usuario desde una API
        // Por ahora usamos datos de ejemplo
        
        setStats({
          totalVideos: 0,  // En una implementación real, obtener de la API
          totalLikes: 0,   // En una implementación real, obtener de la API
          totalComentarios: 0  // En una implementación real, obtener de la API
        });
      } catch (error) {
        console.error('Error al cargar datos del perfil:', error);
      }
    };
    
    obtenerDatos();
    
    // Actualizar datos cuando la pantalla obtiene el foco
    const unsubscribe = navigation.addListener('focus', () => {
      obtenerDatos();
    });
    
    return unsubscribe;
  }, [navigation]);

  // Mostrar información sobre la app
  const mostrarInformacion = () => {
    Alert.alert(
      'Acerca de la aplicación',
      'Esta es una aplicación de videos desarrollada con Expo y React Native.\n\nVersión 1.0.0',
      [{ text: 'OK' }]
    );
  };

  // Mostrar términos y condiciones
  const mostrarTerminos = () => {
    Alert.alert(
      'Términos y condiciones',
      'Al utilizar esta aplicación, aceptas cumplir con nuestros términos y condiciones.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#007BFF" />
        </View>
        
        <Text style={styles.userIdText}>
          ID: {deviceId ? `${deviceId.substring(0, 8)}...` : 'Cargando...'}
        </Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalVideos}</Text>
          <Text style={styles.statLabel}>Videos</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalLikes}</Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalComentarios}</Text>
          <Text style={styles.statLabel}>Comentarios</Text>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('MisVideos')}
        >
          <Ionicons name="videocam-outline" size={24} color="#333" />
          <Text style={styles.menuItemText}>Mis videos</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('MisLikes')}
        >
          <Ionicons name="heart-outline" size={24} color="#333" />
          <Text style={styles.menuItemText}>Videos que me gustan</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Ajustes</Text>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={mostrarInformacion}
        >
          <Ionicons name="information-circle-outline" size={24} color="#333" />
          <Text style={styles.menuItemText}>Acerca de</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={mostrarTerminos}
        >
          <Ionicons name="document-text-outline" size={24} color="#333" />
          <Text style={styles.menuItemText}>Términos y condiciones</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    marginBottom: 10,
  },
  userIdText: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 1,
    paddingVertical: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 15,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  versionContainer: {
    padding: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});

export default PerfilScreen;