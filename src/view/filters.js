import AbstractView from "./abstract.js";

const createFiltersTemplate = () => {
  const filters = [
    {
      label: `everything`,
      name: `Everything`,
      isChecked: true,
    },
    {
      label: `future`,
      name: `Future`,
      isChecked: false,
    },
    {
      label: `past`,
      name: `Past`,
      isChecked: false,
    },
  ];

  const createFilter = () => {
    let filterItems = ``;
    for (let item of filters) {
      filterItems += `<div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item.label}" ${item.isChecked ? `checked` : `` }>
          <label class="trip-filters__filter-label" for="filter-past">${item.name}</label>
      </div>`;
    }
    return filterItems;
  };

  const filterTemplate = createFilter();

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractView {

  getTemplate() {
    return createFiltersTemplate();
  }
}
