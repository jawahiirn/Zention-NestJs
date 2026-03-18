import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../../../../common/constants/iam.constants';
import { ActiveUserInterface } from '../../../../common/interfaces/active-user.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserInterface | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserInterface | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
