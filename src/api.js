const Method = {
  GET: `GET`,
  PUT: `PUT`
};

export default class Api {
  constructor(endEvent, authorization) {
    this._endEvent = endEvent;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({url: `points`})
      .then(Api.toJSON);
  }

  updateEvent(event) {
    return this._load(
        {
          url: `points/${event.id}`,
          method: Method.PUT,
          body: JSON.stringify(event),
          headers: new Headers({"Content-Type": `application/json`})
        }
    )
    .then(Api.toJSON);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(Api.toJSON);
  }

  getOffers() {
    return this._load({url: `offers`})
    .then(Api.toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endEvent}/${url}`, {method, body, headers})
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

  static catchError(err) {
    throw err;
  }
}
