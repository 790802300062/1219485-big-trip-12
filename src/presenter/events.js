import {filter} from '../utils/filter.js';

export default class EventsPresenter {
  constructor(eventsModel, filtersModel) {
    this._eventsModel = eventsModel;
    this._filtersModel = filtersModel;
  }

  _getEvents() {
    const filterType = this._filtersModel.getFilter();
    const events = this._eventsModel.getEvents();

    return filter[filterType](events);
  }

  _getAllEvents() {
    return this._eventsModel.getEvents();
  }
}
