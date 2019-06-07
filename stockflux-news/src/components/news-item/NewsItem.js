import React from 'react';
import { FaNewspaper } from 'react-icons/fa';
import * as PropTypes from 'prop-types';

import styles from './NewsItem.module.css';

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

const NewsItem = ({headline, source, copy, link}) => (
    <div className={styles.newsitem}>
        <div className={styles.source}><FaNewspaper/>{source}</div>
        <div className={styles.content} onClick={() => handleNewsItemClick(link)}>
            <div className={styles.headline}>{headline}</div>
            <div className={styles.summary}>{copy}</div>
        </div>
    </div>
);

NewsItem.propTypes = {
    headline: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    copy: PropTypes.string.isRequired
};

export default NewsItem;