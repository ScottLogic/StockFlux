import ReactDOMServer from 'react-dom/server';

export default (html, resultsWindow) => {
  const markup = ReactDOMServer.renderToStaticMarkup(html);
  resultsWindow.getWebWindow().document.getElementById('results-container').innerHTML = markup;
};
