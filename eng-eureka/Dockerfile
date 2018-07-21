
FROM openjdk:8-jdk

ENV JAVA_HOME              /usr/lib/jvm/java-8-openjdk-amd64
ENV JAVA_OPTS              ""
ENV PATH                   $PATH:$JAVA_HOME/bin



WORKDIR /app

EXPOSE 8761

COPY target/eng-eureka.jar /app/eng-eureka.jar

CMD ["/bin/sh", "-c", "java $JAVA_OPTS -jar /app/eng-eureka.jar"]


