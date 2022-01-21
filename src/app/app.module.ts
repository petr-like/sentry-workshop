import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { Router, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { environment } from "./../environments/environment.version";
import { GlobalErrorHandler } from "./global-error-handler/global-error-handler";

import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";
import { ToastrModule } from "ngx-toastr";
import { CommonModule } from '@angular/common';

Sentry.init({
  dsn: "https://c8e54fe7ff9a42ef801489ffb53a4b79@o445693.ingest.sentry.io/5876619",
  release: environment.release,
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["localhost", "https://api.yourserver.io"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],
  tracesSampleRate: 1.0,
});

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ToastrModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([{ path: "", component: AppComponent }], {
      relativeLinkResolution: "legacy",
    }),
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
