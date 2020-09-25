import {isLinkTag} from '../utils/common.js';
import {MenuItem} from '../const.js';

import AbstractView from './abstract-view.js';

const ACTIVE_CLASS = `trip-tabs__btn--active`;

export default class MenuView extends AbstractView {
  constructor() {
    super();
    this._menuItemClickHandler = this._menuItemClickHandler.bind(this);
  }

  getTemplate() {
    return (
      `<nav class="trip-controls__trip-tabs  trip-tabs">
        <a class="trip-tabs__btn ${ACTIVE_CLASS}" href="#" value=${MenuItem.TABLE}>Table</a>
        <a class="trip-tabs__btn" href="#" value=${MenuItem.STATS}>Stats</a>
      </nav>`
    );
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[value=${menuItem}]`);
    const prevActiveItem = this.getElement().querySelector(`.${ACTIVE_CLASS}`);

    if (item && prevActiveItem && prevActiveItem !== item) {
      prevActiveItem.classList.remove(ACTIVE_CLASS);
      item.classList.add(ACTIVE_CLASS);
    }
  }

  setMenuItemClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuItemClickHandler);
  }

  _menuItemClickHandler(evt) {
    evt.preventDefault();

    if (!isLinkTag(evt)
      || evt.target.classList.contains(ACTIVE_CLASS)) {
      return;
    }

    this.setMenuItem(evt.target.getAttribute(`value`));
    this._callback.menuClick(evt.target.getAttribute(`value`));
  }
}
