import {render, RenderPosition} from './utils/render.js';
import {generateEvent} from './mock/event.js';
import {generateDestinationCitiesDescription} from './mock/utils.js';
import {DESTINATION_CITIES} from './mock/const.js';
import {getTripRoute,
  getTripDuration,
  calculateTotalTripCost
} from './utils/common.js';

import TripInfo from './view/trip-info.js';
import NewEventButton from './view/new-event-button.js';
import TripRoute from './view/trip-route.js';
import TripCost from './view/trip-cost.js';
import Menu from './view/menu.js';
import Filters from './view/filters.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';

import TripModel from './model/trip.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';

const EVENTS_AMOUNT = 3;
let date = new Date();

const events = (new Array(EVENTS_AMOUNT)
  .fill()
  .map(() => {
    let event = generateEvent(date);
    date = event.endTime;

    return event;
  })
);

const eventsModel = new EventsModel();
const tripModel = new TripModel();
const filterModel = new FilterModel();
tripModel.setDestinations(DESTINATION_CITIES);
tripModel.setEvents(events);

const tripInfoPosition = document.querySelector(`.trip-main`);
const menuPosition = tripInfoPosition.querySelector(`.menu-position`);
const filtersPosition = tripInfoPosition.querySelector(`.filters-position`);
const eventsContainerPosition = document.querySelector(`.trip-events`);
const destinations = generateDestinationCitiesDescription();
const tripInfo = new TripInfo().getElement();

render(tripInfoPosition, tripInfo, RenderPosition.AFTERBEGIN);

const tripRoutePosition = tripInfoPosition.querySelector(`.trip-main__trip-info`);

render(tripRoutePosition, new TripRoute(getTripRoute(events), getTripDuration(events)).getElement(), RenderPosition.AFTERBEGIN);
render(tripRoutePosition, new TripCost(calculateTotalTripCost(events)).getElement(), RenderPosition.BEFOREEND);
render(menuPosition, new Menu().getElement(), RenderPosition.AFTEREND);
render(tripInfoPosition, new NewEventButton().getElement(), RenderPosition.BEFOREEND);
render(filtersPosition, new Filters().getElement(), RenderPosition.AFTEREND);

const tripPresenter = new TripPresenter(eventsContainerPosition, destinations, tripModel, filterModel);
const filterPresenter = new FilterPresenter(filtersPosition, filterModel, eventsModel);

filterPresenter.init();
tripPresenter.init();

tripInfoPosition.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});
