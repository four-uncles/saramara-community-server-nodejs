import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const env = dotenv.config();
if (env.error) throw new Error("⚠️  Couldn't find .env file  ⚠️");

const config = {
    
    /*
     * port
     */
    port: parseInt(process.env.PORT, 10),

    /*
     * DB connection info
     */
    databaseURL: process.env.DB_URL,
    databasePort: process.env.DB_PORT,
    databaseUser: process.env.DB_USERNAME,
    databasePassword: process.env.DB_PASSWORD,
    databaseName: process.env.DATABASE,
    databaseDialect: process.env.DIALECT,

    /*
     * cookie
     */
    cookieSecret: process.env.COOKIE_SECRET,

    /*
     * Your secret sauces
     */
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGO,
    jwtAccessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_ExpiresIn,
    jwtRefreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_ExpiresIn,
    jwtIssuer: process.env.JWT_ISSUER,


    /*
     * Used by winston logger
     */
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },

    /*
     * API configs
     */
    api: {
        prefix: '/api',
    }
};

export default config;