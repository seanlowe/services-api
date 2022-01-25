import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('utility')
class Utility {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({ 
    name: 'Description',
    type: 'varchar',
    nullable: true,
   })
  public description: string;

  @Column({ nullable: true })
  public created_at: Date;

  @Column({ nullable: true })
  public updated_at: Date;
}

export default Utility;