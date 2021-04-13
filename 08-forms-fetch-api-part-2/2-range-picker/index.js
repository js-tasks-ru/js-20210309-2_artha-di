export default class RangePicker {

  oneDayMs = 86400000;
  mapArray = [];
  currentMonth = {};
  flag = Boolean;
  month = this.getArrayMonth();
  renderDate = {
    from: '',
    to: '',
  }

  getArrayMonth() {
    return Array(12).fill(1).map((item, i) =>
    new Date(`2000.${i + 1}.1`).toLocaleString('ru-RU', {month: 'long'}));
  }

  onClosePicker = (event) => {
    if (!event.target.closest(`.${this.element.classList[0]}`)) {
      this.element.classList.remove('rangepicker_open');
      document.removeEventListener('pointerup', this.onClosePicker);
    }
  }

  onPlace = (event) => {
    this.element.classList.remove('rangepicker_open');
    const [from, to] = this.getStringFromDate(this.range);
    this.subElement.from.innerHTML = from;
    this.subElement.to.innerHTML = to;
    document.removeEventListener('pointerup', this.onClosePicker);
  }

  onClick = (event) => {

      if (event.target.closest(`[data-element="input"]`)) {
          document.addEventListener('pointerup', this.onClosePicker);
          this.element.classList.add('rangepicker_open');
          this.eventSelect = this.generateEvent();
      }
      if(event.target.closest('.rangepicker__selector-control-right')) {
          this.flag = true;
          this.changeCalendar();
      }
      if (event.target.closest('.rangepicker__selector-control-left')) {
          this.flag = false;
          this.changeCalendar();
      }
      if (event.target.closest('[data-value]')) {

        if (Date.parse(this.eventSelect.detail.from) === Date.parse(event.target.dataset.value)) {

            this.element.dispatchEvent(this.eventSelect);
        }
        else if (!this.eventSelect.detail.from) {
            const allDateSelector = document.querySelectorAll('.rangepicker__cell');
            [...allDateSelector].map((item) => {
              for (const [key, value] of Object.entries(this.selectedCss)) {
                item.classList.remove(value);
              }
            });
          this.eventSelect.detail.from = event.target.dataset.value;
        }
        else if (this.eventSelect.detail.from) {
            this.eventSelect.detail.to = event.target.dataset.value;
            this.range.from = new Date(Date.parse(this.eventSelect.detail.from) - this.oneDayMs);
            this.range.to = new Date(Date.parse(this.eventSelect.detail.to) - this.oneDayMs);
            this.changeCalendar();
            this.element.dispatchEvent(this.eventSelect);
        }
     }
  }

  constructor(
     range = {
        from: new Date(),
        to: new Date()
     }){
        this.range = range;
        this.getCurrentMonth()
        this.getArrayMonth();
        this.render();
        this.initEvent();
  }

  getMonthName(date) {
    return this.month[new Date(date).getMonth()];
  }

  getStringFromDate(range) {
    return  Object.entries(range).map((item) => {
      return item[1].toLocaleDateString().split('.').join('/');
    });
  }

  changeCalendar() {
    const div = document.createElement('div');
    this.getCurrentMonth(this.currentMonth);
    this.mapArray.length = 0;
    this.getDataCalendar();
    div.innerHTML = this.showToMonth(this.currentMonth);
    const newCalendar = div.querySelectorAll('.rangepicker__calendar');
    const oldCalendar = this.subElement.selector.querySelectorAll('.rangepicker__calendar');
    newCalendar.forEach((elem, i) => oldCalendar[i].replaceWith(elem));
  }

  get template() {
    const stringRange = this.getStringFromDate(this.range);
    return `
      <div class="rangepicker">
          <div class="rangepicker__input" data-element="input">
              <span data-element="from">${stringRange[0]}</span> -
              <span data-element="to">${stringRange[1]}</span>
          </div>
          <div class="rangepicker__selector" data-element="selector">
            <div class="rangepicker__selector-arrow"></div>
            <div class="rangepicker__selector-control-left"></div>
            <div class="rangepicker__selector-control-right"></div>
            ${this.showToMonth(this.currentMonth)}
          </div>
    </div>`;
  }

  showToMonth(date = {}) {
    const monthName = {
      0: this.getMonthName(date.firstMonth),
      1: this.getMonthName(date.secondMonth),
    }
    return Object.keys(date).map((item, i) => {
        return `
            <div class="rangepicker__calendar">
                <div class="rangepicker__month-indicator">
                    <time datetime="${monthName[i]}">${monthName[i]}</time>
                </div>
                <div class="rangepicker__day-of-week">
                    <div>Пн</div>
                    <div>Вт</div>
                    <div>Ср</div>
                    <div>Чт</div>
                    <div>Пт</div>
                    <div>Сб</div>
                    <div>Вс</div>
                </div>
                <div class="rangepicker__date-grid">
                    ${this.insertCalendar(i)}
                </div>
            </div>`;
    }).join('');
  }

  insertCalendar(i) {
      return [...this.mapArray[i]].map((item) => {
        return `
        <button type="button" class="rangepicker__cell ${item[1].css} ${item[1].cssTo} ${item[1].cssFrom}" data-value="${item[1].date}" ${item[1].style}>${item[0]}</button>
        `;
      }).join('');
  }

  getCurrentMonth(startMonth = this.range.from) {
    if (!this.currentMonth.firstMonth) {
      this.currentMonth = {
        firstMonth: new Date([startMonth.getFullYear(),startMonth.getMonth() + 1,1].join(',')),
        secondMonth: new Date([startMonth.getFullYear(),startMonth.getMonth() + 2 !== 0 ? startMonth.getMonth() + 2 : 0,1].join(',')),
      }
      return;
    }
    if (this.flag) {
      this.currentMonth = {
        firstMonth: new Date(this.currentMonth.firstMonth.setMonth(this.currentMonth.firstMonth.getMonth() + 1)),
        secondMonth: new Date(this.currentMonth.secondMonth.setMonth(this.currentMonth.secondMonth.getMonth() + 1)),
      }
      return;
    }
    this.currentMonth = {
      firstMonth: new Date(this.currentMonth.firstMonth.setMonth(this.currentMonth.firstMonth.getMonth() - 1)),
      secondMonth: new Date(this.currentMonth.secondMonth.setMonth(this.currentMonth.secondMonth.getMonth() - 1)),
    }
  }

  getDataCalendar() {
      Object.keys(this.currentMonth).map((item, i, array) => {
        this.getDataMonth(this.currentMonth[item]);
      });
  }

  getDataMonth(date = this.range.from) {
    const month = date.getMonth() !== 0  ? date.getMonth() + 1 : 1;
    const year = date.getFullYear();
    const firstDayToMonth = new Date(year, month - 1,1).getDay() === 0 ? 7 : new Date(year, month - 1,1).getDay();
    const countDayToMonth = new Date(year, month, 0).getDate();
    const style = `style="--start-from:${firstDayToMonth}"`;
    const addClass = 'rangepicker__selected-between';
    const addClassFrom = 'rangepicker__selected-from';
    const addClassTo = 'rangepicker__selected-to';
    const mapDate = new Map();
    this.selectedCss = {
      addClass: 'rangepicker__selected-between',
      addClassFrom: 'rangepicker__selected-from',
      addClassTo: 'rangepicker__selected-to',
    }

    Array(countDayToMonth).fill().forEach((item, index) => {
        const nextDay = new Date(year, month - 1, index + 2);
          mapDate.set( index + 1, {
            year: year,
            month: month,
            style: index === 0 ? style : '',
            date: nextDay.toISOString(),
            css: this.range.from  - nextDay + this.oneDayMs < 0 && this.range.to - nextDay + this.oneDayMs > 0 &&
            this.range.from  - nextDay + this.oneDayMs !== 0 &&
            this.range.to  - nextDay + this.oneDayMs !== 0  ? addClass : '',
            cssFrom: this.range.from  - nextDay + this.oneDayMs === 0 ? addClassFrom : '',
            cssTo: this.range.to  - nextDay + this.oneDayMs === 0 ? addClassTo : '',
          })
    });
    this.mapArray.push(mapDate);
  }

  render() {
    this.getDataCalendar();
    const div = document.createElement('div');
    div.innerHTML = this.template;
    this.element = div.firstElementChild;
    this.subElement = this.getSubElements(this.element);
  }

  generateEvent(from = '', to = '') {
    return new CustomEvent('date-select', {
      bubbles: true,
      detail: {
        from,
        to
      }
    })
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  initEvent() {
    this.element.addEventListener('pointerdown', this.onClick);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.remove();
    // this.element = null;
  }
}
