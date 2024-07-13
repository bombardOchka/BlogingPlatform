import express from 'express';
import { userRouter } from './routes/userRouter.js';
import { postRouter } from './routes/postRouter.js';
import { commentRouter } from './routes/commentRouter.js';
import { statistikRouter } from './routes/statistic.js';
import {ErrorHandler} from './middleware/ErrorHandler.js';
import passport from 'passport'
import strategy from './middleware/jwt-middleware.js'
import mongoose from 'mongoose';
import { mongoURI } from "./config/mongodb-config.js";



const app = express();
app.use(express.json());


app.set('view engine', 'pug');



app.use('/user', userRouter);
app.use('/posts', postRouter)
app.use('/comments', commentRouter)
app.use('/statistik', statistikRouter)
app.use(passport.initialize())
strategy(passport)
app.use((req, res, next) => next(new Error('Route Not Found')))
app.use(ErrorHandler);

mongoose.connect(mongoURI)
    .then(() => console.log('Connected!'))
    .catch(() => console.log('Failed to connect to mongo'))



export { app };
