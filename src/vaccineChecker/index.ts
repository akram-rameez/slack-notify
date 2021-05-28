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

const init = async () => {
  const oldAppointmentListReserve = await redis.getAsync('availableAppointments');
  const oldAppointmentList = JSON.parse(oldAppointmentListReserve || '{}');

  console.log('COWIN API called @', moment().format());
  const appointmentRequests = await calendarByDistrict(269, moment().format('DD-MM-YYYY'));
  const appointmentRequestsNextWeek = await calendarByDistrict(269, moment().add(7, 'd').format('DD-MM-YYYY'));

  const availableAppointments: { [key: string]: any } = {};
  appointmentRequests.centers.forEach((center) => {
    const { center_id, name, sessions } = center;

    sessions.forEach((session) => {
      const {
        // @ts-ignore
        available_capacity_dose1, available_capacity_dose2, date, vaccine,
      } = session;

      if (available_capacity_dose1 > 0 || available_capacity_dose2 > 0) {
        if (!availableAppointments[`${center_id}:${name}:${date}`]) {
          availableAppointments[`${center_id}:${name}:${date}`] = {
            date,
            ...center,
          };
        }

        availableAppointments[`${center_id}:${name}:${date}`][vaccine] = session;
      }
    });
  });

  appointmentRequestsNextWeek.centers.forEach((center) => {
    const { center_id, name, sessions } = center;

    sessions.forEach((session) => {
      const {
        // @ts-ignore
        available_capacity_dose1, available_capacity_dose2, date, vaccine,
      } = session;

      if (available_capacity_dose1 > 0 || available_capacity_dose2 > 0) {
        if (!availableAppointments[`${center_id}:${name}:${date}`]) {
          availableAppointments[`${center_id}:${name}:${date}`] = {
            date,
            ...center,
          };
        }

        availableAppointments[`${center_id}:${name}:${date}`][vaccine] = session;
      }
    });
  });

  Object.keys(availableAppointments).forEach((aptKey: string) => {
    if (!oldAppointmentList![aptKey]) {
      sendMessage({
        channel: '#vaccine-checker',
        blocks: generateMessageTemplate(availableAppointments[aptKey]),
      });
    }
  });

  redis.setAsync('availableCenters', JSON.stringify(availableAppointments));
};

const main = () => {
  const str = generateTimeString(time);

  const task = cron.schedule(str, async () => {
    init();
  });

  return task;
};

export default main;
