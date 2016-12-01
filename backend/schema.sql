DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id  SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  year INTEGER NOT NULL
);

DROP TABLE IF EXISTS book_genres;

CREATE TABLE book_genres (
  book_id  INTEGER NOT NULL,
  genre_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS book_authors;

CREATE TABLE book_authors (
  book_id  INTEGER NOT NULL,
  author_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  id  SERIAL PRIMARY KEY ,
  name VARCHAR NOT NULL
);

DROP TABLE IF EXISTS genres;

CREATE TABLE genres (
  id  SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);
-- INSERT INTO books (title, author, year, genres) VALUES
--   ('The Handmaid Tale', 'Margaret Atwood', 1985, 'Sci-fi'),
--   ('More Than Human', 'Theodore Sturgeon', 1953, 'Sci-fi'),
--   ('Second Foundation', 'Isaac Asimov', 1953, 'Sci-fi'),
--   ('I Am Legend', 'Richard Matheson', 1954, 'Sci-fi'),
--   ('Kindred', 'Octavia E. Butler', 1979, 'Sci-fi'),
--   ('The Caves of Steel', 'Isaac Asimov', 1953, 'Sci-fi');
