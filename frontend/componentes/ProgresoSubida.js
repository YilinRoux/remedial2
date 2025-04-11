import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import * as Progress from 'react-native-progress';

const ProgresoSubida = ({ visible, progreso, mensaje }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Subiendo video</Text>
          
          <Progress.Bar
            progress={progreso / 100}
            width={250}
            height={10}
            color="#007BFF"
            unfilledColor="#E5E5E5"
            borderWidth={0}
            style={styles.progressBar}
          />
          
          <Text style={styles.percentage}>{progreso}%</Text>
          
          {mensaje && <Text style={styles.message}>{mensaje}</Text>}
          
          <Text style={styles.description}>
            Por favor, no cierres la aplicación hasta que se complete la subida.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  progressBar: {
    marginVertical: 15,
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ProgresoSubida;