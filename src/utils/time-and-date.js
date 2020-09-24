import moment from "moment";

export const formatWholeDate = (date) => moment(date).format(`YYYY-DD-MM`);
export const formatMonth = (date) => moment(date).format(`MMM DD`);
export const formatDateAndTime = (time) => moment(time).format(`DD/MM/YY HH:mm`);
export const formatTime = (time) => moment(time).format(`HH:mm`);

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
