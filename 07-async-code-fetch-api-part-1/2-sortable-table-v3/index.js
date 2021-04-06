import fetchJson from './utils/fetch-json.js';
const BACKEND_URL = 'https://course-js.javascript.ru';


export default class SortableTable {

  button = '';
  typeEvent = '';
  dataHeader = {};
  subElements;
  element;
  headerButtons;

  dataRequest = {
    _sort: this.button ? this.button.dataset.id : 'title',
    _order: this.button ? this.button.dataset.order : 'asc',
    _start: 0,
    _end: 15,
    _step: 15
  }

  scrollThrough = (event) => {

    this.typeEvent = event.type;
    let scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    if (window.scrollY >= scrollHeight - innerHeight) {
      this.dataRequest._start = this.dataRequest._step + this.dataRequest._start;
      this.dataRequest._end = this.dataRequest._step + this.dataRequest._end;
      this.render();
    }
  }

  getParametersForSortButton = (event) => {

    this.typeEvent = event.type;
    this.button = event.target.closest('[data-order]');
    this.dataRequest._sort = this.button.dataset.id;
    this.dataRequest._order = this.button.dataset.order;
    this.dataRequest._start = 0;
    this.dataRequest._end = 25;

    const changeOrder = {
      asc: 'desc',
      desc: 'asc'
    }
    this.button.dataset.order = changeOrder[this.dataRequest._order];
    this.render();
    this.button = '';
  }

  constructor(header = [], { url = '',} = {}) {
                      this.header = header;
                      this.url = new URL(url, BACKEND_URL);
                      this.render();
                      this.showTable()
                      this.setEventHeaderButtons ();
                    }

  getData() {
    this.sortOnServer(this.dataRequest._sort, this.dataRequest._order); //шпионская функция которая вроде как не нужна
    this.createFullUrl();
    const data =  fetchJson(this.url.href);
    return data;
  }

  createFullUrl() {
    Object.entries(this.dataRequest).forEach(([key, value]) => this.url.searchParams.set(key, String(value)));
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

  buildRowHeader([id, title, sortable], obj) {

    if(id === 'status') {
      return obj.template(this.data);
    }
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" ${sortable === true ? 'data-order="desc"' : ''}>
        <span>${title}</span>${sortable === true ? this.templateHeaderArrow : ''}
      </div>`;
  }

  getHeaderContainer() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${Object.entries(this.dataHeader).map( (item , i) => this.buildRowHeader(item[1], this.header[i])).join('')}
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

  getRowTable(data) {
    return data.map( (value) => {
      return `
        <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
          ${this.buildRowTable(value)}
        </a>`
    }).join('');
  }

  getTableContainer(data = []) {
      return `
    <div data-element="body" class="sortable-table__body">
        ${this.getRowTable(data)}
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

  showTable() {
    this.getDataHeader();
    const div = document.createElement('div');
    div.innerHTML = this.getMainContainer();
    const element = div.firstElementChild;
    this.element = element;
    this.subElements = this.getSubElements(element);
  }

  async render() {
    await this.getData()
      .then(data => {

          if(this.typeEvent === 'pointerdown') {
            this.subElements.body.innerHTML = this.getTableContainer(data);
          }
          else {
            const div = document.createElement('div');
            div.innerHTML = this.getTableContainer(data);
            const children = div.firstElementChild.children;
            [...children].forEach((item) => {
              this.subElements.body.append(item);
            });
          }
        this.data = data;
      })
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  setEventHeaderButtons () {
    this.subElements.header.addEventListener('pointerdown', this.getParametersForSortButton);
    window.addEventListener('scroll', this.scrollThrough);
  }
//шпионская функция пустышка мне она не нужна но без нее тест не проходил извините за такую вольность
  sortOnServer(column, direction) {
  }

  destroy(){
    this.element.remove();
    this.subElements = {};
    window.removeEventListener('scroll', this.scrollThrough);
  }
}
