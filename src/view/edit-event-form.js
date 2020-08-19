import {OPTIONS} from '../const.js';
import {getEndTime} from '../utils.js';
import {getTimeInHours} from '../utils.js';

export const createEditEventTemplate = (currentEvent = {}) => {
  const {
    event = {
      name: `Flight`,
      type: `moving`
    },
    destinationCity = `Alaska`,
    startDate = new Date(),
    duration = {
      hour: 0,
      minute: 0
    },
    price = 0,
    options = [],
    destination = {}
  } = currentEvent;

  const preposition = event.type === `arrival`
    ? `in`
    : `to`;

  const getAvailableOption = ()=> {
    const availableOptionName = new Set();

    for (let option of options) {
      availableOptionName.add(option.name);
    }

    return availableOptionName;
  };

  const createOptionTemplate = () => {
    let optionList = ``;
    const availableOptionList = getAvailableOption();
    for (let option of OPTIONS) {
      if (event.type === option.eventType) {
        optionList += `<div class="event__offer-selector">
          <input
            class="event__offer-checkbox  visually-hidden"
            id="event-offer-luggage-1"
            type="checkbox"
            name="event-offer-luggage"
            ${availableOptionList.has(option.name) ? `checked` : ``}
          >
          <label class="event__offer-label" for="event-offer-luggage-1">
            <span class="event__offer-title">${option.name}</span>
            &plus; &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
          </label>
          </div>`;
      }
    }

    return optionList;
  };
  const optionTemplate = createOptionTemplate();

  const createDescrPhotoTemplate = (photoList) => {
    let descrPhotoList = ``;
    for (let photo of photoList) {
      descrPhotoList += `<img class="event__photo" src="${photo}" alt="Event photo">`;
    }

    return descrPhotoList;
  };

  const endDate = getEndTime(startDate, duration);

  const getDate = (date) => {
    return getTimeInHours(date.getDate()) + `/` + getTimeInHours(date.getMonth()) + `/` + String(date.getFullYear()).slice(-2) + ` ` + getTimeInHours(date.getHours()) + `:` + getTimeInHours(date.getMinutes());
  };

  const createDescriptionTemplate = () => {
    if (!destination.descr && !destination.photo) {
      return ``;
    }

    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${destination.descr ? `<p class="event__destination-description">${destination.descr}</p>` : ``}
      <div class="event__photos-container">
        <div class="event__photos-tape">
         ${createDescrPhotoTemplate(destination.photo)}
        </div>
      </div>
    </section>`;
  };
  const descriptionTemplate = createDescriptionTemplate();

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${event.name.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${event.name} ${preposition}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationCity}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
            <option value="Saint Petersburg"></option>
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
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${optionTemplate}
          </div>
        </section>
        ${descriptionTemplate}
      </section>
    </form>`
  );
};
