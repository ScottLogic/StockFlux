# Change Log
**All notable changes to the project will be documented in this file.**

## [1.8.1] - 21-07-2018
### Fixed
- Updated GitHub Releases API key

## [1.8.0] - 20-07-2018
### Added
- Expose options to change Quandl data source database and column name mapping

## [1.7.0] - 14-12-2016
### Changed
- x-axis label styles
- Improved tick generation
- Normalised data generator dates/times
- Updated development dependencies

### Fixed
- Dropdown toggle in Firefox
- Quandl feed error messages
- Coinbase feed has been renamed to GDAX, following a [rebrand](https://blog.coinbase.com/coinbase-exchange-is-now-gdax-adds-ether-trading-a82cc628aa79#.sy8kxyghb)

## [1.6.1] - 10-5-2016
### Changed
- Updated development dependencies

### Fixed
- Zoom on the navigator

## [1.6.0] - 5-5-2016
### Added
- Component to manage secondary charts
- Gradient style for primary chart area series

### Changed
- Only render visible data on primary and secondary charts
- New style for navigator reset button
- Improvements to icon sharpness
- Navigator brush handles no longer cropped

## [1.5.2] - 9-4-2016
### Added
- Selected and hover styles for dropdown menu items
- Release distribution files now published to GitHub Releases

### Fixed
- Navigator brush in IE

## [1.5.1] - 6-4-2016
### Fixed
- Specify correct root configuration file for ESLint to prevent deployment errors

## [1.5.0] - 22-3-2016
### Changed
- Weekends skipped for Quandl data source
- Weekly period removed from Quandl data source

## [1.4.0] - 16-3-2016
### Added
- Option to set historic feed error callback, when using BitFlux as a module
- A weekend discontinuity provider (not currently used)

### Changed
- d3fc dependency to 7.0.0

## [1.3.0] - 3-3-2016
### Changed
- Quandl data source uses WIKI database, rather than YAHOO
- Quandl data source uses adjusted OHLCV values, rather than unadjusted

## [1.2.0] - 1-3-2016
### Added
- Option to set proportion of data to be displayed by default, when using BitFlux as a module
- Option to set number of datums to be fetched, when using BitFlux as a module
- Option to set which indicators to display, when using BitFlux as a module

### Changed
- d3fc dependency to 6.0.0

## [1.1.1] - 23-2-2016
### Fixed
- When using BitFlux as module, changing the Quandl product now correctly updates the models, preventing issues in the overlay

## [1.1.0] - 21-2-2016
### Added
- Unit test coverage reporter
- Option to seed random number generator
- Nicer menus for mobile

### Changed
- Legend only displayed when crosshair is active
- Legend now uses d3fc tooltip component
- Crisp edge shape-rendering now used on RSI annotations and latest price annotation
- RSI annotations and latest price annotation dash frequency
- d3fc dependency to 5.3.0
- Development dependency versions

### Fixed
- Added padding to navigator y-extent to prevent series overlapping chart border
- Centered indicator labels
- Primary chart gridlines better adapt to ticks shown on y-axis
- Prevent `Infinity` being set as application version number when deployed
- Import correct font weight (Roboto 300)
- Width calculations when dimensions change

## [1.0.1] - 1-2-2016
### Fixed
- Build process updated to prevent errors in IE (dependencies are concatenated rather than use rollup)

## [1.0.0] - 27-1-2016
### Changed
- **Breaking change**: Renamed project to **BitFlux**
  - When using BitFlux as a an external UMD module the exported name is now `bitflux` (previously `sc`)
  - Module distribution files are now named `bitflux.*` (previously `sc.*`)
  - Icon classes are now prefixed with `bf-` (previously `sc-`)

### Fixed
- x-axis, shared by primary and secondary charts, height increased to prevent labels being clipped

## [0.11.0] - 21-1-2016
### Added
- Navigator selected area gradient
- Small API for easier integration in OpenFin and associated build step to export as a module

### Changed
- Coinbase API calls are debounced to prevent reaching rate limit
- Update d3fc dependency to 5.2.0
- Use `fc.util.extent()` for padding Y domain
- Add extent accessors to series and indicators to simplify padding calculations
- Application fills to its parent container, rather than entire window

### Fixed
- Moving Average line shown on Bollinger Bands
- Text in chart and menu is no longer selectable
- Text in chart and menu no longer have text selection cursor
- RSI calculations fixed via updating d3fc dependency to 5.2.0
- Reset button is now click-able when tracking latest price
- Padding around current price callout
- Improved loading state visuals with spinner
- Width calculations in navigator
- jQuery is now a dependency, rather than a development dependency

## [0.10.1] - 10-1-2016
### Fixed
- Locked down dependency and development dependency versions to fix build issue #531

## [0.10.0] - 5-1-2016
### Added
- Quandl historic data source
- Error message notifications

### Changed
- Deployment of latest release and develop to GitHub pages now automatically run on CI
- Initial application configuration simplified
- Models refactored for consistency
- Streaming data connection now initialised when historic data has been received

### Fixed
- Volume number formatting

## [0.9.0] - 16-12-2015
### Added
- Component to retrieve Coinbase products
- Indicator removal labels
- ESLint, removing JSHint and JSCS
- Karma

### Changed
- Moved to ES6 modules and Rollup
- Re-evaluated data components
- Navigator hidden on mobile
- Clear all indicator button on mobile
- Period selector dropdown on mobile
- Method of keying on renderers

### Fixed
- Issue where primary chart was not visible when navigating to app in IE
- Volume chart gap between axis and bars removed

## [0.8.0] - 02-12-2015
### Added
- Loading screen while data is loading
- SVG sprite generation for icons
- Release notes

### Changed
- Navigator handle styling
- Series/indicator buttons
- Dropdown/component buttons
- Removed slide out menu from mobile version
- Consistency updates for components
- Faster builds

### Fixed
- Products now show while data is loading
- Layout suspended function reapplied to the navigator
- Navigator focus rectangle displays correctly in Firefox
- Primary chart render console error fixed for IE
- Zoom in extent now limited
- Secondary chart bar series colours

## [0.7.0] - 17-11-2015
### Changed
- Series/indicator stroke widths
- Series colour
- Product selector style
- Period selector style
- Updated d3fc dependency to 4.x.x
- Removed necessary calls outside of render function
- Separated model checking and rendering
- Removed foreground from secondary charts
- Reset button styling
- Crosshair styling
- Legend styling
- Button styling
- Fonts
- Colour scheme
- Update d3fc dependency to 3.x.x
- Removed usage of global models
- Move code to use fc.util.dataJoin where possible

### Fixed
- Main x-axis no longer too wide
- Layout in Firefox and IE
- Period selector displays period correctly
- Button group components are now idempotent
- Bollinger bands display underneath series
- Layout of charts updates correcty
- Exclude livreload script from production build

## [0.6.0] - 27-10-2015
### Added
- Crosshair to primary chart
- Model for products
- Model for periods
- Legend
- Volume chart
- Loading screen while data is loading
- Added EOD option

### Changed
- Limited axis ticks
- Replaced linearTimeSeries with cartesianChart
- Primary chart indicator period length

### Fixed
- Gap between chart and x-axis removed
- Navigator bar panning zoom-in bug

## [0.5.0] - 18-09-2015
### Added
- Ability to add up to 2 secondary charts
- Ability to add multiple indicators at the same time
- Mobile friendly menu

### Changed
- Moved y-axis to the right of the secondary charts
- Added y-axis to MACD panel
- Removed 'chart' suffix from sc.chart.modules
- Zoom does not move from latest price when tracking live data
- Number of visible data points stay the same when tracking live data
- Modularised the entire application

### Fixed
- Panning before indicators begin no longer breaks line render
- Series selections buttons activate state now consistent across all browsers

## [0.4.0] - 08-09-2015
### Added
- MACD chart
- Ability to change period of data
- Coinbase historic feed as data feed
- Mock live data source
- Coinbase OHLC adapter as data feed for the chart

### Changed
- Bollinger band styling
- Bollinger band no longer shows moving average by default
- Y extent depends on displayed series and indicators
- Primary and secondary charts share the same x-axis
- Chart sizes to parent container

### Fixed
- Issue where calculating primary chart y extent before running indicators algorithms would case error

## [0.3.0] - 25-08-2015
### Added
- Modularise navigator
- Modularise primary chart
- Modularise secondary chart
- Line to separate the buttons from the charts
- Moved from CSS to Less

### Changed
- Hide secondary chart by default
- Chart now fills screen on mobile devices
- Navigator now a fixed height
- Removed y-axis tick marks and labels from the navigator
- Primary chart technical indicators
- Aggregate data from historic and live Coinbase data sources

### Fixed
- Issue where switching from live data to generated would cause a basket of live data to be added to the generated data
- Latest price annotation mismatch
- Issue where area series y0 value appeared above the x-axis

## [0.2.0] - 12-08-2015
### Added
- Close price annotation callout label on y-axis
- Live Coinbase data source
- Historical Coinbase data source

### Changed
- Primary chart series types
- Converted Coinbase data from trades to OHLC
