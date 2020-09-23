import {filter} from '../utils/filter.js';
import {
  render,
  remove,
  RenderPosition
} from '../utils/render.js';

import FilterView from '../view/filters.js';

export default class FiltersPreseter {
  constructor(filterHeader, eventsModel, filtersModel) {
    this._header = filterHeader;
    this._eventsModel = eventsModel;
    this._filtersModel = filtersModel;
    this._filterComponent = null;

    this._changeTypeFilter = this._changeTypeFilter.bind(this);
    this._updateView = this._updateView.bind(this);

    this._filtersModel.addObserver(this._updateView);
    this._eventsModel.addObserver(this._updateView);
  }

  init(filtersStatus = true) {
    if (this._filterComponent) {
      remove(this._filterComponent);
      this._filterComponent = null;
    }

    this._filterComponent = new FilterView(
        this._filtersModel.getFilter(),
        this._getFiltersCount(),
        filtersStatus
    );

    this._filterComponent.setFilterTypeChangeHandler(this._changeTypeFilter);

    render(
        this._header,
        this._filterComponent,
        RenderPosition.AFTEREND
    );
  }

  _changeTypeFilter(filterType) {
    this._filtersModel.setFilter(filterType);
  }

  _getFiltersCount() {
    const events = this._eventsModel.getEvents();

    return Object.entries(filter)
    .map(([key, value]) => ({[key]: value(events).length}))
    .reduce((result, element) => Object.assign(result, element), {});
  }

  _updateView() {
    this.init();
  }
}
