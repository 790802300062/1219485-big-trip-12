import {FilterType} from '../const.js';
import {isInputTag} from '../utils/common.js';

import Abstract from '../view/abstract.js';

export default class FilterView extends Abstract {
  constructor(currentFilterType, filters, filtersStatus) {
    super();
    this._currentFilterType = currentFilterType;
    this._filters = filters;
    this._filtersStatus = filtersStatus;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    const filterItemsTemplate = Object.values(FilterType)
      .map((filter) => {
        return this._createFilterItemsTemplate(
            filter,
            filter === this._currentFilterType,
            this._filtersStatus && Boolean(this._filters[filter])
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

  _createFilterItemsTemplate(filter, isChecked, isEnabled) {
    return (
      `<div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input visually-hidden"
          type="radio" name="trip-filter"
          value="${filter}" ${isChecked ? `checked` : ``} ${isEnabled ? `` : `disabled`}>
        <label class="trip-filters__filter-label" for="filter-${filter}"> ${filter} </label>
      </div>`
    );
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.changeFilter = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    if (!isInputTag(evt)) {
      return;
    }

    this._callback.changeFilter(evt.target.value);
  }
}

