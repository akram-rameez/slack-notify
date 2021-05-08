/* eslint-disable max-len */
import cron from 'node-cron';
import {
  calendarByDistrict,
} from 'cowin-api-client';
import sendMessage from '../utils/slackMessage';
import generateTimeString, { GenerateCronTimeStringInterface } from '../utils/cronScheduleGenerator';

const time: GenerateCronTimeStringInterface = {
};

// eslint-disable-next-line no-unused-vars
const addresses = [
  {
    state: 'Karnataka',
    state_id: 16,
    district: 'Dakshina Kannada',
    district_id: 269,
    pinCode: 574154,
  },
];

const init = async () => {
  const appointmentRequests = await calendarByDistrict(276, '08-05-2021');

  const availableAppointments: { date: string; name: string; district: string; pincode: number; ageLimit: number; vaccine: string; }[] = [];
  appointmentRequests.centers.forEach((center) => {
    center.sessions.forEach((session) => {
      if (session.available_capacity > 0) {
        availableAppointments.push({
          date: session.date,
          name: center.name,
          district: center.district_name,
          pincode: center.pincode,
          ageLimit: session.min_age_limit,
          vaccine: session.vaccine,
        });
      }
    });
  });

  console.log(availableAppointments.map((x) => ({ name: x.name, data: x.date })));
};

const main = () => {
  const str = generateTimeString(time);
  init();

  const task = cron.schedule(str, async () => {
    sendMessage({
      channel: '#testing',
      text: 'ping',
    });
  });

  return task;
};

export default main;
