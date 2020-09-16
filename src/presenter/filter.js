import Filters from '../view/filters.js';

import {filterTypeToEvents} from '../utils/common.js';
import {
  render,
  replace,
  remove,
  RenderPosition
} from '../utils/render.js';

import {
  UpdateType,
  FilterType
} from '../const.js';

export default class FilterPresenter {
  constructor(filterContainer, filterModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;
    this._currentFilter = null;
    this._filterComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new Filters(this._currentFilter, filters);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MINOR, filterType);
  }

  _getFilters() {
    const events = this._eventsModel.getEvents();
    const currentDate = new Date();

    return {
      [FilterType.EVERYTHING]: filterTypeToEvents[FilterType.EVERYTHING](events).length,
      [FilterType.FUTURE]: filterTypeToEvents[FilterType.FUTURE](events, currentDate).length,
      [FilterType.PAST]: filterTypeToEvents[FilterType.PAST](events, currentDate).length,
    };
  }
}
