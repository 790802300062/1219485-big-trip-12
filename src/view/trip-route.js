import Abstract from './abstract.js';

const createTripRouteTemplate = (tripRoute) => {
  return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${tripRoute}</h1>
      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>`;
};

export default class TripRoute extends Abstract {
  constructor(tripRoute) {
    super();
    this._tripRoute = tripRoute;
  }

  _getTemplate() {
    return createTripRouteTemplate(this._tripRoute);
  }
}
