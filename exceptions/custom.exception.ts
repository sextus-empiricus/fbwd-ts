export class CustomException extends Error {
   constructor(public message: string, public code: number) {
      super();
      this.message = message;
      this.code = code;
   }
}
