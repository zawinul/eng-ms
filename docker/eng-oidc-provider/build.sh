docker image rm eng-oidc-provider
rm full-deploy.tgz 

pushd ../../eng-oidc-provider
tar -cvzf full-deploy.tgz *
popd

mv ../../eng-oidc-provider/full-deploy.tgz .
docker build -t eng-oidc-provider .
rm full-deploy.tgz