import Abstract from "./abstract";

const createEventMessageTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class EventMessage extends Abstract {
  constructor(message) {
    super();
    this._message = message;
  }

  _getTemplate() {
    return createEventMessageTemplate(this._message);
  }
}
