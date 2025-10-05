import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

const buildNoteSearchFilter = ({ tag, search }) => {
  const filter = {};
  if (tag) filter.tag = tag;

  if (search && search.trim()) {
    const safeInput = search.trim().slice(0, 100);
    const escaped = safeInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    filter.$or = [{ title: regex }, { content: regex }];
  }
  return filter;
};

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10 } = req.query;
    const skip = (page - 1) * perPage;
    const filter = buildNoteSearchFilter(req.query);

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(filter),
      Note.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean(),
    ]);
    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId).lean();
    if (!note) return next(createHttpError(404, 'Note not found'));
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!note) return next(createHttpError(404, 'Note not found'));
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findOneAndDelete({ _id: noteId });
    if (!note) return next(createHttpError(404, 'Note not found'));
    res.status(200).json(note);
    // res.status(204).send();
  } catch (err) {
    next(err);
  }
};
