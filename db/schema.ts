import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const contactMessages = sqliteTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: integer('created_at').notNull(),
  senderHash: text('sender_hash').notNull(),
}, (table) => [index('contact_created_idx').on(table.createdAt), index('contact_sender_idx').on(table.senderHash, table.createdAt)]);
