# React Input Calendar

React component for calendar widged.

## Installation

React Input Calendar is available as an [npm package](https://www.npmjs.org/package/react-input-calendar).
```sh
npm install react-input-calendar
```

Use [browserify](http://browserify.org/) and [reactify](https://github.com/andreypopp/reactify) for dependency management and JSX transformation.

All styles written in CSS and are in file input-component.css.

## Demo

http://rudeg.github.io/react-input-calendar

## Usage

```javascript
var Calendar = require('react-input-calendar');
React.render(
  <Calendar
    format="DD/MM/YYYY"
    date="4-12-2014"
  />,
  document.body
);
```

## API

#### props.format

Type: `String`

Default: 'DD-MM-YYYY'

Allowed Keys: All formats supported by [moment.js](http://momentjs.com/docs/#/parsing/string-format/)

Format of date, which display in input and set in date property.

#### props.date

Type: `String` or `Date`

Default: Current date

Set initial date value.

#### props.minView

Type: `Int` (from 0 to 2)

Default: 0 (DaysView)

Set minimal view. Values:
  0 - days
  1 - months
  2 - years

#### props.computableFormat

Type: `String`

Default: 'DD-MM-YYYY'

Allowed Keys: All formats supported by [moment.js](http://momentjs.com/docs/#/parsing/string-format/)

Format of date for the onChange event. Default on the internation date format (ISO 8601) to ease the save of data;

#### props.onChange

Type: `Function`

Default: null

Set an function that will be triggerred whenever there is a change in the selected date. It will return the date in the `props.computableFormat` format

## License

MIT