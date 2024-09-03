CREATE TABLE IF NOT EXISTS `images`(
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `url` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `users`(
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `image_id` INT,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL UNIQUE,
  `password` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `banners`(
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `image_id` INT,
  `banner_name` VARCHAR(50) NOT NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `services`(
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `image_id` INT,
  `service_code` VARCHAR(25) NOT NULL UNIQUE,
  `service_name` VARCHAR(50) NOT NULL,
  `service_tariff` INT(10) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- INSERT VALUES
INSERT INTO
  `images`(`url`,)
VALUES
  ('https://nutech-integrasi.app/dummy.jpg'),
  ('https://nutech-integrasi.app/dummy.jpg'),
  ('https://nutech-integrasi.app/dummy.jpg'),
  ('https://nutech-integrasi.app/dummy.jpg');

INSERT INTO
  `users`(
    `image_id`,
    `first_name`,
    `last_name`,
    `email`,
    `password`,
  )
VALUES
  (
    1,
    'Firman',
    'Perdana',
    'firman@mail.com',
    '$2a$10$2DeHvuG4hrU3s4Ce3KsmrO0iRXXMgSwEB/D8iAE9F/kjlR0y2Sqhm'
  );