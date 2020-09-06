import DayView from "../view/day-block.js";
import SortView from "../view/sort.js";
import StartView from "../view/start.js";
import EventsListContainerView from "../view/events-list.js";
import EventPresenter from "./event.js";
import EventNewPresenter from "./event-new.js";
import {filter} from "../utils/filter.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {UpdateType, UserAction, FilterType} from "../const.js";
import {createDates, createDateEventsList} from '../utils/event.js';


export default class Trip {
  constructor(tripContainer, eventsModel, filterModel) {
    this._tripContainer = tripContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._eventPresenter = {};
    this._dayList = [];

    this._sortComponent = new SortView();
    this._startComponent = new StartView();

    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._eventNewPresenter = new EventNewPresenter(this._tripContainer, this._handleViewAction);
  }

  init() {
    this._renderTripBoard(this._getEvents());
  }

  createEvent() {
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filtredEvents = filter[filterType](events);
    return filtredEvents;
  }

  _renderStart() {
    render(this._tripContainer, this._startComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderTripBoard() {
    if (this._getEvents().length === 0) {
      this._renderStart();
      return;
    }

    this._renderSort();
    this._renderDayList();
  }

  _renderDayList() {
    let dates = createDates(this._getEvents());
    dates.forEach((day, count) => {
      const dayElement = new DayView(new Date(day), ++count);
      this._dayList.push(dayElement);
      render(this._tripContainer, dayElem, RenderPosition.BEFOREEND);

      const eventsListContainer = new EventsListContainerView();
      render(dayElement, eventsListContainer, RenderPosition.BEFOREEND);

      const dateEventsList = createDateEventsList(this._getEvents(), new Date(day));
      this._renderEventsList(eventsListContainer, dateEvensList);
        this._renderEvent(eventsListContainer, event);
    });
  }

  _renderEventsList(eventsListContainer, dateEvensList) {
    for (let event of dateEvensList) {
      this._renderEvent(eventsListContainer, event);
    }
  }

  _renderEvent(eventListElement, event) {
    const eventPresenter = new EventPresenter(eventListElement, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTripBoard();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTripBoard();
        break;
    }
  }

  _clearTrip() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
      this._eventPresenter = {};
      for (let day of this._dayList) {
        remove(day);
        day.removeElement();
      }
      this._dayList = [];
      remove(this._sortComponent);
      remove(this._startComponent);
      this._eventNewPresenter.destroy();
  }
}

