import * as dotenv from 'dotenv';
dotenv.config();
export const users = {
    standard: {
        username: process.env.USERNAME || '',
        password: process.env.PASSWORD || '',
    },
};