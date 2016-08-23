String.prototype.format = function () {
  let self = this.toString();

  if (!arguments.length) { return self; }
  let args = (typeof arguments[0] !== 'object') ? arguments.slice() : arguments[0];

  for (let key in args) {
    self = self.replace(new RegExp('\\{' + key + '\\}', 'gi'), args[key]);
  }

  return self;
}
