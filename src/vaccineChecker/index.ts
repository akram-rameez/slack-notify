import cron from 'node-cron';
import generateTimeString, { GenerateCronTimeStringInterface } from '../utils/cronScheduleGenerator';

const time: GenerateCronTimeStringInterface = {};

const main = () => {
  const str = generateTimeString(time);

  const task = cron.schedule(str, () => {
    console.log('ping');
  });

  return task;
};

export default main;
