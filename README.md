# Getting Started with Error Monitoring for Angular

## Pre-Installation Directions: Setup and deploy angular app

1. Be sure to have node, NVM, and git installed.

2. Fork this repository and clone. Set node version as specified:
```
git clone https://github.com/<your_fork>/sentry-workshop
nvm use
```
3. Then install with
```
npm install
```
4. Then build and run server with
```
npm run deploy
```
5. Verify web server is running properly and app can be loaded (go to http://localhost:5000 in the browser and trigger errors)

6. You should be set for the workshop, where you will add Sentry into this angular application to monitor errors.
