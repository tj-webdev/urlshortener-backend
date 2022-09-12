require('dotenv').config();

PORT = process.env.PORT || 4000;

const cookieParser = require('cookie-parser');
const express = require('express');
const dbConnect = require('./mongodb');
const cors = require('cors');

// Express app setup & configurations
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.ORIGIN_URL,
  credentials: true
}))

// connect database 
dbConnect(process.env.DB_URL);

// include routes
const shortUrlRoute = require('./routes/shortUrlRoute');
const userRoute = require('./routes/userRoute');

app.use('/',shortUrlRoute);
app.use('/user',userRoute);

app.listen(PORT);