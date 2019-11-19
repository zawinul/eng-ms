LINUX VM
---
scaricato ISO di installazione da https://saimei.ftp.acc.umu.se/debian-cd/current-live/amd64/iso-hybrid/debian-live-10.1.0-amd64-kde.iso  
più di 10 giga di HD


//--- OLD

* update
		sudo apt-get update

* creato utente paolo

	sudo useradd -m paolo -p paolo
	sudo groupadd developers

	sudo usermod -a -G developers paolo
	sudo usermod -aG sudo paolo
	#sudo usermod -aG docker paolo

	sudo chsh -s /bin/bash paolo
	
	sudo git config --global user.name "Nome Cognome"
	sudo git config --global user.email "indirizzo@mail.com"


installato docker come da https://docs.docker.com/install/linux/docker-ce/debian/


installare maven


OLD
===
* C:\Users\a135631\VirtualBox VMs\F31-VB-64bit.7z  

* aggiunto utente paolo e gruppo developers, aggiunto paolo ai sudoers

	sudo useradd -m paolo -p paolo
	sudo groupadd developers
	sudo groupadd admin

	sudo usermod -aG developers paolo
	sudo usermod -aG sudo paolo
	sudo usermod -aG docker paolo

* modificato .bashrc

	export ENGMSDIR=/var/eng-ms
	export PATH=$PATH:$ENGMSDIR/script/linux
	export MYGITUSER=******
	export MYGITPASSWORD=******

* clonato repository git

	cd /var
	git clone https://github.com/zawinul/eng-ms

* cambiato gruppo a tutto il contenuto
	
	chgrp -R developers eng-ms

* installato vs code come da istruzioni su sito web

