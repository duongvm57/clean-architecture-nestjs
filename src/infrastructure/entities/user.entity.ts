import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { TABLE_NAME } from '../common/constants/constant';
import { BaseEntity } from './base.entity';

@Entity(TABLE_NAME.USERS)
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column('varchar', { unique: true })
  username: string;

  @Column('varchar')
  email: string;

  @Column('text')
  password: string;

  @Column({ nullable: true })
  last_login?: Date;

  @Column('varchar', { nullable: true })
  hash_refresh_token: string;
}
