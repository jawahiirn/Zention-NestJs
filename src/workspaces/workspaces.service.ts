import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { WorkspaceMemberEntity } from './members/entities/workspace-member.entity';
import { IdGeneratorPort } from '../common/application/ports/id-generator.port';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { User } from '../users/entities/user.entity';
import { WorkspaceMemberRole } from './enums/workspace-roles.enum';
import { WorkspaceInvitationStatus } from './enums/invitation-status.enum';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspacesRepository: Repository<WorkspaceEntity>,
    @InjectRepository(WorkspaceMemberEntity)
    private readonly membersRepository: Repository<WorkspaceMemberEntity>,
    @Inject(IdGeneratorPort)
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, userId: string) {
    const workspace = this.workspacesRepository.create({
      id: this.idGenerator.generate(),
      name: createWorkspaceDto.name,
      icon: createWorkspaceDto.icon ?? null,
      iconColor: createWorkspaceDto.iconColor ?? null,
      createdBy: { id: userId } as User,
    });

    const savedWorkspace = await this.workspacesRepository.save(workspace);

    // Explicitly add creator as a member
    // TODO: User Member Service method to replace this block
    const member = this.membersRepository.create({
      workspace: savedWorkspace,
      user: { id: userId } as User,
      role: WorkspaceMemberRole.OWNER,
      invitationStatus: WorkspaceInvitationStatus.ACCEPTED,
    });
    await this.membersRepository.save(member);

    return savedWorkspace;
  }

  async findAll(userId: string): Promise<WorkspaceEntity[]> {
    return this.workspacesRepository
      .createQueryBuilder('workspace')
      .innerJoin('workspace.members', 'member')
      .where('member.userId = :userId', { userId })
      .getMany();
  }

  async findOne(id: string, userId: string): Promise<WorkspaceEntity> {
    const workspace = await this.workspacesRepository
      .createQueryBuilder('workspace')
      .innerJoin('workspace.members', 'member')
      .where('workspace.id = :id', { id })
      .andWhere('member.userId = :userId', { userId })
      .getOne();

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    return workspace;
  }
}
