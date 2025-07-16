const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors'); // <-- THIS LINE MUST BE HERE

app.use(bodyParser.json()); // req.body

// THIS IS THE CRITICAL CORS CONFIGURATION. It MUST be before your routes.
app.use(cors()); // <-- THIS LINE MUST BE HERE

const PORT = process.env.PORT || 3000;

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers (CORS must be applied BEFORE these)
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


app.listen(PORT, ()=>{
    console.log('listening on port 3000');
})