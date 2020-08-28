import AbstractView from "./abstract.js";

const createEventMessageTemplate = (message) => (
  `<p class="trip-events__msg">${message}</p>`
);

export default class EventMessage extends AbstractView {
  constructor(message) {
    super();
    this._message = message;
  }

  getTemplate() {
    return createEventMessageTemplate(this._message);
  }
}
