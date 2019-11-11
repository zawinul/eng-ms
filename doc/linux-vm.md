LINUX VM
---
https://www.osboxes.org/fedora/  
Fedora 31  
C:\Users\a135631\VirtualBox VMs\F31-VB-64bit.7z  

aggiunto utente paolo e gruppo developers, aggiunto paolo ai sudoers

	sudo useradd -m paolo -p paolo
	sudo groupadd developers

	sudo usermod -a -G developers paolo
	sudo usermod -aG wheel paolo

modificato .bashrc

		export ENGMSDIR=/var/eng-ms
		export PATH=$PATH:$ENGMSDIR/script/linux
		export MYGITUSER=******
		export MYGITPASSWORD=******


installato mongodb seguendo le istruzioni in https://tecadmin.net/install-mongodb-on-fedora/ (solo temporaneamente, poi andrà in docker)  
per abilitare mongodb ad essere acceduto dall'esterno modificato \etc\mongod.conf
con

	bind_ip = 0.0.0.0 

installato node seguendo le istruzioni in https://tecadmin.net/install-latest-nodejs-on-fedora/ (solo temporaneamente, poi andrà in docker)

installato vs code con dnf come da istruzioni in https://code.visualstudio.com/docs/setup/linux  
