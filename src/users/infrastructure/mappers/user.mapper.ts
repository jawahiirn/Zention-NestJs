import { UserEntity } from '../entities/user.entity';
import { User } from '../../domain/user';

export class UserMapper {
  static toDomain(userEntity: UserEntity): User {
    return new User(
      userEntity.email,
      userEntity.password,
      userEntity.id,
      userEntity.fullName,
      userEntity.createdAt,
      userEntity.updatedAt,
      userEntity.isActive,
    );
  }
  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.password = user.password;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    entity.isActive = user.isActive;
    entity.fullName = user.fullName;
    return entity;
  }
}
