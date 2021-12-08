#!/bin/sh

sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y npm
sudo apt-get autoremove -y

sudo npm install -g n
sudo mkdir -p /usr/local/n
sudo chown -R $(whoami) /usr/local/n
sudo mkdir -p /usr/local/bin /usr/local/lib /usr/local/include /usr/local/share
sudo chown -R $(whoami) /usr/local/bin /usr/local/lib /usr/local/include /usr/local/share

n lts
npm i -g pnpm

cd ..
pnpm i
