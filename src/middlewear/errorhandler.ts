import type { NextFunction, Request, Response } from "express";
import type { HttpError } from "../types/shared.types";

const errorHandler = (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors: Array<{ field: string; message: string }> | null = null;

  if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = "Validation error";
    errors = Object.values(err.errors).map((error) => {
      const typedError = error as { path?: string; message?: string };
      return {
        field: typedError.path || "field",
        message: typedError.message || "Invalid value"
      };
    });
  }

  if (err.code === 11000 && err.keyPattern) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase()}${field.slice(1)} already exists`;
    errors = [{ field, message: `This ${field} is already registered` }];
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
    errors = [{ field: err.path || "id", message: `Invalid value: ${String(err.value)}` }];
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please login again.";
  }

  const responseBody: {
    success: boolean;
    message: string;
    statusCode: number;
    errors?: Array<{ field: string; message: string }>;
    stack?: string;
  } = {
    success: false,
    message,
    statusCode
  };

  if (errors) {
    responseBody.errors = errors;
  }

  if (process.env.NODE_ENV === "development") {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
};

const createError = (statusCode: number, message: string) => {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  return error;
};

const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  createError,
  asyncHandler
};

