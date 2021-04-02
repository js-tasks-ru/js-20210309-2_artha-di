class Tooltip {

  // elem.hidden

  constructor() {

    this.moveCursor();
    this.getSelectorsEventZone();
  }


  get template() {
    return `<div class="tooltip">This is tooltip</div>`
  }

  getSelectorsEventZone() {
    const selectors = [...document.querySelectorAll('[data-tooltip]')];
    console.dir(document.body);
  }

  moveCursor() {
    document.addEventListener('click', this.click)
  }

  click(event) {
    console.log(event);
    console.log(event.target);
  }
}

const tooltip = new Tooltip();

export default tooltip;
