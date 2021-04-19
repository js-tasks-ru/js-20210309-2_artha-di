import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';


export default class ProductForm {

  PRODUCT_URL = 'api/rest/products';
  CATEGORIES_URL = 'api/rest/categories';

  defaultFormData = {
    title: '',
    description: '',
    quantity: 1,
    subcategory: '',
    status: 1,
    price: 100,
    discount: 0
  };

  onSubmit = (event) => {

    if (event.target.contains(this.subElements.productForm.save)) {
      event.preventDefault();
      this.save();
    }
  }

  templateProduct() {
  return `
  <div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input id="title" required="" type="text" name="title" class="form-control" value="${this.resultProductsData ? escapeHtml(this.resultProductsData.title) : ''}" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea id="description"  required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${this.resultProductsData ? this.resultProductsData.description : ''}</textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
          <ul class="sortable-list">
            ${this.templateImages()}
          </ul>
         </div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select id="subcategory" class="form-control" name="subcategory">
            ${this.templateCategories()}
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input id="price" required="" type="number" name="price" value="${this.resultProductsData ? this.resultProductsData.price : ''}" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input id="discount" required="" type="number" value="${this.resultProductsData ? this.resultProductsData.discount : ''}" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input id="quantity" required="" type="number" class="form-control" value="${this.resultProductsData ? this.resultProductsData.quantity : ''}" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select id="status" class="form-control" name="status">
          <option value="1" ${this.resultProductsData && this.resultProductsData.status === 1 ? 'selected="selected"' : ''}>Активен</option>
          <option value="0" ${this.resultProductsData && this.resultProductsData.status === 0 ? 'selected="selected"' : ''}>Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>`;
  }

  templateImages(){
    if (!this.resultProductsData || !this.resultProductsData.images) {
      return;
    }
    return this.resultProductsData.images.map( picture => {
      return `
        <li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="https://i.imgur.com/MWorX2R.jpg">
          <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
          <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="${picture.source}" src="${picture.url}">
            <span>${picture.source}</span>
          </span>
          <button type="button"><img src="icon-trash.svg" data-delete-handle="" alt="delete"></button>
        </li>
        `;
    }).join('');
  }

  templateCategories(){
    return this.resultCategoriesData.map((category) => {
      if (category.subcategories && category.subcategories.length) {
      return category.subcategories.map((subcategory) => {
        return `
          <option value="${subcategory.id}" ${this.resultProductsData && subcategory.id === this.resultProductsData.subcategories ? 'selected="selected"' : ''}> ${category.title} &gt; ${subcategory.title}</option>`;
      }).join('');
      }
      return `
          <option value="${category.id}" ${category.id === this.resultProductsData.subcategories ? 'selected="selected"' : ''}>${category.title}</option>`;
    });
  }

  getFormData() {

    const {productForm, imageListContainer} = this.subElements;
    const exludedFields = ['images'];
    const formatToNumber = ['price', 'quantity', 'discount', 'status'];
    const fields = Object.keys(this.defaultFormData).filter( item => !exludedFields.includes(item));

    const getValue = field => productForm.querySelector(`[name=${field}]`).value;
    const values = {};

    for (const field of fields) {
      const value = getValue(field);
      values[field] = formatToNumber.includes(field)
        ? parseInt(value)
        : value;
    }

    const imagesHTMLCollection = imageListContainer.querySelectorAll('.sortable-table__cell-img');

    values.images = [];
    values.id = this.productId;

    for (const image of imagesHTMLCollection) {
      values.images.push({
        url: image.src,
        source: image.alt
      });
      return values;
    }
  }

  async save() {
    const product = await this.getFormData();
    try {
      const result = await fetchJson(`${BACKEND_URL}/${this.PRODUCT_URL}`, {
        method: this.productId ? 'PATCH' : 'PUT',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify(product)
      });
      this.dispatchEvent(result.id);
    }
    catch (error) {
      console.error('something went wrong', error);
    }
  }

  constructor (productId = '') {
    this.productId = productId;
  }

  async render () {

    const {categories, products} = this.getUrl(this.productId);
    const promiseCategoriesData = fetchJson(categories);

    const promiseProductData = products ? fetchJson(products) : this.defaultFormData;

    const [resultCategoriesData, resultProductsData] = await Promise.all([promiseCategoriesData, promiseProductData]);
    this.resultCategoriesData = resultCategoriesData;
    const [objectProducts] = resultProductsData;
    this.resultProductsData = objectProducts;
    const div = document.createElement('div');
    div.innerHTML = this.templateProduct();
    this.element = div.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.initEvent();
    return this.element;
  }

  dispatchEvent(result) {
    const event = this.productId
    ? new CustomEvent("product-updated", { detail: { id: result }}) : new CustomEvent("product-saved");
    this.element.dispatchEvent(event);
  }

  getUrl(id){
    const url = {
      categories: '',
      products: '',
    };
    const productsUrl = new URL(this.PRODUCT_URL, BACKEND_URL);
    const categoriesUrl = new URL(this.CATEGORIES_URL, BACKEND_URL);
    const categoriesQuery = [['_sort', 'weight'], ['_refs', 'subcategory']];
    if(id) {
      productsUrl.searchParams.set('id', this.productId);
      url.products = productsUrl.href;
    }
    for(const [key, value]  of categoriesQuery) {
      categoriesUrl.searchParams.set(key, value);
    }
    url.categories = categoriesUrl.href;
    return url;
  }

  initEvent(event) {
    this.element.addEventListener('submit', this.onSubmit);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  remove () {
    this.element.remove();
    this.subElements = null;
  }

  destroy () {
    this.remove();
  }
}
