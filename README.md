[![npm version](https://img.shields.io/npm/v/ng2-scrollspy.svg?style=flat)](https://www.npmjs.com/package/ng2-scrollspy)
[![Build Status](https://img.shields.io/travis/jonnybgod/ng2-scrollspy/master.svg?style=flat)](https://travis-ci.org/jonnybgod/ng2-scrollspy)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/bafd522f82da48fda8bb25bee689b32f)](https://www.codacy.com/app/jonnybgod/ng2-scrollspy)
[![Coverage Status](https://coveralls.io/repos/jonnybgod/ng2-scrollspy/badge.svg?branch=master&service=github)](https://coveralls.io/github/jonnybgod/ng2-scrollspy?branch=master)
[![devDependency Status](https://david-dm.org/jonnybgod/ng2-scrollspy/dev-status.svg)](https://david-dm.org/jonnybgod/ng2-scrollspy#info=devDependencies)

[![Github Releases](https://img.shields.io/github/downloads/jonnybgod/ng2-scrollspy/latest/total.svg)]()

You can use this angular2 service to spy scroll events from ```window``` or any other scrollable element.

This library implements an service to collect observables from scroll spy directives. It can be used to create you own components or if you prefer use on of the following components that leverage this library functionality to accomplish different behaviors:

* [ng2-scrollspy-index](https://github.com/JonnyBGod/ng2-scrollspy-index) (Comming Soon)
* [ng2-scrollspy-parallax](https://github.com/JonnyBGod/ng2-scrollspy-parallax) (Comming Soon)
* [ng2-scrollspy-infinite](https://github.com/JonnyBGod/ng2-scrollspy-infinite) (Comming Soon)

## Installation
First you need to install the npm module:
```sh
npm install ng2-scrollspy --save
```

If you use SystemJS to load your files, you might have to update your config with this if you don't use `defaultJSExtensions: true`:
```js
System.config({
	packages: {
		"/ng2-scrollspy": {"defaultExtension": "js"}
	}
});
```

Finally, you can use ng2-scrollspy in your Angular 2 project.
It is recommended to instantiate `ScrollSpyService` in the bootstrap of your application and to never add it to the "providers" property of your components, this way you will keep it as a singleton.
If you add it to the "providers" property of a component it will instantiate a new instance of the service that won't be initialized.

```js
import {ScrollSpyService} from 'ng2-scrollspy/ng2-scrollspy';

bootstrap(AppComponent, [
	ScrollSpyService
]);
```

## Using

#### Spy window scroll

Use ```ScrollSpyDirective``` to spy on window.

```js
import {Component, View, Injectable, AfterViewInit} from 'angular2/angular2';
import {ScrollSpyDirective, ScrollSpyService} from 'ng2-scrollspy/ng2-scrollspy';

@Injectable()
@Component({
	selector: 'app'
})
@View({
	template: `<div scrollSpy></div>`,
	directives: [ScrollSpyDirective]
})
export class AppComponent implements AfterViewInit {
	constructor(scrollSpyService: ScrollSpyService) {
		this.scrollSpyService = scrollSpyService;
	}

	ngAfterViewInit() {
		this.scrollSpyService.getObservable('window').subscribe((e: any) => {
			console.log('ScrollSpy::window: ', e);
		});
	}
}
```

#### Spy any element scroll

Use ```ScrollSpyElementDirective``` to spy on any element. You must git a unique id to each instance.

```js
import {Component, View, Injectable, AfterViewInit} from 'angular2/angular2';
import {ScrollSpyElementDirective, ScrollSpyService} from 'ng2-scrollspy/ng2-scrollspy';

@Injectable()
@Component({
	selector: 'yourComponent'
})
@View({
	template: `<div scrollSpyElement="test" style="max-height: 100px; overflow: auto;">`
		`<div style="height: 500px;"></div>`
	`</div>`,
	directives: [ScrollSpyElementDirective]
})
export class YourComponent implements AfterViewInit {
	constructor(scrollSpyService: ScrollSpyService) {
		this.scrollSpyService = scrollSpyService;
	}

	ngAfterViewInit() {
		this.scrollSpyService.getObservable('test').subscribe((e: any) => {
			console.log('ScrollSpy::test: ', e);
		});
	}
}
```

Because ```ScrollSpyService``` is a singleton, you can get any ScrollSpy observable from anywhere withing your application.

Check one of the dependent libraries for examples of more complex use cases.

## License

[MIT](LICENSE)
