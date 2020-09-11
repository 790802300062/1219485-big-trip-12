import Abstract from './abstract.js';

const createTripRouteTemplate = (tripRoute, tripDuration) => {
  return (`<div class="trip-info__main">
      <h1 class="trip-info__title">${tripRoute}</h1>
      <p class="trip-info__dates">${tripDuration}</p>
    </div>`
  );
};

export default class TripRoute extends Abstract {
  constructor(tripRoute, tripDuration) {
    super();
    this._tripRoute = tripRoute;
    this._tripDuration = tripDuration;
  }

  _getTemplate() {
    return createTripRouteTemplate(this._tripRoute, this._tripDuration);
  }
}
