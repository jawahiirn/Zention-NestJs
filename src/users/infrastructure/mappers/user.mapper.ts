import { UserEntity } from '../entities/user.entity';
import { User } from '../../domain/user';

export class UserMapper {
  static toDomain(userEntity: UserEntity): User {
    return new User(userEntity.email, userEntity.password, userEntity.id);
  }
  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    if (user.id) {
      entity.id = user.id;
    }
    entity.email = user.email;
    entity.password = user.password;
    return entity;
  }
}
