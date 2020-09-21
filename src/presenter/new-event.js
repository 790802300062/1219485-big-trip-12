import {UserAction} from '../const.js';
import {
  isEscEvent,
  generateId
} from '../utils/common.js';

import {
  render,
  remove,
  RenderPosition
} from '../utils/render.js';

import EventEditView from '../view/event-edit.js';

export default class NewEventPresenter {
  constructor(eventsModel, offersModel, changeData) {
    this._eventsModel = eventsModel;
    this._offersModel = offersModel;
    this._changeEventData = changeData;

    this._eventEditComponent = null;
    this._destroyCallback = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  init(header, callback) {
    if (this._eventEditComponent !== null) {
      return;
    }

    this._destroyCallback = callback;

    this._eventEditComponent = new EventEditView(
        this._eventsModel.getDestinations(),
        this._offersModel.getOffers()
    );

    this._eventEditComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._eventEditComponent.setDeleteClickHandler(this._deleteClickHandler);

    render(header, this._eventEditComponent, RenderPosition.AFTEREND);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _formSubmitHandler(newEventData) {
    this._changeEventData(
        UserAction.ADD_EVENT,
        Object.assign({id: generateId()}, newEventData)
    );
    this.destroy();
  }

  _deleteClickHandler() {
    this.destroy();
  }
}
