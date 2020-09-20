import {getTripDatesInterval} from '../utils/time-and-date.js';
import Abstract from '../view/abstract.js';

const MAX_CITIES_AMOUNT = 3;

export default class TripRouteView extends Abstract {
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
    const tripRoute = [];

    for (const event of events) {
      if (tripRoute[tripRoute.length - 1] !== event.city) {
        tripRoute.push(event.city);
      }

      if (tripRoute.length > MAX_CITIES_AMOUNT) {
        return `${events[0].city} &mdash; ... &mdash; ${events[events.length - 1].city}`;
      }
    }

    return tripRoute.join(` &mdash; `);
  }
}
