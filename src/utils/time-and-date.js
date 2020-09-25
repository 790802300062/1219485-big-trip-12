import moment from "moment";

const FULL_DATE_FORMAT = `YYYY-DD-MM`;
const DATE_AND_MONTH_FORMAT = `MMM DD`;
const DATE_AND_TIME_FORMAT = `DD/MM/YY HH:mm`;
const TIME_FORMAT = `HH:mm`;

export const formatWholeDate = (date) => moment(date).format(FULL_DATE_FORMAT);
export const formatMonth = (date) => moment(date).format(DATE_AND_MONTH_FORMAT);
export const formatDateAndTime = (time) => moment(time).format(DATE_AND_TIME_FORMAT);
export const formatTime = (time) => moment(time).format(TIME_FORMAT);

export const getTimeInterval = (interval) => {
  const duration = moment.duration(interval);

  return [
    [Math.floor(duration.asDays()), `D`],
    [duration.hours(), `H`],
    [duration.minutes(), `M`]
  ]
  .reduce((result, [number, letter], index, durations) => {
    return (number || result.length || (index === (durations.length - 1) && !result.length))
      ? `${result} ${String(number).padStart(2, `0`)}${letter}`
      : result;
  }, ``)
  .trim();
};

export const getTripDatesInterval = (events) => {
  if (!events.length) {
    return ``;
  }

  const start = events[0].timeStart;
  const end = events[events.length - 1].timeEnd;

  const endString = start.getMonth() === end.getMonth()
    ? moment(end).format(`DD`)
    : moment(end).format(`MMM DD`);

  return `${formatMonth(start)}&nbsp;&mdash;&nbsp;${endString}`;
};

export const getNewDate = (existingDate = new Date()) => {
  const newDate = new Date(existingDate);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};
