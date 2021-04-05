import fetchJson from './utils/fetch-json.js';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {

  chartHeight = 50;

  constructor({
    label = '',
    link = '',
    formatHeading = data => data,
    url = '',
    range = {},
    } = {}) {
    this.url = new URL(url, BACKEND_URL);
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.render();
    this.showChart();
  }

  createFullUrl(range, url) {
    Object.entries(range).forEach(([key, value]) => url.searchParams.set(key, value));
  }

  getData (range, url) {
    this.createFullUrl(range, url);
    const data = fetchJson(this.url.toString());
    return data;
  }

  downloadСharts(headerData = 0, bodyData = '') {
    this.element.classList.add('column-chart_loading');
    if (headerData && bodyData.length) {
      this.subElements.header.textContent = headerData;
      this.subElements.body.innerHTML = bodyData;
      this.element.classList.remove('column-chart_loading');
    }
  }

  async showChart () {
    const value = await this.getData(this.range, this.url);
    this.mapDataFromAllTime = new Map(Object.entries(value));
    this.dataChart();
    this.downloadСharts(this.allDataChart.header, this.allDataChart.body);
  }

  dataChart() {
    this.allDataChart = {
      header: this.getNumberData(),
      body: this.createChart(this.getColumnProps(this.mapDataFromAllTime))
    }
  }

  async update(from, to) {
    this.range = {from, to};
    await this.showChart();
  }

  get template() {
    return `<div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">${this.label}${this.checkLink()}</div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
            ${this.getNumberData()}
        </div>
        <div data-element="body" class="column-chart__chart">
            ${this.createChart()}
        </div>
      </div>
    </div>
    `;
  }

   render() {
   const element = document.createElement('div');
   element.innerHTML = this.template;
   this.element = element.firstElementChild;
   this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  getNumberData() {

    if (this.mapDataFromAllTime) {
      const sum = [...this.mapDataFromAllTime.values()].reduce((accum, next) => accum + next);

      if (this.formatHeading) {
        return this.formatHeading(sum);
      }
      this.formatHeading = sum;
      return  sum;

    } else {
      return 1;
    }
  }

  checkLink() {
    return this.link ? this.appendLink() : '';
  }

  appendLink() {
    return `<a class="column-chart__link" href="${this.link}">View all</a>`;
  }

  getColumnProps(data = 0) {
    const arrayParametrs = data ? [...data.values()] : [];

    if (arrayParametrs.length) {
      const maxValue = Math.max(...arrayParametrs);
      const scale = this.chartHeight / maxValue;
      return arrayParametrs.map(item => {
        return [(item / maxValue * 100).toFixed(0) + '%', String(Math.floor(item * scale))];
      });
    }
  }

  createChart(data = []) {
    if (data) {
      return data.map(([key, value]) => `<div style="--value: ${value}" data-tooltip="${key}"></div>`).join('');
    }
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }
}
