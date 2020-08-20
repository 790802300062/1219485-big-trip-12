import MenuControlsView from "./view/site-menu.js";
import TripInfoView from "./view/trip-info.js";
import FiltersView from "./view/filter.js";
import SortView from "./view/sort.js";
import DayView from "./view/day.js";
import EditEventView from "./view/edit-event-form.js";
import EventView from "./view/event.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils.js";

const EVENTS_AMOUNT = 25;

const events = new Array(EVENTS_AMOUNT).fill().map(generateEvent);

events.sort((a, b) => {
  const dateA = new Date(a.startDate);
  const dateB = new Date(b.startDate);
  return dateA - dateB;
});

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);

const tripControlElement = tripMainElement.querySelector(`.trip-main__trip-controls`);

render(tripControlElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);
render(tripControlElement, new MenuControlsView().getElement(), RenderPosition.AFTEREND);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new DayView(events).getElement(), RenderPosition.BEFOREEND);

const DaysElement = document.querySelectorAll(`.trip-days__item`);

const renderEvents = (eventListElement, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EditEventView(event);

  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);

  const replaceEventToForm = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToEvent = () => {
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEventToForm();
  });

  eventEditComponent.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, () => {
    replaceFormToEvent();
  });

  eventEditComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToEvent();
  });
};

for (let dayElement of DaysElement) {
  let date = new Date(dayElement.querySelector(`.day__date`).getAttribute(`datetime`));
  let dayEvents = events.filter((event) => event.startDate.getMonth() === date.getMonth() && event.startDate.getDate() === date.getDate());
  for (let event of dayEvents) {
    renderEvents(dayElement.querySelector(`.trip-events__list`), event);
  }
}

