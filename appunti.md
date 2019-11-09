
Camunda: (dipende da mysql)
-

progetto: C:\workspace\Camunda\eng-camunda-authfilter
start: C:\Workspace\Camunda\runnable\start.bat
url: https://127.0.0.1:8080
admin: demo/demo

camunda usa jose4j per la gestione dei token


camunda db:
db: jdbc:mysql://localhost:3306/camunda
db.username: camunda2
db.password: camunda

MONGO
-----
(C:\Workspace\eng-ms\eng-oidc-provider\mongo-start.bat)
c:\mongo\bin\mongod --dbpath c:\temp\aa-mongo-ms2


CONFIG
------
http://127.0.0.1:8888/....  
C:\Workspace\eng-ms\eng-config\avvia.bat

EUREKA
---
C:\Workspace\eng-ms\eng-eureka\avvia.bat

http://127.0.0.1:8761/

ENG-OID-PROVIDER  
---

dipende da mongo  

C:\Workspace\eng-ms\eng-oidc-provider\provider-start.bat  
http://127.0.0.1:3000/....  
la logica per trovare gli utenti è in in account.js
*paolo/aaa*  
*pippo/bbb*  
I "client" sono configurati in clients.json





## CONSUMER
chiama servizio1  
C:\Workspace\eng-ms\eng-oidc-consumer\consumer-start.bat

## SERVIZIO1 
si aspetta un token valido contenente 'servizio1' nello scope  
C:\Workspace\eng-ms\eng-oidc-servizo1\servizio1-start.bat

## STATIC CONSUMER
C:\workspace\eng-ms\eng-static-consumer\test\http-server\start.bat
https://eng-static:91
https://eng-static:91/r3/richiedi/

#VIRTUAL BOX
---
https://www.osboxes.org/fedora/  
Fedora 31  
C:\Users\a135631\VirtualBox VMs\F31-VB-64bit.7z  

sudo useradd -m paolo -p paolo
sudo groupadd developers

sudo usermod -a -G developers paolo
sudo usermod -aG wheel paolo



VARIE
---
provato vaadin per gestire client side failover & load balancing, non mi piace, approccio integrato server-client alle UI, stile gwt  
