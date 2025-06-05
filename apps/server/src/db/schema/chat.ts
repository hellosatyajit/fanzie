import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const conversationParticipants = pgTable('conversation_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id),
  participantId: uuid('participant_id'),
  participantType: text('participant_type', { enum: ['user', 'model'] }),
});

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id),
  senderId: uuid('sender_id'),
  senderType: text('sender_type', { enum: ['user', 'model'] }),
  message: text('message'),
  sentAt: timestamp('sent_at').defaultNow(),
});
