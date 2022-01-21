import { Component } from '@angular/core';
import * as Sentry from "@sentry/browser";
import { MyError } from './global-error-handler/error';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  color = 'black';
  textValue = '';
  currentUser = '';

  changeColor() {
    var that = this;
    this.color = 'red';
    setTimeout(() => {
      that.color = 'black'
    }, 1500);
  }

  handleSubmit() {
    this.currentUser = this.textValue;
    Sentry.setUser({ email: this.currentUser });
  }

  malformed() {
    decodeURIComponent('%');
  }

  // ERRORS
  notAFunctionError() {
    var someArray = [{ func: function () {}}];
    someArray[1].func();
  }

  uriError() {
    decodeURIComponent('%');
  }

  syntaxError() {
    eval('foo bar');
  }

  rangeError() {
    throw new RangeError('Parameter must be between 1 and 100');
  }

  myError() {
    throw new MyError('Custom error from any place in our code without send to sentry');
  }
}

