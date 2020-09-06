import MenuControlsView from "./view/site-menu.js";
import TripInfoView from "./view/trip-info.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition} from "./utils/render.js";

const EVENTS_AMOUNT = 25;

const events = new Array(EVENTS_AMOUNT).fill().map(generateEvent);
console.log(events);

events.sort((a, b) => {
  const dateA = new Date(a.startDate);
  const dateB = new Date(b.startDate);

  return dateA - dateB;
});

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);

const tripControlElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
render(tripControlElement, new MenuControlsView(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector(`.trip-events`);
const tripPresenter = new TripPresenter(tripEventsElement, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlElement, filterModel, eventsModel);

tripPresenter.init();
filterPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});
