// Ejecutar desde lorers_back/: node seed.js
// Crea 10 usuarios, 20 eventos y participación cruzada entre ellos.
// Contraseña de todos los usuarios: Password123

import bcrypt from 'bcryptjs';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host:     'localhost',
  database: 'mi_proyecto_db',
  user:     'admin',
  password: 'MiPassword456',
  port:     5432,
});

// ─── Datos de usuarios ────────────────────────────────────────────────────────

const USERS = [
  { name: 'Ana Torres',     username: 'ana_torres'   },
  { name: 'Luis Ramírez',   username: 'luis_ramirez' },
  { name: 'Sofía Herrera',  username: 'sofia_h'      },
  { name: 'Carlos Mendez',  username: 'carlos_m'     },
  { name: 'Valentina Gil',  username: 'vale_gil'     },
  { name: 'Diego Vargas',   username: 'diego_v'      },
  { name: 'Mariana López',  username: 'mariana_l'    },
  { name: 'Andrés Ruiz',    username: 'andres_r'     },
  { name: 'Camila Ortiz',   username: 'camila_o'     },
  { name: 'Sebastián Mora', username: 'seba_mora'    },
];

// ─── Datos de eventos ─────────────────────────────────────────────────────────
// creator_index = índice en el array de usuarios (0-based)

const EVENTS = [
  {
    name: 'Hackathon Bogotá 2026',
    description: 'Competencia de desarrollo de software de 48 horas. Equipos de hasta 4 personas.',
    creator_index: 0,
    start: '2026-04-10T08:00:00',
    end:   '2026-04-12T08:00:00',
    address: 'Centro de Convenciones Ágora, Bogotá',
    latitude: 4.6565, longitude: -74.0942,
    max_participants: 80,
  },
  {
    name: 'Taller de Angular Avanzado',
    description: 'Workshop de 6 horas sobre signals, standalone components y lazy loading.',
    creator_index: 1,
    start: '2026-04-15T09:00:00',
    end:   '2026-04-15T15:00:00',
    address: 'Espacio LaboTIC, Calle 72 # 10-07, Bogotá',
    latitude: 4.6609, longitude: -74.0535,
    max_participants: 30,
  },
  {
    name: 'Concierto Jazz en el Parque',
    description: 'Tarde de jazz con músicos locales. Entrada libre, lleva tu manta.',
    creator_index: 2,
    start: '2026-04-20T15:00:00',
    end:   '2026-04-20T20:00:00',
    address: 'Parque Simón Bolívar, Bogotá',
    latitude: 4.6585, longitude: -74.0939,
    max_participants: null,
  },
  {
    name: 'Carrera 5K Ambiental',
    description: 'Corremos por el medio ambiente. Inscripción incluye kit del corredor.',
    creator_index: 3,
    start: '2026-04-26T06:30:00',
    end:   '2026-04-26T10:00:00',
    address: 'Ciclovía Av. El Dorado, Bogotá',
    latitude: 4.6563, longitude: -74.1002,
    max_participants: 200,
  },
  {
    name: 'Meetup Node.js Medellín',
    description: 'Charlas técnicas sobre Node.js, Express y arquitecturas event-driven.',
    creator_index: 4,
    start: '2026-04-18T18:00:00',
    end:   '2026-04-18T21:00:00',
    address: 'Ruta N, Calle 67 # 52A-02, Medellín',
    latitude: 6.2534, longitude: -75.5636,
    max_participants: 50,
  },
  {
    name: 'Exposición de Arte Digital',
    description: 'Muestra de arte generativo e instalaciones interactivas con IA.',
    creator_index: 5,
    start: '2026-05-02T10:00:00',
    end:   '2026-05-04T18:00:00',
    address: 'Museo de Arte Moderno, Bogotá',
    latitude: 4.6478, longitude: -74.0604,
    max_participants: null,
  },
  {
    name: 'Taller de Fotografía Urbana',
    description: 'Recorrido fotográfico por La Candelaria. Trae tu cámara o celular.',
    creator_index: 6,
    start: '2026-05-08T07:00:00',
    end:   '2026-05-08T12:00:00',
    address: 'Plaza de Bolívar, Bogotá',
    latitude: 4.5981, longitude: -74.0762,
    max_participants: 20,
  },
  {
    name: 'Conferencia UX/UI Design',
    description: 'Speakers nacionales e internacionales sobre diseño centrado en el usuario.',
    creator_index: 7,
    start: '2026-05-14T08:30:00',
    end:   '2026-05-14T17:30:00',
    address: 'Hotel Tequendama, Bogotá',
    latitude: 4.6095, longitude: -74.0728,
    max_participants: 150,
  },
  {
    name: 'Festival Gastronómico Cali',
    description: 'Lo mejor de la gastronomía vallecaucana. Stands, demostraciones y concursos.',
    creator_index: 8,
    start: '2026-05-17T11:00:00',
    end:   '2026-05-17T22:00:00',
    address: 'Bulevar del Río, Cali',
    latitude: 3.4516, longitude: -76.5320,
    max_participants: null,
  },
  {
    name: 'Bootcamp Python Data Science',
    description: 'Tres días intensivos: pandas, matplotlib, scikit-learn. Incluye certificado.',
    creator_index: 9,
    start: '2026-05-20T08:00:00',
    end:   '2026-05-22T17:00:00',
    address: 'Campus UniAndes, Bogotá',
    latitude: 4.6018, longitude: -74.0659,
    max_participants: 40,
  },
  {
    name: 'Ciclopaseo Nocturno',
    description: 'Ruta de 20km por la ciudad iluminada. Gratis, lleva luces en tu bici.',
    creator_index: 0,
    start: '2026-04-25T20:00:00',
    end:   '2026-04-25T23:30:00',
    address: 'Parque de la 93, Bogotá',
    latitude: 4.6762, longitude: -74.0489,
    max_participants: null,
  },
  {
    name: 'Charla Startups & Funding',
    description: 'Inversores ángel y fundadores comparten experiencias en levantamiento de capital.',
    creator_index: 1,
    start: '2026-05-05T18:30:00',
    end:   '2026-05-05T21:00:00',
    address: 'WeWork Andino, Bogotá',
    latitude: 4.6676, longitude: -74.0528,
    max_participants: 60,
  },
  {
    name: 'Torneo de Ajedrez Online',
    description: 'Torneo suizo de 7 rondas en lichess.org. Categorías libre y sub-1800.',
    creator_index: 2,
    start: '2026-05-10T10:00:00',
    end:   '2026-05-10T18:00:00',
    address: 'Virtual — lichess.org/tournament',
    latitude: null, longitude: null,
    max_participants: 64,
  },
  {
    name: 'Yoga y Meditación al Aire Libre',
    description: 'Sesión de yoga Vinyasa + meditación guiada. Trae tu mat.',
    creator_index: 3,
    start: '2026-04-13T07:00:00',
    end:   '2026-04-13T09:00:00',
    address: 'Parque Metropolitano Timiza, Bogotá',
    latitude: 4.5814, longitude: -74.1355,
    max_participants: 25,
  },
  {
    name: 'Noche de Micropoesía',
    description: 'Lee o escucha poesía en formato micro. Máximo 3 minutos por poeta.',
    creator_index: 4,
    start: '2026-05-23T19:00:00',
    end:   '2026-05-23T22:00:00',
    address: 'Librería Lerner, Av. Jiménez, Bogotá',
    latitude: 4.5998, longitude: -74.0759,
    max_participants: null,
  },
  {
    name: 'Workshop Docker & Kubernetes',
    description: 'Hands-on: contenedores, orquestación y despliegue en la nube.',
    creator_index: 5,
    start: '2026-05-28T09:00:00',
    end:   '2026-05-28T17:00:00',
    address: 'Loft Coworking, Carrera 15, Bogotá',
    latitude: 4.6648, longitude: -74.0535,
    max_participants: 24,
  },
  {
    name: 'Feria de Emprendimiento Juvenil',
    description: 'Stands de proyectos universitarios, pitches y networking.',
    creator_index: 6,
    start: '2026-06-04T09:00:00',
    end:   '2026-06-04T16:00:00',
    address: 'Universidad Nacional de Colombia, Bogotá',
    latitude: 4.6359, longitude: -74.0836,
    max_participants: null,
  },
  {
    name: 'Cine Foro: Inteligencia Artificial',
    description: 'Proyección de "Ex Machina" seguida de foro con expertos en IA.',
    creator_index: 7,
    start: '2026-05-30T17:00:00',
    end:   '2026-05-30T21:00:00',
    address: 'Cinemateca Distrital, Bogotá',
    latitude: 4.6091, longitude: -74.0799,
    max_participants: 80,
  },
  {
    name: 'Retiro de Escritura Creativa',
    description: 'Fin de semana de escritura, técnicas narrativas y feedback grupal.',
    creator_index: 8,
    start: '2026-06-06T16:00:00',
    end:   '2026-06-08T12:00:00',
    address: 'Hacienda La Danza, Subachoque, Cundinamarca',
    latitude: 4.9285, longitude: -74.1659,
    max_participants: 15,
  },
  {
    name: 'Demo Day Proyectos IoT',
    description: 'Estudiantes y makers presentan sus proyectos de Internet de las Cosas.',
    creator_index: 9,
    start: '2026-06-12T14:00:00',
    end:   '2026-06-12T18:00:00',
    address: 'Fab Lab Bogotá, Carrera 7 # 155-30',
    latitude: 4.7258, longitude: -74.0440,
    max_participants: 50,
  },
];

// ─── Participaciones: [event_index, user_index] ───────────────────────────────
// Regla: el usuario NO puede unirse a un evento que creó.

const PARTICIPATIONS = [
  // Hackathon Bogotá — creador: 0 (ana)
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],

  // Taller Angular — creador: 1 (luis)
  [1, 0], [1, 2], [1, 7], [1, 8],

  // Concierto Jazz — creador: 2 (sofia)
  [2, 0], [2, 1], [2, 3], [2, 9],

  // Carrera 5K — creador: 3 (carlos)
  [3, 0], [3, 4], [3, 5], [3, 6], [3, 7],

  // Meetup Node.js — creador: 4 (valentina)
  [4, 1], [4, 2], [4, 3], [4, 9],

  // Exposición Arte — creador: 5 (diego)
  [5, 0], [5, 2], [5, 6], [5, 8],

  // Taller Fotografía — creador: 6 (mariana)
  [6, 1], [6, 4], [6, 7], [6, 9],

  // Conferencia UX — creador: 7 (andres)
  [7, 0], [7, 2], [7, 5], [7, 6], [7, 8],

  // Festival Gastronómico — creador: 8 (camila)
  [8, 1], [8, 3], [8, 5], [8, 7], [8, 9],

  // Bootcamp Python — creador: 9 (sebastian)
  [9, 0], [9, 2], [9, 4], [9, 6],

  // Ciclopaseo — creador: 0 (ana)
  [10, 1], [10, 3], [10, 5], [10, 7], [10, 9],

  // Charla Startups — creador: 1 (luis)
  [11, 0], [11, 4], [11, 6], [11, 8],

  // Torneo Ajedrez — creador: 2 (sofia)
  [12, 0], [12, 3], [12, 5], [12, 7], [12, 9],

  // Yoga — creador: 3 (carlos)
  [13, 1], [13, 2], [13, 6], [13, 8],

  // Micropoesía — creador: 4 (valentina)
  [14, 0], [14, 3], [14, 5], [14, 9],

  // Docker & K8s — creador: 5 (diego)
  [15, 1], [15, 2], [15, 4], [15, 7],

  // Feria Emprendimiento — creador: 6 (mariana)
  [16, 0], [16, 3], [16, 5], [16, 8], [16, 9],

  // Cine Foro IA — creador: 7 (andres)
  [17, 1], [17, 4], [17, 6], [17, 9],

  // Retiro Escritura — creador: 8 (camila)
  [18, 0], [18, 2], [18, 4], [18, 6],

  // Demo Day IoT — creador: 9 (sebastian)
  [19, 1], [19, 3], [19, 5], [19, 7], [19, 8],
];

// ─── Likes: [event_index, user_index] ────────────────────────────────────────
// Regla: el usuario NO puede dar like a un evento que creó.

const LIKES = [
  // Hackathon Bogotá — creador: 0
  [0, 1], [0, 2], [0, 3], [0, 5], [0, 7], [0, 9],

  // Taller Angular — creador: 1
  [1, 0], [1, 2], [1, 4], [1, 8],

  // Concierto Jazz — creador: 2
  [2, 0], [2, 1], [2, 4], [2, 6], [2, 8], [2, 9],

  // Carrera 5K — creador: 3
  [3, 0], [3, 2], [3, 6], [3, 8],

  // Meetup Node.js — creador: 4
  [4, 1], [4, 3], [4, 5], [4, 7], [4, 9],

  // Exposición Arte — creador: 5
  [5, 0], [5, 2], [5, 4], [5, 6], [5, 8],

  // Taller Fotografía — creador: 6
  [6, 1], [6, 3], [6, 5], [6, 9],

  // Conferencia UX — creador: 7
  [7, 0], [7, 2], [7, 4], [7, 6], [7, 8], [7, 9],

  // Festival Gastronómico — creador: 8
  [8, 1], [8, 3], [8, 5], [8, 7],

  // Bootcamp Python — creador: 9
  [9, 0], [9, 2], [9, 4], [9, 6], [9, 8],

  // Ciclopaseo — creador: 0
  [10, 1], [10, 3], [10, 5], [10, 7],

  // Charla Startups — creador: 1
  [11, 0], [11, 2], [11, 4], [11, 6], [11, 9],

  // Torneo Ajedrez — creador: 2
  [12, 1], [12, 3], [12, 5], [12, 7],

  // Yoga — creador: 3
  [13, 0], [13, 2], [13, 4], [13, 6], [13, 8], [13, 9],

  // Micropoesía — creador: 4
  [14, 0], [14, 3], [14, 7], [14, 9],

  // Docker & K8s — creador: 5
  [15, 1], [15, 3], [15, 6], [15, 8], [15, 9],

  // Feria Emprendimiento — creador: 6
  [16, 0], [16, 2], [16, 4], [16, 7],

  // Cine Foro IA — creador: 7
  [17, 0], [17, 2], [17, 5], [17, 8], [17, 9],

  // Retiro Escritura — creador: 8
  [18, 1], [18, 3], [18, 5], [18, 7],

  // Demo Day IoT — creador: 9
  [19, 0], [19, 2], [19, 4], [19, 6], [19, 8],
];

// ─── Script principal ─────────────────────────────────────────────────────────

async function seed() {
  const client = await pool.connect();

  try {
    console.log('🌱 Iniciando seed...\n');

    await client.query('BEGIN');

    // Limpiar tablas en orden (respetando FK)
    await client.query('DELETE FROM event_likes');
    await client.query('DELETE FROM participants');
    await client.query('DELETE FROM events');
    await client.query('DELETE FROM users');
    console.log('🗑️  Tablas limpiadas');

    // 1. Insertar usuarios
    const passwordHash = bcrypt.hashSync('Password123', 10);
    const userIds = [];

    for (const u of USERS) {
      const res = await client.query(
        `INSERT INTO users (name, username, password, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, NOW(), NOW())
         RETURNING id`,
        [u.name, u.username, passwordHash]
      );
      userIds.push(res.rows[0].id);
    }
    console.log(`👤 ${userIds.length} usuarios insertados`);

    // 2. Insertar eventos
    const eventIds = [];

    for (const e of EVENTS) {
      const creatorId = userIds[e.creator_index];
      const res = await client.query(
        `INSERT INTO events
           (name, description, creator_id, likes, max_participants,
            start_time, end_time, address, latitude, longitude,
            "createdAt", "updatedAt")
         VALUES ($1,$2,$3,0,$4,$5,$6,$7,$8,$9,NOW(),NOW())
         RETURNING id_event`,
        [
          e.name,
          e.description,
          creatorId,
          e.max_participants,
          e.start,
          e.end,
          e.address,
          e.latitude,
          e.longitude,
        ]
      );
      eventIds.push(res.rows[0].id_event);
    }
    console.log(`📅 ${eventIds.length} eventos insertados`);

    // 3. Insertar participaciones
    let participationCount = 0;

    for (const [eventIdx, userIdx] of PARTICIPATIONS) {
      const eventId = eventIds[eventIdx];
      const userId  = userIds[userIdx];

      await client.query(
        `INSERT INTO participants (id_event, id_user)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [eventId, userId]
      );
      participationCount++;
    }
    console.log(`🤝 ${participationCount} participaciones insertadas`);

    // 4. Insertar likes y actualizar contador en events
    let likeCount = 0;

    for (const [eventIdx, userIdx] of LIKES) {
      const eventId = eventIds[eventIdx];
      const userId  = userIds[userIdx];

      await client.query(
        `INSERT INTO event_likes (id_event, id_user)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [eventId, userId]
      );
      likeCount++;
    }

    // Actualizar el campo likes de cada evento con el conteo real
    for (const eventId of eventIds) {
      await client.query(
        `UPDATE events
         SET likes = (SELECT COUNT(*) FROM event_likes WHERE id_event = $1)
         WHERE id_event = $1`,
        [eventId]
      );
    }
    console.log(`❤️  ${likeCount} likes insertados`);

    await client.query('COMMIT');

    console.log('\n✅ Seed completado exitosamente.');
    console.log('──────────────────────────────────');
    console.log('Contraseña de todos los usuarios: Password123');
    console.log('Usuarios disponibles:');
    USERS.forEach(u => console.log(`  • ${u.username}`));

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error durante el seed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
