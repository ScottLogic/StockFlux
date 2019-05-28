import React from 'react';
import Components from 'stockflux-components';
import './App.css';
import NewsItem from './components/news-item/NewsItem';

const tempNews = [{
  headline: 'test headline',
  source: 'DNN',
  copy: 'this is not news'
},
{
  headline: 'test headline',
  source: 'DNN',
  copy: 'this is not news'
},
{
  headline: 'test headline',
  source: 'DNN',
  copy: 'this is not news'
},
{
  headline: 'test headline',
  source: 'DNN',
  copy: 'this is not news'
}]

function App() {
  return (
    <div className="stockflux-news">
      <Components.Titlebar />
      <div className="stockflux-header">
          SYMBOL
      </div>
      <div>
          {tempNews.map((newsItem, index) => 
            <NewsItem key={index} headline={newsItem.headline} source={newsItem.source} copy={newsItem.copy} />
          )}
      </div>
    </div>
  );
}

export default App;
