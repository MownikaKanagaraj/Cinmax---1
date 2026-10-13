import type { AppSettingsDTO } from './dto';
import { AppSettingsEntity } from './entity';

export class AppSettingsMapper {
  public static toEntity(dto: AppSettingsDTO): AppSettingsEntity {
    return new AppSettingsEntity({
      appName: dto.app_name,
      currency: dto.currency,
      taxRate: Number(dto.tax_rate),
      freeShippingThreshold: Number(dto.free_shipping_threshold),
      standardShippingFee: Number(dto.standard_shipping_fee),
      contactEmail: dto.contact_email,
      supportPhone: dto.support_phone ?? undefined,
      dispatchTimeDays: dto.dispatch_time_days !== undefined && dto.dispatch_time_days !== null ? Number(dto.dispatch_time_days) : 20,
    });
  }

  public static toDTO(entity: AppSettingsEntity): AppSettingsDTO {
    return {
      app_name: entity.appName,
      currency: entity.currency,
      tax_rate: entity.taxRate,
      free_shipping_threshold: entity.freeShippingThreshold,
      standard_shipping_fee: entity.standardShippingFee,
      contact_email: entity.contactEmail,
      support_phone: entity.supportPhone ?? null,
      dispatch_time_days: entity.dispatchTimeDays ?? 20,
    };
  }
}
