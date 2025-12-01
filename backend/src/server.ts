import cors from 'cors';
import express from 'express';
import { ConnectToDB } from './db';
import projectsRouter from './api/projects.routes';
import tasksRouter from './api/tasks.routes';
import { createTables } from './seed';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;


app.use("/api/projects", projectsRouter);
app.use("/api/projects", tasksRouter);

async function start() {
     try {  
      await ConnectToDB();
      await createTables();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
     } catch (error) {
      console.error("Error while starting a server", error);
     }
  }

start();