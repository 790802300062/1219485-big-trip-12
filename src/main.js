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
import Api from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const SW_ERROR_MESSAGE = `ServiceWorker isn't available`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const tripInfoNode = document.querySelector(`.trip-main`);
const menuNode = tripInfoNode.querySelector(`.menu-position`);
const filtersNode = tripInfoNode.querySelector(`.filters-position`);
const eventsContainerNode = document.querySelector(`.trip-events`);
const sortAndContentNode = eventsContainerNode.querySelector(`.sort-content-position`);
const newEventButtonNode = tripInfoNode.querySelector(`.trip-main__event-add-btn`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const offersModel = new OffersModel();
const eventsModel = new EventsModel(offersModel);
const filtersModel = new FiltersModel();
const menuComponent = new MenuView();
const filtersPresenter = new FiltersPreseter(filtersNode, eventsModel, filtersModel);
const tripPresenter = new TripPresenter(eventsContainerNode, sortAndContentNode,
    eventsModel, offersModel, filtersModel, apiWithProvider);
const informationPresenter = new TripInfoPresenter(tripInfoNode, eventsModel, filtersModel);
const statisticsPresenter = new StatisticsPresenter(eventsContainerNode, eventsModel);

newEventButtonNode.disabled = true;

informationPresenter.init();
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
    eventsModel.setEvents(events);
    enableMenu();
  })
  .catch(() => {
    eventsModel.setEvents([]);
    enableMenu();
  });

const enableMenu = () => {
  render(menuNode, menuComponent, RenderPosition.AFTEREND);

  menuComponent.setMenuItemClickHandler(handleMenuClick);
  newEventButtonNode.addEventListener(`click`, newEventButtonClickHandler);
  newEventButtonNode.disabled = false;
};

const newEventButtonClickHandler = (evt) => {
  evt.preventDefault();
  handleMenuClick(MenuItem.NEW_EVENT);
  menuComponent.setMenuItem(MenuItem.TABLE);
};

const newEventFormCloseHandler = () => {
  newEventButtonNode.disabled = false;
};

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_EVENT:
      statisticsPresenter.destroy();
      tripPresenter.destroy();
      filtersModel.setFilter(FilterType.EVERYTHING);
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
      filtersModel.setFilter(FilterType.EVERYTHING);
      filtersPresenter.init(false);
      statisticsPresenter.init();
  }
};

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
