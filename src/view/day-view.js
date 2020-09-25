import {
  formatWholeDate,
  formatMonth
} from '../utils/time-and-date.js';

import AbstractView from './abstract-view.js';

export default class DayView extends AbstractView {
  constructor(date, index, visible) {
    super();
    this._date = date;
    this._index = index;
    this._visible = visible;
  }

  getTemplate() {
    const dayContent = this._visible ? this._createDayContent() : ``;

    return (
      `<li class="trip-days__item  day" id="trip-days__item-${this._index}">
        <div class="day__info">${dayContent}</div>
      </li>`
    );
  }

  _createDayContent() {
    return (
      `<span class="day__counter">${this._index}</span>
      <time class="day__date" datetime="${formatWholeDate(this._date)}">
        ${formatMonth(new Date(this._date))}
      </time>`
    );
  }
}

