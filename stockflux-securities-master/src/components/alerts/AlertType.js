export function AlertType(value) {
  this._value = value;
}

AlertType.prototype.valueOf = function() {
  return this._value;
};

AlertType.ERROR = new AlertType('error');
AlertType.SUCCESS = new AlertType('success');
