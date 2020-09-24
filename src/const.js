export const AUTHORIZATION = `Basic id790802300062bigtripkejgjkhelkjh`;
export const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;

export const EventCategory = {
  TRANSFER: `Transfer`,
  ACTIVITY: `Activity`
};

export const EVENT_TYPES = new Map([
  [EventCategory.TRANSFER, [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`
  ]],
  [EventCategory.ACTIVITY, [
    `Check-in`,
    `Sightseeing`,
    `Restaurant`
  ]]
]);

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const SortType = {
  DEFAULT: `Event`,
  TIME: `Time`,
  PRICE: `Price`
};

export const EventType = {
  FILTER: `Filter was changed`,
  SORT: `Sort type was changed`,
  EVENT: `Event data was changed`,
  FAVORITE: `Property "Favorite" was changed`,
  ADD: `New event was added`,
  DELETE: `Event was deleted`,
  INIT: `Application init`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MAJOR: `MAJOR`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`,
  NEW_EVENT: `New Event`
};

export const VehicleEmoji = new Map([
  [`Taxi`, `🚕`],
  [`Bus`, `🚌`],
  [`Train`, `🚂`],
  [`Ship`, `🚢`],
  [`Transport`, `🚆`],
  [`Drive`, `🚗`],
  [`Flight`, `✈️`],
  [`Check-in`, `🏨`],
  [`Sightseeing`, `🏛`],
  [`Restaurant`, `🍴`]
]);

export const ChartType = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME_SPENT: `TIME SPENT`,
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};
