import {
  render,
  RenderPosition
} from './utils/render.js';

import {
  FilterType,
  MenuItem,
  EventType,
  UpdateType,
  AUTHORIZATION,
  END_POINT
} from './const.js';

import MenuView from './view/menu.js';

import TripPresenter from './presenter/trip.js';
import FiltersPresenter from './presenter/filters.js';
import TripInfoPresenter from './presenter/trip-info.js';
import StatisticsPresenter from './presenter/statistics.js';

import OffersModel from './model/offers.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';

import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v12.0`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const OFFLINE_TITLE = ` [offline]`;

const tripInfoNode = document.querySelector(`.trip-main`);
const menuNode = tripInfoNode.querySelector(`.menu-position`);
const filtersNode = tripInfoNode.querySelector(`.filters-position`);
const eventsContainerNode = document.querySelector(`.trip-events`);
const sortAndContentNode = eventsContainerNode.querySelector(`.sort-content-position`);
const newEventButtonNode = tripInfoNode.querySelector(`.trip-main__event-add-btn`);

const newEventButtonClickHandler = (evt) => {
  evt.preventDefault();
  handleMenuClick(MenuItem.NEW_EVENT);
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

const newEventFormCloseHandler = () => {
  newEventButtonNode.disabled = false;
};

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_EVENT:
      statisticsPresenter.destroy();
      tripPresenter.destroy();
      filterModel.setFilter(FilterType.EVERYTHING);
      tripPresenter.init();
      filtersPresenter.init();
      tripPresenter.createEvent(newEventFormCloseHandler);
      newEventButtonNode.disabled = true;
      break;
    case MenuItem.TABLE:
      statisticsPresenter.destroy();
      tripPresenter.init();
      filtersPresenter.init();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      filterModel.setFilter(FilterType.EVERYTHING);
      filtersPresenter.init(false);
      statisticsPresenter.init();
  }
};

const enableMenu = () => {
  render(menuNode, siteMenuComponent, RenderPosition.AFTEREND);

  siteMenuComponent.setMenuItemClickHandler(handleMenuClick);
  newEventButtonNode.addEventListener(`click`, newEventButtonClickHandler);
  newEventButtonNode.disabled = false;
};

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const offersModel = new OffersModel();
const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const siteMenuComponent = new MenuView();

const filtersPresenter = new FiltersPresenter(filtersNode, eventsModel, filterModel);
const tripPresenter = new TripPresenter(eventsContainerNode, sortAndContentNode,
    eventsModel, offersModel, filterModel, apiWithProvider);

const tripInfoPresenter = new TripInfoPresenter(tripInfoNode, eventsModel, filterModel);
const statisticsPresenter = new StatisticsPresenter(eventsContainerNode, eventsModel);

newEventButtonNode.disabled = true;

tripInfoPresenter.init();
tripPresenter.init();
filtersPresenter.init();

Promise.all([
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations(),
  apiWithProvider.getEvents(),
])
  .then(([offers, destinations, events]) => {
    offersModel.setOffersFromServer(offers);
    eventsModel.setDestinations(destinations);
    eventsModel.setEvents(EventType.INIT, UpdateType.MAJOR, events);
    enableMenu();
  })
.catch(() => {
  eventsModel.setEvents(EventType.INIT, UpdateType.MAJOR, []);
  enableMenu();
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(OFFLINE_TITLE, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += OFFLINE_TITLE;
});
