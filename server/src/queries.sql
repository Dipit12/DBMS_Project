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

-- TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION log_change() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO AuditLogs(user_id, action, table_name, old_data, new_data)
  VALUES (current_setting('app.current_user')::INT, TG_OP, TG_TABLE_NAME, row_to_json(OLD), row_to_json(NEW));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS
CREATE TRIGGER product_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON Products
FOR EACH ROW EXECUTE FUNCTION log_change();

-- Insert base roles
INSERT INTO Roles(role_name) VALUES ('admin'), ('auditor'), ('dataentry'), ('guest');
