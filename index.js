import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
import connectDB from './utils/db.js';
connectDB();

import userRouter from './routes/user.route.js';

app.use(express.json());
app.use('/users', userRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Big Ads server is listening on port ${port}`);
});
