import {FilterType} from '../const.js';
import Observer from '../utils/observer.js';

export default class FilterModel extends Observer {
  constructor() {
    super();
    this._currentFilter = FilterType.EVERYTHING;
  }

  setFilter(updateType, filter) {
    this._currentFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._currentFilter;
  }
}
