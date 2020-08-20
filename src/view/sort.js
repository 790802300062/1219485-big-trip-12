import {createElement} from "../utils.js";

const createSortTemplate = () => {
  const sort = [
    {
      label: `day`,
      name: `Day`,
      hasIcon: false,
      isChecked: false,
      isInput: false,
    },
    {
      label: `event`,
      name: `Event`,
      hasIcon: false,
      isChecked: true,
      isInput: true,
    },
    {
      label: `time`,
      name: `Time`,
      hasIcon: true,
      isChecked: false,
      isInput: true,
    },
    {
      label: `price`,
      name: `Price`,
      hasIcon: true,
      isChecked: false,
      isInput: true,
    },
    {
      label: `offers`,
      name: `Offers`,
      hasIcon: false,
      isChecked: false,
      isInput: false,
    }
  ];

  const transportSymbol = (hasIcon) => {
    return hasIcon ? `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
      <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
    </svg>` : ``;
  };

  const createSort = () => {
    let sortItems = ``;
    for (let item of sort) {
      if (!item.isInput) {
        sortItems += `<span class="trip-sort__item  trip-sort__item--${item.label}">${item.name}</span>`;
      } else {
        sortItems += `<div class="trip-sort__item  trip-sort__item--time">
          <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item.label}" ${item.isChecked ? `checked` : ``}>
          <label class="trip-sort__btn" for="sort-${item.label}">
            ${item.name}
            ${transportSymbol(item.hasIcon)}
          </label>
        </div>`;
      }
    }

    return sortItems;
  };
  const sortTemplate = createSort();

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${sortTemplate}
      </form>`
  );
};

export default class Sort {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSortTemplate();
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
