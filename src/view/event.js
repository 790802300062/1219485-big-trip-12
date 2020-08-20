import {getEndTime} from '../utils.js';
import {getTimeInHours} from '../utils.js';
import {createElement} from "../utils.js";

const EVENT_TYPE_NAME = `arrival`;
const MAX_VISIT_OPTION_AMOUNT = 3;

const createEventTemplate = (currentEvent) => {
  const {event, destinationCity, startDate, duration, price, options} = currentEvent;

  const preposition = event.type === EVENT_TYPE_NAME
    ? `in`
    : `to`;

  const createOptionTemplate = () => {
    let optionList = ``;
    if (options.length > 0) {
      for (let option of options.slice(0, MAX_VISIT_OPTION_AMOUNT)) {
        optionList += `<li class="event__offer">
          <span class="event__offer-title">${option.name}</span>
          &plus; &euro; &nbsp;<span class="event__offer-price">${option.price}</span>
          </li>`;
      }
    }

    return optionList;
  };

  const optionTemplate = createOptionTemplate(options);

  const endDate = getEndTime(startDate, duration);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.name.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${event.name} ${preposition} ${destinationCity}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="">
              ${getTimeInHours(startDate.getHours())}:${getTimeInHours(startDate.getMinutes())}
             </time>
            &mdash;
            <time class="event__end-time" datetime="">
            ${getTimeInHours(endDate.getHours())}:${getTimeInHours(endDate.getMinutes())}
            </time>
          </p>
          <p class="event__duration">${duration.hour}H ${duration.minute}M</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${optionTemplate}
        </ul>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event {
  constructor(event) {
    this._event = event;
    this._element = null;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
