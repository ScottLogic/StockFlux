import React from 'react';
import * as PropTypes from 'prop-types';

import './NewsItem.css';

const NewsItem = ({headline, source, copy}) => (
    <div className="newsitem">
        <div className="item-source">{source}</div>
        <div className="item-content">
            <div className="item-headline">{headline}</div>
            <div className="item-content">{copy}</div>
        </div>
    </div>
);

NewsItem.propTypes = {
    headline: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    copy: PropTypes.string.isRequired
};

export default NewsItem;