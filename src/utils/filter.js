import {FilterType} from '../const.js';
import moment from 'moment';

export const filter = {
  [FilterType.FUTURE]: (events) => events.filter((event) => {
    return moment(event.timeStart).isAfter(new Date(), `day`);
  }),
  [FilterType.PAST]: (events) => events.filter((event) => {
    return moment(event.timeStart).isBefore(new Date(), `day`);
  }),
  [FilterType.EVERYTHING]: (events) => events.slice()
};
