import {createElement} from "../utils.js";

const createEventMessageTemplate = (message) => {
  return (
    `<p class="trip-events__msg">${message}</p>`
  );
};

export default class EventMessage {
  constructor(message) {
    this._message = message;
    this._element = null;
  }

  getTemplate() {
    return createEventMessageTemplate(this._message);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
