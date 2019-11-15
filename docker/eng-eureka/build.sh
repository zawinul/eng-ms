pushd $ENGMSDIR/eng-eureka
mvn -DskipTests=true package
popd
cp $ENGMSDIR/eng-eureka/target/eng-eureka.jar .
docker image rm eng-eureka
docker build -t eng-eureka .
