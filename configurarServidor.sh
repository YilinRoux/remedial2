#!/bin/bash
# Script para configurar el servidor Ubuntu con Node.js, Nginx y MongoDB

# Actualizar el sistema
echo "Actualizando el sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js y npm
echo "Instalando Node.js y npm..."
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node -v
npm -v

# Instalar PM2 para gestionar procesos de Node.js
echo "Instalando PM2..."
sudo npm install -g pm2

# Instalar MongoDB (cliente, ya que usamos MongoDB Atlas)
echo "Instalando cliente de MongoDB..."
sudo apt install -y mongodb-clients

# Instalar Nginx
echo "Instalando Nginx..."
sudo apt install -y nginx

# Habilitar Nginx para iniciar con el sistema
sudo systemctl enable nginx
sudo systemctl start nginx

# Instalar Certbot para SSL
echo "Instalando Certbot para SSL..."
sudo apt install -y certbot python3-certbot-nginx

# Crear directorios para la aplicación
echo "Creando directorios para la aplicación..."
sudo mkdir -p /var/www/lavacalola.club/web
sudo mkdir -p /opt/remedial/backend
sudo mkdir -p /opt/remedial/backend/uploads/temp

# Configurar permisos
echo "Configurando permisos..."
sudo chown -R $USER:$USER /var/www/lavacalola.club
sudo chown -R $USER:$USER /opt/remedial

# Obtener certificado SSL (ajusta el email)
echo "Obteniendo certificado SSL..."
sudo certbot --nginx -d lavacalola.club -d www.lavacalola.club --agree-tos --email tu@email.com --non-interactive

# Copiar archivos de configuración y código (esto debe hacerse manualmente o con scp/rsync)
echo "NOTA: Recuerda copiar los archivos de configuración y código al servidor."
echo "Puedes hacerlo con scp/rsync o git clone"

# Configurar Nginx (asumiendo que ya tienes el archivo de configuración)
echo "Configurando Nginx..."
sudo cp remedial/nginx.conf /etc/nginx/sites-available/lavacalola.club
sudo ln -s /etc/nginx/sites-available/lavacalola.club /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Configurar FFmpeg para procesamiento de videos
echo "Instalando FFmpeg..."
sudo apt install -y ffmpeg

# Configurar firewall
echo "Configurando firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable

echo "Configuración del servidor completada."
echo "Recuerda configurar las variables de entorno y iniciar la aplicación con PM2."