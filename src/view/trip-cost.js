import Abstract from './abstract';

const createTripCostTemplate = (amount) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${amount}</span>
    </p>`
  );
};

export default class TripCost extends Abstract {
  constructor(amount) {
    super();
    this._amount = amount;
  }

  _getTemplate() {
    return createTripCostTemplate(this._amount);
  }
}
