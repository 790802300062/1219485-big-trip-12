import DayView from "../view/day-block.js";
import SortView from "../view/sort.js";
import EditEventView from "../view/edit-event.js";
import EventView from "../view/event.js";
import {render, RenderPosition, replace} from "../utils/render.js";


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._sortComponent = new SortView();
  }

  init(events) {
    this._events = events.slice();
    this._renderSort();
    this._renderDay(this._events);
    this._renderEventList(this._events);
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderDay(events) {
    render(this._tripContainer, new DayView(events), RenderPosition.BEFOREEND);
  }

  _renderEventList(events) {
    const dayElements = document.querySelectorAll(`.trip-days__item`);
    for (let dayElement of dayElements) {
      let date = new Date(dayElement.querySelector(`.day__date`).getAttribute(`datetime`));
      let dayEvents = events.filter((event) => event.startDate.getMonth() === date.getMonth() && event.startDate.getDate() === date.getDate());
      for (let event of dayEvents) {
        this._renderEvent(dayElement.querySelector(`.trip-events__list`), event);
      }
    }
  }

  _renderEvent(eventListElement, event) {
    const eventComponent = new EventView(event);
    const eventEditComponent = new EditEventView(event);
    render(eventListElement, eventComponent, RenderPosition.BEFOREEND);

    const replaceEventToForm = () => {
      replace(eventEditComponent, eventComponent);
    };

    const replaceFormToEvent = () => {
      replace(eventComponent, eventEditComponent);
    };

    eventComponent.setEventClickHandler(() => {
      replaceEventToForm();
    });

    eventEditComponent.setCancelClickHandler(() => {
      replaceFormToEvent();
    });

    eventEditComponent.setFormSubmitHandler(() => {
      replaceFormToEvent();
    });
  }
}
