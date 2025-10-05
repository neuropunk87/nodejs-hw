import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().max(100).allow(''),
  }),
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(100).required().messages({
      'string.base': 'Title must be a string',
      'string.max': 'Title should have at most {#limit} characters',
      'any.required': 'Title is required',
    }),
    content: Joi.string().max(1000).allow('').messages({
      'string.base': 'Content must be a string',
      'string.max': 'Content should have at most {#limit} characters',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .required()
      .messages({
        'any.only': `Tag must be one of the following: ${TAGS.join(', ')}`,
        'any.required': 'Tag is required',
      }),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(100).messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least {#limit} characters',
      'string.max': 'Title should have at most {#limit} characters',
    }),
    content: Joi.string().max(1000).allow('').messages({
      'string.base': 'Content must be a string',
      'string.max': 'Content should have at most {#limit} characters',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'any.only': `Tag must be one of the following: ${TAGS.join(', ')}`,
      }),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided for update',
    }),
};
