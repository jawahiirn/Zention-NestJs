import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { WorkspaceEntity } from '../../entities/workspace.entity';
import { User } from '../../../users/entities/user.entity';
import { InvitationStatus } from '../../enums/invitation-status.enum';

@Entity('workspace_invitations')
export class InvitationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkspaceEntity)
  @JoinColumn({ name: 'workspaceId' })
  workspace: WorkspaceEntity;

  @Column()
  email: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'invitedById' })
  invitedBy: User;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
