FROM gradle:8.10-jdk21 AS build
WORKDIR /workspace

COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle settings.gradle ./

RUN chmod +x gradlew
RUN ./gradlew --no-daemon dependencies
COPY src src
RUN ./gradlew --no-daemon clean bootJar

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*
RUN addgroup --system spring && adduser --system --ingroup spring spring
COPY --from=build /workspace/build/libs/*.jar /app/app.jar
RUN mkdir -p /app/logs && chown -R spring:spring /app
USER spring
EXPOSE 8080
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]