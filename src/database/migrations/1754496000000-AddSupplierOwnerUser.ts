import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddSupplierOwnerUser1754496000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'suppliers',
      new TableColumn({
        name: 'owner_user_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'suppliers',
      new TableForeignKey({
        columnNames: ['owner_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('suppliers');
    const fk = table?.foreignKeys.find((f) => f.columnNames.includes('owner_user_id'));
    if (fk) await queryRunner.dropForeignKey('suppliers', fk);
    await queryRunner.dropColumn('suppliers', 'owner_user_id');
  }
}


