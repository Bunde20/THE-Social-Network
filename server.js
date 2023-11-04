const express = require('express');
const db = require('./config/connection');
const connectDB = require('./config/connection');

connectDB();

const PORT = process.env.PORT || 3001;
const app = express();

app.listen(PORT, () => { console.log(`App listening on port ${PORT}`); });
