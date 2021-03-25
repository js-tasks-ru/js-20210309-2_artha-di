export default class ColumnChart {
  chartHeight = 50;
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

  render() {
    const element = document.createElement('div'); // (*)
    element.innerHTML = `
    <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">${this.label}${this.checkLink()}</div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.value}</div>
        <div data-element="body" class="column-chart__chart">
        </div>
      </div>
    </div>
    `;
    // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
    // который мы создали на строке (*)
    this.element = element.firstElementChild;
    this.createChart();
    if(this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }
  }

  checkLink() {
    if (this.link) {
      return this.appendLink();
    } else {
      return '';
    }
  }

  appendLink() {
    return `<a class="column-chart__link" href="${this.link}">View all</a>`;
  }

  getColumnProps() {
    if (Array.isArray(this.data) && this.data.length !==  0) {
      const maxValue = Math.max(...this.data);
      const scale = this.chartHeight / maxValue;
      return new Map(this.data.map(item => {
        return [(item / maxValue * 100).toFixed(0) + '%', String(Math.floor(item * scale))];
      }));
    }
  }

  createChart() {
    const arrayPercent = this.getColumnProps(this.data);
    if (arrayPercent && this.data.length) {
      for (const [percent, num] of arrayPercent) {
        const elem = this.element.querySelector('.column-chart__chart');
        elem.insertAdjacentHTML('beforeend', `<div style="--value: ${num}" data-tooltip="${percent}"></div>`)
      }
    }
  }
  // initEventListeners () {
  //   // NOTE: в данном методе добавляем обработчики событий, если они есть
  // }
  update(array) {
    this.data = Array.isArray(array) ? array : '';
    this.remove();
    this.render();
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }
}
