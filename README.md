# Angular UI View Spinner

A declarative, powerful drop-in addition to UI Router, enabling spinners to be shown when executing `resolves` before
the route change is complete.

**Motivation**: Global spinners suck, UX and humans desire to know what part of the screen is loading.  UI Router gives
us the hooks we need and this directive is the easiest *drop-in* replacement to complicated or global loading indicators.

Most importantly, this works as you nest multiple `<ui-view>` elements, and comes with a good set of defaults to
not show if the data is loaded within a certain amount of time (avoids spinner flashes).


# Demo / Example

[Demo](http://rpocklin.github.io/angular-ui-view-spinner/example/index.html)


## Installation

1. Install the plugin into your Angular.js project, manually or via:

  `bower install angular-ui-view-spinner --save`

1. Include `angular-ui-view-spinner.css` in your app:

  `<link rel="stylesheet" href="bower_components/angular-ui-view-spinner/angular-ui-view-spinner.css" />`

1. Include `angular-ui-view-spinner.js` in your app:

  `<script src="bower_components/angular-ui-view-spinner/angular-ui-view-spinner.js"></script>`

1. Add `angular-ui-view-spinner` as a new module dependency in your angular app.

  `var myapp = angular.module('myapp', ['angular-ui-view-spinner']);`

1. Ensure that the other Angular.js module dependencies are included:

  `var myapp = angular.module('myapp', ['angularSpinner', 'ui.router', 'angular-ui-view-spinner']);`

## Creating the Directive

1. [ required ] Replace `<ui-view ...>` or `<div ui-view ...>` with `<ui-loading-view ...>` or `<div ui-loading-view ...>`.
1. [ required ] Define the root-state for that `<ui-loading-view>` based on the parents route.
1. [ optional ] Specify the preset size of the spinner `size="small | medium | large"`.
1. [ optional ] Customise the `angularSpinner` spinner dimensions directly: `spinner-size="{ radius: 50, width: 10, length: 60 }"`.

NOTE: The spinner will appear on any view where you have `resolve:` defined with an async loader, whether it's one async request or many.

Complete (minimal) example:

```html
  
  <div>
    <a ui-sref="example.one">Route 1</a>
    <a ui-sref="example.two">Route 2</a>
  </div>
  <ui-loading-view root-state="example"></ui-loading-view>
```


## Notes

- You can use either the SASS styles directly file under `/src` or the compiled CSS files, up to you :)
- You may wish to customise the `margin-top` of the spinner to the `<ui-view>` containers,
  or use flex-box or another method to vertically center the spinner but it depends which browsers / versions you are 
  targeting - the default is `margin-top: 50px`.

## Running Locally

1. Checkout git repository locally: `git clone git@github.com:rpocklin/angular-ui-view-spinner.git`
1. `npm install`
1. `bower install`
1. `grunt serve`
1. View `http://localhost:9000/example/` in your browser to see the example.


## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Make your changes, run `grunt` to ensure all tests pass.  (Ideally add more tests!)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request


## History

1.0.0 Initial release

## TODO
1. Your feature here

## License

Released under the MIT License. See the [LICENSE][license] file for further details.

[license]: https://github.com/rpocklin/angular-ui-view-spinner/blob/master/LICENSE
