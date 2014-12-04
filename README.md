# React Input Calendar

React component for calendar widged.

## Installation

React Input calendar is available as an [npm package](https://www.npmjs.org/package/react-input-calendar).
```sh
npm install react-input-calendar
```

Use [browserify](http://browserify.org/) and [reactify](https://github.com/andreypopp/reactify) for dependency management and JSX transformation.

All styles written in CSS and are in file input-component.css.

## Demo

http://rudeg.github.io/react-input-calendar

## Usage

For a typeahead input:

```javascript
var Calendar = require('react-input-calendar');
React.render(
  <Calendar
    format="DD/MM/YYYY"
    date="4-12-2014"
  />
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

## License

MIT