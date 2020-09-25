import {
  render,
  remove,
  RenderPosition
} from '../utils/render.js';

import StatisticsView from '../view/statistics-view.js';

export default class StatisticsPresenter {
  constructor(header, eventsModel) {
    this._header = header;
    this._eventsModel = eventsModel;
    this._statisticsComponent = null;
  }

  init() {
    if (this._statisticsComponent !== null) {
      this.destroy();
    }

    this._statisticsComponent = new StatisticsView(this._eventsModel.getEvents());
    render(this._header, this._statisticsComponent, RenderPosition.AFTEREND);
  }

  destroy() {
    remove(this._statisticsComponent);
    this._statisticsComponent = null;
  }
}
