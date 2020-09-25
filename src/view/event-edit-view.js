import flatpickr from 'flatpickr';
import moment from 'moment';
import he from 'he';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

import {
  mapCategoryToType,
  EventCategory,
  EventType
} from '../const.js';

import {
  generateEventPreposition,
  isInputTag,
  makeFirstLetterUppercased,
  isOnline
} from '../utils/common.js';

import {
  formatDateAndTime,
  getNewDate
} from '../utils/time-and-date.js';

import Smart from './smart-view.js';

const BLANK_EVENT = {
  type: mapCategoryToType.get(EventCategory.TRANSFER)[0],
  city: ``,
  offers: [],
  timeStart: getNewDate(),
  timeEnd: getNewDate(),
  price: 0,
  destination: [],
  photos: []
};

const FLATPICKR_PROPERTIES = {
  'dateFormat': `DD/MM/YY HH:mm`,
  'enableTime': true,
  'time_24hr': true,
  'formatDate': (date, format) => moment(date).format(format)
};

const HtmlClasses = {
  CITY: `event__field-group--destination`,
  PRICE: `event__input--price`
};

export default class EventEditView extends Smart {
  constructor(destinations, offersByType, event, originEvent) {
    super();
    this._destinations = destinations.size ? destinations : new Map();
    this._offersByType = offersByType.size ? offersByType : new Map();

    if (event) {
      this._originData = originEvent ? originEvent : event;
    } else {
      event = BLANK_EVENT;
      this._isNew = true;
    }

    this._data = EventEditView.convertEventToData(event);
    this._startDatepicker = null;
    this._endDatepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._eventCityChangeHandler = this._eventCityChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._eventPriceChangeHandler = this._eventPriceChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickers();
    this._checkFormValidity();
  }

  getTemplate() {
    const {type, timeStart, timeEnd, price, isDisabled, isSaving, isDeleting} = this._data;

    const buttonName = isDeleting ? `Deleting...` : `Delete`;

    return (
      `<form class="trip-events__item event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17"
              src="img/icons/${type.toLowerCase()}.png" alt="Event type icon" >
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1"
            type="checkbox" ${isDisabled ? `disabled` : ``}>
              <div class="event__type-list">
              ${this._createTypesListTemplate()}
            </div>
          </div>

          ${this._createTripCityTemplate()}

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time" id="event-start-time-1"
              type="text" name="event-start-time" value="${formatDateAndTime(timeStart)}"
              ${isDisabled ? `disabled` : ``} readonly>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time" id="event-end-time-1"
              type="text" name="event-end-time" value="${formatDateAndTime(timeEnd)}"
              ${isDisabled ? `disabled` : ``} readonly>
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input ${HtmlClasses.PRICE}" id="event-price-1"
            type="number" name="event-price" value="${price}" ${isDisabled ? `disabled` : ``}>
          </div>

          <button class="event__save-btn btn btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>
            ${isSaving ? `Saving...` : `Save`}
          </button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>
            ${this._isNew ? `Cancel` : buttonName}
          </button>

          ${this._createTripFavoriteButtonTemplate()}
        </header>

        ${this._createTripDetailsTemplate()}

      </form>`
    );
  }

  removeElement() {
    super.removeElement();
    this._destroyDateDatepickers();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickers();
    this.setFormSubmitHandler(this._callback.changeEventData);
    this.setDeleteClickHandler(this._callback.eventDelete);

    if (!this._isNew) {
      this.setFormCloseHandler(this._callback.formClose);
    }
  }

  setFormCloseHandler(callback) {
    this._callback.formClose = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._formCloseHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.changeEventData = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.eventDelete = callback;
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._deleteButtonClickHandler);
  }

  reset(event) {
    this.updateData(
        EventEditView.convertEventToData(event)
    );
  }

  getUnsavedUserData() {
    return this._data;
  }

  _destroyDateDatepickers() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }
  }

  _setDatepickers() {
    this._destroyDateDatepickers();

    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        Object.assign(
            {
              defaultDate: this._data.timeStart,
              onChange: this._startDateChangeHandler
            },
            FLATPICKR_PROPERTIES
        )
    );

    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        Object.assign(
            {
              defaultDate: this._data.timeEnd,
              minDate: this._data.timeStart,
              minTime: `00:05`,
              onChange: this._endDateChangeHandler
            },
            FLATPICKR_PROPERTIES
        )
    );
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`)
      .addEventListener(`click`, this._eventTypeChangeHandler);
    this.getElement().querySelector(`.${HtmlClasses.CITY}`)
      .addEventListener(`change`, this._eventCityChangeHandler);
    this.getElement().querySelector(`.${HtmlClasses.PRICE}`)
      .addEventListener(`change`, this._eventPriceChangeHandler);

    if (this._offersByType.get(this._data.type)
      && this._offersByType.get(this._data.type).length) {
      this.getElement().querySelector(`.event__available-offers`)
        .addEventListener(`click`, this._offersChangeHandler);
    }

    if (!this._isNew) {
      this.getElement().querySelector(`.event__favorite-btn`)
        .addEventListener(`click`, this._favoriteClickHandler);
    }
  }

  _createTripFavoriteButtonTemplate() {
    const {isFavorite, isDisabled} = this._data;

    return !this._isNew
      ? (
        `<input id="event-favorite-1" class="event__favorite-checkbox visually-hidden" type="checkbox"
          name="event-favorite" ${isFavorite ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855
             8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button" ${isDisabled ? `disabled` : ``}>
          <span class="visually-hidden">Open event</span>
        </button>`
      )
      : ``;
  }

  _createInnerPartOfOffersSection(listOfOffers) {
    const {offers, isDisabled} = this._data;

    const checkedOffers = offers.reduce((result, offer) => {
      return result.set(offer.title, offer);
    }, new Map());

    return listOfOffers
      .map((offer) => {
        return (
          `<div class="event__offer-selector">
            <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.title}-1"
              type="checkbox" name="${offer.title}" ${checkedOffers.has(offer.title) ? `checked` : ``}
              ${isDisabled ? `disabled` : ``}>
            <label class="event__offer-label" for="event-offer-${offer.title}-1">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`
        );
      })
      .join(``);
  }

  _createTripOffersSectionTemplate() {
    const {type} = this._data;

    const offersList = this._offersByType.get(type);

    return (offersList && offersList.length)
      ? `<section class="event__section event__section--offers">
          <h3 class="event__section-title event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${this._createInnerPartOfOffersSection(offersList)}
          </div>
        </section>`
      : ``;
  }

  _createTripDestinationDescriptionTemplate() {
    const {destination, photos} = this._data;

    return (destination.length || photos.length)
      ? (
        `<section class="event__section event__section--destination">
          <h3 class="event__section-title event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination}</p>

          ${this._createTripDestinationPhotosTemplate()}

        </section>`
      )
      : ``;
  }

  _createTripDestinationPhotosTemplate() {
    const {photos} = this._data;

    return photos.length
      ? (
        `<div class="event__photos-container">
          <div class="event__photos-tape">
            ${photos.map((photo, index) => `<img class="event__photo"
              src="${isOnline() ? photo.src : `./img/photos/${Math.min(index + 1, 5)}.jpg`}"
              alt="${photo.description}">`).join(``)}
          </div>
        </div>`
      )
      : ``;
  }

  _createTripDetailsTemplate() {
    const {destination, photos} = this._data;

    const offersExisting = (this._offersByType.get(this._data.type)
      && this._offersByType.get(this._data.type).length);

    return ((destination && destination.length) || (photos && photos.length)
     || offersExisting)
      ? (`<section class="event__details">
          ${this._createTripOffersSectionTemplate()}
          ${this._createTripDestinationDescriptionTemplate()}
        </section>`
      )
      : ``;
  }

  _createTripCityTemplate() {
    const {type, city, isDisabled} = this._data;

    return (
      `<div class="event__field-group ${HtmlClasses.CITY}">
        <label class="event__label event__type-output" for="event-destination-1">
          ${generateEventPreposition(type)}
        </label>
        <input class="event__input event__input--destination" id="event-destination-1"
          type="text" name="event-destination" value="${he.encode(city)}" list="destination-list-1"
          ${isDisabled ? `disabled` : ``}>
        <datalist id="destination-list-1">
          ${Array.from(this._destinations.keys())
            .map((it) => {
              return `<option value="${it}"></option>`;
            })
            .join(``)}
        </datalist>
      </div>`
    );
  }

  _createTypesListItemTemplate(type, isChecked) {
    return (
      `<div class="event__type-item">
        <input id="event-type-${type.toLowerCase()}-1" class="event__type-input visually-hidden"
          type="radio" name="event-type" value="${type.toLowerCase()}"
          ${isChecked ? `checked` : ``}>
        <label class="event__type-label event__type-label--${type.toLowerCase()}"
          for="event-type-${type.toLowerCase()}-1">${type}</label>
      </div>`
    );
  }

  _createTypesListTemplate() {
    const checkedType = this._data.type;

    return Array.from(mapCategoryToType.entries())
      .map(([kind, types]) => {
        return (
          `<fieldset class="event__type-group">
            <legend class="visually-hidden">${kind}</legend>
            ${types.map((type) => {
            return this._createTypesListItemTemplate(type, type === checkedType);
          }).join(``)}
          </fieldset>`
        );
      }).join(``);
  }

  _checkCityValidity() {
    const cityField = this.getElement().querySelector(`.${HtmlClasses.CITY} input`);
    let cityMessage = ``;
    let validity = true;

    if (this._destinations.size
      && ![...this._destinations.keys()].includes(cityField.value)) {
      cityMessage = `Выбранный пункт назначения отсутсвует в предложенном списке`;
      validity = false;
    }

    if (cityField.value.length === 0) {
      cityMessage = `Не указан пункт назначения`;
      validity = false;
    }

    cityField.setCustomValidity(cityMessage);

    return validity;
  }

  _checkPriceValidity() {
    const priceField = this.getElement().querySelector(`.${HtmlClasses.PRICE}`);
    let priceMessage = ``;
    let validity = true;

    if (!(parseInt(priceField.value, 10)) || (parseInt(priceField.value, 10)) < 0) {
      priceMessage = `Стоимость должны быть больше ноля`;
      validity = false;
    }

    priceField.setCustomValidity(priceMessage);

    return validity;
  }

  _checkFormValidity() {
    return this._checkCityValidity() && this._checkPriceValidity();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    if (this._checkFormValidity()) {
      this._callback.changeEventData(
          EventEditView.convertDataToEvent(this._data),
          EventType.EVENT
      );
    }
  }

  _formCloseHandler(evt) {
    evt.preventDefault();
    this._callback.formClose();
  }

  _favoriteClickHandler() {
    this._callback.changeEventData(
        EventEditView.convertDataToEvent(
            Object.assign(
                {},
                this._originData,
                {
                  isFavorite: !this._originData.isFavorite
                }
            )
        ),
        EventType.FAVORITE
    );
  }

  _eventTypeChangeHandler(evt) {
    if (!isInputTag(evt)) {
      return;
    }

    const type = makeFirstLetterUppercased(evt.target.value);

    this.getElement().querySelector(`.event__type-toggle`).checked = false;
    this.updateData({type, offers: []});
  }

  _eventCityChangeHandler(evt) {
    if (!isInputTag(evt) && evt.target.value === this._data.city) {
      return;
    }

    const newCity = evt.target.value;
    const destination = this._destinations.get(newCity);

    if (destination) {
      const {description, photos} = destination;
      this.updateData(
          {
            city: newCity,
            destination: description,
            photos
          }
      );
    } else {
      this.updateData(
          {
            city: newCity,
          }
      );
    }

    this._checkFormValidity();
  }

  _offersChangeHandler(evt) {
    if (!isInputTag(evt)) {
      return;
    }

    const offers = this._data.offers.map((offer) => Object.assign({}, offer));
    const offerIndex = offers.findIndex((it) => it.title === evt.target.name);

    if (offerIndex < 0) {
      const listOfOffers = this._offersByType.get(this._data.type);
      const newOffer = listOfOffers.find((it) => it.title === evt.target.name);
      if (newOffer) {
        offers.push(newOffer);
      }
    } else {
      offers.splice(offerIndex, 1);
    }

    this.updateData({offers}, true);
  }

  _eventPriceChangeHandler(evt) {
    if (evt.target.value === this._data.price) {
      return;
    }

    this.updateData(
        {
          price: parseInt(evt.target.value, 10),
        },
        true
    );

    this._checkFormValidity();
  }

  _startDateChangeHandler([userDate]) {
    const timeStart = new Date(userDate);
    const timeEnd = (timeStart > this._data.timeEnd) ? timeStart : this._data.timeEnd;

    this._endDatepicker.set(`minDate`, timeStart);
    this._endDatepicker.setDate(timeEnd);

    this.updateData({timeStart, timeEnd}, true);
  }

  _endDateChangeHandler([userDate]) {
    this.updateData(
        {
          timeEnd: new Date(userDate)
        },
        true
    );
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.eventDelete(EventEditView.convertDataToEvent(this._data));
  }

  static convertEventToData(event) {
    return Object.assign(event, {
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    });
  }

  static convertDataToEvent(eventData) {
    delete eventData.isDisabled;
    delete eventData.isSaving;
    delete eventData.isDeleting;

    return eventData;
  }
}
