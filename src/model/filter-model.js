import {
  FilterType,
  EventType,
  UpdateType
} from '../const.js';

import Observer from '../utils/observer.js';

export default class FilterModel extends Observer {
  constructor() {
    super();
    this._currentFilter = FilterType.EVERYTHING;
  }

  setFilter(filter) {
    this._currentFilter = filter;

    this._notify(
        {
          eventType: EventType.FILTER,
          updateType: UpdateType.MAJOR
        },
        filter
    );
  }

  getFilter() {
    return this._currentFilter;
  }
}
