FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
RUN npm install -g pnpm
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN pnpm install
COPY frontend/ ./
RUN pnpm build

FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY springboot/ ./springboot/
COPY --from=frontend-build /app/frontend/dist ./springboot/src/main/resources/static/
RUN cd springboot && mvn package -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/springboot/target/zara-interpreter-1.0.0.jar app.jar
EXPOSE 8080
CMD ["java", "-Xmx300m", "-Xms75m", "-jar", "app.jar"]
