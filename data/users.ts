import * as dotenv from 'dotenv';
dotenv.config();

export const users = {
  standard: {
    username: process.env.TEST_USERNAME || 'tester_champion',
    password: process.env.TEST_PASSWORD || '123123',
  },
};
