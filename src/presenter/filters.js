import FiltersView from '../view/filters.js';
import {UpdateType} from '../const.js';
import {filter} from '../utils/filter.js';
import {
  render,
  remove,
  RenderPosition
} from '../utils/render.js';

export default class FiltersPresenter {
  constructor(filterHeader, eventsModel, filterModel) {
    this._header = filterHeader;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;

    this._filterComponent = null;

    this._changeTypeFilter = this._changeTypeFilter.bind(this);
    this._updateView = this._updateView.bind(this);

    this._filterModel.addObserver(this._updateView);
    this._eventsModel.addObserver(this._updateView);
  }

  init(isFiltersActive = true) {
    if (this._filterComponent) {
      remove(this._filterComponent);
      this._filterComponent = null;
    }

    this._filterComponent = new FiltersView(
        this._filterModel.getFilter(),
        this._getFiltersNumber(),
        isFiltersActive
    );

    this._filterComponent.setFilterTypeChangeHandler(this._changeTypeFilter);

    render(
        this._header,
        this._filterComponent,
        RenderPosition.AFTEREND
    );
  }

  _changeTypeFilter(filterType) {
    this._filterModel.setFilter(filterType);
  }

  _getFiltersNumber() {
    const events = this._eventsModel.getEvents();

    return Object.entries(filter)
    .map(([key, value]) => ({[key]: value(events).length}))
    .reduce((result, element) => Object.assign(result, element), {});
  }

  _updateView(event) {
    if (event.updateType === UpdateType.MAJOR) {
      this.init();
    }
  }
}
