export default function(responseObject) {
  var message;
  if (responseObject && responseObject.quandl_error) {
    message = responseObject.quandl_error.message;
  }
  return message;
}
