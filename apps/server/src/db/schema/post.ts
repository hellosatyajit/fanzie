import { pgTable, uuid, text, timestamp,primaryKey } from 'drizzle-orm/pg-core';
import { models } from './organization';
import { users } from './auth';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  modelId: uuid('model_id').references(() => models.id),
  content: text('content'),
  type: text('type', { enum: ['free', 'paid_once', 'member_only'] }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const postLikes = pgTable('post_likes', {
  userId: uuid('user_id').references(() => users.id),
  postId: uuid('post_id').references(() => posts.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  pk: primaryKey(t.userId, t.postId),
}));

export const postComments = pgTable('post_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').references(() => posts.id),
  userId: uuid('user_id').references(() => users.id),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow(),
});