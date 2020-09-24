import AbstractView from '../view/abstract.js';

export default class DaysListView extends AbstractView {
  getTemplate() {
    return (
      `<ul class="trip-days"></ul>`
    );
  }
}
