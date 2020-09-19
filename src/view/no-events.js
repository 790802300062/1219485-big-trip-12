import Abstract from '../view/abstract.js';

export default class NoEventsView extends Abstract {
  getTemplate() {
    return (
      `<p class="trip-events__msg">Click New Event to create your first point</p>`
    );
  }
}
