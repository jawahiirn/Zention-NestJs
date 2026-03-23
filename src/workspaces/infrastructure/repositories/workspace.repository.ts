import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceRepositoryPort } from '../../application/ports/workspace-repository.port';
import { Workspace } from '../../domain/workspace';
import { WorkspaceMember } from '../../domain/workspace-member';
import { WorkspaceEntity } from '../entities/workspace.entity';
import { WorkspaceMemberEntity } from '../entities/workspace-member.entity';
import { WorkspaceMapper } from '../mappers/workspace.mapper';
import { WorkspaceMemberMapper } from '../mappers/workspace-member.mapper';

@Injectable()
export class WorkspaceRepository implements WorkspaceRepositoryPort {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(WorkspaceMemberEntity)
    private readonly memberRepository: Repository<WorkspaceMemberEntity>,
  ) {}

  async save(workspace: Workspace): Promise<void> {
    const entity = WorkspaceMapper.toPersistence(workspace);
    await this.workspaceRepository.save(entity);
  }

  async findById(userId: string, workspaceId: string): Promise<Workspace> {
    await this.findMember(userId, workspaceId);
    const entity = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });
    if (!entity) {
      throw new NotFoundException(
        `Workspace with ID ${workspaceId} not found.`,
      );
    }
    return WorkspaceMapper.toDomain(entity);
  }

  async findAllByUserId(userId: string): Promise<Workspace[]> {
    const memberEntities = await this.memberRepository.find({
      where: { userId },
      relations: ['workspace'],
    });

    return memberEntities.map((member) =>
      WorkspaceMapper.toDomain(member.workspace),
    );
  }

  async saveMember(member: WorkspaceMember): Promise<void> {
    const entity = WorkspaceMemberMapper.toPersistence(member);
    await this.memberRepository.save(entity);
  }

  async findMember(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMember> {
    const entity = await this.memberRepository.findOneBy({
      userId,
      workspaceId,
    });
    if (!entity) {
      throw new NotFoundException('Workspace not found.');
    }
    return WorkspaceMemberMapper.toDomain(entity);
  }
}
