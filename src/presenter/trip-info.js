import {EventType} from '../const.js';
import {
  render,
  append,
  replace,
  RenderPosition
} from '../utils/render.js';

import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import TripRouteView from '../view/trip-route.js';
import EventsPresenter from './events.js';

export default class TripInfoPresenter extends EventsPresenter {
  constructor(tripInfoContainer, eventsModel, filtersModel) {
    super(eventsModel, filtersModel);
    this._container = tripInfoContainer;

    this._updateViews = this._updateViews.bind(this);

    this._eventsModel.addObserver(this._updateViews);
    this._filtersModel.addObserver(this._updateViews);
  }

  init() {
    this._tripInfoComponent = new TripInfoView();
    this._routeComponent = new TripRouteView(this._getAllEvents());
    this._costComponent = new TripCostView(this._getEvents());

    append(this._tripInfoComponent, this._routeComponent);
    append(this._tripInfoComponent, this._costComponent);

    render(
        this._container,
        this._tripInfoComponent,
        RenderPosition.AFTERBEGIN
    );
  }

  _updateViews(eventType) {
    if (eventType === EventType.EVENT) {
      this._updateRoute();
    }

    this._updateCost();
    this._updateRoute();
  }

  _updateCost() {
    let prevCostComponent = this._costComponent;

    this._costComponent = new TripCostView(this._getEvents());

    replace(this._costComponent, prevCostComponent);

    prevCostComponent = null;
  }

  _updateRoute() {
    let prevRouteComponent = this._routeComponent;

    this._routeComponent = new TripRouteView(this._getAllEvents());

    replace(this._routeComponent, prevRouteComponent);

    prevRouteComponent = null;
  }
}
