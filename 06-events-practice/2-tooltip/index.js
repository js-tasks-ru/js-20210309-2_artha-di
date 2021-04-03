class Tooltip {

  moveTooltip = (event) => {
    const position = this.getDataCoords(event)
      this.element.style.left = position.coordinateX + 10 + 'px';
      this.element.style.top = position.coordinateY + 10 + 'px';
  }

  onPointerMove = (event) => {
    this.moveTooltip(event);
  }

  onPointerOver = (event) => {
    this.getTarget(event);
    if (this.element) {
      this.moveTooltip(event);
      document.addEventListener('pointermove', this.onPointerMove);
    }
  }

  onPointerOut = (event) => {
    this.hideTooltip(this.target);
    document.removeEventListener('pointermove', this.onPointerMove);
  }

  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
  }

  initializeListeners() {
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }

  initialize() {
    this.initializeListeners();
  }

  get templateTooltip(){
    return `<div class="tooltip">This is tooltip</div>`;
  }

  getDataCoords(event){
    return {
      coordinateX: event.pageX,
      coordinateY: event.pageY,
    }
  }

  getTarget(event){
    const target = event.target.closest('[data-tooltip]');
    if (target) {
      const valueTooltip = target.dataset.tooltip;
      this.render(valueTooltip);
      this.target = true;
    } else {
      this.target = false;
    }
  }

  hideTooltip(target){
    if(this.target) {
      document.removeEventListener('pointerover', this.onPointerMove);
      this.element.remove();
      this.tooltip = null;
    }
  }

  render(text){
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.templateTooltip;
    const element = tempDiv.firstElementChild;
    this.element = element;
    this.element.innerHTML = text;
    document.body.append(this.element);
  }
  destroy(){
    this.hideTooltip();
    document.removeEventListener('pointerover', this.onPointerMove);
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerover', this.onPointerOut);
  }
}

const tooltip = new Tooltip();

export default tooltip;





