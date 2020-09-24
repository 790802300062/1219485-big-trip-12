import {FilterType} from '../const.js';
import moment from 'moment';

export const filter = {
  [FilterType.FUTURE]: (events) => events.filter((event) => {
    return moment(event.timeStart).isAfter(moment(), `day`);
  }),
  [FilterType.PAST]: (events) => events.filter((event) => {
    return moment(event.timeStart).isBefore(moment(), `day`);
  }),
  [FilterType.EVERYTHING]: (events) => events.slice()
};
