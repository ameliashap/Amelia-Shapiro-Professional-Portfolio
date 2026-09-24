CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer NOT NULL,
	`sender_hash` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contact_created_idx` ON `contact_messages` (`created_at`);--> statement-breakpoint
CREATE INDEX `contact_sender_idx` ON `contact_messages` (`sender_hash`,`created_at`);