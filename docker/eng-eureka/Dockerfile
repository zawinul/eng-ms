
FROM openjdk:8-jdk

ENV JAVA_HOME              /usr/lib/jvm/java-8-openjdk-amd64
ENV JAVA_OPTS              ""
ENV PATH                   $PATH:$JAVA_HOME/bin



WORKDIR /app

EXPOSE 8761

COPY eng-eureka.jar /app
COPY start-in-docker.sh /app

CMD ["./start-in-docker.sh"]


