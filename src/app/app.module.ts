import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { Router, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { environment } from "./../environments/environment.prod";

import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://c8e54fe7ff9a42ef801489ffb53a4b79@o445693.ingest.sentry.io/5876619",
  release: environment.release,
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["localhost", "https://yourserver.io/api"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([{ path: "", component: AppComponent }], { relativeLinkResolution: 'legacy' }),
  ],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
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
