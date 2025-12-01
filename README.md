# Task Planning Board
This project is a simple **Task Planning Board** that allows users to create projects and manage tasks within those projects.  
Each project can contain multiple tasks. 
The application uses a frontend UI together with a REST API and a PostgreSQL database.

## Stack
**Technology Stack:**

- **Frontend:** Angular  
- **Backend:** Node.js + Express  
- **Validation:** Zod  
- **Database:** PostgreSQL  
- **Containerization:** Docker & Docker Compose  

**Make sure Docker (v4.50.0 or higher) is installed**. To check, use `docker --version`.

## How to install
1. Use `docker compose up --build` to run the app.
2. To shut down the application, use `docker compose down`. 
3. Open the app on ``localhost:4200``.
4. For testing, use `ng test`.

**Manual installation**
1. For backend, use:
cd backend
npm install
npm run start

2. For frontend, use:
cd frontend
npm install
ng serve

### Environment variables
All required environment variables are defined inside a `docker-compose.yaml` file:
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
POSTGRES_DB: appdb

## Design notes
1. The app uses a simple database structure with two main tables: **projects** and **tasks**. Each task is linked to a project using a foreign key. 
2. **ENUM types** are also used for tasks to prevent inserting invalid status or priority. 
3. A small seed script is included in the backend. It creates necessary tables and enum types during the initial setup.
4. A custom pipe and a small adapter were created for frontend and backend respectively to transform data into necessary formats. 