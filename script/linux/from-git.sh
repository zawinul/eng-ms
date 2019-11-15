pushd $ENGMSDIR
sudo git pull
sudo chgrp -R developers . 
sudo chmod -R g=rwx .

popd
