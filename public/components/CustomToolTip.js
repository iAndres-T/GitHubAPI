export class CustomToolTip {
  eGui;

  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.style.whiteSpace = 'pre-wrap';
    this.eGui.style.maxWidth = '500px';
    this.eGui.innerHTML = params.value.replace(/\n/g, '<br>');
  }

  getGui() { return this.eGui; }
}