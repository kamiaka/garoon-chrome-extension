export class ErrorResponse {
  constructor(protected resp: Response) {}

  status(): number {
    return this.resp.status;
  }
}
