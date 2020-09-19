import Abstract from '../view/abstract.js';

const createDayListTemplate = () => `<ul class="trip-days"></ul>`;

export default class DaysListView extends Abstract {

  getTemplate() {
    return createDayListTemplate();
  }
}
