const express = require('express');
const pino = require('./middlewares/pino');
const logger = require('./helpers/pino');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.options('*', cors());
app.use(pino);

const userRoutes = require('./routes/userRoutes');

const port = process.env.PORT;
const url = process.env.DB;
const dbName = process.env.DB_NAME;

MongoClient.connect(url)
    .then(client => {

        logger.info('Connected to MongoDB');

        const db = client.db(dbName);

        app.use('/api/user', userRoutes(db));

        app.listen(port, () => {

            logger.info(`Server running on port ${port}`)

        });

    })
    .catch(err => {

        logger.error(err);

    });

module.exports = app;
