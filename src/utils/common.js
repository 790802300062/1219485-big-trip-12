import {EventKeyCode} from '../const.js';

export const makeFirstLetterToUpperCase = (str) => {
  if (!str) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1);
};

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
      return `${events[0].destination}`;
    case 2:
      return `${events[0].destination} &mdash; ${events[events.length - 1].destination}`;
    case 3:
      return `${events[0].destination} &mdash; ${events[1].destination} &mdash; ${events[events.length - 1].destination}`;
    default:
      return `${events[0].destination} &mdash; ... &mdash; ${events[events.length - 1].destination}`;
  }
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
