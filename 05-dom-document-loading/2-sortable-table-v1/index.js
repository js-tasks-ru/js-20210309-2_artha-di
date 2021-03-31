export default class SortableTable {

  dataHeader = {};
  subElements;
  element;

  constructor(header = [], { data } = []) {
    this.header = header;
    this.data = data;
    this.render();
  }

  getDataHeader() {
    this.dataHeader = this.header.reduce((accum, next) => {
        accum[next.id].push(next.id, next.title, next.sortable, next.sortType ? next.sortType : 'template');
        return accum;
      },
      {
        images:[],
        title:[],
        quantity:[],
        price:[],
        sales:[],
      });
  }

  get templateHeaderArrow() {
    return `
    <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
    </span>`;
  }

  buildRowHeader([id, title, sortable]) {
      return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="">
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

  getRowTable(obj = this.data) {
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

  sortValueString(arraySort, fieldValue, orderValue) {
    let arrayForSort = arraySort.map( (item) => item[fieldValue]);

    let direction = 0;
    switch (orderValue) {
      case 'asc':
        direction = 1
        break;
      case 'desc':
        direction = -1
    }
    return  arrayForSort.sort((a, b) => {
      return a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper'}) * direction;
    });
  }

  sortValueNumber(arraySort, fieldValue, orderValue) {
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

  sort(fieldValue, orderValue) {
    let sortArray;

    if(typeof this.data[0][fieldValue] === 'string') {
      sortArray = this.sortValueString(this.data, fieldValue, orderValue);
    } else {
      sortArray = this.sortValueNumber(this.data, fieldValue, orderValue);
    }

    const resultSort = [];

    for(const value of sortArray) {
      resultSort.push(this.data.find((item) => item[fieldValue] === value));
    }
    this.subElements.body.innerHTML = this.getRowTable(resultSort);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  destroy(){
    this.element.remove();
    this.subElements = {};
  }
}

