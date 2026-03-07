import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import './entities/User.js';
import './entities/Event.js';
import router from './routes/index.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/', router);

sequelize.authenticate()
    .then(() => {
        console.log(`Database connection established`);
        return sequelize.sync();
    })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    });
