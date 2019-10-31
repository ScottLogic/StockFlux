import Titlebar from './components/Titlebar/Titlebar';
import ScrollWrapperY from './components/scroll-wrapper-y/ScrollWrapperY';
import { Spinner, LargeSpinner } from './components/spinner/Spinner';
import Watchlist from './components/buttons/round-buttons/app-shortcuts/Watchlist';
import Chart from './components/buttons/round-buttons/app-shortcuts/Chart';
import Round from './components/buttons/round-button/RoundButton';
import Close from './components/buttons/round-buttons/Close';
import CloseIcon from './components/icons/close.svg';
import MinimizeIcon from './components/icons/minimize.svg';
import News from './components/buttons/round-buttons/app-shortcuts/News';

import Borderless from './components/buttons/borderless-button/BorderlessButton';
import ChartBorderless from './components/buttons/borderless-buttons/app-shortcuts/Chart';
import NewsBorderless from './components/buttons/borderless-buttons/app-shortcuts/News';
import CloseBorderless from './components/buttons/borderless-buttons/Close';

import ChartIcon from './components/glyphs/small/chart.svg';
import NewsIcon from './components/glyphs/small/news.svg';
import WatchListIcon from './components/glyphs/small/watchlist.svg';

import PriceUp from './components/glyphs/arrows/priceArrowUp.svg';
import PriceDown from './components/glyphs/arrows/priceArrowDown.svg';

import ConfirmationWindow from './components/popups/ConfirmationWindow';
import PopupWindow from './components/popups/PopupWindow';
import PreviewWindow from './components/preview-window/PreviewWindow';

import './styles/button-icon.css';
import './styles/icon.css';
import './styles/font.css';
import './styles/scrollbar.css';
import './index.css';

export default {
  Titlebar,
  ScrollWrapperY,
  Spinner,
  LargeSpinner,
  Buttons: { Round, Close, Borderless },
  Shortcuts: {
    Watchlist,
    Chart,
    News,
    ChartBorderless,
    NewsBorderless,
    CloseBorderless
  },
  Icons: {
    Small: { Chart: ChartIcon, News: NewsIcon, Watchlist: WatchListIcon },
    Arrows: { PriceUp, PriceDown },
    Toolbar: { MinimizeIcon, CloseIcon }
  },
  Popups: { PopupWindow, ConfirmationWindow },
  PreviewWindow
};
