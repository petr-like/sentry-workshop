import { ErrorHandler, Inject, Injectable, Injector, NgZone } from "@angular/core";
import * as Sentry from "@sentry/browser";
import { MyError } from "./error";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private zone: NgZone,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  private get toastr() {
    return this.injector.get(ToastrService);
  }

  handleError(error: any) {
    if (
      (error instanceof HttpErrorResponse && error.status >= 500) ||
      error.isAxiosError ||
      error.config?.baseURL.includes("trongrid")
    ) {
      return;
    }

    const extractedError = this.extractorError(error);
    console.dir(extractedError);
    // Capture handled exception and send it to Sentry.
    if (!(error instanceof MyError)) {
      console.warn("Catch to Sentry");
      const eventId = this.zone.runOutsideAngular(() =>
        Sentry.captureException(extractedError)
      );
      console.log("eventId: ", eventId);
    }

    switch (error.name) {
      case "TypeError":
        console.warn("Error handler TypeError: ", error);
        break;
      default:
        this.toastr.error(extractedError);
    }
  }

  extractorError = (error: any) => {
    // Try to unwrap zone.js error.
    // https://github.com/angular/angular/blob/master/packages/core/src/util/errors.ts
    if (error instanceof MyError) {
      return error.message;
    }
    if (error && error.ngOriginalError) {
      error = error.ngOriginalError;
    }
    // We can handle messages and Error objects directly.
    if (typeof error === "string" || error instanceof Error) {
      return error;
    }
    // If it's http module error, extract as much information from it as we can.
    if (error instanceof HttpErrorResponse) {
      // If error from our API server
      if (error.url?.includes("l")) {
        const { message } = error.error;
        const errorsMsg: string =
          typeof message === "string" ? message : message.join("<br />");
        return new MyError(`${errorsMsg} <br /><br />  Code: ${error.status}`);
      }
      // The `error` property of http exception can be either an `Error` object, which we can use directly...
      if (error.error instanceof Error) {
        return error.error;
      }
      // ... or an`ErrorEvent`, which can provide us with the message but no stack...
      if (error.error instanceof ErrorEvent && error.error.message) {
        return error.error.message;
      }
      // ...or the request body itself, which we can use as a message instead.
      if (typeof error.error === "string") {
        return (
          "Server returned code " +
          error.status +
          ' with body "' +
          error.error +
          '"'
        );
      }
      // If we don't have any detailed information, fallback to the request message itself.
      return error.message;
    }
    // Nothing was extracted, fallback to default error message.
    return error;
  };
}
