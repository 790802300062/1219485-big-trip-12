import AbstractView from "./abstract.js";
import {getTimeInHours} from '../utils/common.js';

const MONTHS_NAMES = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

const createDayTemplate = (date, count) => {
  let month = MONTHS_NAMES[date.getMonth()];
  let day = getTimeInHours(date.getDate());

  return (`
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count}</span>
        <time class="day__date" datetime="2019-${month}-${day}">${month + ` ` + day}</time>
      </div>
    </li>`
  );
};

export default class DayBlock extends AbstractView {
  constructor(day, count) {
    super();
    this._day = day;
    this._count = count;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._count);
  }
}
