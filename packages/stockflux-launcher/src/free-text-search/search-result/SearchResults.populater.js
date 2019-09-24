import ReactDOM from 'react-dom';

export default (html, resultsWindow) => {
  const childDocument = resultsWindow.getWebWindow().document;
  injectToChildHead(childDocument, document.getElementsByTagName('style'));
  ReactDOM.render(html, childDocument.getElementById('results-container'));
};

const injectToChildHead = (childDocument, nodes) => {
  for (let node of nodes) {
    childDocument
      .getElementsByTagName('head')[0]
      .appendChild(node.cloneNode(true));
  }
};
