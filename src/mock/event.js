import {getRandomInteger} from '../utils/common.js';
import {OPTIONS} from '../const.js';

const TRIP_EVENTS = [
  {
    name: `Taxi`,
    type: `moving`
  },
  {
    name: `Bus`,
    type: `moving`
  },
  {
    name: `Train`,
    type: `moving`
  },
  {
    name: `Ship`,
    type: `moving`
  },
  {
    name: `Transport`,
    type: `moving`
  },
  {
    name: `Drive`,
    type: `moving`
  },
  {
    name: `Flight`,
    type: `moving`
  },
  {
    name: `Check-in`,
    type: `arrival`
  },
  {
    name: `Sightseeing`,
    type: `arrival`
  },
  {
    name: `Restaurant`,
    type: `arrival`
  }
];

const DESTINATION_CITIES = [
  `London`,
  `Paris`,
  `New York`,
  `Berlin`,
  `Amsterdam`,
  `Tokyo`,
  `Bangkok`,
  `Madrid`,
  `Rome`,
  `Moscow`,
  `Barcelona`,
  `Prague`
];

const EventPrice = {
  MIN: 5,
  MAX: 500
};

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                     Cras aliquet varius magna, non porta ligula feugiat eget.
                     Fusce tristique felis at fermentum pharetra.
                     Aliquam id orci ut lectus varius viverra.
                     Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
                     Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
                     Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
                     Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.
                     Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const DAY_GAP = 15;

const MaxInDayTime = {
  HOURS: 23,
  MINUTES: 59
};

const OptionAmount = {
  MIN: 0,
  MAX: 4
};

const PhotoAmount = {
  MIN: 1,
  MAX: 10
};

const MAX_DESCRIPTION_SENTENCE_AMOUNT = 4;

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

const destinationDescription = () => {
  const sentences = DESCRIPTION.split(`.`);
  let text = ``;

  for (let i = 0; i < getRandomInteger(0, MAX_DESCRIPTION_SENTENCE_AMOUNT); i++) {
    text += sentences[getRandomInteger(0, sentences.length - 1)] + `. `;
  }

  return text;
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

const generatePhotos = () => {
  const photos = [];

  for (let i = 0; i < getRandomInteger(PhotoAmount.MIN, PhotoAmount.MAX); i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return photos;
};


export const generateEvent = () => {
  return {
    event: generateEventType(),
    destinationCity: generateDestinationCity(),
    startDate: generateStartDate(DAY_GAP),
    duration: generateDuration(),
    price: getRandomInteger(EventPrice.MIN, EventPrice.MAX),
    options: generateOptions(`moving`),
    destination: {
      description: destinationDescription(),
      photo: generatePhotos()
    }
  };
};
