import AbstractView from '../view/abstract.js';

export default class SmartView extends AbstractView {
  constructor() {
    if (new.target === SmartView) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }

    super();
    this._data = {};
  }

  updateData(updatedData, justDataUpdating) {
    if (!updatedData) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        updatedData
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }
}
