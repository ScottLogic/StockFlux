import React from 'react';
import {format, isToday} from 'date-fns';
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
        defaultTop: 80,
        saveWindowState: false,
        frame: true,
        contextMenu: true,
        api: {
            iframe: {
                sameOriginInjection: false
            }
        }
    };
    window.fin.Window.create(winOption);
}

const timeToRead = (copy) => {
    const textLength = copy.split(" ").length;
    return textLength > 0 ? `${Math.ceil(textLength / 200)} min read` : ``; 
}

const articleDate = (unformattedDate) => {
    const date = new Date(unformattedDate);

    return !isToday(date) ? format(date, 'DD MMM') : format(date, 'h:mm A');
}

const NewsItem = ({headline, source, copy, link, time}) => (
    <div className="newsitem" onClick={() => handleNewsItemClick(link)}>
        <div className="newsitem-header">
            <div className="headline">{headline}</div>
            <div className="story-date">{articleDate(time)}</div>
        </div>
        <div className="newsitem-meta">
            <div className="source">{source}</div>
            <div className="time-to-read">{timeToRead(copy)}</div>
        </div>
        <div className="newsitem-content">
            <div className="summary">{copy}</div>
        </div>
    </div>
);

NewsItem.propTypes = {
    headline: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    copy: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired
};

export default NewsItem;