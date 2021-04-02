class Tooltip {

  moveTooltip = (event) => {
    const position = this.dataCoords(event)
    this.tooltip.style.left = position.coordinateX + 10  + 'px';
    this.tooltip.style.top = position.coordinateY + 10 + 'px';
  }

  // getTarge = (event) => {
  //   const target = event.target;
  //   let valueData;
  //   if (target.dataset.tooltip) {
  //     valueData = target.dataset.tooltip;
  //     this.changeTooltip(valueData);
  //   }
  // }

  onMouseMove = (event) => {
    this.moveTooltip(event);
    this.target = this.getTarget(event);
  }

  onMouseOver = (event) => {
    if(this.target) {
      document.removeEventListener('pointerout', this.onMouseOut);
      console.log(this.target);
        this.changeTooltip(this.target);

    }
  }

  onMouseOut = () => {
    if(!this.target) {
      document.removeEventListener('pointerover', this.onMouseOver);
      const defaultText = 'This is tooltip';
      console.log(this.target);
      this.changeTooltip(defaultText);

    }
  }



  constructor() {
    this.renderTooltip();
  }

  initialize() {
    document.addEventListener('pointermove', this.onMouseMove);
    if(this.target) {
    document.addEventListener('pointerover', this.onMouseOver);
    document.addEventListener('pointerout', this.onMouseOut);
  }

  get templateTooltip() {
    return `<div class="tooltip">This is tooltip</div>`;
  }

  dataCoords(event) {
    return {
      coordinateX: event.pageX,
      coordinateY: event.pageY,
    }
  }

  getTarget(event) {
    const target = event.target;
    if (target.dataset.tooltip) {
      return target.dataset.tooltip;
    }
  }

  changeTooltip(valueData = 'This is tooltip') {

    this.tooltip.innerText = valueData;
    this.tooltip.hidden = false;
  }



  renderTooltip() {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.templateTooltip;
    const element = tempDiv.firstElementChild;
    this.tooltip = element;
    this.tooltip.hidden = true;
    document.body.append(this.tooltip);
  }
}




const tooltip = new Tooltip();

export default tooltip;
