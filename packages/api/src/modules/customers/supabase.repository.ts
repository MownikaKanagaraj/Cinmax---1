import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Address } from '@cinmax/types';
import { CustomerEntity } from './entity';
import { CustomerMapper } from './mapper';
import type { ICustomerRepository, NotificationSettingsData, CustomerPreferencesData } from './repository.interface';

export class SupabaseCustomerRepository implements ICustomerRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  public async getCustomers(): Promise<CustomerEntity[]> {
    try {
      const { data: profiles, error } = await this.supabase
        .from('profiles')
        .select('id, email, first_name, last_name, phone, avatar_url, role, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error || !profiles) return [];

      return profiles.map((p: any) =>
        CustomerMapper.toEntity({
          ...p,
          saved_addresses: [],
        } as any)
      );
    } catch (err) {
      console.warn('[SupabaseCustomerRepository] getCustomers error fallback:', err);
      return [];
    }
  }

  public async getProfile(userId: string): Promise<CustomerEntity | null> {
    const { data: profileData, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !profileData) return null;

    const addresses = await this.getAddresses(userId);

    return CustomerMapper.toEntity({
      ...profileData,
      saved_addresses: addresses as any,
    } as any);
  }

  public async updateProfile(userId: string, data: Partial<CustomerEntity>): Promise<CustomerEntity> {
    const { data: updated, error } = await this.supabase
      .from('profiles')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        avatar_url: data.avatarUrl,
        date_of_birth: (data as any).dateOfBirth,
        gender: (data as any).gender,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) throw new Error(`Supabase Profile Update Error: ${error.message}`);
    return (await this.getProfile(userId))!;
  }

  public async getAddresses(userId: string): Promise<Address[]> {
    const { data, error } = await this.supabase
      .from('customer_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Supabase Addresses Fetch Error: ${error.message}`);

    return (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      firstName: row.first_name,
      lastName: row.last_name,
      company: row.company || undefined,
      streetLine1: row.street_line1,
      streetLine2: row.street_line2 || undefined,
      city: row.city,
      state: row.state,
      postalCode: row.postal_code,
      country: row.country || 'US',
      phone: row.phone,
      isDefaultShipping: Boolean(row.is_default_shipping),
      isDefaultBilling: Boolean(row.is_default_billing),
    }));
  }

  public async addAddress(userId: string, address: Omit<Address, 'id'> | Address): Promise<Address> {
    const { data, error } = await this.supabase
      .from('customer_addresses')
      .insert({
        user_id: userId,
        first_name: address.firstName,
        last_name: address.lastName,
        company: address.company,
        street_line1: address.streetLine1,
        street_line2: address.streetLine2,
        city: address.city,
        state: address.state,
        postal_code: address.postalCode,
        country: address.country || 'US',
        phone: address.phone,
        is_default_shipping: Boolean(address.isDefaultShipping),
        is_default_billing: Boolean(address.isDefaultBilling),
      } as any)
      .select('*')
      .single();

    if (error) throw new Error(`Supabase Add Address Error: ${error.message}`);

    return {
      id: data.id,
      userId: data.user_id,
      firstName: data.first_name,
      lastName: data.last_name,
      company: data.company,
      streetLine1: data.street_line1,
      streetLine2: data.street_line2,
      city: data.city,
      state: data.state,
      postalCode: data.postal_code,
      country: data.country,
      phone: data.phone,
      isDefaultShipping: Boolean(data.is_default_shipping),
      isDefaultBilling: Boolean(data.is_default_billing),
    };
  }

  public async updateAddress(
    userId: string,
    addressId: string,
    data: Partial<Address>
  ): Promise<Address> {
    const { data: updated, error } = await this.supabase
      .from('customer_addresses')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        company: data.company,
        street_line1: data.streetLine1,
        street_line2: data.streetLine2,
        city: data.city,
        state: data.state,
        postal_code: data.postalCode,
        country: data.country,
        phone: data.phone,
        is_default_shipping: data.isDefaultShipping,
        is_default_billing: data.isDefaultBilling,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', addressId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw new Error(`Supabase Update Address Error: ${error.message}`);

    return {
      id: updated.id,
      userId: updated.user_id,
      firstName: updated.first_name,
      lastName: updated.last_name,
      company: updated.company,
      streetLine1: updated.street_line1,
      streetLine2: updated.street_line2,
      city: updated.city,
      state: updated.state,
      postalCode: updated.postal_code,
      country: updated.country,
      phone: updated.phone,
      isDefaultShipping: Boolean(updated.is_default_shipping),
      isDefaultBilling: Boolean(updated.is_default_billing),
    };
  }

  public async deleteAddress(userId: string, addressId: string): Promise<void> {
    const { error } = await this.supabase
      .from('customer_addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', userId);

    if (error) throw new Error(`Supabase Delete Address Error: ${error.message}`);
  }

  public async setDefaultAddress(
    userId: string,
    addressId: string,
    type: 'shipping' | 'billing' = 'shipping'
  ): Promise<Address[]> {
    if (type === 'shipping') {
      await this.supabase
        .from('customer_addresses')
        .update({ is_default_shipping: false } as any)
        .eq('user_id', userId);

      await this.supabase
        .from('customer_addresses')
        .update({ is_default_shipping: true } as any)
        .eq('id', addressId)
        .eq('user_id', userId);
    } else {
      await this.supabase
        .from('customer_addresses')
        .update({ is_default_billing: false } as any)
        .eq('user_id', userId);

      await this.supabase
        .from('customer_addresses')
        .update({ is_default_billing: true } as any)
        .eq('id', addressId)
        .eq('user_id', userId);
    }

    return this.getAddresses(userId);
  }

  public async getNotificationSettings(userId: string): Promise<NotificationSettingsData> {
    const { data, error } = await this.supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        marketingEmails: true,
        orderUpdates: true,
      };
    }

    return {
      emailNotifications: Boolean(data.email_notifications),
      smsNotifications: Boolean(data.sms_notifications),
      pushNotifications: Boolean(data.push_notifications),
      marketingEmails: Boolean(data.marketing_emails),
      orderUpdates: Boolean(data.order_updates),
    };
  }

  public async updateNotificationSettings(
    userId: string,
    data: Partial<NotificationSettingsData>
  ): Promise<NotificationSettingsData> {
    const { data: updated, error } = await this.supabase
      .from('notification_settings')
      .upsert({
        user_id: userId,
        email_notifications: data.emailNotifications,
        sms_notifications: data.smsNotifications,
        push_notifications: data.pushNotifications,
        marketing_emails: data.marketingEmails,
        order_updates: data.orderUpdates,
        updated_at: new Date().toISOString(),
      } as any)
      .select('*')
      .single();

    if (error) throw new Error(`Supabase Update Notification Settings Error: ${error.message}`);

    return {
      emailNotifications: Boolean(updated.email_notifications),
      smsNotifications: Boolean(updated.sms_notifications),
      pushNotifications: Boolean(updated.push_notifications),
      marketingEmails: Boolean(updated.marketing_emails),
      orderUpdates: Boolean(updated.order_updates),
    };
  }

  public async getCustomerPreferences(userId: string): Promise<CustomerPreferencesData> {
    const { data, error } = await this.supabase
      .from('customer_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return { favoriteIngredients: [] };
    }

    return {
      skinType: data.skin_type || undefined,
      fragrancePreference: data.fragrance_preference || undefined,
      favoriteIngredients: data.favorite_ingredients || [],
    };
  }

  public async updateCustomerPreferences(
    userId: string,
    data: Partial<CustomerPreferencesData>
  ): Promise<CustomerPreferencesData> {
    const { data: updated, error } = await this.supabase
      .from('customer_preferences')
      .upsert({
        user_id: userId,
        skin_type: data.skinType,
        fragrance_preference: data.fragrancePreference,
        favorite_ingredients: data.favoriteIngredients,
        updated_at: new Date().toISOString(),
      } as any)
      .select('*')
      .single();

    if (error) throw new Error(`Supabase Update Customer Preferences Error: ${error.message}`);

    return {
      skinType: updated.skin_type || undefined,
      fragrancePreference: updated.fragrance_preference || undefined,
      favoriteIngredients: updated.favorite_ingredients || [],
    };
  }
}
