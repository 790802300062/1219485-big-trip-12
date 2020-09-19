import Abstract from '../view/abstract.js';

export default class TripCostView extends Abstract {
  constructor(events) {
    super();
    this._totalTripCost = this._getTotalTripCost(events);
  }

  getTemplate() {
    return (
      `<p class="trip-info__cost">
          Total: &euro;&nbsp;
          <span class="trip-info__cost-value">
            ${this._totalTripCost}
          </span>
        </p>`
    );
  }

  _getTotalTripCost(events) {
    let totalTripCost = 0;

    for (const event of events) {
      totalTripCost += event.price;

      if (event.offers) {
        for (const offer of event.offers) {
          if (offer.checked) {
            totalTripCost += offer.price;
          }
        }
      }
    }

    return totalTripCost;
  }
}
