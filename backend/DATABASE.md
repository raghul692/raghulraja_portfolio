# Portfolio Database Schema

## contact_submissions

Stores contact form submissions from the portfolio website.

```sql
CREATE TABLE contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

## Setup Instructions

1. Install MySQL
2. Create database: `CREATE DATABASE portfolio;`
3. Update `.env` with your MySQL credentials
4. Run backend: `uvicorn main:app --reload`
5. The table will be created automatically on startup