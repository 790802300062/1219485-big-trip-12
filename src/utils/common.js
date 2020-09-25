import {mapCategoryToType} from '../const.js';

const ESC_KEY = `Escape`;

const TagName = {
  INPUT: `INPUT`,
  LINK: `A`
};

const isTagName = (evt, tag) => evt.target.tagName === tag;

export const isInputTag = (evt) => isTagName(evt, TagName.INPUT);

export const isLinkTag = (evt) => isTagName(evt, TagName.LINK);

export const isEscEvent = (evt) => evt.key === ESC_KEY;

export const isOnline = () => window.navigator.onLine;

export const getDuration = (event) => event.timeEnd - event.timeStart;

export const makeFirstLetterUppercased = (sentence) => sentence[0].toUpperCase() + sentence.slice(1).toLowerCase();

export const generateEventPreposition = (type) => {
  if (mapCategoryToType.get(`Activity`).includes(type)) {
    return `${type} in`;
  }

  return `${type} to`;
};
