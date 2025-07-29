# Use an official OpenJDK JRE as the base image
FROM eclipse-temurin:21-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file into the container
COPY target/*.jar app.jar

# Expose port (commonly used by Spring Boot)
EXPOSE 8089

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
