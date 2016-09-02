'use strict';

function ImageView(url, $name) {
  this.url = url;
  this.$name = $name;
}

ImageView.prototype.show = function () {
  var $img = document.createElement('img');
  $img.src = this.url;
  $img.classList.add('image-viewer__image');
  this.$name.parentElement.insertBefore($img, this.$name.nextSibling);
};

module.exports = ImageView;
