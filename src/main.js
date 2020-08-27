import MenuControlsView from "./view/site-menu.js";
import TripInfoView from "./view/trip-info.js";
import FilterView from "./view/filters.js";
import TripPresenter from "./presenter/trip.js";
import EventMessageView from "./view/event-message.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import {EventMessage} from "./const.js";

const EVENTS_AMOUNT = 0;

const events = new Array(EVENTS_AMOUNT).fill().map(generateEvent);

events.sort((a, b) => {
  const dateA = new Date(a.startDate);
  const dateB = new Date(b.startDate);
  return dateA - dateB;
});

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);

const tripControlElement = tripMainElement.querySelector(`.trip-main__trip-controls`);

render(tripControlElement, new FilterView(), RenderPosition.BEFOREEND);
render(tripControlElement, new MenuControlsView(), RenderPosition.AFTEREND);

const tripEventsElement = document.querySelector(`.trip-events`);
const tripPresenter = new TripPresenter(tripEventsElement);
tripPresenter.init(events);

if (!events.length) {
  remove(TripInfoView());
  render(tripEventsElement, new EventMessageView(EventMessage.NO_EVENTS), RenderPosition.BEFOREEND);
}




/*  const onEscKeyDown = (evt) => {
  if (!evt.key === Key.ENTER || evt.key === Key.ESCAPE) {
    return
  };

  evt.preventDefault();
  replaceFormToEvent();
  document.removeEventListener(`keydown`, onEscKeyDown);
}*/
