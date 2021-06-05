/* eslint-disable camelcase */
/* eslint-disable max-len */
import cron from 'node-cron';
import {
  calendarByDistrict,
} from 'cowin-api-client';
import moment from 'moment';
import sendMessage from '../utils/slackMessage';
import generateTimeString, { GenerateCronTimeStringInterface } from '../utils/cronScheduleGenerator';
import redis from '../db/redis';
import generateMessageTemplate from './messageTemplate';

const time: GenerateCronTimeStringInterface = {
  second: '*/15',
};

// const oldAppointmentList: any[] = [];
const init = async () => {
  const oldAppointmentListReserve = await redis.getAsync('availableAppointments');
  const oldAppointmentList = JSON.parse(oldAppointmentListReserve || '[]');

  console.log('COWIN API called @', moment().format());
  const appointmentRequests = await calendarByDistrict(269, moment().format('DD-MM-YYYY'));
  const appointmentRequestsNextWeek = await calendarByDistrict(269, moment().add(7, 'd').format('DD-MM-YYYY'));

  const availableAppointments: { [key: string]: any } = {};
  appointmentRequests.centers.forEach((center) => {
    const { center_id, name, sessions } = center;

    sessions.forEach((session) => {
      const {
        // @ts-ignore
        // available_capacity_dose1,
        // @ts-ignore
        available_capacity_dose2,
        date,
        vaccine,
      } = session;

      // if (available_capacity_dose1 > 0) {
      //   if (!availableAppointments[`${center_id}:${name}:${date}:dose_1`]) {
      //     availableAppointments[`${center_id}:${name}:${date}:dose_1`] = {
      //       date,
      //       ...center,
      //     };
      //   }

      //   availableAppointments[`${center_id}:${name}:${date}:dose_1`][vaccine] = session;
      // }

      if (available_capacity_dose2 > 0) {
        if (!availableAppointments[`${center_id}:${name}:${date}:dose_2`]) {
          availableAppointments[`${center_id}:${name}:${date}:dose_2`] = {
            date,
            ...center,
          };
        }

        availableAppointments[`${center_id}:${name}:${date}:dose_2`][vaccine] = session;
      }
    });
  });
  appointmentRequestsNextWeek.centers.forEach((center) => {
    const { center_id, name, sessions } = center;

    sessions.forEach((session) => {
      const {
        // @ts-ignore
        // available_capacity_dose1,
        // @ts-ignore
        available_capacity_dose2,
        date,
        vaccine,
      } = session;

      // if (available_capacity_dose1 > 0 || available_capacity_dose2 > 0) {
      // if (available_capacity_dose1 > 0) {
      //   if (!availableAppointments[`${center_id}:${name}:${date}:dose_1`]) {
      //     availableAppointments[`${center_id}:${name}:${date}:dose_1`] = {
      //       date,
      //       ...center,
      //     };
      //   }

      //   availableAppointments[`${center_id}:${name}:${date}:dose_1`][vaccine] = session;
      // }

      if (available_capacity_dose2 > 0) {
        if (!availableAppointments[`${center_id}:${name}:${date}:dose_2`]) {
          availableAppointments[`${center_id}:${name}:${date}:dose_2`] = {
            date,
            ...center,
          };
        }

        availableAppointments[`${center_id}:${name}:${date}:dose_2`][vaccine] = session;
      }
    });
  });

  console.log(oldAppointmentList);

  const newCenters: string[] = [];
  Object.keys(availableAppointments).forEach((aptKey: string) => {
    if (!oldAppointmentList.includes(aptKey)) {
      const { name } = availableAppointments[aptKey];

      newCenters.push(name);
      try {
        sendMessage({
          channel: '#vaccine-checker',
          text: `Vaccine Available @ ${name}`,
          blocks: generateMessageTemplate(availableAppointments[aptKey]),
        });
      } catch (err) {
        // console.log(err);
      }
    }
  });

  const deleted = oldAppointmentList.filter((center: string) => !availableAppointments[center]);
  console.log(`Found ${newCenters.length} new centers. Removed ${deleted.length} centers`);

  // oldAppointmentList = Object.keys(availableAppointments);
  redis.setAsync('availableAppointments', JSON.stringify(Object.keys(availableAppointments)));
};

const main = () => {
  const str = generateTimeString(time);

  const task = cron.schedule(str, async () => {
    init();
  });

  return task;
};

export default main;
