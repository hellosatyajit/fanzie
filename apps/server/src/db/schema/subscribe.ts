import { pgTable, uuid, text, timestamp, numeric,primaryKey } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { models } from './organization';
import { posts } from './post';

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  modelId: uuid('model_id').references(() => models.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  paymentType: text('payment_type'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const paidPostUnlocks = pgTable('paid_post_unlocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  postId: uuid('post_id').references(() => posts.id),
  createdAt: timestamp('created_at').defaultNow(),
});
