import express from 'express';
import route  from './routes/route.js';
import mongoose from 'mongoose';
import 'dotenv/config'

const app = express();

app.use(express.json());

app.use('/', route);

mongoose.connect(process.env.MY_STRING)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log(err))


app.listen(3000, function(){
    console.log('Express is running on port 3000');
})