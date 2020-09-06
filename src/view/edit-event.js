import SmartView from "./smart.js";
import {OPTIONS, TRIP_EVENTS, DESTINATION_CITIES} from '../const.js';
import {getEndTime, generateDescription, generatePhotos} from '../utils/event.js';
import {getTimeInHours} from '../utils/common.js';

const BLANK_EVENT = {
  event: {
    name: `Flight`,
    type: `transfer`
  },
  destinationCity: `Alaska`,
  startDate: new Date(),
  duration: {
    hour: 0,
    minute: 0
  },
  price: 0,
  isFavorite: true,
  options: [],
  destination: {
    description: ``,
    photo: []
  },
};

const createEditEventTemplate = (currentEvent = {}) => {
  const {startDate, duration, price, isFavorite, options, dataDestination, dataEventType, dataEventName, dataDestinationCity} = currentEvent;

  const preposition = dataEventType === `activity`
    ? `in`
    : `to`;

  const getAvailableOption = ()=> {
    const availableOptionName = new Set();

    for (const option of options) {
      availableOptionName.add(option.name);
    }

    return availableOptionName;
  };

  const createDescriptionPhotoTemplate = (photoList) => {
    let descriptionPhotoList = ``;
    for (let photo of photoList) {
      descriptionPhotoList += `<img class="event__photo" src="${photo}" alt="Event photo">`;
    }
    return descriptionPhotoList;
  };

  const createDescriptionTemplate = () => {
    if (!dataDestination.description && !dataDestination.photo) {
      return ``;
    }

    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${dataDestination.description ? `<p class="event__destination-description">${dataDestination.description}</p>` : ``}
      <div class="event__photos-container">
        <div class="event__photos-tape">
         ${createDescriptionPhotoTemplate(dataDestination.photo)}
        </div>
      </div>
    </section>`;
  };

  const descriptionTemplate = createDescriptionTemplate();

  const createOptionTemplate = () => {
    let optionList = ``;
    const availableOptionList = getAvailableOption();
    for (const option of OPTIONS) {
      if (dataEventType === option.eventType) {
        let optionNameToLowerCase = option.name.toLowerCase();
        optionList += `<div class="event__offer-selector">
          <input
            class="event__offer-checkbox  visually-hidden"
            id="event-offer-${optionNameToLowerCase}-1"
            type="checkbox"
            name="event-offer-${optionNameToLowerCase}"
            ${availableOptionList.has(option.name) ? `checked` : ``}
          >
          <label class="event__offer-label" for="event-offer-${optionNameToLowerCase}-1">
            <span class="event__offer-title">${option.name}</span>
            &plus; &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
          </label>
          </div>`;
      }
    }

    return optionList;
  };

  const optionTemplate = createOptionTemplate();

  const createTripEventTemplate = (type) => {
    let tripEventList = ``;
    for (let tripEvent of TRIP_EVENTS) {
      if (tripEvent.type === type) {
        let tripEventNameToLowerCase = tripEvent.name.toLowerCase();
        tripEventList += `<div class="event__type-item">
                <input id="event-type-${tripEventNameToLowerCase}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${tripEventNameToLowerCase}">
                <label class="event__type-label  event__type-label--${tripEventNameToLowerCase}" for="event-type-${tripEventNameToLowerCase}-1">${tripEvent.name}</label>
              </div>`;
      }
    }

    return tripEventList;
  };

  const transferEventTemplate = createTripEventTemplate(`transfer`);
  const activityEventTemplate = createTripEventTemplate(`activity`);

  const createDestinationCityTemplate = () => {
    let destinationCityList = ``;
    for (let city of DESTINATION_CITIES) {
      destinationCityList += `<option value="${city}"></option>`;
    }
    return destinationCityList;
  };

  const destinationCityTemplate = createDestinationCityTemplate();

  const endDate = getEndTime(startDate, duration);

  const getDate = (date) => {
    return getTimeInHours(date.getDate()) +
    `/` +
    getTimeInHours(date.getMonth()) +
    `/` +
    String(date.getFullYear()).slice(-2) +
    ` ` +
    getTimeInHours(date.getHours()) +
    `:` +
    getTimeInHours(date.getMinutes());
  };

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${dataEventName.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transferEventTemplate}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${activityEventTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${dataEventName} ${preposition}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${dataDestinationCity}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${destinationCityTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input
            class="event__input event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            value="${getDate(startDate)}"
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDate(endDate)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
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
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${optionTemplate}
          </div>
        </section>
      </section>
      ${descriptionTemplate}
    </form>`);
};

export default class EditEvent extends SmartView {
  constructor(event = BLANK_EVENT) {
    super();
    this._data = EditEvent.parseEventToData(event);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._eventNameTypeHandler = this._eventNameTypeHandler.bind(this);
    this._eventCityHandler = this._eventCityHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditEventTemplate(this._data);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditEvent.parseDataToEvent(this._data));
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _setInnerHandlers() {
    const eventTypeRadio = this.getElement().querySelectorAll(`input[name="event-type"]`);
    for (let radio of eventTypeRadio) {
      radio.addEventListener(`change`, this._eventNameTypeHandler);
    }
    this.getElement()
      .querySelector(`#event-destination-1`)
      .addEventListener(`change`, this._eventCityHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _eventCityHandler(evt) {
    evt.preventDefault();
    this.updateData({
      dataDestinationCity: evt.target.value,
      dataDestination: {
        descr: generateDescription(),
        photo: generatePhotos()
      }
    });
  }

  _eventNameTypeHandler(evt) {
    evt.preventDefault();
    let dataEventName = evt.target.value;
    dataEventName = dataEventName.charAt(0).toUpperCase() + dataEventName.substr(1).toLowerCase();
    let dataEventType = TRIP_EVENTS.filter((item) => item.name === dataEventName)[0].type;
    this.updateData({
      dataEventName,
      dataEventType
    });
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  reset(event) {
    this.updateData(EditEvent.parseEventToData(event));
  }

  static parseEventToData(currentEvent) {
    return Object.assign({}, currentEvent, {
      dataEventType: currentEvent.event.type,
      dataEventName: currentEvent.event.name,
      dataDestinationCity: currentEvent.destinationCity,
      dataDestination: {
        description: currentEvent.destination.description,
        photo: currentEvent.destination.photo
      }
    });
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);
    data.event.type = data.dataEventType;
    data.event.name = data.dataEventName;
    data.destinationCity = data.dataDestinationCity;
    data.destination.description = data.dataDestination.description;
    data.destination.photo = data.dataDestination.photo;

    delete data.dataEventType;
    delete data.dataEventName;
    delete data.dataDestinationCity;

    return data;
  }
}
