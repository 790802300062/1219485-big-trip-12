import Abstract from './abstract.js';

const createDaysContainerTemplate = () => `<ul class="trip-days"></ul>`;

export default class DaysContainer extends Abstract {
  _getTemplate() {
    return createDaysContainerTemplate();
  }
}
