# syntax=docker/dockerfile:1.7

FROM maven:3.9.9-eclipse-temurin-17 AS deps
WORKDIR /workspace

COPY pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline

FROM deps AS build
WORKDIR /workspace

COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre AS runtime-base
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system spring \
    && useradd --system --gid spring --home-dir /home/spring --create-home spring \
    && chown -R spring:spring /app

COPY --from=build /workspace/target/*.jar /app/app.jar

USER spring:spring
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]

FROM runtime-base AS runtime-local
ENV SPRING_PROFILES_ACTIVE=local

FROM runtime-base AS runtime-prod
ENV SPRING_PROFILES_ACTIVE=prod
