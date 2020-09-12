import {
  VEHICLE_TYPES,
  DESTINATION_CITIES,
  MAX_OFFERS_AMOUNT,
  Price,
  IdNumber
} from './const.js';

import {
  getRandomInteger,
  generateDestinationDescription,
  generateAdditionalOffers,
  generateRandomDate
} from './utils.js';

import {addZeroInBeginning} from '../utils/time-and-date.js';

export const generateEvent = (date) => {
  let event = {
    id: getRandomInteger(IdNumber.MIN, IdNumber.MAX),
    type: VEHICLE_TYPES[getRandomInteger(0, VEHICLE_TYPES.length - 1)],
    destination: generateDestinationDescription(DESTINATION_CITIES[getRandomInteger(0, DESTINATION_CITIES.length - 1)]),
    offers: generateAdditionalOffers(getRandomInteger(0, MAX_OFFERS_AMOUNT)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    price: getRandomInteger(Price.MIN, Price.MAX)
  };

  date = generateRandomDate(date);
  event.startTime = date;
  event.day = `${date.getFullYear()}-${addZeroInBeginning(date.getMonth() + 1)}-${addZeroInBeginning(date.getDate())}`;
  date = generateRandomDate(date);
  event.endTime = date;

  return event;
};
