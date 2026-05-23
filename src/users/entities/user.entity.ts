import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ default: '' })
  fullName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true, unique: true })
  googleId: string | null;

  @Column({ default: false })
  isPending: boolean;

  activate(password: string, fullName?: string): User {
    const activatedUser = new User();
    Object.assign(activatedUser, this);
    activatedUser.password = password;
    activatedUser.fullName = fullName ?? this.fullName;
    activatedUser.isActive = true;
    activatedUser.isPending = false;
    return activatedUser;
  }

  claimSocial(googleId: string, fullName?: string): User {
    const claimedUser = new User();
    Object.assign(claimedUser, this);
    claimedUser.googleId = googleId;
    claimedUser.fullName = fullName ?? this.fullName;
    claimedUser.isActive = true;
    claimedUser.isPending = false;
    return claimedUser;
  }
}
