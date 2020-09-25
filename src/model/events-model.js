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

  setEvents(eventType, updateType, events) {
    this._events = this._sortEvents(events);

    this._notify({eventType, updateType}, events);
  }

  updateEvent(eventType, updateType, event) {
    const index = this._events.findIndex((item) => event.id === item.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events.splice(index, 1, event);
    this._events = this._sortEvents(this._events);

    this._notify({eventType, updateType}, event);
  }

  addEvent(eventType, updateType, event) {
    this._events.push(event);
    this._events = this._sortEvents(this._events);

    this._notify({eventType, updateType}, event);
  }

  deleteEvent(eventType, updateType, event) {
    const index = this._events.findIndex((item) => event.id === item.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events.splice(index, 1);

    this._notify({eventType, updateType}, event);
  }

  _sortEvents(events) {
    return events.slice().sort((a, b) => a.timeStart - b.timeStart);
  }

  static adaptToClient(event) {
    return {
      id: event.id,
      type: makeFirstLetterUppercased(event.type),
      city: event.destination.name,
      offers: event.offers,
      timeStart: new Date(event.date_from),
      timeEnd: new Date(event.date_to),
      price: event.base_price,
      isFavorite: event.is_favorite,
      destination: event.destination.description,
      photos: event.destination.pictures,
    };
  }

  static adaptToServer(event) {
    return {
      'id': event.id,
      'type': event.type.toLowerCase(),
      'base_price': event.price,
      'date_from': event.timeStart.toISOString(),
      'date_to': event.timeEnd.toISOString(),
      'is_favorite': Boolean(event.isFavorite),
      'destination': {
        'description': event.destination,
        'name': event.city,
        'pictures': event.photos
      },
      'offers': event.offers
    };
  }
}
