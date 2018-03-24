#!/bin/bash

# Check we are root
if [ "$(whoami)" != "root" ]; then
    echo "You must be root to run this script"
    exit 1
fi

# TODO: Run raspi config first
# - Make sure the camera is enabled
# Run rpi-update

apt-get -y update

# Upgrade the Raspberry Pi’s firmware
apt-get -y install rpi-update
## TODO: Stop it from asking for confirmation
rpi-update

# Install packages
apt-get -y install vim git nano emacs libraspberrypi-dev autoconf automake libtool pkg-config \
    alsa-base alsa-tools alsa-utils build-essential python-dev python-pip

pip install xvfbwrapper

# Run raspberry config to enable camera and resize partition (options 1 and 5):
# TODO
#raspi-config

# Disable wifi power-save mode
iw dev wlan0 set power_save off
echo "wireless-power off" >> /etc/network/interfaces

# Access trough .local domain (for instance pi.local or fruitnanny.local)
apt-get -y install avahi-daemon

# Download & install nodejs
curl -sL https://deb.nodesource.com/setup_6.x | bash -
apt install -y nodejs
# Install nodejs process manager (PM2) for automatic nodejs app startup
npm install pm2 -g

apt-get -y install python-gst-1.0 python-gobject xvfb pulseaudio dbus-x11

# Install fruitnanny
cd /opt
git clone https://github.com/alexjrussell/fruitnanny
chown -R pi:pi /opt/fruitnanny
cd /opt/fruitnanny
sudo -u pi npm install

# Configure fruitnanny
read -p "Enter your baby's name [Baby]: " baby_name
if [ "$baby_name" == "" ]; then
    baby_name=Baby
fi
read -p "Enter your baby's date of birth (yyyy-mm-dd): " baby_birthdate
# TODO: Validate birth date
read -p "Enter temperature unit (C/F) [C]: " temp_unit
# TODO: Validate temperature unit
if [ "$temp_unit" == "" ]; then
    temp_unit=C
fi
# TODO: Update /opt/fruitnanny/fruitnanny_config.js

# Add the pi user to the pulse-access group
adduser pi pulse-access

# Install .asoundrc
sudo -u pi ln -s /opt/fruitnanny/configuration/alsa/.asoundrc /home/pi/.asoundrc

# Install gstreamer plugins
apt-get -y install gstreamer1.0-tools gstreamer1.0-plugins-good gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly gstreamer1.0-plugins-bad libgstreamer1.0-dev \
    libgstreamer-plugins-base1.0-dev gstreamer1.0-alsa

# Install gstreamer camera module
git clone https://github.com/thaytan/gst-rpicamsrc /tmp/gst-rpicamsrc
cd /tmp/gst-rpicamsrc
./autogen.sh --prefix=/usr --libdir=/usr/lib/arm-linux-gnueabihf/
make
make install

# Install motion
apt-get -y install motion

# Install Janus WebRTC Gateway
apt-get -y install libmicrohttpd-dev libjansson-dev libnice-dev \
    libssl-dev libsrtp-dev libsofia-sip-ua-dev libglib2.0-dev \
    libopus-dev libogg-dev pkg-config gengetopt libsrtp2-dev

git clone https://github.com/meetecho/janus-gateway /tmp/janus-gateway
cd /tmp/janus-gateway
git checkout v0.2.5
sh autogen.sh
./configure --disable-websockets --disable-data-channels --disable-rabbitmq --disable-mqtt
make
make install

# Configure Janus using the files in /opt/fruitnanny/configuration/janus
ln -s /opt/fruitnanny/configuration/janus/janus.cfg /usr/local/etc/janus
ln -s /opt/fruitnanny/configuration/janus/janus.plugin.streaming.cfg /usr/local/etc/janus
ln -s /opt/fruitnanny/configuration/janus/janus.transport.http.cfg /usr/local/etc/janus

# Generate ssl certificates
cd /usr/local/share/janus/certs
# TODO: openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj "/C=/ST=/L=/O=/OU=/CN=" -keyout mycert.key -out mycert.pem
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout mycert.key -out mycert.pem

# Enable access to GPIO without root
adduser pi gpio

# Install Adafruit DHT module
git clone https://github.com/adafruit/Adafruit_Python_DHT /tmp/Adafruit_Python_DHT
cd /tmp/Adafruit_Python_DHT
python setup.py install

# Install service files
ln -s /opt/fruitnanny/configuration/systemd/noise.service /etc/systemd/system/
ln -s /opt/fruitnanny/configuration/systemd/video.service /etc/systemd/system/
ln -s /opt/fruitnanny/configuration/systemd/janus.service /etc/systemd/system/
ln -s /opt/fruitnanny/configuration/systemd/fruitnanny.service /etc/systemd/system/

# Enable services
systemctl enable noise
systemctl enable video
systemctl enable janus
systemctl enable fruitnanny

# Install nodejs process manager (PM2) for automatic nodejs app startup
#npm install pm2 -g
# Run this as pi user?
#sudo -u pi pm2 startup
#env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
# Run this as pi user?
#sudo -u pi pm2 save

# install nginx
apt-get -y install nginx

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Copy fruitnanny configs
ln -s /opt/fruitnanny/configuration/nginx/fruitnanny_http /etc/nginx/sites-available/fruitnanny_http
ln -s /opt/fruitnanny/configuration/nginx/fruitnanny_https /etc/nginx/sites-available/fruitnanny_https

# enable new configs
ln -s /etc/nginx/sites-available/fruitnanny_http /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/fruitnanny_https /etc/nginx/sites-enabled/

# Configure the password
sh -c "echo -n 'fruitnanny:' >> /etc/nginx/.htpasswd"
echo "Enter password for fruitnanny web application"
sh -c "openssl passwd -apr1 >> /etc/nginx/.htpasswd"
systemctl enable nginx

sudo -u pi pm2 start /opt/fruitnanny/server/app.js --name="fruitnanny"
sleep 5s
sudo -u pi pm2 save
sudo -u pi pm2 kill
echo "Installation successful - Starting Fruitnanny"
systemctl start fruitnanny
