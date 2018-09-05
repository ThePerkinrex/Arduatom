'use babel';
import { CompositeDisposable, Disposable } from 'atom';
class StatusBarStateView extends HTMLElement {
  init() {
    this.classList.add('arduatom', 'inline-block');
    this.innerHTML = 'No board';
    this.disposables = new CompositeDisposable();
    this.addEventListener('click', this.clicked);
    this.disposables.add(new Disposable(() => this.removeEventListener('click', this.clicked)));
  }

  destroy() {
    this.disposables.dispose();
    this.disposables = null;
  }

  clicked(){
    console.log("Click");
  }
}

export default document.registerElement('status-bar-arduino', {prototype: StatusBarStateView.prototype});
