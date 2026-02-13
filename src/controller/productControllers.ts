import type { Request, Response } from "express";
import type { AuthenticatedRequest, NotePayload, NotesQueryParams } from "../types/shared.types";

const { createError, asyncHandler } = require("../middleware/errorHandler");
const {
  listNotesService,
  getNoteByIdService,
  createNoteService,
  updateNoteService,
  deleteNoteService,
  getNotesStatsService
} = require("../services/notesService");

const getAllNotes = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.userId) {
    throw createError(401, "Authentication required");
  }

  const data = await listNotesService(String(authReq.userId), req.query as NotesQueryParams);

  res.status(200).json({
    success: true,
    message: "Notes retrieved successfully",
    data
  });
});

const getNoteById = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const note = await getNoteByIdService(req.params.id, String(authReq.userId));

  if (!note) {
    throw createError(404, "Note not found");
  }

  if (note === "forbidden") {
    throw createError(403, "You are not authorized to access this note");
  }

  res.status(200).json({
    success: true,
    message: "Note retrieved successfully",
    data: { note }
  });
});

const createNote = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const payload = req.body as NotePayload;

  if (!payload.title || !payload.content) {
    throw createError(400, "Title and content are required");
  }

  const note = await createNoteService(String(authReq.userId), payload);

  res.status(201).json({
    success: true,
    message: "Note created successfully",
    data: { note }
  });
});

const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const payload = req.body as NotePayload;
  const result = await updateNoteService(req.params.id, String(authReq.userId), payload);

  if (!result) {
    throw createError(404, "Note not found");
  }

  if (result === "forbidden") {
    throw createError(403, "You are not authorized to update this note");
  }

  res.status(200).json({
    success: true,
    message: "Note updated successfully",
    data: { note: result }
  });
});

const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const result = await deleteNoteService(req.params.id, String(authReq.userId));

  if (!result) {
    throw createError(404, "Note not found");
  }

  if (result === "forbidden") {
    throw createError(403, "You are not authorized to delete this note");
  }

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
    data: null
  });
});

const getNotesStats = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const data = await getNotesStatsService(String(authReq.userId));

  res.status(200).json({
    success: true,
    data
  });
});

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNotesStats
};

