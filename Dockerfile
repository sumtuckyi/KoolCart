FROM openjdk:17

ARG JAR_FILE=build/libs/KoolCart-0.0.1-SNAPSHOT.jar

COPY ${JAR_FILE} koolcart.jar

ENTRYPOINT [ "java", "-jar", "koolcart.jar" ]