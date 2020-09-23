import {getEventDuration} from '../utils/common.js';
import {
  render,
  append,
  remove,
  RenderPosition
} from '../utils/render.js';

import {
  SortType,
  UserAction,
  EventType,
  FormStatus
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
  constructor(tripContainer, tripHeader, eventsModel, offersModel, filtersModel, api) {
    super(eventsModel, filtersModel);
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
    this._updateViews = this._updateViews.bind(this);
    this._applyNewFilter = this._applyNewFilter.bind(this);
    this._resetDataChanges = this._resetDataChanges.bind(this);

    this._newEventPresenter = new NewEventPresenter(
        eventsModel,
        offersModel,
        this._changeEventsData
    );
  }

  init() {
    this._eventsModel.addObserver(this._updateViews);
    this._filtersModel.addObserver(this._applyNewFilter);

    this._createTripSplit();
    this._renderTrip();
  }

  destroy() {
    this._clearTrip(true);

    remove(this._daysListComponent);
    remove(this._sortComponent);

    this._eventsModel.removeObserver(this._updateViews);
    this._filtersModel.removeObserver(this._applyNewFilter);
  }

  createEvent(callback) {
    this._newEventPresenter.init(
        (this._sortComponent !== null && this._sortComponent.isEventRendered())
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
      .sort((event1, event2) => getEventDuration(event2) - getEventDuration(event1));
  }

  _createSplitBySort(events) {
    this._tripSplit = new Map([[SORT_KEY, events]]);
  }

  _createSplitByDays() {
    const tripDays = new Map();

    for (const event of this._getEvents()) {
      const date = new Date(event.timeStart).setHours(0, 0, 0, 0);

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

  _renderNoPoints() {
    render(
        this._container,
        this._noEventsComponent,
        RenderPosition.BEFOREEND
    );
  }

  _renderSortComponent() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._changeEventsSorting);

    render(
        this._container,
        this._sortComponent,
        RenderPosition.BEFOREEND
    );
  }

  _renderLoading() {
    render(this._header, this._loadingComponent, RenderPosition.AFTEREND);
  }

  _createEventPresenter(container, eventData) {
    const eventPresenter = new EventPresenter(
        container,
        this._eventsModel,
        this._offersModel,
        this._changeEventsData,
        this._resetDataChanges
    );
    eventPresenter.init(eventData);
    this._existEventPresenters[eventData.id] = eventPresenter;
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

  _renderTripTable() {
    this._createDaysList();

    render(
        this._container,
        this._daysListComponent,
        RenderPosition.BEFOREEND
    );
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!this._getEvents().length) {
      this._renderNoPoints();
      return;
    }

    this._renderSortComponent();
    this._renderTripTable();
  }

  _clearTrip(resetSortType = false) {
    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

    this._newEventPresenter.destroy();

    remove(this._noEventsComponent);
    remove(this._loadingComponent);
    remove(this._sortComponent);

    Object
      .values(this._existEventPresenters)
      .forEach((presenter) => presenter.destroy());
    this._existEventPresenters = {};

    this._existTripDays.forEach(remove);
    this._existTripDays = [];
  }

  _updateViews(eventType) {
    if (eventType === EventType.INIT) {
      this._isLoading = false;
      remove(this._loadingComponent);
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
    this._updateViews();
  }

  _changeEventsData(userAction, event) {
    switch (userAction) {
      case UserAction.UPDATE_EVENT:
        this._existEventPresenters[event.id].setFormViewStatus(FormStatus.SAVING);
        this._api.updateEvent(event)
          .then((response) => {
            this._eventsModel.updateEvent(response);
        })
          .catch(() => {
            this._existEventPresenters[event.id].setFormViewStatus(FormStatus.ABORTING);
          });
        break;
      case UserAction.DELETE_EVENT:
        this._existEventPresenters[event.id].setFormViewStatus(FormStatus.DELETING);
        this._api.deleteEvent(event)
          .then(() => {
            this._eventsModel.deleteEvent(event);
          })
          .catch(() => {
            this._existEventPresenters[event.id].setFormViewStatus(FormStatus.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._newEventPresenter.setFormViewStatus(FormStatus.SAVING);
        this._api.addEvent(event)
          .then((response) => {
            this._eventsModel.addEvent(response);
          })
          .catch(() => {
            this._newEventPresenter.setFormViewStatus(FormStatus.ABORTING);
          });
        break;
    }
  }

  _resetDataChanges() {
    this._newEventPresenter.destroy();
    Object
      .values(this._existEventPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _applyNewFilter(eventType) {
    this._currentSortType = SortType.DEFAULT;
    this._updateViews(eventType);
  }
}
