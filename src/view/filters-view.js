import {FilterType} from '../const.js';
import {isInputTag} from '../utils/common.js';

import AbstractView from './abstract-view.js';

export default class FiltersView extends AbstractView {
  constructor(currentFilterType, filters, filtersEnabled) {
    super();
    this._currentFilter = currentFilterType;
    this._filters = filters;
    this._filtersEnabled = filtersEnabled;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    const filterItemsTemplate = Object.values(FilterType)
      .map((filter) => {
        return this._createFilterItemTemplate(
            filter,
            filter === this._currentFilter,
            this._filtersEnabled && Boolean(this._filters[filter])
        );
      })
      .join(``);

    return (
      `<form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
    );
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.changeFilter = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }

  _createFilterItemTemplate(filter, isChecked, isEnabled) {
    return (
      `<div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input visually-hidden" type="radio"
          name="trip-filter" value="${filter}" ${isChecked ? `checked` : ``} ${isEnabled ? `` : `disabled`}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
      </div>`
    );
  }

  _filterTypeChangeHandler(evt) {
    if (!isInputTag(evt)) {
      return;
    }

    this._callback.changeFilter(evt.target.value);
  }
}

