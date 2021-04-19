export default class SortableList {

  onPointerMove = ({ clientX, clientY }) => {
    this.draggingElem.style.left = `${clientX - this.shiftXY.x}px`;
    this.draggingElem.style.top = `${clientY - this.shiftXY.y}px`;

    const siblingElement = {
      prev: this.placeholder.previousElementSibling,
      next: this.placeholder.nextElementSibling,
    }

    if (siblingElement.prev) {
      const middlePrevElem = this.getMiddleElement(siblingElement, 'prev')

      if (clientY < middlePrevElem) {
        return siblingElement.prev.before(this.placeholder);
      }
    }

    if (siblingElement.next) {
      const middleNextElem = this.getMiddleElement(siblingElement, 'next')

      if (this.element.children[[...this.element.children].length -1] === siblingElement.next) {
        return siblingElement.prev.after(this.placeholder);
      }
      if (clientY > middleNextElem) {
        return siblingElement.next.after(this.placeholder);
      }
    }
  };

  onPointerUp = () => {
    this.dragStop();
  };

  constructor({ items = [] } = {}) {
    this.items = items;
    this.render();
  }

  render() {
    this.element = document.createElement('ul');
    this.element.className = 'sortable-list';

    this.addItems();
    this.initEventListeners();
  }

  getMiddleElement(siblingElement, typeElement) {
    return siblingElement[typeElement].getBoundingClientRect().top + siblingElement[typeElement].getBoundingClientRect().height / 2;
  }

  addItems() {
    // item is a DOM element
    for (const item of this.items) {
      item.classList.add('sortable-list__item');
    }

    this.element.append(...this.items);
  }

  initEventListeners () {
    this.element.addEventListener('pointerdown', event => {
      this.onPointerDown(event);
    });
  }

  onPointerDown (event) {
    const element = event.target.closest('.sortable-list__item');

    if (element) {
      if (event.target.closest('[data-grab-handle]')) {
        event.preventDefault();

        this.dragStart(element, event);
      }

      if (event.target.closest('[data-delete-handle]')) {
        event.preventDefault();

        element.remove();
      }
    }
  }

  createPlaceholderElement (width, height) {
    const element = document.createElement('li');
    element.className = 'sortable-list__placeholder';
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    return element;
  }

  dragStart(element, {clientX, clientY}) {
    this.draggingElem = element;
    this.elementInitialIndex = [...this.element.children].indexOf(element);
    const { offsetWidth, offsetHeight } = element;
    const { x, y } = element.getBoundingClientRect();

    this.shiftXY = {
      x: clientX - x,
      y: clientY - y,
    }
    this.draggingElem.style.width = `${offsetWidth}px`;
    this.draggingElem.style.height = `${offsetHeight}px`;
    this.draggingElem.classList.add('sortable-list__item_dragging');

    this.draggingElem.style.left = `${clientX - this.shiftXY.x}px`;
    this.draggingElem.style.top = `${clientY - this.shiftXY.y}px`;

    this.placeholder = this.createPlaceholder(offsetWidth, offsetHeight);

    this.draggingElem.after(this.placeholder);
    this.element.append(this.draggingElem);

    this.addDocumentEventListeners();
  }

  addDocumentEventListeners () {
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  createPlaceholder(offsetWidth, offsetHeight) {
    const element = document.createElement('li');
    element.classList.add('sortable-list__placeholder');
    const param = ['width', 'height'];
    [offsetWidth, offsetHeight].forEach( (elem, i) => element.style[param[i]] = `${elem}px`);
    return element;
  }

  removeDocumentEventListeners () {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }

  scrollIfCloseToWindowEdge(clientY) {
    const scrollingValue = 10;
    const threshold = 20;

    if (clientY < threshold) {
      window.scrollBy(0, -scrollingValue);
    } else if (clientY > document.documentElement.clientHeight - threshold) {
      window.scrollBy(0, scrollingValue);
    }
  }

  dragStop() {
    const placeholderIndex = [...this.element.children].indexOf(this.placeholderElement);

    this.draggingElem.style.cssText = '';
    this.draggingElem.classList.remove('sortable-list__item_dragging');
    this.placeholder.replaceWith(this.draggingElem);
    this.draggingElem = null;

    this.removeDocumentEventListeners();

    if (placeholderIndex !== this.elementInitialIndex) {
      this.dispatchEvent('sortable-list-reorder', {
        from: this.elementInitialIndex,
        to: placeholderIndex
      });
    }
  }

  dispatchEvent (type, details) {
    this.element.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      details
    }));
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy () {
    this.remove();
    this.removeDocumentEventListeners();
    this.element = null;
  }
}
