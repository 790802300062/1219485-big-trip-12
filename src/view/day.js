import {
  formatWholeDate,
  formatMonth
} from '../utils/time-and-date.js';

import Abstract from './abstract';

const createDayTemplate = (dayDate, counter) => {
  return (`<li class="trip-days__item  day">
      <div class="day__info">
        ${counter !== 0 ? `<span class="day__counter">${counter}</span>
        <time class="day__date" datetime="${formatWholeDate(dayDate)}">${formatMonth(dayDate)}</time>` : ``}
      </div>
    </li>`
  );
};

export default class DayView extends Abstract {
  constructor(dayDate, counter) {
    super();

    this._dayDate = dayDate;
    this._counter = counter;
  }

  _getTemplate() {
    return createDayTemplate(this._dayDate, this._counter);
  }
}
