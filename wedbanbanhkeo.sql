-- Tạo CSDL
CREATE DATABASE IF NOT EXISTS WebBanBanhKeo1;
USE WebBanBanhKeo1;

-- Bảng Người Dùng
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('Hoạt động', 'Bị khóa') DEFAULT 'Hoạt động'
);

-- Bảng Danh Mục Sản Phẩm
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Bảng Sản Phẩm
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    category_id INT NOT NULL,
    description TEXT,
    stock INT DEFAULT 0 CHECK (stock >= 0),
    image_url VARCHAR(255) NOT NULL DEFAULT 'https://example.com/default.jpg',
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Bảng Đơn Hàng
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price > 0),
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'canceled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng Chi Tiết Đơn Hàng
CREATE TABLE order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Bảng Giỏ Hàng
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Bảng Thanh Toán
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    payment_method ENUM('credit_card', 'paypal', 'bank_transfer', 'cod') NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng Bình Luận
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    comment TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Thêm dữ liệu mẫu
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@shop.com', '$2a$10$hashedpassword', 'admin'),
('Nguyen Van A', 'a@example.com', '$2a$10$hashedpassword1', 'user'),
('Tran Thi B', 'b@example.com', '$2a$10$hashedpassword2', 'user');

INSERT INTO categories (name) VALUES 
('Bánh'), 
('Kẹo');

INSERT INTO products (name, price, category_id, description, stock, image_url) VALUES 
('Bánh quy', 50000, 1, 'Bánh quy giòn tan', 100, 'https://product.hstatic.net/200000459373/product/osifood__4__86ec385e42744770ae33a56186458a61_master.png'),
('Kẹo dẻo', 30000, 2, 'Kẹo dẻo trái cây', 200, 'https://example.com/default.jpg'),
('Bánh Trung Thu Ai Huê', 150000, 1, 'Bánh trung thu cao cấp từ thương hiệu Ai Huê', 50, 'https://trungthu.congquynh.vn/Uploads/banh-le/banh-trung-thu-ai-hue.jpg'),
('Kẹo Socola M&M\'s Milk 90g', 50000, 2, 'Kẹo socola M&M\'s hương vị sữa hộp 90g', 100, 'https://lanchi.vn/wp-content/uploads/2021/12/KEO-SOCOLA-MampMS-MILK-90G-.jpg');

INSERT INTO orders (user_id, total_price, status) VALUES 
(2, 80000, 'pending'),
(3, 100000, 'pending');

INSERT INTO order_details (order_id, product_id, quantity, price) VALUES 
(1, 1, 2, 50000),
(1, 2, 1, 30000);

INSERT INTO cart (user_id, product_id, quantity) VALUES 
(2, 1, 2),
(3, 2, 1),
(1, 1, 2);

INSERT INTO payments (order_id, user_id, amount, payment_method, status) VALUES 
(1, 2, 80000, 'credit_card', 'completed'),
(2, 3, 100000, 'paypal', 'pending');

-- Trigger cập nhật trạng thái đơn hàng sau khi thanh toán hoàn thành
DELIMITER //
CREATE TRIGGER after_payment_completed
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' THEN
        UPDATE orders 
        SET status = 'confirmed'
        WHERE id = NEW.order_id;
    END IF;
END;
//
DELIMITER ;

-- Cập nhật quyền admin
UPDATE users SET role = 'admin' WHERE email = 'admin1@gmail.com';
UPDATE users SET role = 'admin' WHERE email = 'useu1use01@example.com';

-- Xóa giỏ hàng của user_id = 4
DELETE FROM cart WHERE user_id = 4;

-- Hiển thị danh sách bảng
SHOW TABLES;
SET SQL_SAFE_UPDATES = 0;

-- Kiểm tra dữ liệu
SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM products;
SELECT * FROM orders;
SELECT * FROM order_details;
SELECT * FROM cart;
SELECT * FROM payments;
SELECT * FROM comments;

-- Lọc dữ liệu cụ thể
SELECT * FROM cart WHERE user_id = 2;
SELECT id, name, stock FROM products WHERE id IN (1, 3);
SELECT c.product_id, p.name, c.quantity, p.price, 
       (c.quantity * p.price) AS total_price, p.image_url
FROM cart c 
JOIN products p ON c.product_id = p.id 
WHERE c.user_id = 2;
SELECT * FROM cart WHERE user_id = 1;
