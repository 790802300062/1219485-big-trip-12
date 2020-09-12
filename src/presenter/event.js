import {
  render,
  RenderPosition,
  replace,
  remove
} from '../utils/render.js';

import {isEscapeEvent} from '../utils/common.js';

import Event from '../view/event.js';
import EventEdit from '../view/event-edit.js';
import Offer from '../view/offer.js';
import OfferList from '../view/offer-list.js';

const MAX_OFFERS_AMOUNT = 3;
const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class EventPresenter {
  constructor(container, destinations, changeData, changeMode) {
    this._container = container;
    this._destinations = destinations;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._event = null;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEventRollupButtonClick = this._handleEventRollupButtonClick.bind(this);
    this._handleEventFormRollupButtonClick = this._handleEventFormRollupButtonClick.bind(this);
    this._handleEventFormSubmit = this._handleEventFormSubmit.bind(this);
    this._onEscapeKeydown = this._escapeKeydownHandler.bind(this);
    this._handleFavoriteChange = this._handleFavoriteChange.bind(this);
  }

  init(event) {
    this._event = event;

    const previousEventComponent = this._eventComponent;
    const previousEventEditComponent = this._eventEditComponent;

    this._eventComponent = new Event(event);
    this._eventEditComponent = new EventEdit(event, this._destinations);

    this._eventComponent.setRollupButtonClickHandler(this._handleEventRollupButtonClick);
    this._eventEditComponent.setRollupButtonClickHandler(this._handleEventFormRollupButtonClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleEventFormSubmit);

    this._eventEditComponent.setFavoriteChangeHandler(this._handleFavoriteChange);

    if (event.offers.length > 0) {
      const offersContainer = this._eventComponent.getContainer();
      this._renderOffersList(offersContainer, event.offers);
    }

    if (previousEventComponent === null || previousEventEditComponent === null) {
      render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, previousEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventEditComponent, previousEventEditComponent);
    }

    remove(previousEventComponent);
    remove(previousEventEditComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    this._eventEditComponent.reset(this._event);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _escapeKeydownHandler(evt) {
    if (isEscapeEvent(evt)) {
      this._replaceFormToCard();
    }
  }

  _handleEventRollupButtonClick() {
    this._replaceCardToForm();
    document.addEventListener(`keydown`, this._escapeKeydownHandler);
  }

  _handleEventFormRollupButtonClick() {
    this._replaceFormToCard();
    document.removeEventListener(`keydown`, this._escapeKeydownHandler);
  }

  _handleEventFormSubmit(editedEvent) {
    this._changeData(editedEvent);
    this._replaceFormToCard();
  }

  _handleFavoriteChange(isFavorite) {
    this._event = Object.assign(
        this._event,
        {isFavorite}
    );
    this._changeData(this._event);
  }

  _renderOffersList(offersContainer, offers) {
    const offerListView = new OfferList();
    render(offersContainer, offerListView, RenderPosition.AFTEREND);

    this._renderOffers(offerListView, offers);
  }

  _renderOffers(offerListView, offers) {
    offers.slice(0, MAX_OFFERS_AMOUNT)
      .forEach((offer) => {
        render(offerListView, new Offer(offer), RenderPosition.BEFOREEND);
      });
  }
}
