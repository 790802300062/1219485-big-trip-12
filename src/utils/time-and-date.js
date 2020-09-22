import moment from 'moment';

export const formatWholeDate = (date) => moment(date).format(`YYYY-DD-MM`);
export const formatMonth = (date) => moment(date).format(`MMM DD`);
export const formatDateAndTime = (time) => moment(time).format(`DD/MM/YY HH:mm`);
export const formatTime = (time) => moment(time).format(`HH:mm`);

export const getTimeInterval = (interval) => {
  const duration = moment.duration(interval);

  return [
    [duration.days(), `D`],
    [duration.hours(), `H`],
    [duration.minutes(), `M`],
  ]
  .map(([number, letter]) => {
    return number ? `${String(number).padStart(2, `0`)}${letter}` : ``;
  })
  .filter(Boolean)
  .join(` `);
};

export const getTripDatesInterval = (events) => {
  if (!events.length) {
    return ``;
  }

  const start = events[0].timeStart;
  const end = events[events.length - 1].timeStart;

  const endString = start.getMonth() === end.getMonth()
    ? moment(end).format(`DD`)
    : moment(end).format(`MMM DD`);

  return `${formatMonth(start)}&nbsp;&mdash;&nbsp;${endString}`;
};
