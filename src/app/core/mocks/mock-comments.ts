import { Comment } from '../models/comment.model';

export const MOCK_COMMENTS: Comment[] = [
  // Fight Club (m1)
  { id: 'c1', content: 'Una obra maestra del cine moderno. La dirección de Fincher es impecable.', score: 9, user: { id: 'u1', name: 'Carlos García', role: 'USER' }, movieId: 'm1', createdAt: '2024-01-15T10:30:00Z' },
  { id: 'c2', content: 'Narrativamente brillante, aunque algo pretenciosa en momentos.', score: 8, user: { id: 'u4', name: 'Ana Rodríguez', role: 'CRITIC' }, movieId: 'm1', createdAt: '2024-01-16T14:20:00Z' },

  // Pulp Fiction (m2)
  { id: 'c3', content: 'Tarantino en su mejor momento. Los diálogos son de otro nivel.', score: 10, user: { id: 'u2', name: 'María López', role: 'USER' }, movieId: 'm2', createdAt: '2024-02-01T09:15:00Z' },
  { id: 'c4', content: 'Revolucionó el cine independiente. La estructura narrativa es genial.', score: 9, user: { id: 'u5', name: 'Pedro Sánchez', role: 'CRITIC' }, movieId: 'm2', createdAt: '2024-02-02T11:00:00Z' },
  { id: 'c5', content: 'La vi 5 veces y sigo descubriendo detalles nuevos.', score: 9, user: { id: 'u3', name: 'Juan Martínez', role: 'USER' }, movieId: 'm2', createdAt: '2024-02-03T16:45:00Z' },

  // The Godfather (m3)
  { id: 'c6', content: 'La mejor película jamás hecha. Punto.', score: 10, user: { id: 'u1', name: 'Carlos García', role: 'USER' }, movieId: 'm3', createdAt: '2024-01-20T08:00:00Z' },
  { id: 'c7', content: 'Coppola creó algo eterno. La actuación de Brando es incomparable.', score: 10, user: { id: 'u4', name: 'Ana Rodríguez', role: 'CRITIC' }, movieId: 'm3', createdAt: '2024-01-21T12:30:00Z' },
  { id: 'c8', content: 'Un clásico que define el género. Imprescindible.', score: 9, user: { id: 'u5', name: 'Pedro Sánchez', role: 'CRITIC' }, movieId: 'm3', createdAt: '2024-01-22T15:00:00Z' },

  // Inception (m4)
  { id: 'c9', content: 'Nolan es un genio. Te vuela la cabeza en cada escena.', score: 9, user: { id: 'u2', name: 'María López', role: 'USER' }, movieId: 'm4', createdAt: '2024-03-05T10:00:00Z' },
  { id: 'c10', content: 'Visualmente espectacular con un guion que te mantiene pensando.', score: 8, user: { id: 'u4', name: 'Ana Rodríguez', role: 'CRITIC' }, movieId: 'm4', createdAt: '2024-03-06T14:00:00Z' },

  // The Dark Knight (m5)
  { id: 'c11', content: 'Heath Ledger como el Joker es lo mejor que he visto.', score: 10, user: { id: 'u3', name: 'Juan Martínez', role: 'USER' }, movieId: 'm5', createdAt: '2024-02-10T09:00:00Z' },
  { id: 'c12', content: 'Redefinió lo que puede ser una película de superhéroes.', score: 9, user: { id: 'u5', name: 'Pedro Sánchez', role: 'CRITIC' }, movieId: 'm5', createdAt: '2024-02-11T11:30:00Z' },
  { id: 'c13', content: 'La mejor película de Batman, sin duda alguna.', score: 9, user: { id: 'u1', name: 'Carlos García', role: 'USER' }, movieId: 'm5', createdAt: '2024-02-12T16:00:00Z' },

  // The Shawshank Redemption (m6)
  { id: 'c14', content: 'Una historia de esperanza que te llega al alma.', score: 10, user: { id: 'u2', name: 'María López', role: 'USER' }, movieId: 'm6', createdAt: '2024-01-25T08:30:00Z' },
  { id: 'c15', content: 'Freeman y Robbins tienen una química increíble.', score: 9, user: { id: 'u4', name: 'Ana Rodríguez', role: 'CRITIC' }, movieId: 'm6', createdAt: '2024-01-26T10:00:00Z' },

  // The Matrix (m7)
  { id: 'c16', content: 'Cambió la ciencia ficción para siempre. Icónica.', score: 9, user: { id: 'u1', name: 'Carlos García', role: 'USER' }, movieId: 'm7', createdAt: '2024-03-10T09:00:00Z' },
  { id: 'c17', content: 'Innovadora en efectos visuales, aunque la filosofía es algo superficial.', score: 8, user: { id: 'u5', name: 'Pedro Sánchez', role: 'CRITIC' }, movieId: 'm7', createdAt: '2024-03-11T13:00:00Z' },

  // Whiplash (m8)
  { id: 'c18', content: 'J.K. Simmons da miedo de lo bueno que está.', score: 9, user: { id: 'u3', name: 'Juan Martínez', role: 'USER' }, movieId: 'm8', createdAt: '2024-04-01T10:00:00Z' },
  { id: 'c19', content: 'Una obra maestra sobre la obsesión y el perfeccionismo.', score: 9, user: { id: 'u4', name: 'Ana Rodríguez', role: 'CRITIC' }, movieId: 'm8', createdAt: '2024-04-02T14:00:00Z' },

  // LOTR Fellowship (m9)
  { id: 'c20', content: 'La aventura épica definitiva. Peter Jackson es un maestro.', score: 9, user: { id: 'u2', name: 'María López', role: 'USER' }, movieId: 'm9', createdAt: '2024-02-15T10:00:00Z' },
  { id: 'c21', content: 'Adaptación magistral de Tolkien. Cada escena es una pintura.', score: 9, user: { id: 'u5', name: 'Pedro Sánchez', role: 'CRITIC' }, movieId: 'm9', createdAt: '2024-02-16T15:00:00Z' },

  // Parasite (m10)
  { id: 'c22', content: 'Bong Joon-ho es un genio. La tensión es insoportable.', score: 9, user: { id: 'u1', name: 'Carlos García', role: 'USER' }, movieId: 'm10', createdAt: '2024-03-20T09:00:00Z' },
  { id: 'c23', content: 'Merecidísimo el Oscar. Comentario social brillante envuelto en thriller.', score: 10, user: { id: 'u4', name: 'Ana Rodríguez', role: 'CRITIC' }, movieId: 'm10', createdAt: '2024-03-21T11:00:00Z' },

  // Spider-Verse (m11)
  { id: 'c24', content: 'La mejor película animada que he visto. El arte visual es increíble.', score: 9, user: { id: 'u3', name: 'Juan Martínez', role: 'USER' }, movieId: 'm11', createdAt: '2024-04-10T10:00:00Z' },
  { id: 'c25', content: 'Revoluciona la animación. Cada fotograma es arte puro.', score: 9, user: { id: 'u5', name: 'Pedro Sánchez', role: 'CRITIC' }, movieId: 'm11', createdAt: '2024-04-11T14:00:00Z' },

  // Dune (m12)
  { id: 'c26', content: 'Villeneuve logró lo imposible. La escala es impresionante.', score: 8, user: { id: 'u2', name: 'María López', role: 'USER' }, movieId: 'm12', createdAt: '2024-05-01T09:00:00Z' },
  { id: 'c27', content: 'Visualmente soberbia pero el ritmo puede ser lento para algunos.', score: 8, user: { id: 'u4', name: 'Ana Rodríguez', role: 'CRITIC' }, movieId: 'm12', createdAt: '2024-05-02T12:00:00Z' },

  // Psycho (m15)
  { id: 'c28', content: 'Hitchcock inventó el terror moderno con esta película.', score: 9, user: { id: 'u5', name: 'Pedro Sánchez', role: 'CRITIC' }, movieId: 'm15', createdAt: '2024-04-15T10:00:00Z' },
  { id: 'c29', content: 'Después de 60 años sigue dando escalofríos. Atemporal.', score: 8, user: { id: 'u1', name: 'Carlos García', role: 'USER' }, movieId: 'm15', createdAt: '2024-04-16T15:00:00Z' },

  // Oppenheimer (m20)
  { id: 'c30', content: 'Nolan vuelve a demostrar que es el mejor director actual.', score: 8, user: { id: 'u3', name: 'Juan Martínez', role: 'USER' }, movieId: 'm20', createdAt: '2024-05-10T10:00:00Z' },
  { id: 'c31', content: 'Cillian Murphy merece todos los premios. Actuación monumental.', score: 9, user: { id: 'u4', name: 'Ana Rodríguez', role: 'CRITIC' }, movieId: 'm20', createdAt: '2024-05-11T14:00:00Z' },

  // Barbie (m18)
  { id: 'c32', content: 'Mucho más profunda de lo que esperaba. Greta Gerwig es brillante.', score: 7, user: { id: 'u2', name: 'María López', role: 'USER' }, movieId: 'm18', createdAt: '2024-05-15T09:00:00Z' },
  { id: 'c33', content: 'Entretenida pero no alcanza la profundidad que pretende.', score: 7, user: { id: 'u5', name: 'Pedro Sánchez', role: 'CRITIC' }, movieId: 'm18', createdAt: '2024-05-16T11:00:00Z' },

  // Toy Story (m13)
  { id: 'c34', content: 'La película que inició todo. Pixar cambió el mundo de la animación.', score: 9, user: { id: 'u1', name: 'Carlos García', role: 'USER' }, movieId: 'm13', createdAt: '2024-06-01T10:00:00Z' },
  { id: 'c35', content: 'Un hito tecnológico y narrativo. Tom Hanks como Woody es perfecto.', score: 9, user: { id: 'u4', name: 'Ana Rodríguez', role: 'CRITIC' }, movieId: 'm13', createdAt: '2024-06-02T14:00:00Z' },
];
