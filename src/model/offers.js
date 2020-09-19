import {makeFirstLetterUppercased} from '../utils/common.js';

import Observer from '../utils/observer.js';

const CLIENT_PROPERTY = {checked: false};

export default class OffersModel extends Observer {
  constructor() {
    super();
    this._offers = new Map();
  }

  setOffersFromServer(serverOffers) {
    serverOffers.forEach(({type, offers}) => {
      this._offers.set(
          makeFirstLetterUppercased(type),
          offers.map(this._createBlankOffer)
      );
    });
  }

  getOffers() {
    return this._offers;
  }

  getOffersByType(type) {
    const offers = this._offers.get(type);
    if (offers.length === 0) {
      return [];
    }

    return offers.map((offer) => Object.assign({}, offer));
  }

  _createBlankOffer(offer) {
    return Object.assign({}, offer, CLIENT_PROPERTY);
  }

  adaptOffersToClient(type, serverOffers) {
    const offers = this.getOffersByType(type);

    if (serverOffers.length === 0) {
      return offers;
    }

    const titles = serverOffers.map(({title}) => title);

    offers.forEach((item) => {
      if (titles.includes(item.title)) {
        item.checked = true;
      }
    });

    return offers;
  }

  adaptOffersToServer(offers) {
    return offers
    .filter((offer) => offer.checked)
    .map((offer) => {
      const offetCopy = Object.assign({}, offer);

      delete offetCopy.checked;

      return offetCopy;
    });
  }
}
