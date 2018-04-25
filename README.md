# WebRTC Scalable Server Installation Steps


1. Install NodeJS and NPM
2. Start Nari Signalling server



### Install NodeJS and NPM

#### Ubuntu/Debian
Installing NodeJS Debian and Ubuntu based Linux distributions.

```shell
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
```
#### SUSE Linux Enterprise Server (SLES)

Installing NodeJS openSUSE and SLE.
The ["Web and Scripting Module"](https://www.suse.com/documentation/sles-12/book_sle_deployment/data/sec_add-ons_extensions.html)  must be added before installing.

```shell
zypper ar -f http://download.opensuse.org/repositories/home:/kwk:/orientdb/openSUSE_12.3/ Nodejs
zypper install nodejs nodejs-devel
zypper install nodejs4
```

### Install Nari signalling server
#### Linux Platform
Start Nari signalling server
```shell
git clone https://github.com/murugancmi/nari-node.git 
cd nari-node
npm install
```


Time to start your Signalling server

```shell
node server.js
```

Run in production 

```shell
npm install -g pm2
pm2 start server --name=nari
```


