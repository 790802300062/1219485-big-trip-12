import {getDuration} from '../utils/common.js';
import {getNewDate} from '../utils/time-and-date.js';
import {
  render,
  append,
  remove,
  RenderPosition
} from '../utils/render.js';

import {
  SortType,
  EventType,
  UpdateType,
  State
} from '../const.js';

import SortView from '../view/sort.js';
import DaysListView from '../view/days-list.js';
import DayView from '../view/day.js';
import EventsListView from '../view/events-list.js';
import NoEventsView from '../view/no-events.js';
import LoadingView from '../view/loading.js';

import EventPresenter from '../presenter/event.js';
import EventsPresenter from '../presenter/events.js';
import NewEventPresenter from '../presenter/new-event.js';

const SORT_KEY = `sort`;

export default class TripPresenter extends EventsPresenter {
  constructor(tripContainer, tripHeader, eventsModel, offersModel, filterModel, api) {
    super(eventsModel, filterModel);
    this._container = tripContainer;
    this._header = tripHeader;
    this._offersModel = offersModel;
    this._api = api;

    this._currentSortType = SortType.DEFAULT;
    this._existEventPresenters = {};
    this._existTripDays = [];
    this._isLoading = true;

    this._noEventsComponent = new NoEventsView();
    this._daysListComponent = new DaysListView();
    this._loadingComponent = new LoadingView();
    this._sortComponent = null;

    this._changeEventsSorting = this._changeEventsSorting.bind(this);
    this._changeEventsData = this._changeEventsData.bind(this);
    this._updateView = this._updateView.bind(this);
    this._applyNewFilter = this._applyNewFilter.bind(this);
    this._resetDataChanges = this._resetDataChanges.bind(this);

    this._newEventPresenter = new NewEventPresenter(eventsModel, offersModel, this._changeEventsData);
  }

  init() {
    this._eventsModel.addObserver(this._updateView);
    this._filterModel.addObserver(this._applyNewFilter);

    this._createTripSplit();
    this._renderTrip();
  }

  destroy() {
    this._clearTrip(true);

    remove(this._daysListComponent);
    remove(this._sortComponent);

    this._eventsModel.removeObserver(this._updateView);
    this._filterModel.removeObserver(this._applyNewFilter);
  }

  createEvent(callback) {
    this._newEventPresenter.init(
        (this._sortComponent !== null && this._sortComponent.isRendered())
          ? this._sortComponent
          : this._header,
        callback
    );
  }

  _getEventsByPrice() {
    return this._getEvents().slice()
      .sort((event1, event2) => event2.price - event1.price);
  }

  _getEventsByTime() {
    return this._getEvents().slice()
      .sort((event1, event2) => getDuration(event2) - getDuration(event1));
  }

  _createSplitBySort(events) {
    this._tripSplit = new Map([[SORT_KEY, events]]);
  }

  _createSplitByDays() {
    const tripDays = new Map();

    for (const event of this._getEvents()) {
      const date = getNewDate(event.timeStart).valueOf();

      if (tripDays.has(date)) {
        tripDays.get(date).push(event);
      } else {
        tripDays.set(date, [event]);
      }
    }

    this._tripSplit = tripDays;
  }

  _createTripSplit() {
    switch (this._currentSortType) {
      case SortType.TIME:
        this._createSplitBySort(this._getEventsByTime());
        break;
      case SortType.PRICE:
        this._createSplitBySort(this._getEventsByPrice());
        break;
      default:
        this._createSplitByDays();
    }
  }

  _createEventPresenter(container, EventData) {
    const eventPresenter = new EventPresenter(
        container,
        this._eventsModel,
        this._offersModel,
        this._changeEventsData,
        this._resetDataChanges,
        EventData
    );
    eventPresenter.init(EventData);
    this._existEventPresenters[EventData.id] = eventPresenter;
  }

  _createDay(date, index) {
    const isSort = date === SORT_KEY ? true : false;
    const tripDayComponent = new DayView(date, index, !isSort);
    const eventsListComponent = new EventsListView(index);

    append(tripDayComponent, eventsListComponent);

    this._tripSplit.get(date).forEach((eventData) => {
      this._createEventPresenter(eventsListComponent, eventData);
    });

    append(this._daysListComponent, tripDayComponent);
    this._existTripDays.push(tripDayComponent);
  }

  _createDaysList() {
    Array.from(this._tripSplit.keys()).forEach((key, index) => {
      this._createDay(key, index + 1);
    });
  }

  _clearTrip(resetSortType = false) {
    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

    this._newEventPresenter.destroy();

    remove(this._noEventsComponent);
    remove(this._loadingComponent);
    remove(this._sortComponent);

    Object.values(this._existEventPresenters)
      .forEach((presenter) => presenter.destroy());
    this._existEventPresenters = {};

    this._existTripDays.forEach(remove);
    this._existTripDays = [];
  }

  _renderNoEvents() {
    render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _renderSortComponent() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._changeEventsSorting);

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._header, this._loadingComponent, RenderPosition.AFTEREND);
  }

  _renderTripTable() {
    this._createDaysList();

    render(this._container, this._daysListComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!this._getEvents().length) {
      this._renderNoEvents();
      return;
    }

    this._renderSortComponent();
    this._renderTripTable();
  }

  _updateView(event, updateEventData) {
    if (event.eventType === EventType.INIT) {
      this._isLoading = false;
      remove(this._loadingComponent);
    }

    if (event.updateType === UpdateType.PATCH) {
      this._existEventPresenters[updateEventData.id]
        .setPropertyFavorite(updateEventData);
      return;
    }

    this._clearTrip();
    this._createTripSplit();
    this._renderTrip();
  }

  _changeEventsSorting(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._updateView(
        {
          eventType: EventType.SORT,
          updateType: UpdateType.MAJOR
        }
    );
  }

  _changeEventsData(eventType, event) {
    switch (eventType) {
      case EventType.EVENT:
        this._existEventPresenters[event.id].setViewState(State.SAVING);
        this._api.updateEvent(event)
          .then((response) => {
            this._eventsModel.updateEvent(
                EventType.EVENT,
                UpdateType.MAJOR,
                response
            );
          })
          .catch(() => {
            this._existEventPresenters[event.id].setViewState(State.ABORTING);
          });
        break;
      case EventType.FAVORITE:
        this._existEventPresenters[event.id].setViewState(State.SAVING);
        this._api.updateEvent(event)
          .then((response) => {
            this._eventsModel.updateEvent(
                EventType.FAVORITE,
                UpdateType.PATCH,
                response
            );
          })
          .catch(() => {
            this._existEventPresenters[event.id].setViewState(State.ABORTING);
          });
        break;
      case EventType.DELETE:
        this._existEventPresenters[event.id].setViewState(State.DELETING);
        this._api.deleteEvent(event)
          .then(() => {
            this._eventsModel.deleteEvent(
                EventType.DELETE,
                UpdateType.MAJOR,
                event
            );
          })
          .catch(() => {
            this._existEventPresenters[event.id].setViewState(State.ABORTING);
          });
        break;
      case EventType.ADD:
        this._newEventPresenter.setViewState(State.SAVING);
        this._api.addEvent(event)
          .then((response) => {
            this._eventsModel.addEvent(
                EventType.ADD,
                UpdateType.MAJOR,
                response
            );
          })
          .catch(() => {
            this._newEventPresenter.setViewState(State.ABORTING);
          });
        break;
    }
  }

  _resetDataChanges() {
    this._newEventPresenter.destroy();
    Object.values(this._existEventPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _applyNewFilter(event) {
    this._currentSortType = SortType.DEFAULT;
    this._updateView(event);
  }
}
