import { pgTable, uuid, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  creatorId: uuid('creator_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const models = pgTable('models', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const modelModerators = pgTable('model_moderators', {
  modelId: uuid('model_id').references(() => models.id),
  moderatorId: uuid('moderator_id').references(() => users.id),
}, (t) => ({
  pk: primaryKey(t.modelId, t.moderatorId),
}));
