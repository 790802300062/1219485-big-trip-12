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
  FILTER: `filter`,
  EVENT: `event`,
  INIT: `init`
};

export const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
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

export const AUTHORIZATION = `Basic 123abc456def`;
export const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;
