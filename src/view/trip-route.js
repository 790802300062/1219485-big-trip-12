import {getTripDatesInterval} from '../utils/time-and-date.js';

import AbstractView from '../view/abstract.js';

const LIMIT_ROUTE_CITY = 3;

export default class TripRouteView extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return (
      `<div class="trip-info__main">
        <h1 class="trip-info__title">
          ${this._getTripRoute()}
        </h1>

        <p class="trip-info__dates">${getTripDatesInterval(this._events)}</p>
      </div>`
    );
  }

  _getTripRoute() {
    const events = this._events;
    const route = [];

    for (const event of events) {
      if (route[route.length - 1] !== event.city) {
        route.push(event.city);
      }

      if (route.length > LIMIT_ROUTE_CITY) {
        return `${events[0].city} &mdash; ... &mdash; ${events[events.length - 1].city}`;
      }
    }

    return route.join(` &mdash; `);
  }
}
