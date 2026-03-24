import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { RefreshTokenStoragePort } from '../../application/ports/refresh-token-storage.port';
import Redis from 'ioredis';

// TODO: Move this class to its own dedicated file
export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage
  implements
    RefreshTokenStoragePort,
    OnApplicationBootstrap,
    OnApplicationShutdown
{
  private redisClient: Redis;
  private logger = new Logger('RefreshTokenIdsStorage');

  onApplicationBootstrap(): any {
    // TODO: Ideally, move this to dedicated RedisModule
    this.logger.log(process.env.REDIS_HOST);
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST! ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    });
  }

  onApplicationShutdown(signal?: string): any {
    return this.redisClient.quit();
  }

  async insert(userId: string, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }
  async validate(userId: string, tokenId: string): Promise<boolean> {
    const storeId = await this.redisClient.get(this.getKey(userId));
    if (storeId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storeId === tokenId;
  }
  async invalidate(userId: string): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  async suspend(userId: string): Promise<void> {
    await this.redisClient.set(this.getSuspensionKey(userId), 'true');
  }

  async isSuspended(userId: string): Promise<boolean> {
    const isSuspended = await this.redisClient.get(
      this.getSuspensionKey(userId),
    );
    return isSuspended === 'true';
  }

  async activate(userId: string): Promise<void> {
    await this.redisClient.del(this.getSuspensionKey(userId));
  }

  getKey(userId: string): string {
    return `user-${userId}`;
  }

  private getSuspensionKey(userId: string): string {
    return `user-suspended-${userId}`;
  }
}
