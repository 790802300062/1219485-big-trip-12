import {renderTemplate} from "./view/utils.js";
import {createRouteCostTemplate} from "./view/cost.js";
import {createDayTemplate} from "./view/day.js";
import {createEventTemplate} from "./view/event.js";
import {createEventEditFormTemplate} from "./view/event-edit.js";
import {createFiltersTemplate} from "./view/filters.js";
import {createMenuTemplate} from "./view/menu.js";
import {createRouteInfoTemplate} from "./view/route.js";
import {createRouteAndCostTemplate} from "./view/route-cost.js";
import {createSortTemplate} from "./view/sort.js";

const header = document.querySelector(`.page-body`);
const tripMainContainer = header.querySelector(`.trip-main`);

renderTemplate(tripMainContainer, `afterBegin`, createRouteAndCostTemplate());

const tripRoute = header.querySelector(`.trip-info`);
const tripMenu = header.querySelector(`.trip-controls`);

renderTemplate(tripRoute, `afterbegin`, createRouteInfoTemplate());
renderTemplate(tripRoute, `beforeend`, createRouteCostTemplate());
renderTemplate(tripMenu, `afterbegin`, createMenuTemplate());
renderTemplate(tripMenu, `beforeend`, createFiltersTemplate());

const tripEventsContainer = header.querySelector(`.trip-events`);

renderTemplate(tripEventsContainer, `afterbegin`, createSortTemplate());
renderTemplate(tripEventsContainer, `beforeend`, createDayTemplate());

const tripDayEventsContainer = tripEventsContainer.querySelector(`.trip-events__list`);

renderTemplate(tripDayEventsContainer, `afterbegin`, createEventEditFormTemplate());

new Array(3).fill(`*`).forEach(function () {
  renderTemplate(tripDayEventsContainer, `beforeend`, createEventTemplate());
});
