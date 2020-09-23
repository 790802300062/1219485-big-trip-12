import EventsModel from './model/events.js';

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const Url = {
  EVENTS: `points`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`
}

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({url: Url.EVENTS})
      .then(Api.toJSON)
      .then((serverEvents) => serverEvents.map(EventsModel.adaptToClient));
  }

  addEvent(event) {
    return this._load(
        {
          url: Url.EVENTS,
          method: Method.POST,
          body: JSON.stringify(EventsModel.adaptToServer(event)),
          headers: new Headers({"Content-Type": `application/json`})
        }
    )
        .then(Api.toJSON)
        .then(EventsModel.adaptToClient);
  }

  updateEvent(event) {
    return this._load(
        {
          url: Url.EVENTS+`/${event.id}`,
          method: Method.PUT,
          body: JSON.stringify(EventsModel.adaptToServer(event)),
          headers: new Headers({"Content-Type": `application/json`})
        }
    )
    .then(Api.toJSON)
    .then(EventsModel.adaptToClient);
  }

  deleteEvent(event) {
    return this._load(
        {
          url: Url.EVENTS+`/${event.id}`,
          method: Method.DELETE,
        }
    );
  }

  getDestinations() {
    return this._load({url: Url.DESTINATIONS})
      .then(Api.toJSON);
  }

  getOffers() {
    return this._load({url: Url.OFFERS})
    .then(Api.toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`_${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(error) {
    throw error;
  }
}
