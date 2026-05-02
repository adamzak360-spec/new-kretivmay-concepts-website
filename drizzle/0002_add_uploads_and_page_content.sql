CREATE TABLE `uploads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`contentType` varchar(100) NOT NULL,
	`data` longtext NOT NULL,
	`size` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `uploads_id` PRIMARY KEY(`id`),
	CONSTRAINT `uploads_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `page_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`page` varchar(100) NOT NULL,
	`section` varchar(100) NOT NULL,
	`content` json NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `page_content_id` PRIMARY KEY(`id`)
);
