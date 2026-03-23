import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class RefreshTokenStoragePort {
  abstract insert(userId: string, tokenId: string): Promise<void>;
  abstract validate(userId: string, tokenId: string): Promise<boolean>;
  abstract invalidate(userId: string): Promise<void>;
  abstract suspend(userId: string): Promise<void>;
  abstract isSuspended(userId: string): Promise<boolean>;
  abstract activate(userId: string): Promise<void>;
  abstract getKey(userId: string): string;
}
