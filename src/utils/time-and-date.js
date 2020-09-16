import moment from "moment";
import {duration} from "moment";

export const addZeroInBeginning = (number) => {
  return String(number).padStart(2, `0`);
};

export const formatWholeDate = (date) => moment(date).format();
export const formatMonth = (date) => moment(date).format(`MMM D`);
export const formatDateAndTime = (date) => moment(date).format(`DD/MM/YY HH:mm`);
export const formatDate = (date) => moment(date).format(`DD/MM/YYYY`);
export const formatTime = (date) => moment(date).format(`HH:mm`);

export const calculateTimeDifference = (startDate, endDate) => {
  const {days, hours, minutes} = duration(endDate - startDate)._data;

  return `${
    days > 0 ? `${addZeroInBeginning(days)}D ` : ``
  }${
    days > 0 || hours > 0 ? `${addZeroInBeginning(hours)}H ` : ``
  }${
    `${addZeroInBeginning(minutes)}M`}`;
};

export const isDatesEqual = (firstDate, secondDate) => {
  if (firstDate === null && secondDate === null) {
    return true;
  }

  return moment(firstDate).isSame(secondDate, `day`);
};

