import AbstractView from '../view/abstract.js';

export default class LoadingView extends AbstractView {
  getTemplate() {
    return (
      `<p class="trip-events__msg">Loading...</p>`
    );
  }
}
