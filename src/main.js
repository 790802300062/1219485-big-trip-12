import {
  render,
  RenderPosition
} from './utils/render.js';

import {
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

const AUTHORIZATION = `Basic io380cs93mlfrq1ii8sdfhurdy67k`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;

const headerNode = document.querySelector(`.trip-main`);
const menuHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[0];
const filtersHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[1];
const boardContainerNode = document.querySelector(`.trip-events`);
const tripHeader = boardContainerNode.querySelector(`h2`);
const newEventButton = headerNode.querySelector(`.trip-main__event-add-btn`);

const newEventButtonClickHandler = (evt) => {
  evt.preventDefault();
  handleMenuClick(MenuItem.NEW_EVENT);
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

const newEventFormCloseHandler = () => {
  newEventButton.disabled = false;
};

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_EVENT:
      statisticsPresenter.destroy();
      tripPresenter.destroy();
      filtersModel.setFilter(FilterType.EVERYTHING);
      tripPresenter.init();
      tripPresenter.createEvent(newEventFormCloseHandler);
      newEventButton.disabled = true;
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

const enableMenu = () => {
  render(
      menuHeaderNode,
      siteMenuComponent,
      RenderPosition.AFTEREND
  );

  siteMenuComponent.setMenuItemClickHandler(handleMenuClick);
  newEventButton.addEventListener(`click`, newEventButtonClickHandler);
  newEventButton.disabled = false;
};

const api = new Api(END_POINT, AUTHORIZATION);
const offersModel = new OffersModel();
const pointsModel = new EventsModel(offersModel);
const filtersModel = new FiltersModel();
const siteMenuComponent = new MenuView();
const filtersPreseter = new FiltersPreseter(
    filtersHeaderNode,
    pointsModel,
    filtersModel
);
const tripPresenter = new TripPresenter(
    boardContainerNode,
    tripHeader,
    pointsModel,
    offersModel,
    filtersModel,
    api
);
const informationPresenter = new TripInfoPresenter(
    headerNode,
    pointsModel,
    filtersModel
);
const statisticsPresenter = new StatisticsPresenter(
    boardContainerNode,
    pointsModel
);

newEventButton.disabled = true;

informationPresenter.init();
tripPresenter.init();
filtersPreseter.init();

Promise.all([
  api.getOffers(),
  api.getDestinations(),
  api.getEvents(),
])
  .then(([offers, destinations, points]) => {
    offersModel.setOffersFromServer(offers);
    pointsModel.setDestinations(destinations);
    pointsModel.setEvents(points);
    enableMenu();
  })
  .catch(() => {
    pointsModel.setEvents([]);
    enableMenu();
  });
