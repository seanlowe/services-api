import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity('utility')
class Utility {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({
    type: 'varchar',
    nullable: true,
   })
  public description: string;
  
  @VersionColumn()
  public version: number;

  @Column({ nullable: true })
  public published: boolean;

  @CreateDateColumn({ nullable: true })
  public created_at: Date;

  @UpdateDateColumn({ nullable: true })
  public updated_at: Date;
}

export default Utility;