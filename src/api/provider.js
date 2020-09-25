import {nanoid} from 'nanoid';
import {isOnline} from '../utils/common.js';

import EventsModel from '../model/events-model.js';

const SYNC_ERROR_MESSAGE = `Sync data failed`;

const StoreTitle = {
  OFFERS: `Offers`,
  DESTINATIONS: `Destinations`,
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = this._createStoreStructure(
              events.map(EventsModel.adaptToServer)
          );
          this._store.setItems(items);
          return events;
        });
    }

    const storeEvents = Object.values(this._store.getItems());

    return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
  }

  updateEvent(event) {
    if (isOnline()) {
      return this._api.updateEvent(event)
        .then((updatedEvent) => {
          this._store.setItem(
              updatedEvent.id,
              EventsModel.adaptToServer(updatedEvent)
          );

          return updatedEvent;
        });
    }

    this._store.setItem(event.id, EventsModel.adaptToServer(Object.assign({}, event)));

    return Promise.resolve(event);
  }

  addEvent(event) {
    if (isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, EventsModel.adaptToServer(newEvent));

          return newEvent;
        });
    }

    const localNewEventId = nanoid();
    const localNewEvent = Object.assign({}, event, {id: localNewEventId});

    this._store.setItem(localNewEvent.id, EventsModel.adaptToServer(localNewEvent));

    return Promise.resolve(localNewEvent);
  }

  deleteEvent(event) {
    if (isOnline()) {
      return this._api.deleteEvent(event)
        .then(() => this._store.removeItem(event.id));
    }

    this._store.removeItem(event.id);

    return Promise.resolve();
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destination) => {
          this._store.setStaticDataByKey(StoreTitle.DESTINATIONS, destination);
          return destination;
        });
    }

    return Promise.resolve(
        this._store.getStaticDataByKey(StoreTitle.DESTINATIONS)
    );
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setStaticDataByKey(StoreTitle.OFFERS, offers);
          return offers;
        });
    }

    return Promise.resolve(
        this._store.getStaticDataByKey(StoreTitle.OFFERS)
    );
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._store.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = response.created;
          const updatedEvents = this._getSyncedEvents(response.updated);

          const items = this._createStoreStructure(
              [...createdEvents, ...updatedEvents]
          );

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(SYNC_ERROR_MESSAGE));
  }

  _getSyncedEvents(items) {
    return items.filter(({success}) => success)
      .map(({payload}) => {
        return payload.event;
      });
  }

  _createStoreStructure(items) {
    return items.reduce((acc, current) => {
      return Object.assign({}, acc, {
        [current.id]: current,
      });
    }, {});
  }
}
