CREATE TABLE todo(
  id SERIAL PRIMARY KEY NOT NULL,
  typetask VARCHAR(60) NOT NULL,
  title VARCHAR(80) NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);