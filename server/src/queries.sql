CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE Roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE UserRoles (
    user_id INT REFERENCES Users(user_id),
    role_id INT REFERENCES Roles(role_id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE AuditLogs (
    log_id SERIAL PRIMARY KEY,
    user_id INT,
    action TEXT,
    table_name TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_data JSONB,
    new_data JSONB
);

CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,
    name TEXT,
    price NUMERIC
);

DROP TRIGGER IF EXISTS product_change_trigger ON Products;
DROP FUNCTION IF EXISTS log_change();


-- Insert base roles
INSERT INTO Roles(role_name) VALUES ('admin'), ('auditor'), ('dataentry'), ('guest');
