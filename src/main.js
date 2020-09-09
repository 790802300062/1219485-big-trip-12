import {render, RenderPosition} from './utils/render.js';
import {generateEvent} from './mock/event.js';
import {generateDestinationCitiesDescription} from './mock/utils.js';
import {getTripRoute, calculateTotalTripCost} from './utils/common.js';

import TripInfo from './view/trip-info.js';
import NewEventButton from './view/new-event-button.js';
import TripRoute from './view/trip-route.js';
import TripCost from './view/trip-cost.js';
import Menu from './view/menu.js';
import Filters from './view/filters.js';
import TripPresenter from './presenter/trip';

const EVENTS_AMOUNT = 25;

const tripInfoPosition = document.querySelector(`.trip-main`);
const menuPosition = tripInfoPosition.querySelector(`.menu-position`);
const filtersPosition = tripInfoPosition.querySelector(`.trip-controls`);
const eventsContainerPosition = document.querySelector(`.trip-events`);

let date = new Date();

const events = new Array(EVENTS_AMOUNT)
  .fill()
  .map(() => {
    let event = generateEvent(date);
    date = event.endTime;

    return event;
  });

const destinations = generateDestinationCitiesDescription();
const tripInfo = new TripInfo().getElement();

render(tripInfoPosition, tripInfo, RenderPosition.AFTERBEGIN);
render(tripInfoPosition, new NewEventButton().getElement(), RenderPosition.BEFOREEND);

render(tripInfoPosition, new TripRoute(getTripRoute(events)).getElement(), RenderPosition.BEFOREEND);
render(tripInfoPosition, new TripCost(calculateTotalTripCost(events)).getElement(), RenderPosition.BEFOREEND);

render(menuPosition, new Menu().getElement(), RenderPosition.AFTEREND);
render(filtersPosition, new Filters().getElement(), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(eventsContainerPosition, destinations);
tripPresenter.init(events);
