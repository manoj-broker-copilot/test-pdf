import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// export class SerializeInterceptor implements NestInterceptor {
//   constructor(private dto: any) {}
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Observable<any> | Promise<Observable<any>> {
//     return next.handle().pipe(
//       map((data: any) => {
//         return plainToInstance(this.dto, data, {
//           excludeExtraneousValues: true,
//           enableImplicitConversion: true,
//         });
//       }),
//     );
//   }
// }
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (Array.isArray(data)) {
          return plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          });
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data?.results && Array.isArray(data.results)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return {
            ...data,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            results: plainToInstance(this.dto, data.results, {
              excludeExtraneousValues: true,
              enableImplicitConversion: true,
            }),
          };
        }

        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      }),
    );
  }
}
