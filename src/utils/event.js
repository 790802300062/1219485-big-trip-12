import {getRandomInteger} from "../utils/common.js";

export const getEndTime = (startTime, duration)=> {
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + duration.minute);
  endTime.setHours(endTime.getHours() + duration.hour);
  return endTime;
};

export const createDates = (events) => {
  const dates = [];
  for (let event of events) {
    let newDate = new Date(event.startDate);
    newDate = newDate.setHours(23, 59, 59, 999);
    if (!dates.includes(newDate)) {
      dates.push(newDate);
    }
  }
  return dates;
};

export const createDateEventsList = (events, date) => {
  return events.filter((event) => event.startDate.getMonth() === date.getMonth() && event.startDate.getDate() === date.getDate());
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

const PhotoAmount = {
  MIN: 1,
  MAX: 10
};

const MAX_DESCRIPTION_SENTENCE_AMOUNT = 4;

export const generateDescription = () => {
  const sentences = DESCRIPTION.split(`.`);
  let text = ``;

  for (let i = 0; i < getRandomInteger(0, MAX_DESCRIPTION_SENTENCE_AMOUNT); i++) {
    text += sentences[getRandomInteger(0, sentences.length - 1)] + `. `;
  }

  return text;
};

export const generatePhotos = () => {
  const photos = [];

  for (let i = 0; i < getRandomInteger(PhotoAmount.MIN, PhotoAmount.MAX); i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return photos;
};


