import Abstract from '../view/abstract.js';

export default class EventsListView extends Abstract {
  constructor(idNumber) {
    super();
    this._idNumber = idNumber;
  }

  getTemplate() {
    return (
      `<ul class="trip-events__list" id="trip-events__list-${this._idNumber}"></ul>`
    );
  }
}
