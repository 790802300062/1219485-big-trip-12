import {
  ACTIVITY_TYPES,
  TRANSFER_TYPES,
  EventTypeWithPreposition,
  AdditionalOfferList
} from '../const.js';

import {makeFirstLetterToUpperCase} from '../utils/common.js';
import {formatDateToString} from '../utils/time-and-date.js';

import Smart from './smart.js';

const createBlankEvent = () => ({
  type: ``,
  destination: {
    name: ``,
    description: ``,
    photos: []
  },
  startTime: new Date(),
  endTime: new Date(),
  offers: [],
  isFavorite: false,
  price: 0,
});

const isOfferCheckedForEvent = (offerName, offers) => offers.find((item) => item.type === offerName);

const createOptionsListTemplate = (destinations) => {
  return destinations
    .map(({name}) => `<option value="${name}"></option>`)
    .join(``);
};

const createPhotoContainerTemplate = (eventData) => {
  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${eventData.destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">

          ${createPhotoListTemplate(eventData)}

        </div>
      </div>
    </section>`;
};

const createPhotoListTemplate = (eventData) =>
  eventData.destination.photos.map((photo) =>
    `<img class="event__photo" src="${photo.href}" alt="${photo.description}">`);

const createEventListTemplate = (eventData, eventTypes) => {
  return (
    eventTypes.map((eventType) => {
      return `
        <div class="event__type-item">
          <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventData.type === eventType ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${makeFirstLetterToUpperCase(eventType)}</label>
        </div>`;
    }).join(``)
  );
};

const createOfferContainerTemplate = (eventData) => {
  return `
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">

          ${createOfferListTemplate(eventData)}

        </div>
      </section>
    </section>`;
};

const createOfferListTemplate = (eventData) => {
  return (
    Object.entries(AdditionalOfferList).map((key) => {
      return (`<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${key[0]}-1" type="checkbox" name="event-offer-${key[0]}" ${isOfferCheckedForEvent(key[0], eventData.offers) ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${key[0]}-1">
          <span class="event__offer-title">${key[1].text}</span>
          +
          €&nbsp;<span class="event__offer-price">${key[1].price}</span>
        </label>
      </div>`);
    }).join(``)
  );
};

const createEventFormTemplate = (eventData, destinations) => {
  const optionsListTemplate = createOptionsListTemplate(destinations);

  return `
    <li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${eventData.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>

                ${createEventListTemplate(eventData, ACTIVITY_TYPES)}

              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>

                ${createEventListTemplate(eventData, TRANSFER_TYPES)}

             </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${EventTypeWithPreposition[eventData.type]}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${eventData.destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${optionsListTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDateToString(eventData.startTime)}">
            —
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDateToString(eventData.endTime)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${eventData.price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${eventData.isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        ${event.offers.length > 0 ? createOfferContainerTemplate(eventData) : ``}

        ${eventData.destination.photos.length > 0 ? createPhotoContainerTemplate(eventData) : ``}

        </form>
      </li>`;
};

export default class EventEdit extends Smart {
  constructor(event = createBlankEvent(), destinations) {
    super();
    this._destinations = destinations;
    this._data = EventEdit.parseEventToData(event);

    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteCheckboxChangeHandler = this._favoriteCheckboxChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._typeListChangeHandler = this._typeListChangeHandler.bind(this);
    this._setInnerHandlers();
  }

  reset(event) {
    this.updateData(
        EventEdit.parseEventToData(event)
    );
  }

  _getTemplate() {
    return createEventFormTemplate(this._data, this._destinations);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setRollupButtonClickHandler(this._callback.rollupButtonClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _setInnerHandlers() {
    const element = this.getElement();

    element.querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, this._favoriteCheckboxChangeHandler);
    element.querySelector(`.event__input--price`)
      .addEventListener(`change`, this._priceChangeHandler);
    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);
    element.querySelector(`.event__type-list`)
      .addEventListener(`change`, this._typeListChangeHandler);
  }

  _rollupButtonClickHandler() {
    this._callback.rollupButtonClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventEdit.parseDataToEvent(this._data));
  }

  _favoriteCheckboxChangeHandler() {
    this.updateData({
      isFavorite: !this._data.isFavorite
    }, true);
    this._callback.favoriteChange(this._data.isFavorite);
  }

  _priceChangeHandler(evt) {
    this.updateData({
      price: evt.target.valueAsNumber,
    }, true);
  }

  _destinationChangeHandler(evt) {
    const destination = this._destinations.find((item) => item.name === evt.target.value);
    if (destination === undefined) {
      evt.target.value = this._data.destination.name;
      return;
    }

    this.updateData({
      destination
    });
  }

  _typeListChangeHandler(evt) {
    this.updateData({
      type: evt.target.value
    });
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._rollupButtonClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement()
      .addEventListener(`submit`, this._formSubmitHandler);
  }

  setFavoriteChangeHandler(callback) {
    this._callback.favoriteChange = callback;
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event
    );
  }

  static parseDataToEvent(eventData) {
    return Object.assign(
        {},
        eventData
    );
  }
}
