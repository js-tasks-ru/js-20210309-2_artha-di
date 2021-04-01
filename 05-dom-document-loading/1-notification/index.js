export default class NotificationMessage {

  static prevMessage;
  static timer;

  constructor (text = '', { duration = 1000, type = 'success'} = {}) {
    this.text = text;
    this.duration = duration;
    this.type = type;
    this.render();
  }

  get template () {
    return `<div class="notification success" style="--value:${this.duration / 1000}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
        <div class="notification-body">
        ${this.text}
        </div>
        </div>
    </div>`
  }

  remove() {
    NotificationMessage.prevMessage.remove();
  }

  destroy() {
    this.element.remove();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    switch (this.type) {
      case 'success':
        this.element.classList.remove("error");
        break;
      case 'error':
        this.element.classList.toggle("error");
    }
  }

  delayExecute(command = '') {
    const timer = setTimeout(() => {
      this.remove();
      this.destroy();
      clearTimeout(timer);
    }, this.duration);
    NotificationMessage.timer = timer;
  }

  show(target = 'body') {
    if (NotificationMessage.prevMessage) {
      clearTimeout(NotificationMessage.timer);
      this.remove();
    }
    if (target === 'body') {
      document.body.append(this.element)
    } else {
      target.append(this.element)
    }
    NotificationMessage.prevMessage = this.element;
    this.delayExecute();
  }
}
