import {makeFirstLetterUppercased} from '../utils/common.js';

import Observer from '../utils/observer.js';

export default class OffersModel extends Observer {
  constructor() {
    super();
    this._offers = new Map();
  }

  setOffersFromServer(serverOffers) {
    serverOffers.forEach(({type, offers}) => {
      this._offers.set(
          makeFirstLetterUppercased(type),
          offers
      );
    });
  }

  getOffers() {
    return this._offers;
  }
}
