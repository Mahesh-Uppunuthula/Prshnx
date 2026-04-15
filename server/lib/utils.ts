import { timestamp, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import { ErrorResponse } from "../types/error";

export function asyncHandler<T extends (...args: any) => Promise<any> | void>(
  fn: T,
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
  return uuidv7().slice(0, 8);
}

export function defaultPrimaryKey() {
  return { id: uuid().primaryKey().defaultRandom() };
}

export function defaultTimeStamps() {
  return {
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "string" })
      .defaultNow()
      .$onUpdate(() => sql`now()`)
      .notNull(),
  };
}
