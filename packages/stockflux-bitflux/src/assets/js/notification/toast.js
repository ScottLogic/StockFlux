import d3 from 'd3';
import fc from 'd3fc';
import event from '../event';

export default function() {
  var dispatch = d3.dispatch(event.notificationClose);

  var panelDataJoin = fc.util
    .dataJoin()
    .selector('div.alert-content')
    .element('div')
    .attr('class', 'alert-content');

  var toastDataJoin = fc.util
    .dataJoin()
    .selector('div.alert')
    .element('div')
    .attr({ class: 'alert alert-info alert-dismissible', role: 'alert' })
    .key(function(d) {
      return d.id;
    });

  var toast = function(selection) {
    selection.each(function(model) {
      var container = d3.select(this);

      var panel = panelDataJoin(container, [model]);
      panel.enter().html('<div class="messages"></div>');

      var toasts = toastDataJoin(panel.select('.messages'), model.messages);

      var toastsEnter = toasts.enter();
      toastsEnter.html(
        '<button type="button" class="close" aria-label="Close"> \
                    <span aria-hidden="true">&times;</span> \
                </button> \
                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> \
                <span class="sr-only">Error:</span> \
                <span class="message"></span>'
      );

      toastsEnter.select('.close').on('click', function(d) {
        dispatch[event.notificationClose](d.id);
      });

      toasts.select('.message').text(function(d) {
        return d.message;
      });
    });
  };

  d3.rebind(toast, dispatch, 'on');

  return toast;
}
