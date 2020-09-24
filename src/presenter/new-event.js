import {isEscEvent} from '../utils/common.js';
import {
  render,
  remove,
  RenderPosition
} from '../utils/render.js';

import {
  EventType,
  State
} from '../const.js';

import EventEditView from '../view/event-edit.js';

export default class NewEventPresenter {
  constructor(eventsModel, offersModel, changeData) {
    this._eventsModel = eventsModel;
    this._offersModel = offersModel;
    this._changeEventData = changeData;

    this._EventEditComponent = null;
    this._destroyCallback = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  init(header, callback) {
    if (this._EventEditComponent !== null) {
      return;
    }

    this._destroyCallback = callback;

    this._EventEditComponent = new EventEditView(
        this._eventsModel.getDestinations(),
        this._offersModel.getOffers()
    );

    this._EventEditComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._EventEditComponent.setDeleteClickHandler(this._deleteClickHandler);

    render(header, this._EventEditComponent, RenderPosition.AFTEREND);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._EventEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._EventEditComponent);
    this._EventEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._EventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._EventEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.ABORTING:
        this._EventEditComponent.shake(resetFormState);
        break;
      default:
        throw new Error(`Impossible to determine State status`);
    }
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _formSubmitHandler(newEvent) {
    this._changeEventData(
        EventType.ADD,
        newEvent
    );
  }

  _deleteClickHandler() {
    this.destroy();
  }
}
