
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();

// * Create express server
const app = express();

// * Connect database
dbConnection();

app.use(cors());
app.use(express.static('public'));

// * Body reading 
app.use(express.json());

// * Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// * Listen request
app.listen(process.env.PORT, () => {
    console.log(`Server runing on the port ${process.env.PORT}`);
})
