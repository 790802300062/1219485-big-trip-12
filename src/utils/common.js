import {EventKeyCode} from '../const.js';
import {
  addZeroInBeginning,
  formatMonth
} from './time-and-date.js';

export const makeFirstLetterToUpperCase = (string) => string[0].toUpperCase() + string.slice(1);

export const isEscapeEvent = (evt) => {
  return evt.key === EventKeyCode.ESCAPE || evt.key === EventKeyCode.ESC;
};

export const sortEventsByTime = (firstEvent, secondEvent) =>
  (secondEvent.endTime - secondEvent.startTime) - (firstEvent.endTime - firstEvent.startTime);

export const sortEventsByPrice = (firstEvent, secondEvent) => secondEvent.price - firstEvent.price;

export const calculateTotalTripCost = (events) => events.reduce((eventsPrice, event) =>
  eventsPrice + event.price + event.offers.reduce((offersPrice, offer) =>
    offersPrice + offer.price, 0), 0);

export const getTripRoute = (events) => {
  switch (events.length) {
    case 0:
      return ``;
    case 1:
      return `${events[0].destination.name}`;
    case 2:
      return `${events[0].destination.name} &mdash; ${events[events.length - 1].destination.name}`;
    case 3:
      return `${events[0].destination.name} &mdash; ${events[1].destination.name} &mdash; ${events[events.length - 1].destination.name}`;
    default:
      return `${events[0].destination.name} &mdash; ... &mdash; ${events[events.length - 1].destination.name}`;
  }
};

export const getTripDuration = (events) => {
  const startTime = events[0].startTime;
  const endTime = events[events.length - 1].endTime;

  if (startTime.getMonth() !== endTime.getMonth()) {
    return `${formatMonth(startTime)}&nbsp;&mdash;&nbsp;${formatMonth(endTime)}`;
  } else {
    if (startTime.getDay() !== endTime.getDay()) {
      return `${formatMonth(startTime)}&nbsp;&mdash;&nbsp;${addZeroInBeginning(endTime.getDay())}`;
    }
  }

  return formatMonth(startTime);
};

export const sortItemsByID = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
