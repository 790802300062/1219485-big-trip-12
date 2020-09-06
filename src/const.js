export const OPTIONS = [
  {
    name: `Add luggage`,
    price: 30,
    eventType: `transfer`
  },
  {
    name: `Switch to business class`,
    price: 100,
    eventType: `transfer`
  },
  {
    name: `Switch to first class`,
    price: 200,
    eventType: `transfer`
  },
  {
    name: `Add meal`,
    price: 15,
    eventType: `transfer`
  },
  {
    name: `Choose seats`,
    price: 5,
    eventType: `transfer`
  },
  {
    name: `Travel by train`,
    price: 40,
    eventType: `transfer`
  },
  {
    name: `Book tickets`,
    price: 40,
    eventType: `activity`
  },
  {
    name: `Lunch in city`,
    price: 30,
    eventType: `activity`
  }
];

export const TRIP_EVENTS = [
  {
    name: `Taxi`,
    type: `transfer`
  },
  {
    name: `Bus`,
    type: `transfer`
  },
  {
    name: `Train`,
    type: `transfer`
  },
  {
    name: `Ship`,
    type: `transfer`
  },
  {
    name: `Transport`,
    type: `transfer`
  },
  {
    name: `Drive`,
    type: `transfer`
  },
  {
    name: `Flight`,
    type: `transfer`
  },
  {
    name: `Check-in`,
    type: `activity`
  },
  {
    name: `Sightseeing`,
    type: `activity`
  },
  {
    name: `Restaurant`,
    type: `activity`
  }
];

export const DESTINATION_CITIES = [
  `London`,
  `Paris`,
  `New York`,
  `Berlin`,
  `Amsterdam`,
  `Tokyo`,
  `Bangkok`,
  `Madrid`,
  `Rome`,
  `Moscow`,
  `Barcelona`,
  `Prague`
];


export const Key = {
  ENTER: `Enter`,
  ESCAPE: `Escape`
};

export const EventMessage = {
  NO_EVENTS: `Click New Event to create your first point`,
  LOADING: `Loading...`
};

export const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const FilterType = {
  EVERYTHING: `Everything`,
  FUTURE: `Future`,
  PAST: `Past`,
};
