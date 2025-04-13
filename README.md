# Cineyal: Movie Rental System

A full-stack movie rental application with a React frontend and Spring Boot microservices.

## Prerequisites

Please refer to each technology's official website for detailed installation instructions:

- Java 17
- Node.js (18+)
- npm or yarn
- Maven
- PostgreSQL
- ActiveMQ

## Installation & Setup

1. Clone this repository or extract the code files from the zip file
2. Set up PostgreSQL database for the Movies service with movierentaldb db
3. Configure ActiveMQ for communication between the backend and the email service

## Starting the Services

### 1. Start the Movie Service

```bash
cd Movies
mvn install
mvn spring-boot:run
```

### 2. Start the Email Service

```bash
cd EmailService
mvn install
mvn spring-boot:run
```

### 3. Start the Frontend

```bash
cd movies-front
npm install
npm run dev
```

The frontend will be available at http://localhost:5173 