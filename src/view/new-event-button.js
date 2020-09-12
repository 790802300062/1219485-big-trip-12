import Abstract from './abstract.js';

const createNewEventButtonTemplate = () => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
};

export default class NewEventButton extends Abstract {
  _getTemplate() {
    return createNewEventButtonTemplate();
  }
}
