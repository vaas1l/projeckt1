/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function (knex) {
  return knex('services').del().then(() => {
    return knex('services').insert([
      { name: 'Dámské Kadeřnictví', price: 300 },
      { name: 'Pánské Kadeřnictví', price: 200 },
      { name: 'Dětské Kadeřnictví', price: 150 },
      { name: 'Barvení Vlasů', price: 500 },
      { name: 'Drobné Úpravy', price: 100 },
      { name: 'Manikúra', price: 250 },
      { name: 'Pedikúra', price: 300 },
      { name: 'Depilace', price: 350 },
      { name: 'Masáže', price: 400 },
      { name: 'Make-up', price: 450 },
    ]);
  });
};
