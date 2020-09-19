import {getTimeInterval} from '../utils/time-and-date.js';
import {getEventDuration} from '../utils/common.js';
import {
  VehicleEmoji,
  EVENT_TYPES,
  ChartType,
  EventCategory
} from '../const.js';

import Abstract from '../view/abstract.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const ChartProperty = {
  TYPE: `horizontalBar`,
  BAR_HEIGHT: 400,
  BAR_THICKNESS: 44,
  MIN_BAR_LENGTH: 100,
  OPTIONS_FONT_SIZE: 13,
  OPTIONS_TITLE_FONT_SIZE: 23,
  OPTIONS_SCALES_Y_AXES_PADDING: 5,
  OPTIONS_SCALES_Y_AXES_FONT_SIZE: 13,
};

const ChartValue = {
  WHITE: `#ffffff`,
  BLACK: `#000000`,
  START: `start`,
  END: `end`,
  LEFT: `left`
};

export default class StatisticsView extends Abstract {
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

    const moneyChartPosition = this.getElement().querySelector(`.statistics__chart--money`);
    const transportChartPosition = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendChartPosition = this.getElement().querySelector(`.statistics__chart--time`);

    moneyChartPosition.height = ChartProperty.BAR_HEIGHT;
    transportChartPosition.height = ChartProperty.BAR_HEIGHT;
    timeSpendChartPosition.height = ChartProperty.BAR_HEIGHT;

    this._moneyChart = this._renderChart(moneyChartPosition, ChartType.MONEY, ((value) => `€ ${value}`));
    this._transportChart = this._renderChart(transportChartPosition, ChartType.TRANSPORT, (value) => `${value}x`);
    this._timeSpendChart = this._renderChart(timeSpendChartPosition, ChartType.TIME_SPENT, (value) => `${getTimeInterval(value)}`);
  }

  _renderChart(ctx, text, formatter) {
    return new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: ChartProperty.TYPE,
      data: {
        labels: this._data[text].labels,
        datasets: [{
          data: this._data[text].data,
          backgroundColor: ChartValue.WHITE,
          hoverBackgroundColor: ChartValue.WHITE,
          anchor: ChartValue.START,
          barThickness: ChartProperty.BAR_THICKNESS,
          minBarLength: ChartProperty.MIN_BAR_LENGTH
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: ChartProperty.OPTIONS_FONT_SIZE
            },
            color: ChartValue.BLACK,
            anchor: ChartValue.END,
            align: ChartValue.START,
            formatter
          }
        },
        title: {
          display: true,
          text,
          fontColor: ChartValue.BLACK,
          fontSize: ChartProperty.OPTIONS_TITLE_FONT_SIZE,
          position: ChartValue.LEFT
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: ChartValue.BLACK,
              padding: ChartProperty.OPTIONS_SCALES_Y_AXES_PADDING,
              fontSize: ChartProperty.OPTIONS_SCALES_Y_AXES_FONT_SIZE,
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
      } else {
        eventTypes[event.type] = event.price;
      }
    });

    return this._getFormattedStructure(eventTypes, ChartType.MONEY);
  }

  _getTransportChartData(points) {
    const transportTypes = EVENT_TYPES.get(EventCategory.TRANSFER);
    const pointsTransport = {};

    points.forEach((point) => {
      if (pointsTransport[point.type]) {
        pointsTransport[point.type]++;
      } else {
        if (transportTypes.includes(point.type)) {
          pointsTransport[point.type] = 1;
        }
      }
    });

    return this._getFormattedStructure(pointsTransport, ChartType.TRANSPORT);
  }

  _getTimeSpentChartData(events) {
    const eventTypes = {};

    events.forEach((event) => {
      if (eventTypes[event.type]) {
        eventTypes[event.type] += getEventDuration(event);
      } else {
        eventTypes[event.type] = getEventDuration(event);
      }
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
