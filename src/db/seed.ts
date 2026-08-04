import { initTursoDB, turso } from './turso';

async function seed() {
  console.log('🚀 Démarrage du remplissage de la base de données Turso Cloud...');
  await initTursoDB();

  // Verify counts
  const stations = await turso.execute('SELECT COUNT(*) as count FROM stations;');
  const lines = await turso.execute('SELECT COUNT(*) as count FROM lines;');
  const perturbations = await turso.execute('SELECT COUNT(*) as count FROM perturbations;');

  console.log('====================================================');
  console.log(`✅ Base Turso Cloud remplie avec succès !`);
  console.log(`📌 Stations insérées : ${stations.rows[0].count}`);
  console.log(`📌 Lignes insérées    : ${lines.rows[0].count}`);
  console.log(`📌 Perturbations     : ${perturbations.rows[0].count}`);
  console.log('====================================================');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Erreur lors du remplissage de Turso:', err);
  process.exit(1);
});
