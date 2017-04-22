function UI() {
  var form = document.createElement('form');
  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.onchange = this.onFileSelected.bind(this);
  form.appendChild(fileInput);
  document.getElementById(this.root).appendChild(form);
}

UI.prototype.onFileSelected = function onFileSelected(event) {
  // TODO: iterate over all selected files and trigger uploads
  var file = event.target.files[0];

  return self.createVideo(file);
};

module.exports = UI;
