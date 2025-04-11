import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ComentarioItem from '../componentes/ComentarioItem';
import apiService from '../servicios/api';
import dispositivo from '../utilidades/dispositivo';

const ComentariosScreen = ({ route, navigation }) => {
  const { videoId } = route.params;
  const [comentarios, setComentarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [deviceId, setDeviceId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const inputRef = useRef(null);
  const flatListRef = useRef(null);

  
  useEffect(() => {
    const obtenerDispositivo = async () => {
      const id = await dispositivo.obtenerIdDispositivo();
      setDeviceId(id);
    };
    
    obtenerDispositivo();
  }, []);

  
  useEffect(() => {
    cargarComentarios();
  }, [videoId, currentPage]);

  
  const cargarComentarios = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
        setCurrentPage(1);
      }

      const page = refresh ? 1 : currentPage;
      const resultado = await apiService.comentarios.obtenerComentariosPorVideo(videoId, page, 20);
      
      setTotalPages(resultado.totalPages);
      
      if (refresh || page === 1) {
        setComentarios(resultado.comentarios);
      } else {
        setComentarios((prevComentarios) => [
          ...prevComentarios, 
          ...resultado.comentarios.filter(
            c => !prevComentarios.some(pc => pc._id === c._id)
          )
        ]);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      Alert.alert('Error', 'No se pudieron cargar los comentarios.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  
  const enviarComentario = async () => {
    if (!nuevoComentario.trim() || !deviceId) return;
    
    try {
      setIsSending(true);
      
      await apiService.comentarios.crearComentario(
        videoId,
        deviceId,
        nuevoComentario.trim()
      );
      
    
      setNuevoComentario('');
      
      cargarComentarios(true);
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      Alert.alert('Error', 'No se pudo enviar el comentario. Inténtalo de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  
  const eliminarComentario = async (comentarioId) => {
    if (!deviceId) return;
    
    try {
      await apiService.comentarios.eliminarComentario(comentarioId, deviceId);
      
     
      setComentarios((prevComentarios) =>
        prevComentarios.filter((c) => c._id !== comentarioId)
      );
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      Alert.alert('Error', 'No se pudo eliminar el comentario.');
    }
  };

  
  const handleEndReached = () => {
    if (!isLoading && !isRefreshing && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };


  const renderItem = ({ item }) => (
    <ComentarioItem
      comentario={item}
      esPropio={item.deviceId === deviceId}
      onEliminar={eliminarComentario}
    />
  );


  const renderFooter = () => {
    if (!isLoading || isRefreshing) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007BFF" />
      </View>
    );
  };

  
  const renderEmptyComponent = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No hay comentarios todavía.
        </Text>
        <Text style={styles.emptySubtext}>
          ¡Sé el primero en comentar!
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Comentarios</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={comentarios}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        refreshing={isRefreshing}
        onRefresh={() => cargarComentarios(true)}
        style={styles.list}
        contentContainerStyle={
          comentarios.length === 0 ? { flex: 1 } : { paddingBottom: 10 }
        }
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Escribe un comentario..."
          value={nuevoComentario}
          onChangeText={setNuevoComentario}
          multiline
          maxLength={500}
          autoCapitalize="none"
          autoCorrect={true}
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!nuevoComentario.trim() || isSending) && styles.disabledButton,
          ]}
          onPress={enviarComentario}
          disabled={!nuevoComentario.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Ionicons name="send" size={20} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
  },
  list: {
    flex: 1,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#B0D0F7',
  },
});

export default ComentariosScreen;