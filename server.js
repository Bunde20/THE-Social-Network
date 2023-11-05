const express = require('express');
const connectDB = require('./config/connection');
const routes = require('./routes');

connectDB();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(PORT, () => { console.log(`App listening on port ${PORT}`); });
