CREATE TABLE IF NOT EXISTS `images`(
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `users`(
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `image_id` INT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL UNIQUE,
  `password` TEXT NOT NULL,
  `balance` INT(20) NOT NULL DEFAULT 0,
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

CREATE TABLE IF NOT EXISTS `transactions`(
  `id` iNT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `invoice_number` VARCHAR(20) NOT NULL UNIQUE,
  `transaction_type` VARCHAR(20) NOT NULL,
  `total_amount` INT(10) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- INSERT VALUES
INSERT INTO
  `images`(`name`)
VALUES
  ('dummy1.jpg'),
  ('dummy2.jpg'),
  ('dummy3.jpg'),
  ('dummy4.jpg'),
  ('dummy5.jpg'),
  ('dummy6.jpg'),
  ('dummy7.jpg'),
  ('dummy8.jpg'),
  ('dummy9.jpg'),
  ('dummy10.jpg'),
  ('dummy11.jpg'),
  ('dummy12.jpg'),
  ('dummy13.jpg'),
  ('dummy14.jpg'),
  ('dummy15.jpg'),
  ('dummy16.jpg'),
  ('dummy17.jpg'),
  ('dummy18.jpg');

INSERT INTO
  `users`(
    `image_id`,
    `first_name`,
    `last_name`,
    `email`,
    `password`
  )
VALUES
  (
    1,
    'Firman',
    'Perdana',
    'firman@mail.com',
    '$2b$10$tWvEO6P44.S/pKisZz1OQO1MAUiAhGXtOgtYiQtuBZgBmXfi9NiCa'
  );

INSERT INTO
  `banners`(
    `image_id`,
    `banner_name`,
    `description`
  )
VALUES
  (2, 'Banner 1', 'Lerem Ipsum Dolor sit amet'),
  (3, 'Banner 2', 'Lerem Ipsum Dolor sit amet'),
  (4, 'Banner 3', 'Lerem Ipsum Dolor sit amet'),
  (5, 'Banner 4', 'Lerem Ipsum Dolor sit amet'),
  (6, 'Banner 5', 'Lerem Ipsum Dolor sit amet');

INSERT INTO
  `services`(
    `image_id`,
    `service_code`,
    `service_name`,
    `service_tariff`
  )
VALUES
  (
    7,
    'PAJAK',
    'Pajak PBB',
    40000
  ),
  (
    8,
    'PLN',
    'Listrik',
    10000
  ),
  (
    9,
    'PDAM',
    'PDAM Berlangganan',
    10000
  ),
  (
    10,
    'PULSA',
    'Pulsa',
    40000
  ),
  (
    11,
    'PGN',
    'PGN Berlangganan',
    50000
  ),
  (
    12,
    'MUSIK',
    'Musik Berlangganan',
    50000
  ),
  (
    13,
    'TV',
    'TV Berlangganan',
    50000
  ),
  (
    14,
    'PAKET_DATA',
    'Paket data',
    50000
  ),
  (
    15,
    'VOUCHER_GAME',
    'Voucher Game',
    10000
  ),
  (
    16,
    'VOUCHER_MAKANAN',
    'Voucher Makanan',
    10000
  ),
  (
    17,
    'QURBAN',
    'Qurban',
    10000
  ),
  (
    18,
    'ZAKAT',
    'Zakat',
    10000
  );