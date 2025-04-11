import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import fecha from '../utilidades/fecha';

const ComentarioItem = ({ comentario, esPropio, onEliminar }) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={40} color="#666" />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.deviceId}>
            Usuario {comentario.deviceId.substring(0, 8)}...
          </Text>
          <Text style={styles.time}>
            {fecha.formatearFechaRelativa(comentario.createdAt)}
          </Text>
        </View>
        
        <Text style={styles.text}>{comentario.text}</Text>
        
        {esPropio && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onEliminar(comentario._id)}
          >
            <Text style={styles.deleteText}>Eliminar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  avatarContainer: {
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  deviceId: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    fontSize: 12,
    color: '#FF375F',
  },
});

export default ComentarioItem;