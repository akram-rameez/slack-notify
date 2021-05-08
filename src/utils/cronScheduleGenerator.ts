export interface GenerateCronTimeStringInterface {
    second?: number;
    minute?: number;
    hour?: number;
    day?: number;
    month?: number;
    dayOfWeek?: number;
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
