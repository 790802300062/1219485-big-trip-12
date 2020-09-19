import {EventType} from '../const.js';
import {makeFirstLetterUppercased} from '../utils/common.js';

import Observer from '../utils/observer.js';

export default class EventsModel extends Observer {
  constructor(offersModel) {
    super();
    this._offersModel = offersModel;
    this._events = [];
    this._destinations = new Map();
  }

  getEvents() {
    return this._events;
  }

  getDestinations() {
    return this._destinations;
  }

  setDestinations(destinations) {
    destinations.forEach(({name, description, pictures}) => {
      this._destinations.set(name, {description, photos: pictures});
    });
  }

  setEvents(events) {
    this._events = this._sortEvents(events.map(this._adaptToClient.bind(this)));

    this._notify(EventType.INIT, events);
  }

  updateEvent(update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events.splice(index, 1, update);
    this._events = this._sortEvents(this._events);

    this._notify(EventType.EVENT, update);
  }

  addEvent(update) {
    this._events.push(update);
    this._events = this._sortEvents(this._events);

    this._notify(EventType.EVENT, update);
  }

  deleteEvent(update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events.splice(index, 1);

    this._notify(EventType.EVENT, update);
  }

  _adaptToClient(event) {
    return {
      id: event.id,
      type: makeFirstLetterUppercased(event.type),
      city: event.destination.name,
      offers: this._offersModel.adaptOffersToClient(
          makeFirstLetterUppercased(event.type),
          event.offers
      ),
      timeStart: new Date(event.date_from),
      timeEnd: new Date(event.date_to),
      price: event.base_price,
      isFavorite: event.is_favorite,
      destination: event.destination.description,
      photos: event.destination.pictures,
    };
  }

  adaptToServer(event) {
    return {
      'id': event.id,
      'type': event.type.toLowerCase(),
      'base_price': event.price,
      'date_from': event.timeStart.toISOString(),
      'date_to': event.timeEnd.toISOString(),
      'is_favorite': event.isFavorite,
      'destination': {
        'description': event.destination,
        'name': event.city,
        'pictures': event.photos
      },
      'offers': this._offersModel.adaptOffersToServer(event.offers)
    };
  }

  _sortEvents(events) {
    return events.slice().sort((a, b) => a.timeStart - b.timeStart);
  }
}
