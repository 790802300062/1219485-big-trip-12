import {
  AdditivesToDate,
  DESCRIPTION,
  MAX_PHOTOS_AMOUNT,
  MAX_SENTENCES_IN_DESCRIPTION,
  DESTINATION_CITIES,
  ADDITIONAL_OFFERS,
} from './const.js';

export const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateRandomDate = (date) => {
  const randomDate = new Date(date);

  randomDate.setDate(randomDate.getDate()
    + getRandomInteger(0, AdditivesToDate.DAYS));

  randomDate.setHours(randomDate.getHours()
    + getRandomInteger(0, AdditivesToDate.HOURS));

  randomDate.setMinutes(getRandomInteger(0, AdditivesToDate.MINUTES));

  return new Date(randomDate);
};

export const generateDescription = (sentencesNumber) => new Array(sentencesNumber)
  .fill()
  .map(() => DESCRIPTION[getRandomInteger(0, DESCRIPTION.length - 1)])
  .join(` `);

export const generatePhotos = (photosAmount) => new Array(photosAmount)
  .fill()
  .map(() => {
    return {
      href: `img/photos/${getRandomInteger(1, MAX_PHOTOS_AMOUNT)}.jpg`,
      description: generateDescription(getRandomInteger(1, MAX_SENTENCES_IN_DESCRIPTION)),
    };
  });

export const generateDestinationDescription = (item) =>
  ({
    name: item,
    description: generateDescription(getRandomInteger(1, MAX_SENTENCES_IN_DESCRIPTION)),
    photos: generatePhotos(getRandomInteger(1, MAX_PHOTOS_AMOUNT)),
  });

export const generateDestinationCitiesDescription = () =>
  DESTINATION_CITIES.map((item) =>
    generateDestinationDescription(item));

export const generateAdditionalOffers = (offersAmount) => new Array(offersAmount)
  .fill()
  .map(() => ADDITIONAL_OFFERS[getRandomInteger(0, ADDITIONAL_OFFERS.length - 1)]);
