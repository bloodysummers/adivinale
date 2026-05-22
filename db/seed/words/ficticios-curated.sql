-- ficticios-curated.sql
-- Category: personajes-ficticios
-- Total: 49 rows
-- Sub-lotes: Superhéroes (8), Personajes de cine (9), Personajes de TV (11),
--            Personajes literarios (16), Animación (5)

INSERT INTO words (category_id, text, language, subtext, subcategory) VALUES

  -- =====================================================================
  -- Superhéroes (8)
  -- =====================================================================
  ('personajes-ficticios', 'Batman', 'es', NULL, 'Superhéroes'),
  ('personajes-ficticios', 'Superman', 'es', NULL, 'Superhéroes'),
  ('personajes-ficticios', 'Spider-Man', 'es', NULL, 'Superhéroes'),
  ('personajes-ficticios', 'Wonder Woman', 'es', NULL, 'Superhéroes'),
  ('personajes-ficticios', 'Iron Man', 'es', NULL, 'Superhéroes'),
  ('personajes-ficticios', 'Wolverine', 'es', NULL, 'Superhéroes'),
  ('personajes-ficticios', 'Joker', 'es', NULL, 'Superhéroes'),
  ('personajes-ficticios', 'Catwoman', 'es', NULL, 'Superhéroes'),

  -- =====================================================================
  -- Personajes de cine (9)
  -- =====================================================================
  ('personajes-ficticios', 'James Bond', 'es', NULL, 'Personajes de cine'),
  ('personajes-ficticios', 'Indiana Jones', 'es', NULL, 'Personajes de cine'),
  ('personajes-ficticios', 'Jack Sparrow', 'es', NULL, 'Personajes de cine'),
  ('personajes-ficticios', 'Forrest Gump', 'es', NULL, 'Personajes de cine'),
  ('personajes-ficticios', 'Darth Vader', 'es', NULL, 'Personajes de cine'),
  ('personajes-ficticios', 'Luke Skywalker', 'es', NULL, 'Personajes de cine'),
  ('personajes-ficticios', 'El Zorro', 'es', NULL, 'Personajes de cine'),
  ('personajes-ficticios', 'El Llanero Solitario', 'es', NULL, 'Personajes de cine'),
  ('personajes-ficticios', 'Hannibal Lecter', 'es', NULL, 'Personajes de cine'),

  -- =====================================================================
  -- Personajes de TV (11)
  -- =====================================================================
  ('personajes-ficticios', 'El Chapulin Colorado', 'es', NULL, 'Personajes de TV'),
  ('personajes-ficticios', 'El Chavo del 8', 'es', NULL, 'Personajes de TV'),
  ('personajes-ficticios', 'Walter White', 'es', NULL, 'Personajes de TV'),
  ('personajes-ficticios', 'Tony Soprano', 'es', NULL, 'Personajes de TV'),
  ('personajes-ficticios', 'Tyrion Lannister', 'es', NULL, 'Personajes de TV'),
  ('personajes-ficticios', 'Jon Snow', 'es', NULL, 'Personajes de TV'),
  ('personajes-ficticios', 'Daenerys Targaryen', 'es', NULL, 'Personajes de TV'),
  ('personajes-ficticios', 'Arya Stark', 'es', NULL, 'Personajes de TV'),
  ('personajes-ficticios', 'James T. Kirk', 'es', NULL, 'Personajes de TV'),
  ('personajes-ficticios', 'Spock', 'es', NULL, 'Personajes de TV'),
  ('personajes-ficticios', 'Hannibal', 'es', NULL, 'Personajes de TV'),

  -- =====================================================================
  -- Personajes literarios (16)
  -- =====================================================================
  ('personajes-ficticios', 'Sherlock Holmes', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Harry Potter', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Frodo Baggins', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Gandalf', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Hermione Granger', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Don Quijote de la Mancha', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Jay Gatsby', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Atticus Finch', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Huckleberry Finn', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Elizabeth Bennet', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Dorian Gray', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Lisbeth Salander', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Robin Hood', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Tarzan', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Dracula', 'es', NULL, 'Personajes literarios'),
  ('personajes-ficticios', 'Frankenstein', 'es', NULL, 'Personajes literarios'),

  -- =====================================================================
  -- Animación (5)
  -- =====================================================================
  ('personajes-ficticios', 'Snoopy', 'es', NULL, 'Animación'),
  ('personajes-ficticios', 'Mickey Mouse', 'es', NULL, 'Animación'),
  ('personajes-ficticios', 'Bugs Bunny', 'es', NULL, 'Animación'),
  ('personajes-ficticios', 'Homer Simpson', 'es', NULL, 'Animación'),
  ('personajes-ficticios', 'Bart Simpson', 'es', NULL, 'Animación')

ON CONFLICT DO NOTHING;
