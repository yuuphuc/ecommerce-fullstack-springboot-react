FROM openjdk:22-jdk-slim

WORKDIR /app
COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Sửa dòng này: Bỏ ngoặc vuông để chạy lệnh thông qua shell
CMD java -jar target/*.jar