const Time = {
  HOURS: 24,
  MINUTES: 60,
  MILISECONDS: 60000
};

export const addZeroInBeginning = (number) => {
  return String(number).padStart(2, `0`);
};

export const formatDateToString = (date) => {
  const year = addZeroInBeginning(date.getFullYear().toString().substr(-2));
  const month = addZeroInBeginning(date.getMonth());
  const day = addZeroInBeginning(date.getDate());

  return `${day}/${month}/${year} ${formatTimeToString(date)}`;
};

export const formatTimeToString = (date = new Date()) => {
  const hours = addZeroInBeginning(date.getHours());
  const minutes = addZeroInBeginning(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const formatWholeDate = (date) => {
  const formattedDate = new Date(date);
  formattedDate.setHours(formattedDate.getHours());

  return formattedDate.toISOString();
};

export const formatMonthDate = new Intl.DateTimeFormat(`en-GB`, {
  month: `short`,
  day: `numeric`,
}).format;

export const formatDayDate = (date) => formatWholeDate(date).slice(0, 10);

export const getDatesDifference = (startDate, endDate) => {
  let difference = endDate - startDate;
  difference -= difference % Time.MILISECONDS;
  difference = difference / Time.MILISECONDS;
  const minutes = difference % Time.MINUTES;
  difference -= minutes;
  difference = difference / Time.MINUTES;
  const hours = difference % Time.HOURS;
  difference -= hours;
  const days = difference / Time.HOURS;

  let formattedTime = ``;

  if (days > 0) {
    formattedTime = addZeroInBeginning(days) + `D `;
  }

  if (days > 0 || hours > 0) {
    formattedTime = formattedTime + addZeroInBeginning(hours) + `H `;
  }

  formattedTime = formattedTime + addZeroInBeginning(minutes) + `M`;

  return formattedTime;
};

