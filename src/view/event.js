import {EventTypeWithPreposition} from '../const.js';
import {
  formatWholeDate,
  formatTime,
  calculateTimeDifference
} from '../utils/time-and-date.js';

import Abstract from './abstract';

const formatEventTitle = (event) => `${EventTypeWithPreposition[event.type]} ${event.destination.name}`;

const createEventTemplate = (event) => {
  return (`<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${formatEventTitle(event)}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatWholeDate(event.startTime)}">${formatTime(event.startTime)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatWholeDate(event.endTime)}">${formatTime(event.endTime)}</time>
            </p>
          <p class="event__duration">${calculateTimeDifference(event.startTime, event.endTime)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${event.price}</span>
        </p>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends Abstract {
  constructor(event) {
    super();
    this._event = event;
    this._onRollupButtonClick = this._onRollupButtonClick.bind(this);
  }

  _getTemplate() {
    return createEventTemplate(this._event);
  }

  getContainer() {
    return this.getElement().querySelector(`.event__price`);
  }

  _onRollupButtonClick() {
    this._callback.rollupButtonClick();
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._onRollupButtonClick);
  }
}
