import Abstract from '../view/abstract.js';

export default class SmartView extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateDate(updatedData, justDataUpdating) {
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
    throw new Error(`Abstract method not implemented`);
  }
}
