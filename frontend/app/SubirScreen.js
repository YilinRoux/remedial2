import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';
import ProgresoSubida from '../componentes/ProgresoSubida';
import apiService from '../servicios/api';
import dispositivo from '../utilidades/dispositivo';

const SubirScreen = ({ navigation }) => {
  const [videoUri, setVideoUri] = useState(null);
  const [thumbnailUri, setThumbnailUri] = useState(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [deviceId, setDeviceId] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);

 
  useEffect(() => {
    const obtenerDispositivo = async () => {
      const id = await dispositivo.obtenerIdDispositivo();
      setDeviceId(id);
    };
    
    obtenerDispositivo();
  }, []);


  const seleccionarVideo = async () => {
    try {
  
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Se necesita acceso a la galería para seleccionar videos.'
        );
        return;
      }
      
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedVideo = result.assets[0];
        
      
        const { width, height } = selectedVideo;
        if (width > height) {
          Alert.alert(
            'Video horizontal',
            'Por favor, selecciona un video vertical para subirlo.',
            [{ text: 'OK' }]
          );
          return;
        }
        

        const fileInfo = await FileSystem.getInfoAsync(selectedVideo.uri);
        if (fileInfo.size > 52428800) { 
          Alert.alert(
            'Video demasiado grande',
            'El tamaño máximo permitido es 50MB.',
            [{ text: 'OK' }]
          );
          return;
        }
        
        
        setVideoUri(selectedVideo.uri);
        setVideoInfo({
          width: selectedVideo.width,
          height: selectedVideo.height,
          duration: selectedVideo.duration || 0,
          size: fileInfo.size,
        });
        
      
        generarMiniatura(selectedVideo.uri);
      }
    } catch (error) {
      console.error('Error al seleccionar video:', error);
      Alert.alert('Error', 'No se pudo seleccionar el video. Inténtalo de nuevo.');
    }
  };

  
  const generarMiniatura = async (uri) => {
    try {
      const { uri: thumbnail } = await VideoThumbnails.getThumbnailAsync(uri, {
        time: 1000, 
        quality: 0.7,
      });
      
      setThumbnailUri(thumbnail);
    } catch (error) {
      console.error('Error al generar miniatura:', error);
      
    }
  };

 
  const subirVideo = async () => {
    if (!videoUri || !deviceId) {
      Alert.alert('Error', 'Selecciona un video para subir.');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setStatusMessage('Iniciando subida...');
      
      // Subir el video usando el servicio de API
      await apiService.videos
        .onProgress((progress) => {
          setUploadProgress(progress);
          
          if (progress < 50) {
            setStatusMessage('Subiendo video...');
          } else if (progress < 80) {
            setStatusMessage('Procesando video...');
          } else {
            setStatusMessage('Finalizando...');
          }
        })
        .subirVideo(videoUri, deviceId, title);
      

      setVideoUri(null);
      setThumbnailUri(null);
      setTitle('');
      setVideoInfo(null);
      
      Alert.alert(
        '¡Video subido!',
        'Tu video se ha subido correctamente.',
        [
          {
            text: 'Ver feed',
            onPress: () => navigation.navigate('Feed'),
          },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      console.error('Error al subir video:', error);
      Alert.alert(
        'Error al subir video',
        error.response?.data?.error || 'Ha ocurrido un error. Inténtalo de nuevo.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {!videoUri ? (
          <TouchableOpacity
            style={styles.selectButton}
            onPress={seleccionarVideo}
          >
            <Ionicons name="videocam" size={50} color="#007BFF" />
            <Text style={styles.selectText}>Seleccionar video</Text>
            <Text style={styles.infoText}>
              Formatos: MP4, MOV • Máximo 50MB • Máximo 1 minuto
            </Text>
            <Text style={styles.infoText}>
              Solo videos verticales
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.previewContainer}>
            {thumbnailUri ? (
              <Image
                source={{ uri: thumbnailUri }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            ) : (
              <Video
                source={{ uri: videoUri }}
                style={styles.videoPreview}
                useNativeControls
                resizeMode="contain"
              />
            )}
            
            <TouchableOpacity
              style={styles.changeButton}
              onPress={seleccionarVideo}
            >
              <Text style={styles.changeButtonText}>Cambiar video</Text>
            </TouchableOpacity>
            
            {videoInfo && (
              <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Información del video:</Text>
                <Text style={styles.infoDetail}>
                  Tamaño: {(videoInfo.size / (1024 * 1024)).toFixed(2)} MB
                </Text>
                <Text style={styles.infoDetail}>
                  Duración: {Math.round(videoInfo.duration / 1000)} segundos
                </Text>
                <Text style={styles.infoDetail}>
                  Resolución: {videoInfo.width}x{videoInfo.height}
                </Text>
              </View>
            )}
          </View>
        )}
        
   
        <TextInput
          style={styles.input}
          placeholder="Título (opcional)"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          placeholderTextColor="#999"
        />
        

        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!videoUri || isUploading) && styles.disabledButton,
          ]}
          onPress={subirVideo}
          disabled={!videoUri || isUploading}
        >
          <Text style={styles.uploadButtonText}>
            {isUploading ? 'Subiendo...' : 'Subir Video'}
          </Text>
        </TouchableOpacity>
        
       
        <Text style={styles.disclaimer}>
          Al subir este video, aceptas que cumple con nuestras normas de comunidad.
        </Text>
      </View>
      
    
      <ProgresoSubida
        visible={isUploading}
        progreso={uploadProgress}
        mensaje={statusMessage}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    padding: 20,
  },
  selectButton: {
    height: 250,
    borderWidth: 2,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    marginBottom: 20,
  },
  selectText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  previewContainer: {
    height: 300,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  changeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  changeButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
  },
  infoTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoDetail: {
    color: '#DDD',
    fontSize: 11,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
  },
  uploadButton: {
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#B0D0F7',
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default SubirScreen;