import React from "react";
import { Intents } from "stockflux-core";
import NewsIcon from "../../icons/news.svg";
import "../AppShortcut.css";

const NewsShortcut = ({ symbol, name, onClick }) => {
  return (
    <div
      className="app-shortcut news-shortcut"
      onClick={() => {
        symbol && name ? Intents.viewNews(symbol, name) : Intents.viewNews();
        if (onClick) onClick();
      }}
    >
      <NewsIcon />
    </div>
  );
};
export default NewsShortcut;
