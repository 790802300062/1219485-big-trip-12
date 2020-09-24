import {isEscEvent} from '../utils/common.js';
import {
  EventType,
  State
} from '../const.js';

import {
  replace,
  append,
  remove
} from '../utils/render.js';

import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class EventPresenter {
  constructor(container, eventsModel, offersModel, eventDataChangeHandler,
      resetEventDataChangesHandler, event) {
    this._contaier = container;
    this._eventsModel = eventsModel;
    this._offersModel = offersModel;
    this._changeEventData = eventDataChangeHandler;
    this._resetEventDataChanges = resetEventDataChangesHandler;
    this._event = event;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  init(event) {
    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(this._offersModel.getOffers(), this._event);
    this._eventEditComponent = new EventEditView(this._eventsModel.getDestinations(),
        this._offersModel.getOffers(), event, this._event);

    this._eventComponent.setEditClickHandler(this._editClickHandler);
    this._eventEditComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._eventEditComponent.setFormCloseHandler(this._formCloseHandler);
    this._eventEditComponent.setDeleteClickHandler(this._deleteClickHandler);

    if (!prevEventComponent || !prevEventEditComponent) {
      append(this._contaier, this._eventComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._eventEditComponent.reset(this._event);
      this._replaceFormToEvent();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._eventEditComponent.shake(resetFormState);
        break;
      default:
        throw new Error('Impossible to determine State');
    }
  }

  setPropertyFavorite(updatedServerDataEvent) {
    this._event = updatedServerDataEvent;

    const eventData = this._eventEditComponent.getUnsavedUserData();
    eventData.isFavorite = !eventData.isFavorite;
    this.init(eventData);
  }

  _replaceEventToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDITING;
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.resetView();
    }
  }

  _editClickHandler() {
    this._resetEventDataChanges();
    this._replaceEventToForm();
  }

  _formSubmitHandler(newEventData, eventType) {
    this._changeEventData(eventType, newEventData);
  }

  _formCloseHandler() {
    this.resetView();
  }

  _deleteClickHandler(event) {
    this._changeEventData(EventType.DELETE, event);
  }
}
