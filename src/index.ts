// import onDeath from 'death';
import VaccineChecker from './vaccineChecker';
import { createConnection } from './db/mongo';
import redisClient from './db/redis';

const init = async () => {
  await createConnection();
  await redisClient.setAsync('appStartTime', `${new Date()}`);

  const tasks = [
    VaccineChecker(),
  ];

  tasks.forEach((task) => {
    task.start();
  });

  console.info('App start successful');

  // onDeath((signal) => {
  //   console.log(signal, 'die');
  // });
};

init();
