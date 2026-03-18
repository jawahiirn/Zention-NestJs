import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class RefreshTokenStoragePort {
  abstract insert(userId: number, tokenId: string): Promise<void>;
  abstract validate(userId: number, tokenId: string): Promise<boolean>;
  abstract invalidate(userId: number): Promise<void>;
  abstract getKey(userId: number): string;
}
