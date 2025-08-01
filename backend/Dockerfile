# Stage 1: Build the JAR using Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy only Maven files first to leverage cache if dependencies didn't change
COPY pom.xml .
COPY src ./src

# Build the package without tests
RUN mvn clean package -DskipTests

# Stage 2: Use minimal JDK alpine image to run the app
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copy the built jar explicitly by name; adjust JAR name if different
COPY --from=build /app/target/encryptify-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8089

# Optional: Set Java options (e.g., heap size) - adjust as needed
# ENV JAVA_TOOL_OPTIONS="-Xms256m -Xmx512m"

ENTRYPOINT ["java", "-jar", "app.jar"]
