import EventEdit from '../view/event-edit.js';
import EventList from '../view/event-list.js';
import DayView from '../view/day.js';
import {IdNumber} from '../mock/const.js';
import {getRandomInteger} from '../mock/utils.js';
import {
  remove,
  render,
  RenderPosition
} from '../utils/render.js';

import {isEscapeEvent} from '../utils/common.js';
import {
  UserAction,
  UpdateType
} from '../const.js';

import {UNGROUPED_LIST} from '../presenter/trip.js';

const createBlankEvent = () => ({
  type: `bus`,
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

export default class EventNewPresenter {
  constructor(container, destinations, changeData) {
    this._container = container;
    this._destinations = destinations;
    this._changeData = changeData;

    this._eventEditComponent = null;
    this._dayView = null;
    this._eventList = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleResetButtonClick = this._handleResetButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleRollupButtonClick = this._handleRollupButtonClick.bind(this);
  }

  init() {
    if (this._eventEditComponent !== null) {
      return;
    }

    this._eventEditComponent = new EventEdit(createBlankEvent(), this._destinations);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setResetButtonClickHandler(this._handleResetButtonClick);
    this._eventEditComponent.setRollupButtonClickHandler(this._handleRollupButtonClick);


    this._dayView = new DayView(new Date(), UNGROUPED_LIST);
    render(this._container, this._dayView, RenderPosition.AFTERBEGIN);

    this._eventList = new EventList();
    render(this._dayView, this._eventListView, RenderPosition.BEFOREEND);
    render(this._eventList, this._eventEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;
    remove(this._eventList);
    remove(this._dayView);

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR,
        Object.assign(
            {
              id: getRandomInteger(IdNumber.MIN, IdNumber.MAX)
            },
            event
        )
    );
    this.destroy();
  }

  _handleResetButtonClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleRollupButtonClick() {
    this.destroy();
  }
}
