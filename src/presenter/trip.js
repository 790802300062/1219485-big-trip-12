import {formatDayDate} from '../utils/time-and-date.js';
import {SortType} from '../const.js';
import {
  render,
  RenderPosition,
  remove
} from '../utils/render.js';

import {
  sortItemsByID,
  sortEventsByPrice,
  sortEventsByTime
} from '../utils/common.js';

import EventMessage from '../view/event-message.js';
import Sort from '../view/sort.js';
import DaysContainer from '../view/days-container.js';
import DayView from '../view/day.js';
import EventList from '../view/event-list.js';
import EventPresenter from './event.js';

const BLANK_PAGE_MESSAGE = `Click New Event to create your first point`;
const UNGROUPED_LIST = 0;

const reduceEventsByDay = (days, event) => {
  const dayDate = formatDayDate(event.startTime);

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
  constructor(container, destinations) {
    this._container = container;
    this._destinations = destinations;

    this._events = [];
    this._unsortedEvents = [];
    this._eventPresenter = {};
    this._currentSortType = SortType.EVENT;
    this._days = [];

    this._eventMessage = new EventMessage(BLANK_PAGE_MESSAGE);
    this._sort = new Sort();
    this._daysView = new DaysContainer();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(events) {
    this._events = [...events];
    this._unsortedEvents = [...events];

    if (events.length === 0) {
      this._renderBlankPageMessage(BLANK_PAGE_MESSAGE);
      return;
    }

    this._renderSort();
    this._sortEvents(this._currentSortType);
    this._renderDaysList();
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleEventChange(updatedEvent) {
    this._events = sortItemsByID(this._events, updatedEvent);
    this._unsortedEvents = sortItemsByID(this._unsortedEvents, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this._events.sort(sortEventsByPrice);
        break;
      case SortType.TIME:
        this._events.sort(sortEventsByTime);
        break;
      default:
        this._events = [...this._unsortedEvents];
    }

    this._currentSortType = sortType;
  }

  _renderSort() {
    const handleSortChange = (sortType) => {
      if (this._currentSortType === sortType) {
        return;
      }

      this._sortEvents(sortType);
      remove(this._daysView);
      this._renderDaysList();

    };

    this._sort.setChangeHandler(handleSortChange);

    render(this._container, this._sort, RenderPosition.BEFOREEND);
  }

  _renderBlankPageMessage() {
    render(this._container, this._eventMessage, RenderPosition.BEFOREEND);
  }

  _clearPointList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    this._days.forEach(remove);
    this._days = [];

    remove(this._daysView);
  }

  _renderDaysList() {
    render(this._container, this._daysView, RenderPosition.BEFOREEND);
    this._renderDays();
  }

  _renderDays() {
    if (this._currentSortType === SortType.EVENT) {
      const days = groupEventsByDays(this._events);

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
      this._renderEventsList(dayView, this._events);
    }
  }

  _renderEventsList(dayView, dayEvents) {
    const eventListView = new EventList();
    render(dayView, eventListView, RenderPosition.BEFOREEND);
    this._renderEvents(eventListView, dayEvents);
  }

  _renderEvents(eventListView, dayEvents) {
    dayEvents.forEach((event) => {
      const eventPresenter = new EventPresenter(eventListView, this._destinations, this._handleEventChange, this._handleModeChange);
      eventPresenter.init(event);

      this._eventPresenter[event.id] = eventPresenter;
    });
  }
}
