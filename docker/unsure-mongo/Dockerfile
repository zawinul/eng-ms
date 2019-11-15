
FROM mongo

WORKDIR /app
COPY mongo.cfg /app
COPY start-in-docker.sh /app
EXPOSE 27017

CMD ["./start-in-docker.sh"]



