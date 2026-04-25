FROM eclipse-temurin:21-alpine AS build
COPY mvnw .
COPY .mvn .mvn
COPY src /home/app/src
COPY pom.xml /home/app
RUN ./mvnw -f /home/app/pom.xml clean package -Dmaven.test.skip

FROM eclipse-temurin:21-jdk AS run
VOLUME /tmp
COPY --from=build /home/app/target/*.jar app.jar
EXPOSE 8008
ENTRYPOINT ["java", "-jar", "/app.jar"]