import 'reflect-metadata';
import { AppDataSource } from '../datasource';
import { User } from '../entities';
import { UsersService } from 'src/modules/users/domain/users.service';
import { Repository } from 'typeorm';
import { EncryptionService } from 'src/shared/utils/encryption.service';
import { Logger } from 'winston';

async function run() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User) as Repository<User>;

  const plannerEmail = 'planner@example.com';
  const clientEmail = 'client@example.com';

  const existsPlanner = await userRepo.findOne({ where: { email: plannerEmail } });
  const existsClient = await userRepo.findOne({ where: { email: clientEmail } });

  const enc = new EncryptionService({} as any, (console as any) as Logger);

  if (!existsPlanner) {
    await userRepo.save(
      userRepo.create({
        email: plannerEmail,
        password: enc.encprypt('Planner#123'),
        firstName: 'Planner',
        lastName: 'Example',
        role: 'planner' as any,
      }),
    );
  }

  if (!existsClient) {
    await userRepo.save(
      userRepo.create({
        email: clientEmail,
        password: enc.encprypt('Client#123'),
        firstName: 'Client',
        lastName: 'Example',
        role: 'client' as any,
      }),
    );
  }

  await AppDataSource.destroy();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


