import {getRandomInteger} from '../utils/common.js';
import {generateDescription, generatePhotos} from '../utils/event.js';
import {OPTIONS, TRIP_EVENTS, DESTINATION_CITIES} from '../const.js';

const EventPrice = {
  MIN: 5,
  MAX: 500
};

const DAY_GAP = 15;

const MaxInDayTime = {
  HOURS: 23,
  MINUTES: 59
};

const OptionAmount = {
  MIN: 0,
  MAX: 4
};

const generateOptions = (eventType) => {
  const additionalOptions = Array.from(new Set());
  additionalOptions.forEach(function () {
    const currentOptionNumber = getRandomInteger(OptionAmount.MIN, OPTIONS.length - 1);
    if (OPTIONS[currentOptionNumber].eventType === eventType) {
      additionalOptions.add(currentOptionNumber);
    }
  });

  const listOfOptions = [];
  for (let item of additionalOptions) {
    listOfOptions.push(OPTIONS[item]);
  }
  return listOfOptions;
};

const generateEventType = () => {
  const randomIndex = getRandomInteger(0, TRIP_EVENTS.length - 1);

  return TRIP_EVENTS[randomIndex];
};

const generateDestinationCity = () => {
  const randomIndex = getRandomInteger(0, DESTINATION_CITIES.length - 1);

  return DESTINATION_CITIES[randomIndex];
};

const generateDuration = () => {
  return {
    hour: getRandomInteger(0, MaxInDayTime.HOURS),
    minute: getRandomInteger(0, MaxInDayTime.MINUTES)
  };
};

const generateStartDate = () => {
  const min = new Date();
  const max = new Date();
  max.setDate(min.getDate() + Math.round(DAY_GAP / 2));
  min.setDate(min.getDate() - Math.round(DAY_GAP / 2));

  return new Date(+min + Math.random() * (max - min));
};

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const generateEvent = () => {
  return {
    event: generateEventType(),
    destinationCity: generateDestinationCity(),
    startDate: generateStartDate(DAY_GAP),
    duration: generateDuration(),
    price: getRandomInteger(EventPrice.MIN, EventPrice.MAX),
    options: generateOptions(`transfer`),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    destination: {
      description: generateDescription(),
      photo: generatePhotos()
    },
    id: generateId()
  };
};
