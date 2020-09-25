import AbstractView from './abstract-view.js';

export default class TripInfoView extends AbstractView {
  getTemplate() {
    return (
      `<section class="trip-main__trip-info  trip-info"></section>`
    );
  }
}
