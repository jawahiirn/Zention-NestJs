import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { IdGeneratorPort } from '../../common/application/ports/id-generator.port';

@Injectable()
export class SnowflakeIdGeneratorAdapter implements IdGeneratorPort {
  private readonly logger = new Logger(SnowflakeIdGeneratorAdapter.name);

  private readonly EPOCH = BigInt(1715264225000); // Custom epoch: May 9, 2024
  private readonly WORKER_ID_BITS = 10n;
  private readonly SEQUENCE_BITS = 12n;

  private readonly MAX_WORKER_ID = -1n ^ (-1n << this.WORKER_ID_BITS);
  private readonly MAX_SEQUENCE = -1n ^ (-1n << this.SEQUENCE_BITS);

  private readonly WORKER_ID_SHIFT = this.SEQUENCE_BITS;
  private readonly TIMESTAMP_SHIFT = this.SEQUENCE_BITS + this.WORKER_ID_BITS;

  private lastTimestamp = -1n;
  private sequence = 0n;
  private readonly workerId: bigint;

  constructor() {
    const rawWorkerId = process.env.WORKER_ID;
    const parsedWorkerId = BigInt(rawWorkerId || '0');

    if (!rawWorkerId) {
      this.logger.warn(
        'WORKER_ID environment variable is not set. Defaulting to 0. This is unsafe for distributed deployments.',
      );
    }

    if (parsedWorkerId > this.MAX_WORKER_ID || parsedWorkerId < 0n) {
      throw new Error(
        `Worker ID must be between 0 and ${this.MAX_WORKER_ID}. Current: ${parsedWorkerId}`,
      );
    }

    this.workerId = parsedWorkerId;
  }

  generate(): string {
    let timestamp = BigInt(Date.now());

    if (timestamp < this.lastTimestamp) {
      throw new InternalServerErrorException(
        `Clock moved backwards! Cannot generate ID for ${this.lastTimestamp - timestamp}ms`,
      );
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & this.MAX_SEQUENCE;
      if (this.sequence === 0n) {
        timestamp = this.waitNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;

    const id =
      ((timestamp - this.EPOCH) << this.TIMESTAMP_SHIFT) |
      (this.workerId << this.WORKER_ID_SHIFT) |
      this.sequence;

    return id.toString();
  }

  private waitNextMillis(lastTimestamp: bigint): bigint {
    let timestamp = BigInt(Date.now());
    while (timestamp <= lastTimestamp) {
      timestamp = BigInt(Date.now());
    }
    return timestamp;
  }
}
