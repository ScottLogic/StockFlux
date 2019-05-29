import React from 'react';
import * as PropTypes from 'prop-types';

import './NewsItem.css';

const handleNewsItemClick = (link) => {
    const winOption = {
        name: link,
        url: link,
        autoShow: true,
        defaultWidth: 800,
        defaultHeight: 800,
        minWidth: 850,
        minHeight: 500,
        frame: true,
        contextMenu: true,
    };
    window.fin.Window.create(winOption);
}

const NewsItem = ({headline, source, copy, link}) => (
    <div className="newsitem">
        <div className="item-source">{source}</div>
        <div className="item-content" onClick={() => handleNewsItemClick(link)}>
            <div className="item-headline">{headline}</div>
            <div className="item-summary">{copy}</div>
        </div>
    </div>
);

NewsItem.propTypes = {
    headline: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    copy: PropTypes.string.isRequired
};

export default NewsItem;