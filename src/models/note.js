import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: false, default: '', trim: true },
    tag: {
      type: String,
      required: false,
      enum: [...TAGS],
      default: 'Todo',
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

noteSchema.index(
  { title: 'text', content: 'text' },
  {
    name: 'NoteTextIndex',
    weights: { title: 5, content: 1 },
    default_language: 'english',
  },
);

noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, tag: 1, createdAt: -1 });

export const Note = model('Note', noteSchema);
