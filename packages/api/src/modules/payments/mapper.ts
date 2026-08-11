import type { PaymentDTO } from './dto';
import { PaymentEntity } from './entity';

export class PaymentMapper {
  public static toEntity(dto: PaymentDTO): PaymentEntity {
    return new PaymentEntity({
      id: dto.id,
      clientSecret: dto.client_secret,
      amount: Number(dto.amount),
      currency: dto.currency,
      status: dto.status as any,
      orderId: dto.order_id ?? undefined,
      createdAt: dto.created_at,
    });
  }

  public static toDTO(entity: PaymentEntity): PaymentDTO {
    return {
      id: entity.id,
      client_secret: entity.clientSecret,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      order_id: entity.orderId ?? null,
      created_at: entity.createdAt,
    };
  }
}

export { PaymentMapper as PaymentTransactionMapper };
