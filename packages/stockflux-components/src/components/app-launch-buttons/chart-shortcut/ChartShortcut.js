import React from "react";
import { Intents } from "stockflux-core";
import ChartIcon from "../../icons/chart.svg";
import "../AppShortcut.css";

const ChartShortcut = ({ symbol, name, onClick }) => {
  return (
    <div
      className="app-shortcut chart-shortcut"
      onClick={() => {
        symbol && name ? Intents.viewChart(symbol, name) : Intents.viewChart();
        if (onClick) onClick();
      }}
    >
      <ChartIcon />
    </div>
  );
};
export default ChartShortcut;
