export default class SortableTable {

  getParametersForSortButton = (event) => {
    const button = event.currentTarget;
    const section = button.dataset.id;
    const orderButton = button.dataset.order;
    this.headerButtons.map(item => item.dataset.order = '')
    const newOrderButton = orderButton === 'asc' ? 'desc' : orderButton === 'desc' ? 'asc' : 'desc';
    button.dataset.order = newOrderButton;
    this.sort(section, newOrderButton)
  }

  dataHeader = {};
  subElements;
  element;
  headerButtons;

  constructor(header = [], { data } = []) {
    this.header = header;
    this.data = data;
    this.render();
    this.setEventHeaderButtons ();
  }

  getDataHeader() {
    const nameSectionArray = this.header.map(item => item.id);
    const object = nameSectionArray.reduce( (accum, next) => {
      accum[next] = [];
      return accum;
    }, {})

    this.dataHeader = this.header.reduce((accum, next) => {
        accum[next.id].push(next.id, next.title, next.sortable, next.sortType ? next.sortType : 'template');
        return accum;
      },
      object);
  }

  get templateHeaderArrow() {
    return `
    <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
    </span>`;
  }

  buildRowHeader([id, title, sortable]) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" ${sortable === true ? 'data-order="asc"' : ''}>
        <span>${title}</span>${sortable === true ? this.templateHeaderArrow : ''}
      </div>`;
  }

  getHeaderContainer() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${Object.entries(this.dataHeader).map( (item) => this.buildRowHeader(item[1])).join('')}
    </div>`;
  }

  buildRowTable(data) {
    return this.header.map((element) => {
      if (!element.sortable) {
        return  element.template(data.images);
      }
      if(element.sortable) {
        return `
          <div class="sortable-table__cell">${data[element.id]}</div>`;
      }
    }).join('');
  }

  getRowTable(obj = this.resultSort ('title', 'asc', this.data)) {
    return obj.map( (data) => {
      return `
        <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
          ${this.buildRowTable(data)}
        </a>`
    }).join('');
  }

  getTableContainer() {
    return `
    <div data-element="body" class="sortable-table__body">
        ${this.getRowTable()}
    </div>`;
  }

  getMainContainer() {
    return `
    <div data-element="productsContainer" class="products-list__container">
       <div class="sortable-table">
          ${this.getHeaderContainer()}
          ${this.getTableContainer()}
       </div>
    </div>`;
  }

  render() {
    this.getDataHeader();
    const div = document.createElement('div');
    div.innerHTML = this.getMainContainer();
    const element = div.firstElementChild;
    this.element = element;
    this.subElements = this.getSubElements(element);
  }

  sortValueString(fieldValue = 'title', orderValue = 'asc', arraySort = this.data) {

    let arrayForSort = arraySort.map( (item) => item[fieldValue]);

    const directions = {
      asc: 1,
      desc: -1
    };
    return  arrayForSort.sort((a, b) => {
      return a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper'}) * directions[orderValue];
    });
  }

  sortValueNumber(fieldValue, orderValue, arraySort = this.data) {
    let arrayForSort = arraySort.map( (item) => item[fieldValue]);

    return  arrayForSort.sort((a, b) => {
      switch (orderValue) {
        case 'asc':
          return  a - b;
        case 'desc':
          return  b - a
      }
    });
  }

  sort(fieldValue, orderValue, arrySort = this.data) {

    const resultSort = this.resultSort (fieldValue, orderValue, arrySort = this.data);

    this.subElements.body.innerHTML = this.getRowTable(resultSort);
  }

  resultSort (fieldValue, orderValue, arrySort = this.data) {
    let sortArray;

    if(typeof this.data[0][fieldValue] === 'string') {

      sortArray = this.sortValueString(fieldValue, orderValue, arrySort,);
    } else {

      sortArray = this.sortValueNumber(fieldValue, orderValue, arrySort);
    }
    const resultSort = [];

    for(const value of sortArray) {

      resultSort.push(arrySort.find((item) => item[fieldValue] === value));
    }

    return resultSort;
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  setEventHeaderButtons () {
    const buttons = [...this.subElements.header.querySelectorAll('[data-order]')]
      .filter((item) => item.dataset.sortable === 'true');
    this.headerButtons = buttons;
    for (const button of buttons) {
      button.addEventListener('pointerdown', this.getParametersForSortButton);
    }
  }

  destroy(){
    this.element.remove();
    this.subElements = {};
  }
}
