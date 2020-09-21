import {
  render,
  RenderPosition
} from './utils/render.js';

import {
  AUTHORIZATION,
  END_POINT,
  FilterType,
  MenuItem
} from './const.js';

import MenuView from './view/menu.js';
import TripPresenter from './presenter/trip.js';
import FiltersPreseter from './presenter/filters.js';
import TripInfoPresenter from './presenter/trip-info.js';
import StatisticsPresenter from './presenter/statistics.js';
import OffersModel from './model/offers.js';
import EventsModel from './model/events.js';
import FiltersModel from './model/filters.js';
import Api from './api.js';

const tripInfoPosition = document.querySelector(`.trip-main`);
const menuPosition = tripInfoPosition.querySelector(`.menu-position`);
const filtersPosition = tripInfoPosition.querySelector(`.filters-position`);
const eventsContainerPosition = document.querySelector(`.trip-events`);
const sortAndContentPosition = eventsContainerPosition.querySelector(`.sort-content-position`);
const newEventButtonPosition = tripInfoPosition.querySelector(`.trip-main__event-add-btn`);

const api = new Api(END_POINT, AUTHORIZATION);
const offersModel = new OffersModel();
const eventsModel = new EventsModel(offersModel);
const filtersModel = new FiltersModel();
const menuComponent = new MenuView();
const filtersPreseter = new FiltersPreseter(filtersPosition, eventsModel, filtersModel);
const tripPresenter = new TripPresenter(eventsContainerPosition, sortAndContentPosition,
    eventsModel, offersModel, filtersModel, api);
const informationPresenter = new TripInfoPresenter(tripInfoPosition, eventsModel, filtersModel);
const statisticsPresenter = new StatisticsPresenter(eventsContainerPosition, eventsModel);

newEventButtonPosition.disabled = true;

informationPresenter.init();
tripPresenter.init();
filtersPreseter.init();

Promise.all([
  api.getOffers(),
  api.getDestinations(),
  api.getEvents(),
])
  .then(([offers, destinations, events]) => {
    offersModel.setOffersFromServer(offers);
    eventsModel.setDestinations(destinations);
    eventsModel.setEvents(events);
    enableMenu();
  })
  .catch(() => {
    eventsModel.setEvents([]);
    enableMenu();
  });

const enableMenu = () => {
  render(menuPosition, menuComponent, RenderPosition.AFTEREND);

  menuComponent.setMenuItemClickHandler(handleMenuClick);
  newEventButtonPosition.addEventListener(`click`, newEventButtonClickHandler);
  newEventButtonPosition.disabled = false;
};

const newEventButtonClickHandler = (evt) => {
  evt.preventDefault();
  handleMenuClick(MenuItem.NEW_EVENT);
  menuComponent.setMenuItem(MenuItem.TABLE);
};

const newEventFormCloseHandler = () => {
  newEventButtonPosition.disabled = false;
};

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_EVENT:
      statisticsPresenter.destroy();
      tripPresenter.destroy();
      filtersModel.setFilter(FilterType.EVERYTHING);
      tripPresenter.init();
      tripPresenter.createEvent(newEventFormCloseHandler);
      newEventButtonPosition.disabled = true;
      break;
    case MenuItem.TABLE:
      statisticsPresenter.destroy();
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsPresenter.init();
  }
};
