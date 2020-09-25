import AbstractView from './abstract-view.js';

export default class DaysListView extends AbstractView {
  getTemplate() {
    return (
      `<ul class="trip-days"></ul>`
    );
  }
}
