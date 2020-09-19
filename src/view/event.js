import {
  determineEventPreposition,
  getEventDuration
} from '../utils/common.js';

import {
  formatTime,
  getTimeInterval
} from '../utils/time-and-date.js';

import Abstract from '../view/abstract.js';

export default class EventView extends Abstract {
  constructor(event) {
    super();
    this._event = event;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    const {type, city, price} = this._event;

    return (
      `<li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42"
              src="img/icons/${type.toLowerCase()}.png"
              alt="Event type icon">
          </div>
          <h3 class="event__title">${determineEventPreposition(type)} ${city}</h3>

          <div class="event__schedule">
            ${this._createTimeTemplate()}
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${this._createEventOffersTemplate()}
          </ul>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`
    );
  }

  _createTimeTemplate() {
    const {timeStart, timeEnd} = this._event;

    return (
      `<p class="event__time">
        <time class="event__start-time" datetime="${timeStart.toISOString()}">
          ${formatTime(timeStart)}
        </time>
        &mdash;
        <time class="event__end-time" datetime="${timeEnd.toISOString()}">
          ${formatTime(timeEnd)}
        </time>
      </p>
      <p class="event__duration">
        ${getTimeInterval(getEventDuration(this._event))}
      </p>`
    );
  }

  _createEventOffersTemplate() {
    return this._event.offers
      ? this._event.offers.map((offer) => {
        return offer.checked
          ? (
            `<li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </li>`
          )
          : ``;
      }).join(``)
      : ``;
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._editClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }
}
