import AbstractView from '../view/abstract.js';

export default class NoEventsView extends AbstractView {
  getTemplate() {
    return (
      `<p class="trip-events__msg">Click New Event to create your first point</p>`
    );
  }
}
