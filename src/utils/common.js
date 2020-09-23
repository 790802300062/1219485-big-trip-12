import {EVENT_TYPES} from '../const.js';

const ESC_KEY = `Escape`;

const TagName = {
  INPUT: `INPUT`,
  LINK: `A`
};

const isTagName = (evt, tag) => evt.target.tagName === tag;

export const isInputTag = (evt) => isTagName(evt, TagName.INPUT);
export const isLinkTag = (evt) => isTagName(evt, TagName.LINK);

export const makeFirstLetterUppercased = (sentence) => sentence[0].toUpperCase() + sentence.slice(1).toLowerCase();
export const getEventDuration = (event) => event.timeEnd - event.timeStart;

export const determineEventPreposition = (eventType) => {
  if (EVENT_TYPES.get(`Activity`).includes(eventType)) {
    return `${eventType} in`;
  }

  return `${eventType} to`;
};

export const isEscEvent = (evt) => {
  return evt.key === ESC_KEY;
};

export const isOnline = () => {
  return window.navigator.onLine;
};
