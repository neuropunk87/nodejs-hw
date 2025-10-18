import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import { searchRateLimiter } from '../middleware/rateLimitSearch.js';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.use('/notes', authenticate);

router.get(
  '/notes',
  celebrate(getAllNotesSchema),
  searchRateLimiter,
  ctrlWrapper(getAllNotes),
);
router.get('/notes/:noteId', celebrate(noteIdSchema), ctrlWrapper(getNoteById));
router.post('/notes', celebrate(createNoteSchema), ctrlWrapper(createNote));
router.patch(
  '/notes/:noteId',
  celebrate(updateNoteSchema),
  ctrlWrapper(updateNote),
);
router.delete(
  '/notes/:noteId',
  celebrate(noteIdSchema),
  ctrlWrapper(deleteNote),
);

export default router;
