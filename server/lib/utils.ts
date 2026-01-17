import { v4 as uuidv4 } from "uuid";
import { ErrorResponse } from "../types/error";

export function asyncHandler<T extends (...args: any) => Promise<any> | void>(
  fn: T
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error("AsyncHandler Error: ", error);
      if (error instanceof ErrorResponse) {
        throw new ErrorResponse(error.message, error.status, error.type);
      }
      if (error instanceof Error) {
        throw new ErrorResponse(error.message);
      }
      const errorText = JSON.stringify(error);
      console.error("AsyncHandler Unknown Error: ", errorText);
      throw new ErrorResponse(errorText.length ? errorText : "Unknown Error");
    }
  };
}

export function generateImageId(folder: "form-previews", fileId: string) {
  /**
   * For assets it is going to store as
   * form-previews/{fileId}
   */
  return `${folder}/${fileId}`;
}

export function generateISOTimestamp() {
  return new Date().toISOString();
}

export function generatePublicLink() {
  return uuidv4().slice(0, 8);
}
