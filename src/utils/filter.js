import {FilterType} from "../const";
import {getEndTime} from '../utils/event.js';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => getEndTime(event.startDate, event.duration) > new Date()),
  [FilterType.PAST]: (events) => events.filter((event) => getEndTime(event.startDate, event.duration) < new Date()),
};
