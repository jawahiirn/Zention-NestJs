import { Workspace } from '../../domain/workspace';
import { WorkspaceEntity } from '../entities/workspace.entity';

export class WorkspaceMapper {
  static toDomain(entity: WorkspaceEntity): Workspace {
    return new Workspace(
      entity.id,
      entity.name,
      entity.icon,
      entity.iconColor,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Workspace): WorkspaceEntity {
    const entity = new WorkspaceEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.icon = domain.icon;
    entity.iconColor = domain.iconColor;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
