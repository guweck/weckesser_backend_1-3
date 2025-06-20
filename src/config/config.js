import dotenv from 'dotenv';
dotenv.config();

export default {
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/proyecto_backend',
    JWT_SECRET: process.env.JWT_SECRET || 'secretoSuperSecreto'
};
