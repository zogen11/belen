const { execSync } = require('child_process');

// Run the seeding script
console.log('Starting database seeding...');

try {
  execSync('cd server && npx tsx -r dotenv/config seed-data.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('Database seeding completed successfully!');
} catch (error) {
  console.error('Error seeding database:', error.message);
}