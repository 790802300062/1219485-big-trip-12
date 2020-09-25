import AbstractView from "./abstract-view.js";

export default class EventsListView extends AbstractView {
  constructor(index) {
    super();
    this._index = index;
  }

  getTemplate() {
    return (
      `<ul class="trip-events__list" id="trip-events__list-${this._index}"></ul>`
    );
  }
}
