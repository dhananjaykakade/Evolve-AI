import express from 'express';
import { httpLogger } from "./utils/logger.js";

const app = express();
app.use(httpLogger); 

app.get('/', (req, res) => {
    res.send('Hello, Express.js!');
    }
);


app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });

export default app;