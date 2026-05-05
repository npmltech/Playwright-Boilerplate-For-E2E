import * as dotenv from 'dotenv';
dotenv.config();

export const users = {
  standard: {
    username: process.env.USERNAME || 'tester_champion',
    password: process.env.PASSWORD || '123123',
  },
};
