export default class ColumnChart {
  chartHeight = 50;
  subElements = {};
  element;

  constructor({
    data = [],
    label = '',
    link = '',
    value = 0
    } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.render();
  }
  get template() {
    return `<div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">${this.label}${this.checkLink()}</div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.value}</div>
        <div data-element="body" class="column-chart__chart">
        ${this.createChart(this.data)}
        </div>
      </div>
    </div>
    `;
  }

  render() {
    const element = document.createElement('div'); // (*)
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    if(this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  checkLink() {
    return this.link ? this.appendLink() : '';
  }

  appendLink() {
    return `<a class="column-chart__link" href="${this.link}">View all</a>`;
  }

  getColumnProps(data) {
    if (Array.isArray(data) && data.length) {
      const maxValue = Math.max(...data);
      const scale = this.chartHeight / maxValue;
      return new Map([...data.map(item => {
        return [(item / maxValue * 100).toFixed(0) + '%', String(Math.floor(item * scale))];
      })]);
    }
  }

  createChart(data) {
    const arrayData = this.getColumnProps(data);
    if (arrayData && data.length) {
      return [...arrayData].map(([key, value]) =>
        `<div style="--value: ${value}" data-tooltip="${key}"></div>`).join('');
    }
  }

  update({headerData = '', bodyData = []}) {
    headerData !== '' ? this.subElements.header.textContent = headerData : '';
    bodyData.length ? this.subElements.body.innerHTML = this.createChart(bodyData) : [];
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }
}
