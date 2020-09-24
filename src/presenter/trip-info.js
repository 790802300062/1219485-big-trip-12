import {
  EventType,
  UpdateType
} from '../const.js';

import {
  render,
  append,
  replace,
  RenderPosition
} from '../utils/render.js';

import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import TripRouteView from '../view/trip-route.js';
import EventsPresenter from '../presenter/events.js';

export default class TripInfoPresenter extends EventsPresenter {
  constructor(tripInfoContainer, eventsModel, filterModel) {
    super(eventsModel, filterModel);
    this._container = tripInfoContainer;

    this._updateView = this._updateView.bind(this);

    this._eventsModel.addObserver(this._updateView);
    this._filterModel.addObserver(this._updateView);
  }

  init() {
    this._tripInfoComponent = new TripInfoView();
    this._tripRouteComponent = new TripRouteView(this._getAllEvents());
    this._tripCostComponent = new TripCostView(this._getEvents());

    append(this._tripInfoComponent, this._tripRouteComponent);
    append(this._tripInfoComponent, this._tripCostComponent);

    render(
        this._container,
        this._tripInfoComponent,
        RenderPosition.AFTERBEGIN
    );
  }

  _updateView(event) {
    if (event.updateType !== UpdateType.MAJOR) {
      return;
    }

    if (event.eventType === EventType.EVENT) {
      this._updateTripRoute();
    }

    this._updateTripCost();
    this._updateTripRoute();
  }

  _updateTripCost() {
    let prevTripCostComponent = this._tripCostComponent;

    this._tripCostComponent = new TripCostView(this._getEvents());

    replace(this._tripCostComponent, prevTripCostComponent);

    prevTripCostComponent = null;
  }

  _updateTripRoute() {
    let prevTripRouteComponent = this._tripRouteComponent;

    this._tripRouteComponent = new TripRouteView(this._getAllEvents());

    replace(this._tripRouteComponent, prevTripRouteComponent);

    prevTripRouteComponent = null;
  }
}
