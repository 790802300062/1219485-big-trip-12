import {renderTemplate} from "./utils.js";
import {createMenuControlsTemplate} from "./view/site-menu.js";
import {createTripInfoTemplate} from "./view/trip-info.js";
import {createFiltersTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createDayTemplate} from "./view/day.js";
import {createEditEventTemplate} from "./view/edit-event-form.js";
import {generateEvent} from "./mock/event.js";

const EVENTS_AMOUNT = 25;

const events = new Array(EVENTS_AMOUNT).fill().map(generateEvent);

events.sort((a, b) => {
  const dateA = new Date(a.startDate);
  const dateB = new Date(b.startDate);
  return dateA - dateB;
});

const tripMainElement = document.querySelector(`.trip-main`);
renderTemplate(tripMainElement, `afterbegin`, createTripInfoTemplate());

const tripControlElement = tripMainElement.querySelector(`.trip-main__trip-controls`);

renderTemplate(tripControlElement, `afterbegin`, createMenuControlsTemplate());
renderTemplate(tripControlElement, `beforeend`, createFiltersTemplate());

const tripEventsElement = document.querySelector(`.trip-events`);
renderTemplate(tripEventsElement, `beforeend`, createSortTemplate());
renderTemplate(tripEventsElement, `beforeend`, createEditEventTemplate(events[0]));
renderTemplate(tripEventsElement, `beforeend`, createDayTemplate(events));
