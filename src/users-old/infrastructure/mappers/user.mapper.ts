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
      userEntity.googleId,
      userEntity.isPending,
    );
  }

  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.password = user.password;
    entity.fullName = user.fullName;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    entity.isActive = user.isActive;
    entity.googleId = user.googleId;
    entity.isPending = user.isPending;
    return entity;
  }
}
