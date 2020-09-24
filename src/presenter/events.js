import {filter} from '../utils/filter.js';

export default class EventsPresenter {
  constructor(eventsModel, filterModel) {
    if (new.target === EventsPresenter) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }

    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();

    return filter[filterType](events);
  }

  _getAllEvents() {
    return this._eventsModel.getEvents();
  }
}
