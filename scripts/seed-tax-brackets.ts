// src/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { seedTaxBrackets } from 'src/database/seeder/tax-bracket.seeder';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule); // CLI context
  const dataSource = app.get(DataSource);

  await seedTaxBrackets(dataSource);

  await app.close();
  console.log('✅ Seeding complete!');
}

bootstrap().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
