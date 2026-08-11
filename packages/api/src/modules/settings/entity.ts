export interface AppSettingsProps {
  appName: string;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  standardShippingFee: number;
  contactEmail: string;
  supportPhone?: string;
}

export class AppSettingsEntity implements AppSettingsProps {
  public appName: string;
  public currency: string;
  public taxRate: number;
  public freeShippingThreshold: number;
  public standardShippingFee: number;
  public contactEmail: string;
  public supportPhone?: string;

  constructor(props: AppSettingsProps) {
    this.appName = props.appName || 'Cinmax';
    this.currency = props.currency || 'USD';
    this.taxRate = props.taxRate || 0.08;
    this.freeShippingThreshold = props.freeShippingThreshold || 50;
    this.standardShippingFee = props.standardShippingFee || 6.95;
    this.contactEmail = props.contactEmail || 'support@cinmax.com';
    this.supportPhone = props.supportPhone || '+1 (800) 555-CINMAX';
  }
}
