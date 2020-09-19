import {
  formatWholeDate,
  formatMonth
} from '../utils/time-and-date.js';

import Abstract from '../view/abstract.js';

const createDayTemplate = (dayIndex, date) => {
  return(
    `<span class="day__counter">${dayIndex}</span>
      <time class="day__date" datetime="${formatWholeDate(date)}">
        ${formatMonth(new Date(date))}
      </time>`
  );
};

const createDayContent = (dayIndex, dayContent) => {
  return(
    `<li class="trip-days__item  day" id="trip-days__item-${dayIndex}">
        <div class="day__info">${dayContent}</div>
    </li>`
  )
}

export default class DayView extends Abstract {
  constructor(date, dayIndex, visible) {
    super();
    this._date = date;
    this._dayIndex = dayIndex;
    this._visible = visible;
  }

  getTemplate() {
    const dayContent = this._visible ? createDayTemplate(this._dayIndex, this._date) : ``;

    return createDayContent(this._dayIndex, dayContent);
  }
}

