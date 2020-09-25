import moment from 'moment';
import {FilterType} from '../const.js';

export const filter = {
  [FilterType.FUTURE]: (events) => events.filter((event) => {
    return moment(event.timeStart).isAfter(moment(), `day`);
  }),
  [FilterType.PAST]: (events) => events.filter((event) => {
    return moment(event.timeStart).isBefore(moment(), `day`);
  }),
  [FilterType.EVERYTHING]: (events) => events.slice()
};
