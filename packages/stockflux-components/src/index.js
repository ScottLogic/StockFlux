import Titlebar from './components/Titlebar/Titlebar';
import ScrollWrapperY from './components/scroll-wrapper-y/ScrollWrapperY';
import { Spinner, LargeSpinner } from './components/spinner/Spinner';
import Round from './components/buttons/round-button/RoundButton';
import Borderless from './components/buttons/borderless-button/BorderlessButton';
import Chart from './components/buttons/borderless-buttons/app-shortcuts/Chart';
import News from './components/buttons/borderless-buttons/app-shortcuts/News';
import Watchlist from './components/buttons/borderless-buttons/app-shortcuts/Watchlist';
import Close from './components/buttons/borderless-buttons/Close';

import LeftIcon from './components/glyphs/launcher/left.svg';
import RightIcon from './components/glyphs/launcher/right.svg';
import TopIcon from './components/glyphs/launcher/top.svg';
import SearchIcon from './components/glyphs/launcher/search.svg';
import WatchlistIcon from './components/glyphs/launcher/watchlist.svg';

import ChartIcon from './components/glyphs/small/chart.svg';
import CloseIcon from './components/icons/close.svg';
import MinimizeIcon from './components/icons/minimize.svg';
import NewsIcon from './components/glyphs/small/news.svg';
import WatchListIcon from './components/glyphs/small/watchlist.svg';

import ChartIconNormal from './components/glyphs/normal/chart.svg';
import NewsIconNormal from './components/glyphs/normal/news.svg';
import WatchListNormal from './components/glyphs/normal/watchlist.svg';
import RemoveIcon from './components/glyphs/small/remove.svg';
import ShowMenu from './components/glyphs/small/reveal.svg';
import HideMenu from './components/glyphs/small/hide.svg';

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
  Buttons: { Borderless, Round },
  Shortcuts: {
    Chart,
    News,
    Watchlist,
    Close
  },
  Icons: {
    Small: {
      Chart: ChartIcon,
      News: NewsIcon,
      Watchlist: WatchListIcon,
      RemoveIcon,
      ShowMenu,
      HideMenu
    },
    Normal: {
      Chart: ChartIconNormal,
      News: NewsIconNormal,
      Watchlist: WatchListNormal
    },
    Arrows: { PriceUp, PriceDown },
    Launcher: { LeftIcon, RightIcon, TopIcon, SearchIcon, WatchlistIcon },
    Toolbar: { MinimizeIcon, CloseIcon }
  },
  Popups: { PopupWindow, ConfirmationWindow },
  PreviewWindow
};
