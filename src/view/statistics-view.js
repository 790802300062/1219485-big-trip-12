import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {getTimeInterval} from '../utils/time-and-date.js';
import {getDuration} from '../utils/common.js';
import {
  VehicleEmoji,
  mapCategoryToType,
  ChartType,
  EventCategory
} from '../const.js';

import AbstractView from './abstract-view.js';

const ChartProperties = {
  TYPE: `horizontalBar`,
  BAR_HEIGHT: 400,
  BAR_THICKNESS: 44,
  MIN_BAR_LENGTH: 100,
  FONT_SIZE: 13,
  TITLE_FONT_SIZE: 23,
  AXE_Y_PADDING: 5,
  AXE_Y_FONT_SIZE: 13,
};

const ChartValues = {
  WHITE: `#ffffff`,
  BLACK: `#000000`,
  START: `start`,
  END: `end`,
  LEFT: `left`
};

export default class StatisticsView extends AbstractView {
  constructor(events) {
    super();
    this._data = this._createData(events);

    this._moneyChart = null;
    this._timeSpendChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  getTemplate() {
    return (
      `<section class="statistics">
        <h2 class="visually-hidden">Trip statistics</h2>

        <div class="statistics__item statistics__item--money">
          <canvas class="statistics__chart statistics__chart--money" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--transport">
          <canvas class="statistics__chart statistics__chart--transport" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--time-spend">
          <canvas class="statistics__chart statistics__chart--time" width="900"></canvas>
        </div>
      </section>`
    );
  }

  removeElement() {
    super.removeElement();
    this._removeCharts();
  }

  _removeCharts() {
    if (this._moneyChart !== null) {
      this._moneyChart = null;
    }

    if (this._timeSpendChart !== null) {
      this._timeSpendChart = null;
    }

    if (this._timeSpendChart !== null) {
      this._timeSpendChart = null;
    }
  }

  _setCharts() {
    this._removeCharts();

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    moneyCtx.height = ChartProperties.BAR_HEIGHT;
    transportCtx.height = ChartProperties.BAR_HEIGHT;
    timeSpendCtx.height = ChartProperties.BAR_HEIGHT;

    this._moneyChart = this._renderChart(
        moneyCtx,
        ChartType.MONEY,
        ((value) => `€ ${value}`)
    );

    this._transportChart = this._renderChart(
        transportCtx,
        ChartType.TRANSPORT,
        (value) => `${value}`
    );

    this._timeSpendChart = this._renderChart(
        timeSpendCtx,
        ChartType.TIME_SPENT,
        (value) => `${getTimeInterval(value)}`
    );
  }

  _renderChart(ctx, text, formatter) {
    return new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: ChartProperties.TYPE,
      data: {
        labels: this._data[text].labels,
        datasets: [{
          data: this._data[text].data,
          backgroundColor: ChartValues.WHITE,
          hoverBackgroundColor: ChartValues.WHITE,
          anchor: ChartValues.START,
          barThickness: ChartProperties.BAR_THICKNESS,
          minBarLength: ChartProperties.MIN_BAR_LENGTH
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: ChartProperties.FONT_SIZE
            },
            color: ChartValues.BLACK,
            anchor: ChartValues.END,
            align: ChartValues.START,
            formatter
          }
        },
        title: {
          display: true,
          text,
          fontColor: ChartValues.BLACK,
          fontSize: ChartProperties.TITLE_FONT_SIZE,
          position: ChartValues.LEFT
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: ChartValues.BLACK,
              padding: ChartProperties.AXE_Y_PADDING,
              fontSize: ChartProperties.AXE_Y_FONT_SIZE,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  _createData(events) {
    return Object.assign({},
        this._getMoneyChartData(events),
        this._getTransportChartData(events),
        this._getTimeSpentChartData(events)
    );
  }

  _getMoneyChartData(events) {
    const eventTypes = {};

    events.forEach((event) => {
      if (eventTypes[event.type]) {
        eventTypes[event.type] += event.price;
        return;
      }

      eventTypes[event.type] = event.price;
    });

    return this._getFormattedStructure(eventTypes, ChartType.MONEY);
  }

  _getTransportChartData(events) {
    const transportTypes = mapCategoryToType.get(EventCategory.TRANSFER);
    const eventsTransport = {};

    events.forEach((event) => {
      if (eventsTransport[event.type]) {
        eventsTransport[event.type]++;
        return;
      }

      if (transportTypes.includes(event.type)) {
        eventsTransport[event.type] = 1;
      }
    });

    return this._getFormattedStructure(eventsTransport, ChartType.TRANSPORT);
  }

  _getTimeSpentChartData(events) {
    const eventTypes = {};

    events.forEach((event) => {
      if (eventTypes[event.type]) {
        eventTypes[event.type] += getDuration(event);
        return;
      }

      eventTypes[event.type] = getDuration(event);
    });

    return this._getFormattedStructure(eventTypes, ChartType.TIME_SPENT);
  }

  _getFormattedStructure(items, name) {
    return [...Object.entries(items)]
    .sort((a, b) => b[1] - a[1])
    .reduce((result, [key, value]) => {
      result[name].labels.push(`${VehicleEmoji.get(key)} ${key.toUpperCase()}`);
      result[name].data.push(value);

      return result;
    }, {[name]: {labels: [], data: []}});
  }
}
