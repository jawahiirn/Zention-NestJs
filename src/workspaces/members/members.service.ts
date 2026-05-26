import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceMemberEntity } from './entities/workspace-member.entity';
import { User } from '../../users/entities/user.entity';
import { IdGeneratorPort } from '../../common/application/ports/id-generator.port';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(WorkspaceMemberEntity)
    private readonly membersRepository: Repository<WorkspaceMemberEntity>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(IdGeneratorPort)
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async findAll(workspaceId: string) {
    return this.membersRepository.find({
      where: { workspace: { id: workspaceId } },
      relations: ['user'],
    });
  }

  async addMember(workspaceId: string, email: string) {
    // 1. Find or create the user (placeholder)
    let user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      user = this.usersRepository.create({
        id: this.idGenerator.generate(),
        email,
        isPending: true,
      });
      await this.usersRepository.save(user);
    }

    // 2. Create the member record
    const member = this.membersRepository.create({
      workspace: { id: workspaceId },
      user,
    });

    return this.membersRepository.save(member);
  }
}
