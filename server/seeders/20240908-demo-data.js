module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Clear existing data
    await queryInterface.bulkDelete("Tags", null, {});
    await queryInterface.bulkDelete("Dares", null, {});
    await queryInterface.bulkDelete("DareTags", null, {});

    const tags = [
      "Físico",
      "Diversión",
      "Creativo",
      "Social",
      "Desafío",
      "Intelectual",
      "Habilidades",
      "Comunidad",
      "Determinación",
      "Aventura",
      "Hogar",
      "Salud",
      "Cultural",
    ];

    const dares = [
      {
        dare: "Cocina una comida de una cocina extranjera",
        description:
          "Sube una foto de la comida que cocinaste con la receta visible.",
        points: 30,
        timeLimit: 3,
      },
      {
        dare: "Recrea una escena de una película popular",
        description:
          "Sube una foto de tu recreación de una escena de una película conocida.",
        points: 35,
        timeLimit: 6,
      },
      {
        dare: "Crea una obra de arte inspirada en una pintura famosa",
        description:
          "Sube una foto de tu obra de arte inspirada en una pintura famosa.",
        points: 50,
        timeLimit: 7,
      },
      {
        dare: "Organiza un picnic temático",
        description:
          "Sube una foto del montaje del picnic con el tema visible.",
        points: 30,
        timeLimit: 4,
      },
      {
        dare: "Organiza tu estante de libros por género o categoría",
        description: "Sube una foto de tu estante de libros organizado.",
        points: 20,
        timeLimit: 3,
      },
      {
        dare: "Completa un proyecto de decoración DIY para el hogar",
        description:
          "Sube una foto del proyecto terminado y la foto del antes.",
        points: 45,
        timeLimit: 7,
      },
      {
        dare: "Construye un modelo o manualidad usando materiales de casa",
        description:
          "Sube fotos del modelo o manualidad completado con los materiales usados.",
        points: 50,
        timeLimit: 7,
      },
      {
        dare: "Toma una foto creativa en un entorno natural único",
        description:
          "Sube una foto tomada en un entorno natural único como un parque o jardín.",
        points: 30,
        timeLimit: 5,
      },
      {
        dare: "Participa en un evento comunitario local",
        description:
          "Sube una foto de ti en el evento comunitario con detalles visibles.",
        points: 40,
        timeLimit: 7,
      },
      {
        dare: "Muestra una nueva habilidad o pasatiempo",
        description:
          "Sube una foto de algo que hayas creado o una habilidad que hayas dominado.",
        points: 45,
        timeLimit: 10,
      },
      {
        dare: "Decora una habitación para un tema específico",
        description:
          'Sube fotos de la habitación decorada para un tema específico como "Tropical" o "Vintage."',
        points: 50,
        timeLimit: 7,
      },
      {
        dare: "Crea un collage de fotos con un tema estacional",
        description:
          "Sube una foto de tu collage con un tema que represente una estación específica.",
        points: 40,
        timeLimit: 6,
      },
      {
        dare: "Participa en un día de disfraces temático",
        description: "Sube una foto de ti en un disfraz temático.",
        points: 30,
        timeLimit: 4,
      },
      {
        dare: "Prepara y muestra una presentación creativa de desayuno",
        description:
          "Sube una foto de tu presentación de desayuno con una presentación creativa.",
        points: 25,
        timeLimit: 3,
      },
      {
        dare: "Toma una foto con un monumento conocido",
        description: "Sube una foto de ti con un monumento reconocible.",
        points: 20,
        timeLimit: 4,
      },
      {
        dare: "Organiza una colecta de ropa para caridad con un objetivo específico",
        description:
          "Sube una foto de los artículos recolectados y la organización de la colecta.",
        points: 60,
        timeLimit: 7,
      },
      {
        dare: 'Crea una exhibición temática de fotos (por ejemplo, "Blanco y Negro")',
        description:
          "Sube una foto de tu exhibición temática con imágenes en blanco y negro.",
        points: 40,
        timeLimit: 6,
      },
      {
        dare: "Construye y fotografía una característica única para el jardín",
        description:
          "Sube una foto de una característica del jardín que hayas construido tú mismo.",
        points: 50,
        timeLimit: 7,
      },
      {
        dare: "Crea y comparte una receta creativa",
        description: "Sube una foto de tu receta única y el plato final.",
        points: 30,
        timeLimit: 4,
      },
      {
        dare: "Diseña y fotografía una decoración única para una festividad",
        description:
          "Sube una foto de una decoración festiva que diseñaste y hiciste.",
        points: 35,
        timeLimit: 5,
      },
      {
        dare: "Completa un maratón de 42 kilómetros",
        description:
          "Sube una foto en la línea de meta con el número de corredor visible y el tiempo registrado.",
        points: 90,
        timeLimit: 14,
      },
      {
        dare: "Construye una pieza de mobiliario compleja (por ejemplo, una estantería a medida)",
        description:
          "Sube fotos del proceso de construcción y del mueble terminado en su lugar.",
        points: 80,
        timeLimit: 21,
      },
      {
        dare: "Realiza una inmersión en aguas profundas (más de 30 metros) con equipo completo",
        description:
          "Sube una foto de la inmersión con el equipo visible y la profundidad registrada.",
        points: 90,
        timeLimit: 30,
      },
      {
        dare: "Completa un curso de certificación avanzada en una habilidad técnica (por ejemplo, programación, diseño gráfico)",
        description:
          "Sube una foto del certificado de finalización del curso con prueba de la formación.",
        points: 85,
        timeLimit: 30,
      },
      {
        dare: "Organiza y participa en una campaña de recaudación de fondos para una causa específica (más de $2000 recaudados)",
        description:
          "Sube fotos del evento de recaudación de fondos y un informe de la cantidad total recaudada.",
        points: 90,
        timeLimit: 45,
      },
    ];

    // Insert Tags
    await queryInterface.bulkInsert(
      "Tags",
      tags.map((tag) => ({ tagName: tag })),
      {}
    );

    // Retrieve the inserted tags
    const tagRecords = await queryInterface.sequelize.query(
      "SELECT * FROM `Tags`",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const tagMap = tagRecords.reduce((acc, tag) => {
      acc[tag.tagName] = tag.id;
      return acc;
    }, {});

    // Insert Dares
    await queryInterface.bulkInsert("Dares", dares, {});

    // Retrieve the inserted dares
    const dareRecords = await queryInterface.sequelize.query(
      "SELECT * FROM `Dares`",
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Ensure dareRecords is an array
    if (!Array.isArray(dareRecords)) {
      throw new Error("Expected dareRecords to be an array.");
    }
    // Create relationships in DareTags
    const dareTags = [
      { dareId: 1, tagId: tagMap["Creativo"] },
      { dareId: 1, tagId: tagMap["Social"] },
      { dareId: 2, tagId: tagMap["Creativo"] },
      { dareId: 2, tagId: tagMap["Diversión"] },
      { dareId: 3, tagId: tagMap["Creativo"] },
      { dareId: 3, tagId: tagMap["Intelectual"] },
      { dareId: 4, tagId: tagMap["Social"] },
      { dareId: 4, tagId: tagMap["Diversión"] },
      { dareId: 5, tagId: tagMap["Creativo"] },
      { dareId: 6, tagId: tagMap["Hogar"] },
      { dareId: 6, tagId: tagMap["Creativo"] },
      { dareId: 7, tagId: tagMap["Creativo"] },
      { dareId: 7, tagId: tagMap["Habilidades"] },
      { dareId: 8, tagId: tagMap["Creativo"] },
      { dareId: 8, tagId: tagMap["Aventura"] },
      { dareId: 9, tagId: tagMap["Social"] },
      { dareId: 9, tagId: tagMap["Comunidad"] },
      { dareId: 10, tagId: tagMap["Creativo"] },
      { dareId: 10, tagId: tagMap["Diversión"] },
      { dareId: 11, tagId: tagMap["Creativo"] },
      { dareId: 11, tagId: tagMap["Desafío"] },
      { dareId: 12, tagId: tagMap["Diversión"] },
      { dareId: 12, tagId: tagMap["Creativo"] },
      { dareId: 13, tagId: tagMap["Creativo"] },
      { dareId: 13, tagId: tagMap["Hogar"] },
      { dareId: 14, tagId: tagMap["Creativo"] },
      { dareId: 14, tagId: tagMap["Diversión"] },
      { dareId: 15, tagId: tagMap["Físico"] },
      { dareId: 15, tagId: tagMap["Desafío"] },
      { dareId: 16, tagId: tagMap["Hogar"] },
      { dareId: 16, tagId: tagMap["Creativo"] },
      { dareId: 17, tagId: tagMap["Aventura"] },
      { dareId: 17, tagId: tagMap["Creativo"] },
      { dareId: 18, tagId: tagMap["Creativo"] },
      { dareId: 18, tagId: tagMap["Diversión"] },
      { dareId: 19, tagId: tagMap["Físico"] },
      { dareId: 19, tagId: tagMap["Desafío"] },
      { dareId: 20, tagId: tagMap["Hogar"] },
      { dareId: 20, tagId: tagMap["Creativo"] },
    ];

    await queryInterface.bulkInsert("DareTags", dareTags);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("DareTags", null, {});
    await queryInterface.bulkDelete("Dares", null, {});
    await queryInterface.bulkDelete("Tags", null, {});
  },
};
