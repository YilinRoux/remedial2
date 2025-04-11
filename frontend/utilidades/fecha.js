import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Función para formatear fechas en formato relativo (ej: "hace 5 minutos")
const formatearFechaRelativa = (fecha) => {
  try {
    // Convertir string a objeto Date si es necesario
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    
    // Formatear en formato relativo
    return formatDistanceToNow(date, {
      addSuffix: true, // Agrega "hace" antes del tiempo
      locale: es // Usar localización en español
    });
  } catch (error) {
    console.error('Error al formatear fecha relativa:', error);
    return 'fecha desconocida';
  }
};

// Función para formatear fechas en formato de fecha estándar
const formatearFecha = (fecha) => {
  try {
    // Convertir string a objeto Date si es necesario
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    
    // Opciones para el formato de fecha
    const opciones = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    // Formatear usando el método toLocaleDateString
    return date.toLocaleDateString('es-ES', opciones);
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'fecha desconocida';
  }
};

export default {
  formatearFechaRelativa,
  formatearFecha
};