## StockFlux Components

StockFlux Components is a part of the StockFlux application suite. It is a library of shared components used by the core set of applications.

### Install

Currently the library is used locally across the other Stockflux applications.

Before you run an application that has the components library as a dependency you must build the components. To do so run the following command in the Stockflux-components directory:

```bash
npm run build
```

### Usage

The components export is comprised of 4 components and 3 svg components.

```javascript
export default {
  Titlebar,
  ScrollWrapperY,
  Spinner,
  LargeSpinner,
  // svgs
  News,
  Chart,
  Watchlist
};
```

```javascript
import Components from 'stockflux-components';
```

The global default export is defined as `Components`. You can use it like so:

```jsx
<Components.ScrollWrapperY>
  <Components.Spinner />
  <Components.NewsShortcut />
</Components.ScrollWrapperY>
```
