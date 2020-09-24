import {EVENT_TYPES} from '../const.js';

const ESC_KEY = `Escape`;

const TagName = {
  INPUT: `INPUT`,
  LINK: `A`
};

const isTagName = (evt, tag) => {
  return evt.target.tagName === tag;
};

export const isInputTag = (evt) => {
  return isTagName(evt, TagName.INPUT);
};

export const isLinkTag = (evt) => {
  return isTagName(evt, TagName.LINK);
};

export const generateEventPreposition = (type) => {
  if (EVENT_TYPES.get(`Activity`).includes(type)) {
    return `${type} in`;
  }

  return `${type} to`;
};

export const isEscEvent = (evt) => {
  return evt.key === ESC_KEY;
};

export const getDuration = (event) => {
  return event.timeEnd - event.timeStart;
};

export const makeFirstLetterUppercased = (sentence) => {
  return sentence[0].toUpperCase() + sentence.slice(1).toLowerCase();
};

export const isOnline = () => {
  return window.navigator.onLine;
};
