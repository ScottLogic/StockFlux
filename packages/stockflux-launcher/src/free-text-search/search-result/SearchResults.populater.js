import ReactDOM from 'react-dom';

export default (html, childWindow, css) => {
  const childDocument = childWindow.getWebWindow().document;

  ReactDOM.render(html, childDocument.getElementById('root'));

  const parentStyles = document.getElementsByTagName('style');
  const parentScripts = document.getElementsByTagName('script');

  injectNodesToChildHead(childDocument, parentStyles);
  injectNodesToChildHead(childDocument, parentScripts);

  if (css) {
    var linkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('href', css);
    injectNodeToChildHead(childDocument, linkElement);
  }
};

const injectNodesToChildHead = (childDocument, nodes) => {
  for (let node of nodes) {
    injectNodeToChildHead(childDocument, node);
  }
};

const injectNodeToChildHead = (childDocument, node) => {
  childDocument
    .getElementsByTagName('head')[0]
    .appendChild(node.cloneNode(true));
};
