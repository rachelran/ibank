FROM openjdk:8-jdk-alpine
EXPOSE 8080

VOLUME /tmp

ADD cashflow-service-0.0.1-SNAPSHOT.jar /opt/sap/bin/cashflow-service-0.0.1-SNAPSHOT.jar

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/opt/sap/bin/cashflow-service-0.0.1-SNAPSHOT.jar"]
