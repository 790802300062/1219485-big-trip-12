import {formatDate} from '../utils/time-and-date.js';
import {
  SortType,
  UserAction,
  UpdateType,
  FilterType
} from '../const.js';

import {
  render,
  RenderPosition,
  remove
} from '../utils/render.js';

import {
  sortEventsByPrice,
  sortEventsByTime,
  filterTypeToEvents
} from '../utils/common.js';

import EventMessage from '../view/event-message.js';
import Sort from '../view/sort.js';
import DaysContainer from '../view/days-container.js';
import DayView from '../view/day.js';
import EventList from '../view/event-list.js';
import EventPresenter from '../presenter/event.js';
import EventNewPresenter from '../presenter/event-new.js';

export const UNGROUPED_LIST = 0;
const BLANK_PAGE_MESSAGE = `Click New Event to create your first point`;


const reduceEventsByDay = (days, event) => {
  const dayDate = formatDate(event.startTime);

  if (Array.isArray(days[dayDate])) {
    days[dayDate].push(event);
  } else {
    days[dayDate] = [event];
  }

  return days;
};

const groupEventsByDays = (events) => events
  .sort((less, more) => less.startTime - more.startTime)
  .reduce(reduceEventsByDay, {});

export default class TripPresenter {
  constructor(container, destinations, eventsModel, filterModel) {
    this._container = container;
    this._destinations = destinations;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;

    this._eventPresenter = {};
    this._sort = null;
    this._currentSortType = SortType.EVENT;
    this._days = [];

    this._eventMessage = new EventMessage(BLANK_PAGE_MESSAGE);
    this._daysView = new DaysContainer();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this.createEvent = this.createEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._eventNew = new EventNewPresenter(this._daysView, this._destinations, this._handleViewAction);
  }

  init() {
    this._renderSort();
    this._renderDaysList();
  }

  createEvent() {
    this._currentSortType = SortType.EVENT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNew.init();
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filterTypeToEvents[filterType](events, new Date());

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort(sortEventsByTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortEventsByPrice);
    }
    return this._eventsModel.getEvents();
  }

  _handleModeChange() {
    this._eventNew.destroy();
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
        this._clearEventsList();
        this._renderDaysList();
        this._renderSort();
        break;
      case UpdateType.MAJOR:
        this._clearEventsList({resetSortType: true});
        this._renderDaysList();
        this._renderSort();
        break;
    }
  }

  _renderSort() {
    const handleSortChange = (sortType) => {
      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;
      this._clearEventsList();
      this._renderDaysList();
      this._renderSort();
    };

    if (this._sort !== null) {
      this._sort = null;
    }

    this._sort = new Sort(this._currentSortType);
    this._sort.setChangeHandler(handleSortChange);
    render(this._container, this._sort, RenderPosition.AFTERBEGIN);
  }

  _renderBlankPageMessage() {
    render(this._container, this._eventMessage, RenderPosition.BEFOREEND);
  }

  _clearEventsList({resetSortType = false} = {}) {
    this._eventNew.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    this._days.forEach(remove);
    this._days = [];

    remove(this._daysView);
    remove(this._sort);

    if (resetSortType) {
      this._currentSortType = SortType.EVENT;
    }
  }

  _renderDaysList() {
    render(this._container, this._daysView, RenderPosition.BEFOREEND);
    this._renderDays();
  }

  _renderDays() {
    if (this._currentSortType === SortType.EVENT) {
      const days = groupEventsByDays(this._getEvents());

      Object
        .values(days)
        .forEach((dayEvents, counter) => {
          const dayView = new DayView(new Date(dayEvents[0].startTime), counter + 1);
          this._days.push(dayView);

          render(this._daysView, dayView, RenderPosition.BEFOREEND);
          this._renderEventsList(dayView, dayEvents);
        });

    } else {

      const dayView = new DayView(new Date(), UNGROUPED_LIST);

      this._days.push(dayView);

      render(this._daysView, dayView, RenderPosition.BEFOREEND);
      this._renderEventsList(dayView, this._getEvents());
    }
  }

  _renderEventsList(dayView, dayEvents) {
    const eventListView = new EventList();
    render(dayView, eventListView, RenderPosition.BEFOREEND);
    this._renderEvents(eventListView, dayEvents);
  }

  _renderEvents(eventListView, dayEvents) {
    dayEvents.forEach((event) => {
      const eventPresenter = new EventPresenter(eventListView, this._destinations, this._handleViewAction, this._handleModeChange);
      eventPresenter.init(event);

      this._eventPresenter[event.id] = eventPresenter;
    });
  }
}
