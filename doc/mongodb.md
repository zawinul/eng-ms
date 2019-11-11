MONGO
-----
* data directory: c:\temp\aa-mongo-ms2
* start: C:\Workspace\eng-ms\eng-oidc-provider\mongo-start.bat   
(oppure: c:\mongo\bin\mongod --dbpath c:\temp\aa-mongo-ms2)
* ascolta sulla porta 27017
* contiene l'indice eng-ms
* mongoURI = **mongodb://localhost:27017/eng-ms** 
* installato anche su fedora seguendo le istruzioni in https://tecadmin.net/install-mongodb-on-fedora/ (solo temporaneamente, poi andrà in docker)
* per abilitare gli accessi remoti cambiato il file /etc/mongod.conf

		net:
			port: 27017
			bindIp: 0.0.0.0

* per sviluppo installato https://nosqlbooster.com/downloads su Windows 


