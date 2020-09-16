export const EventKeyCode = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
};

export const EventTypeWithPreposition = {
  'taxi': `Taxi to`,
  'bus': `Bus to`,
  'train': `Train to`,
  'ship': `Ship to`,
  'transport': `Transport to`,
  'drive': `Drive to`,
  'flight': `Flight to`,
  'check-in': `Check in`,
  'sightseeing': `Sightseeing in`,
  'restaurant': `Restaurant in`,
};

export const ACTIVITY_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
export const TRANSFER_TYPES = [`check-in`, `sightseeing`, `restaurant`];

export const AdditionalOfferList = {
  'luggage': {
    text: `Add luggage`,
    price: 30,
  },
  'comfort': {
    text: `Switch to comfort class`,
    price: 100,
  },
  'meal': {
    text: `Add meal`,
    price: 15,
  },
  'seats': {
    text: `Choose seats`,
    price: 5,
  },
  'train': {
    text: `Travel by train`,
    price: 40,
  }
};

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
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
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};
