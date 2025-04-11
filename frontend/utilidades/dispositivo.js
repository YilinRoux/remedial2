import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

// Clave para almacenar el ID del dispositivo en AsyncStorage
const DEVICE_ID_KEY = '@video_app:device_id';

// Función para obtener o generar un ID único para el dispositivo
const obtenerIdDispositivo = async () => {
  try {
    // Intentar obtener el ID guardado en AsyncStorage
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    // Si no existe, generar uno nuevo
    if (!deviceId) {
      // Crear un ID único combinando información del dispositivo y un UUID
      const brand = Device.brand || '';
      const modelName = Device.modelName || '';
      const osBuildId = Device.osBuildId || '';
      
      // Combinar información y generar un UUID
      const deviceInfo = `${brand}-${modelName}-${osBuildId}`;
      deviceId = `${deviceInfo}-${uuid.v4()}`;
      
      // Guardar el ID en AsyncStorage para uso futuro
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    
    return deviceId;
  } catch (error) {
    console.error('Error al obtener/generar ID del dispositivo:', error);
    
    // En caso de error, generar un ID temporal
    return `temp-${uuid.v4()}`;
  }
};

export default {
  obtenerIdDispositivo
};