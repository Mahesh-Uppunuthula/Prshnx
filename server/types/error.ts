import type {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
} from "hono/utils/http-status";

import { STATUS_CODES } from "http";
export class ErrorResponse extends Error {
  status: ClientErrorStatusCode | ServerErrorStatusCode;
  type?: string;
  override message: string;

  constructor(
    message: string,
    status: ClientErrorStatusCode | ServerErrorStatusCode = 500,
    type?: string
  ) {
    super(message);
    this.message = message;
    this.status = status;
    this.type = type ?? STATUS_CODES[status];
  }
}
