import Abstract from '../view/abstract.js';

export default class LoadingView extends Abstract {

  getTemplate() {
    return (
      `<p class="trip-events__msg">Loading...</p>`
    );
  }
}
