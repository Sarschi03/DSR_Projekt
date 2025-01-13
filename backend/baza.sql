-- Create the database
CREATE DATABASE IF NOT EXISTS developer_app;
USE developer_app;

-- Create the users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    github_username VARCHAR(100) DEFAULT NULL,
    role ENUM('front_end', 'back_end', 'game_dev', 'full_stack', 'ui_ux') NOT NULL,
    profile_image_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the projects table
CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create the messages table
CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Insert sample users
-- Insert sample users with hashed passwords
INSERT INTO users (first_name, last_name, email, password, github_username, role, profile_image_url)
VALUES
('John', 'Doe', 'john.doe@example.com', '$2y$10$1vHCP5jId3Ohu46pZkNT5.g0hMfS8kxq3oQ5K8tll5bu7BqV1v6Cq', 'john-doe', 'front_end', 'https://example.com/images/project1.png'),
('Jane', 'Smith', 'jane.smith@example.com', '$2y$10$okFAIaXXPdl9slDkJY94zBi1sYoFeN1U4tH10pdE5PR5dG5LCZ3Fi', 'jane-smith', 'back_end', 'https://example.com/images/project2.png'),
('Alice', 'Johnson', 'alice.johnson@example.com', '$2y$10$swGb4.yOczqznsVX7nlp5uu9DLH7aGdScwQNRBzR5Snl7FpoTqe8u', NULL, 'ui_ux', 'https://example.com/images/project3.png'),
('Bob', 'Brown', 'bob.brown@example.com', '$2y$10$M4dHwviy7uHf8DA8UwzoGpnMHMpxgpIjpW9N1AnWjC5myYUw9ZkNa', 'bob-brown', 'full_stack', 'https://example.com/images/project4.png');


-- Insert sample projects
INSERT INTO projects (user_id, title, description, image_url)
VALUES
(1, 'Portfolio Website', 'A modern portfolio for showcasing my frontend skills.', 'https://example.com/images/portfolio.png'),
(2, 'API Backend', 'A robust backend API for e-commerce applications.', 'https://example.com/images/api.png'),
(3, 'Mobile App Design', 'A sleek design for a cross-platform mobile app.', 'https://example.com/images/design.png'),
(4, 'Full-stack Blog', 'A blog application with a fully-featured frontend and backend.', 'https://example.com/images/blog.png');

-- Insert sample messages
INSERT INTO messages (sender_id, receiver_id, message_text)
VALUES
(1, 2, 'Hi Jane, I love your API project. Are you open to collaboration?'),
(2, 1, 'Thanks, John! I’d love to discuss it further. Let’s connect.'),
(3, 4, 'Hey Bob, your blog project looks amazing. Do you need help with UI design?'),
(4, 3, 'Thanks, Alice! I might need some input on making it more user-friendly.');
