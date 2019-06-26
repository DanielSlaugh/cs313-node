CREATE TABLE person
(
   id SERIAL NOT NULL PRIMARY KEY,
   first_name VARCHAR(100) NOT NULL,
   last_name VARCHAR(100) NOT NULL,
   birth_date date
);

CREATE TABLE relation
(
   id SERIAL NOT NULL PRIMARY KEY,
   p_id VARCHAR(100) NOT NULL REFERENCES person(id),
   p_relative VARCHAR(100) NOT NULL REFERENCES person(id)

);

INSERT INTO person(first_name, last_name, birth_date) VALUES
  ('Thomas', 'Burton', '1878-08-28'),
  ('Herbert', 'Burton', '1847-10-01'),
  ('Mary', 'Pass', '1849-08-06');