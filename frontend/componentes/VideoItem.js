import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Video } from 'expo-av';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import apiService from '../servicios/api';
import dispositivo from '../utilidades/dispositivo';
import fecha from '../utilidades/fecha';

const { width, height } = Dimensions.get('window');

const VideoItem = ({ item, onComentariosPress }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likeCount || 0);
  const [deviceId, setDeviceId] = useState(null);

  // Obtener el ID del dispositivo al cargar el componente
  useEffect(() => {
    const obtenerDispositivo = async () => {
      const id = await dispositivo.obtenerIdDispositivo();
      setDeviceId(id);
      
      // Verificar si el usuario ya dio like al video
      if (id && item._id) {
        try {
          const tienelike = await apiService.likes.verificarLike(item._id, id);
          setIsLiked(tienelike);
        } catch (error) {
          console.error('Error al verificar like:', error);
        }
      }
    };
    
    obtenerDispositivo();
  }, [item._id]);

  // Manejar el estado de reproducción del video
  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Manejar la acción de like
  const handleLike = async () => {
    if (!deviceId) return;
    
    try {
      if (isLiked) {
        await apiService.likes.quitarLike(item._id, deviceId);
        setLikeCount(Math.max(0, likeCount - 1));
      } else {
        await apiService.likes.darLike(item._id, deviceId);
        setLikeCount(likeCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error al dar/quitar like:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePlayPause}
        style={styles.videoContainer}
      >
        <Video
          ref={videoRef}
          source={{ uri: item.cloudflareUrl }}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay={false}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && isLoading) {
              setIsLoading(false);
            }
            if (status.isPlaying !== isPlaying) {
              setIsPlaying(status.isPlaying);
            }
          }}
          useNativeControls={false}
        />
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
        
        {!isPlaying && !isLoading && (
          <View style={styles.playButtonContainer}>
            <FontAwesome name="play" size={50} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.controls}>
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title || 'Video sin título'}
          </Text>
          <Text style={styles.createdAt}>
            {fecha.formatearFechaRelativa(item.createdAt)}
          </Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={28}
              color={isLiked ? '#FF375F' : '#FFFFFF'}
            />
            <Text style={styles.actionText}>{likeCount}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onComentariosPress(item)}
          >
            <Ionicons name="chatbubble-outline" size={26} color="#FFFFFF" />
            <Text style={styles.actionText}>{item.commentCount || 0}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height - 130, // Ajustar según el diseño de la app (barra de navegación, etc.)
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  playButtonContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  infoContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  createdAt: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginLeft: 24,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
  },
});

export default VideoItem;