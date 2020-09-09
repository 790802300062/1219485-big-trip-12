import Abstract from './abstract.js';

const createOffersListTemplate = () => `<ul class="event__selected-offers"></ul>`;

export default class OfferList extends Abstract {
  _getTemplate() {
    return createOffersListTemplate();
  }
}
