DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  year INT,
  genres VARCHAR(255)
);

INSERT INTO books (title, author, year, genres) VALUES
  ('The Handmaid Tale', 'Margaret Atwood', 1985, 'Sci-fi'),
  ('More Than Human', 'Theodore Sturgeon', 1953, 'Sci-fi'),
  ('Second Foundation', 'Isaac Asimov', 1953, 'Sci-fi'),
  ('I Am Legend', 'Richard Matheson', 1954, 'Sci-fi'),
  ('Kindred', 'Octavia E. Butler', 1979, 'Sci-fi'),
  ('The Caves of Steel', 'Isaac Asimov', 1953, 'Sci-fi');
