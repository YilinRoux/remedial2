import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
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
  const [useWebView, setUseWebView] = useState(true); // Mantener WebView como predeterminado
  
  useEffect(() => {
    const obtenerDispositivo = async () => {
      const id = await dispositivo.obtenerIdDispositivo();
      setDeviceId(id);
      
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

  const handlePlayPause = async () => {
    if (useWebView) return;
    
    if (videoRef.current) {
      try {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error al reproducir/pausar video:', error);
        setUseWebView(true);
        setIsLoading(false);
      }
    }
  };

  const handleLike = async () => {
    if (!deviceId) {
      Alert.alert('Error', 'No se pudo identificar el dispositivo');
      return;
    }
    
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
      Alert.alert('Error', 'No se pudo procesar tu acción');
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // HTML del reproductor de Cloudflare (sin cambios)
  const embedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; background-color: #000; }
        .container { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
        iframe { width: 100%; height: 100%; border: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <iframe 
          src="https://customer-7ifm1m1zqw3oxnjj.cloudflarestream.com/${item.cloudflareId}/iframe" 
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {useWebView ? (
          <WebView
            source={{ html: embedHtml }}
            style={styles.video}
            javaScriptEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            startInLoadingState={true}
            onLoadStart={handleLoadStart}
            onLoad={handleLoad}
            onError={(e) => console.error('Error en WebView:', e.nativeEvent)}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Cargando reproductor...</Text>
              </View>
            )}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePlayPause}
            style={styles.touchableVideo}
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
            
            {isLoading && !useWebView && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Cargando video...</Text>
              </View>
            )}
            
            {!isPlaying && !isLoading && !useWebView && (
              <View style={styles.playButtonContainer}>
                <FontAwesome name="play" size={50} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {/* Barra de app elevada para no tapar controles del reproductor */}
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
            disabled={!deviceId}
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
    height: height - 130,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  touchableVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  playButtonContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  // Única modificación importante: subir la barra de controles
  controls: {
    position: 'absolute',
    bottom: 75, // Elevado para no tapar los controles nativos del reproductor
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 10,
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
  }
});

export default VideoItem;