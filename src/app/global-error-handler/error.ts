export class MyError extends Error {
  message: string;
  date: Date;

  constructor(message = '', ...params: any) {
    super(...params);

    this.name = 'Error';
    this.message = message;
    this.date = new Date();
  }
}
