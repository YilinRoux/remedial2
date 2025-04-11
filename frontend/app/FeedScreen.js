import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  Dimensions,
} from 'react-native';
import VideoItem from '../componentes/VideoItem';
import apiService from '../servicios/api';

const { height } = Dimensions.get('window');

const FeedScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  

  const flatListRef = useRef(null);

  useEffect(() => {
    cargarVideos();
  }, [currentPage]);


  const cargarVideos = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
        setCurrentPage(1);
      } else if (isLoading === false && refresh === false) {
       
        if (currentPage > totalPages) {
          return; 
        }
      }

      const page = refresh ? 1 : currentPage;
      const resultado = await apiService.videos.obtenerVideos(page, 10);
      
      setTotalPages(resultado.totalPages);
      
      if (refresh || page === 1) {
        setVideos(resultado.videos);
      } else {
        setVideos((prevVideos) => [...prevVideos, ...resultado.videos]);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error al cargar videos:', error);
      setError('No se pudieron cargar los videos. Intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };


  const handleRefresh = () => {
    cargarVideos(true);
  };

 
  const handleEndReached = () => {
    if (!isLoading && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleComentariosPress = (video) => {
    navigation.navigate('Comentarios', { videoId: video._id });
  };

  const renderItem = ({ item, index }) => (
    <VideoItem
      item={item}
      onComentariosPress={handleComentariosPress}
    />
  );

  const renderFooter = () => {
    if (!isLoading || isRefreshing) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No hay videos disponibles.
        </Text>
        <Text style={styles.emptySubtext}>
          ¡Sé el primero en subir uno!
        </Text>
      </View>
    );
  };

  if (error && !isRefreshing && !isLoading) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text
          style={styles.retryText}
          onPress={() => {
            setIsLoading(true);
            cargarVideos();
          }}
        >
          Intentar de nuevo
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        pagingEnabled
        snapToInterval={height - 130}
        snapToAlignment="start"
        decelerationRate="fast"
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#007BFF"
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    height: height - 130,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  errorText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryText: {
    fontSize: 16,
    color: '#007BFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FeedScreen;