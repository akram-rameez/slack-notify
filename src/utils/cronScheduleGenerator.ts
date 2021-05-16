export interface GenerateCronTimeStringInterface {
    second?: number | string;
    minute?: number | string;
    hour?: number | string;
    day?: number | string;
    month?: number | string;
    dayOfWeek?: number | string;
}

function GenerateCronTimeString(obj: GenerateCronTimeStringInterface) {
  const {
    second = '*',
    minute = '*',
    hour = '*',
    day = '*',
    month = '*',
    dayOfWeek = '*',
  } = obj;

  return `${second} ${minute} ${hour} ${day} ${month} ${dayOfWeek}`;
}

export default GenerateCronTimeString;
