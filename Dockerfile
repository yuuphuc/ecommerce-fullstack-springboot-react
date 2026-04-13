# --- Bước 1: Build ứng dụng ---
FROM openjdk:22-jdk-slim AS builder
WORKDIR /app
# Copy toàn bộ code vào để build
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# --- Bước 2: Chạy ứng dụng ---
FROM openjdk:22-jdk-slim
WORKDIR /app
# Chỉ copy file .jar đã được build thành công ở Bước 1 sang đây và đổi tên
COPY --from=builder /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

# Mở port (thường Spring Boot dùng 8080)
EXPOSE 8080

# Chạy ứng dụng với tên file cố định
CMD ["java", "-jar", "app.jar"]