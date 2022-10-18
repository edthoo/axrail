CREATE DATABASE axrail;

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name TEXT,
  country_code TEXT,
  phone_no INTEGER
);

INSERT INTO contacts (name, country_code, phone_no)
VALUES ('test name', '+60', 121002000);