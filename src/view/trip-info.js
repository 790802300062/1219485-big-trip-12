import Abstract from './abstract';

const createTripInfoTemplate = () => {
  return `
    <section class="trip-main__trip-info  trip-info">
    </section>`;
};

export default class TripInfo extends Abstract {
  _getTemplate() {
    return createTripInfoTemplate();
  }
}
