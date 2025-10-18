import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getAllNotes = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    tag,
    search,
    searchMode = 'text',
  } = req.query;
  const skip = (page - 1) * perPage;

  const filter = { userId: req.user._id };
  if (tag) filter.tag = tag;

  let projection;
  let sort = { createdAt: -1 };
  const hasSearch = Boolean(search);

  if (hasSearch) {
    if (searchMode === 'contains') {
      const regex = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ title: regex }, { content: regex }];
    } else {
      filter.$text = { $search: search };
      projection = { score: { $meta: 'textScore' } };
      sort = { score: { $meta: 'textScore' }, createdAt: -1 };
    }
  }

  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(filter),
    Note.find(filter, projection).sort(sort).skip(skip).limit(perPage).lean(),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
    searchMode: hasSearch ? searchMode : 'none',
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  }).lean();

  if (!note) throw createHttpError(404, 'Note not found');

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!note) throw createHttpError(404, 'Note not found');

  res.status(200).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) throw createHttpError(404, 'Note not found');

  res.status(200).json(note);
  // res.status(204).send();
};
