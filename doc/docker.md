docker
====

comandi
* docker info  
* docker images
* docker ps 

	*#mostra i container attualmente running*
* docker ps -a 

	*#mostra anche i contenitori chiusi e non rimossi*
* docker pull *imagename*
* docker run --name *mycontainername*  -i -t *nomeimmagine* <*eventualecomando*>

	crea un container dall'immagine *nomeimmagine*, gli da il nome *mycontainername* e lo avvia in modo interattivo (terminale su STDIN)
* docker stop *mycontainer*
* docker start *imagename*

	*#riavvia un immagine stoppata*

* docker exec *mycontainer* -i -t *mycommand*
* docker rm *mycontainername*
* docker commit *mycontainername* 
*mytagname:version*
* docker login *local-repository-URL*
* docker build -t *mytagname:version* *dir*

	*#compila un immagine dandogli nome e versione. Nella directory dir (di solito è . ) deve essere presente il Dockerfile*
* docker logs < -f >*containername*
	
	#permette di leggere il log del container (-f si appende, come tail -f)
	



---
per far funzionare docker con il proxy engineering: https://www.youtube.com/watch?v=2Czw3bibGkg&feature=youtu.be minuto 3:00

considerazioni su partizione di root https://www.youtube.com/watch?v=2Czw3bibGkg&feature=youtu.be minuto 6:00  
