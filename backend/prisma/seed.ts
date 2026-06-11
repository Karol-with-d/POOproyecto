import { prisma } from '../src/config/prisma';

/**
 * SeedService — clase que encapsula la lógica de poblado de la base de datos.
 * 
 * Nota POO (T-007): usa instancias de clase para operaciones de negocio.
 */
class SeedService {
  async run(): Promise<void> {
    console.log('🌱 Iniciando seed de datos...');

    // Limpieza idempotente (borrar en orden para respetar FKs)
    await this.cleanDatabase();

    // Crear las 6 semanas
    const semanas = await this.createSemanas();

    // Crear actividades para cada semana
    await this.createActivities(semanas);

    // Crear preguntas de quiz para cada semana
    await this.createQuizQuestions(semanas);

    console.log('✅ Seed completado exitosamente.');
  }

  private async cleanDatabase(): Promise<void> {
    console.log('🧹 Limpiando base de datos...');
    await prisma.userProgress.deleteMany();
    await prisma.userScore.deleteMany();
    await prisma.quizOption.deleteMany();
    await prisma.quizQuestion.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.user.deleteMany();
    await prisma.semana.deleteMany();
  }

  private async createSemanas() {
    console.log('📅 Creando semanas...');
    const semanasData = [
      { number: 1, title: 'Semana 1: Objetos y Medidas', topic: 'propiedades_materia', description: 'Exploramos las propiedades de los objetos cotidianos y cómo medirlos.' },
      { number: 2, title: 'Semana 2: Materiales', topic: 'materiales', description: 'Conocemos los diferentes materiales que nos rodean.' },
      { number: 3, title: 'Semana 3: Materiales y Reciclaje', topic: 'reciclaje', description: 'Aprendemos a identificar materiales y darles una segunda vida.' },
      { number: 4, title: 'Semana 4: Cambios Químicos', topic: 'cambios_quimicos', description: 'Descubrimos la familia química y sus experimentos.' },
      { number: 5, title: 'Semana 5: Seres Vivos', topic: 'seres_vivos', description: 'Exploramos qué hace que algo esté vivo.' },
      { number: 6, title: 'Semana 6: Estímulos y Respuestas', topic: 'estimulos', description: 'Entendemos cómo los seres vivos reaccionan a su entorno.' },
    ];

    const created = [];
    for (const data of semanasData) {
      const semana = await prisma.semana.create({ data });
      created.push(semana);
      console.log(`  ✓ Semana ${semana.number}: ${semana.title}`);
    }
    return created;
  }

  private async createActivities(semanas: any[]) {
    console.log('🎮 Creando actividades...');

    const activitiesConfig: Record<number, { type: string; title: string }[]> = {
      1: [
        { type: 'carousel', title: 'Carousel de objetos' },
        { type: 'description_match', title: 'Description match' },
        { type: 'ruler_game', title: 'Rescata a Pulgarcito' },
        { type: 'fill_cup', title: 'Fill the cup' },
        { type: 'sort_size', title: 'Sort by size' },
        { type: 'subweight', title: 'Subweight' },
        { type: 'temperature', title: 'Frío o Caliente' },
      ],
      2: [
        { type: 'drawing', title: 'Drawing' },
        { type: 'tap_scene', title: 'Tap the scene' },
        { type: 'sensory_puzzle', title: 'La Caja Misteriosa' },
        { type: 'scratch_reveal', title: 'La Fábrica Misteriosa' },
        { type: 'sorting', title: 'Categorize scene' },
      ],
      3: [
        { type: 'rpl', title: 'RPL' },
        { type: 'build_it', title: 'Build it' },
        { type: 'material_quiz', title: '¿De qué está hecho?' },
        { type: 'reflection', title: 'Reflection cards' },
        { type: 'recycling', title: 'Dale segunda vida' },
      ],
      4: [
        { type: 'comparison_table', title: 'Fruit comparison table' },
        { type: 'character_intro', title: 'La Familia Química' },
        { type: 'oxidation', title: 'Experimento Oxidación' },
        { type: 'fermentation', title: 'Experimento Fermentación' },
        { type: 'color_lab', title: 'Lab de colores' },
        { type: 'glow_stick', title: 'Barra luminosa' },
        { type: 'combustion', title: 'Combus' },
      ],
      5: [
        { type: 'swipe_card', title: 'Indagación swipe' },
        { type: 'superpowers', title: 'Los 4 Superpoderes' },
        { type: 'power_counter', title: '¿Cuántos superpoderes?' },
        { type: 'power_match', title: '¿Cuál superpoder es?' },
        { type: 'germination', title: '¡Siembra tu semilla!' },
        { type: 'magnifier', title: 'La Lupa de Detective' },
      ],
      6: [
        { type: 'characteristic_sorter', title: '¿Qué tenemos en común?' },
        { type: 'scent_trail', title: '¡Sigue el olor!' },
        { type: 'pupil_simulation', title: '¡La pupila mágica!' },
        { type: 'exercise', title: '¡A moverse!' },
        { type: 'stimulus_match', title: '¿Qué haría?' },
        { type: 'seed_grow', title: '¡Dale vida a tu semilla!' },
        { type: 'habitat', title: '¿Dónde vivo yo?' },
        { type: 'lifecycle', title: '¿Qué viene después?' },
      ],
    };

    for (const semana of semanas) {
      const acts = activitiesConfig[semana.number] || [];
      for (let i = 0; i < acts.length; i++) {
        await prisma.activity.create({
          data: {
            semanaId: semana.id,
            type: acts[i].type,
            title: acts[i].title,
            order: i + 1,
            config: {},
          },
        });
      }
      console.log(`  ✓ ${acts.length} actividades para Semana ${semana.number}`);
    }
  }

  private async createQuizQuestions(semanas: any[]) {
    console.log('❓ Creando preguntas de quiz...');

    const quizData: Record<number, { question: string; type: string; options: { text: string; isCorrect: boolean }[] }[]> = {
      1: [
        { question: '¿Cuál es una propiedad de un lápiz?', type: 'multiple_choice', options: [{ text: 'Es de madera', isCorrect: true }, { text: 'Es líquido', isCorrect: false }, { text: 'Es transparente', isCorrect: false }] },
        { question: '¿Qué usamos para medir longitud?', type: 'multiple_choice', options: [{ text: 'Una regla', isCorrect: true }, { text: 'Un termómetro', isCorrect: false }, { text: 'Una balanza', isCorrect: false }] },
        { question: 'El agua hierve a 100 grados.', type: 'true_false', options: [{ text: 'Verdadero', isCorrect: true }, { text: 'Falso', isCorrect: false }] },
        { question: '¿Cuál objeto es más pesado?', type: 'multiple_choice', options: [{ text: 'Una pluma', isCorrect: false }, { text: 'Una mochila llena', isCorrect: true }, { text: 'Un borrador', isCorrect: false }] },
        { question: '¿Qué propiedad describe el color?', type: 'multiple_choice', options: [{ text: 'Es rojo', isCorrect: true }, { text: 'Pesa 1 kg', isCorrect: false }, { text: 'Mide 10 cm', isCorrect: false }] },
      ],
      2: [
        { question: '¿Qué material es transparente?', type: 'multiple_choice', options: [{ text: 'Vidrio', isCorrect: true }, { text: 'Madera', isCorrect: false }, { text: 'Metal', isCorrect: false }] },
        { question: 'El plástico se puede reciclar.', type: 'true_false', options: [{ text: 'Verdadero', isCorrect: true }, { text: 'Falso', isCorrect: false }] },
        { question: '¿Qué material es buen conductor de calor?', type: 'multiple_choice', options: [{ text: 'Metal', isCorrect: true }, { text: 'Plástico', isCorrect: false }, { text: 'Madera', isCorrect: false }] },
        { question: 'La madera flota en el agua.', type: 'true_false', options: [{ text: 'Verdadero', isCorrect: true }, { text: 'Falso', isCorrect: false }] },
        { question: '¿Qué material es más flexible?', type: 'multiple_choice', options: [{ text: 'Goma', isCorrect: true }, { text: 'Ladrillo', isCorrect: false }, { text: 'Hierro', isCorrect: false }] },
      ],
      3: [
        { question: '¿Qué objeto está hecho de metal?', type: 'multiple_choice', options: [{ text: 'Una moneda', isCorrect: true }, { text: 'Una botella de plástico', isCorrect: false }, { text: 'Un libro', isCorrect: false }] },
        { question: 'El vidrio se puede reciclar infinitamente.', type: 'true_false', options: [{ text: 'Verdadero', isCorrect: true }, { text: 'Falso', isCorrect: false }] },
        { question: '¿Por qué usamos plástico para botellas?', type: 'multiple_choice', options: [{ text: 'Es ligero y no se rompe fácil', isCorrect: true }, { text: 'Es pesado', isCorrect: false }, { text: 'Es caro', isCorrect: false }] },
        { question: 'El papel se hace de madera.', type: 'true_false', options: [{ text: 'Verdadero', isCorrect: true }, { text: 'Falso', isCorrect: false }] },
        { question: '¿Qué material usamos para construir casas?', type: 'multiple_choice', options: [{ text: 'Ladrillo', isCorrect: true }, { text: 'Papel', isCorrect: false }, { text: 'Algodón', isCorrect: false }] },
      ],
      4: [
        { question: '¿Qué gas necesita el fuego para arder?', type: 'multiple_choice', options: [{ text: 'Oxígeno', isCorrect: true }, { text: 'Nitrógeno', isCorrect: false }, { text: 'Dióxido de carbono', isCorrect: false }] },
        { question: 'La fermentación produce gas.', type: 'true_false', options: [{ text: 'Verdadero', isCorrect: true }, { text: 'Falso', isCorrect: false }] },
        { question: '¿Qué pasa cuando una manzana se oxida?', type: 'multiple_choice', options: [{ text: 'Se pone marrón', isCorrect: true }, { text: 'Se pone verde', isCorrect: false }, { text: 'Se pone azul', isCorrect: false }] },
        { question: 'El bicarbonato es ácido.', type: 'true_false', options: [{ text: 'Verdadero', isCorrect: false }, { text: 'Falso', isCorrect: true }] },
        { question: '¿Qué experimento produce burbujas?', type: 'multiple_choice', options: [{ text: 'Fermentación', isCorrect: true }, { text: 'Congelación', isCorrect: false }, { text: 'Evaporación', isCorrect: false }] },
      ],
      5: [
        { question: '¿Cuál es un superpoder de los seres vivos?', type: 'multiple_choice', options: [{ text: 'Crecer', isCorrect: true }, { text: 'Brillar en la oscuridad', isCorrect: false }, { text: 'Volar', isCorrect: false }] },
        { question: 'Las plantas son seres vivos.', type: 'true_false', options: [{ text: 'Verdadero', isCorrect: true }, { text: 'Falso', isCorrect: false }] },
        { question: '¿Qué necesitan todos los seres vivos?', type: 'multiple_choice', options: [{ text: 'Alimentarse', isCorrect: true }, { text: 'Electricidad', isCorrect: false }, { text: 'Baterías', isCorrect: false }] },
        { question: 'Una piedra es un ser vivo.', type: 'true_false', options: [{ text: 'Verdadero', isCorrect: false }, { text: 'Falso', isCorrect: true }] },
        { question: '¿Cómo se llama el proceso cuando una semilla crece?', type: 'multiple_choice', options: [{ text: 'Germinación', isCorrect: true }, { text: 'Fermentación', isCorrect: false }, { text: 'Oxidación', isCorrect: false }] },
      ],
      6: [
        { question: '¿Qué órgano usamos para ver?', type: 'multiple_choice', options: [{ text: 'Los ojos', isCorrect: true }, { text: 'La nariz', isCorrect: false }, { text: 'Las orejas', isCorrect: false }] },
        { question: 'La pupila se contrae cuando hay mucha luz.', type: 'true_false', options: [{ text: 'Verdadero', isCorrect: true }, { text: 'Falso', isCorrect: false }] },
        { question: '¿Qué pasa cuando hacemos ejercicio?', type: 'multiple_choice', options: [{ text: 'El corazón late más rápido', isCorrect: true }, { text: 'Nos enfriamos', isCorrect: false }, { text: 'Nos quedamos dormidos', isCorrect: false }] },
        { question: 'Las plantas pueden detectar sonidos.', type: 'true_false', options: [{ text: 'Verdadero', isCorrect: true }, { text: 'Falso', isCorrect: false }] },
        { question: '¿Qué ciclo describe el crecimiento de una mariposa?', type: 'multiple_choice', options: [{ text: 'Huevo → Oruga → Capullo → Mariposa', isCorrect: true }, { text: 'Semilla → Planta → Flor → Árbol', isCorrect: false }, { text: 'Huevo → Pez → Rana → Sapo', isCorrect: false }] },
      ],
    };

    for (const semana of semanas) {
      const questions = quizData[semana.number] || [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const createdQuestion = await prisma.quizQuestion.create({
          data: {
            semanaId: semana.id,
            question: q.question,
            type: q.type,
            order: i + 1,
          },
        });

        for (const opt of q.options) {
          await prisma.quizOption.create({
            data: {
              questionId: createdQuestion.id,
              text: opt.text,
              isCorrect: opt.isCorrect,
            },
          });
        }
      }
      console.log(`  ✓ ${questions.length} preguntas de quiz para Semana ${semana.number}`);
    }
  }
}

// ============================================
// Ejecutar seed
// ============================================
const seedService = new SeedService();

seedService
  .run()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
