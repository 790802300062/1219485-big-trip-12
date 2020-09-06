import DayView from "../view/day-block.js";
import SortView from "../view/sort.js";
import StartView from "../view/start.js";
import EventsListContainerView from "../view/events-list.js";
import EventPresenter from "./event.js";
import {updateItem} from "../utils/common.js";
import {createDates, createDateEventsList} from '../utils/event.js';
import {render, RenderPosition} from "../utils/render.js";


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._eventPresenter = {};

    this._sortComponent = new SortView();
    this._startComponent = new StartView();
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._sourcedEvent = events.slice();

    if (this._events.length === 0) {
      this._renderStart(this._events);
      return;
    }

    this._renderSort();
    this._renderTrip(this._events);
  }

  _renderStart() {
    render(this._tripContainer, this._startComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip(events) {
    const days = createDates(events);
    let count = 0;
    for (let day of days) {
      count++;
      const dayElement = new DayView(new Date(day), count);
      render(this._tripContainer, dayElement, RenderPosition.BEFOREEND);

      const eventsListContainer = new EventsListContainerView();
      console.log(eventsListContainer);
      render(dayElement, eventsListContainer, RenderPosition.BEFOREEND);

      const dateEventsList = createDateEventsList(events, new Date(day));
      for (let event of dateEventsList) {
        this._renderEvent(eventsListContainer, event);
      }
    }
  }

  _renderEvent(eventListElement, event) {
    const eventPresenter = new EventPresenter(eventListElement, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._sourcedEvent = updateItem(this._sourcedEvent, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _clearEventList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }
}
