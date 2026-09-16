import type { Order, Address } from '@cinmax/types';
import { TaxEngine, type TaxResult } from './tax.engine';

export interface InvoiceDetails {
  invoiceNumber: string;
  orderNumber: string;
  issueDate: string;
  customerName: string;
  customerEmail?: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: Array<{
    title: string;
    sku?: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }>;
  subtotal: number;
  discountAmount: number;
  taxResult: TaxResult;
  shippingAmount: number;
  grandTotal: number;
  currency: string;
  paymentMethod: string;
  pdfExportPayload: {
    title: string;
    contentHtml: string;
  };
}

export class InvoiceEngine {
  public static generateInvoiceNumber(orderNumber: string): string {
    const year = new Date().getFullYear();
    const cleanNumber = orderNumber.replace(/[^0-9]/g, '').slice(-5) || Math.floor(10000 + Math.random() * 90000);
    return `INV-${year}-${cleanNumber}`;
  }

  public static createInvoice(order: Order): InvoiceDetails {
    const invoiceNumber = this.generateInvoiceNumber(order.orderNumber);
    const issueDate = new Date().toISOString();

    const itemsSubtotal = order.itemsSubtotal ?? order.subtotal ?? 0;
    const discountAmount = order.discountAmount ?? order.discountTotal ?? 0;
    const shippingAmount = order.shippingAmount ?? order.shippingTotal ?? 0;

    const taxResult = TaxEngine.calculateTax({
      subtotal: Math.max(0, itemsSubtotal - discountAmount),
      gstRate: 18,
      isIntraState: true,
    });

    const items = (order.items || []).map((item) => ({
      title: item.productTitle + (item.variantTitle ? ` (${item.variantTitle})` : ''),
      sku: item.sku,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }));

    const deliveryText = shippingAmount === 0 ? 'FREE' : `₹${shippingAmount}`;

    const pdfHtml = `
      <div style="font-family: serif; padding: 32px; color: #191C1E;">
        <h2>CINMAX GLOBAL BOTANICAL ATELIER</h2>
        <h3>TAX INVOICE: ${invoiceNumber}</h3>
        <p>Order Reference: ${order.orderNumber} | Date: ${new Date(issueDate).toLocaleDateString()}</p>
        <hr/>
        <p>Subtotal: ₹${itemsSubtotal}</p>
        <p>Discount: -₹${discountAmount}</p>
        <p>Delivery Charges: ${deliveryText}</p>
        <p><strong>Grand Total:</strong> ₹${order.grandTotal} (${order.currency || 'INR'})</p>
      </div>
    `;

    return {
      invoiceNumber,
      orderNumber: order.orderNumber,
      issueDate,
      customerName: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Customer',
      customerEmail: order.shippingAddress?.email,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      items,
      subtotal: itemsSubtotal,
      discountAmount,
      taxResult,
      shippingAmount,
      grandTotal: order.grandTotal,
      currency: order.currency || 'INR',
      paymentMethod: order.paymentMethod || 'razorpay',
      pdfExportPayload: {
        title: `Invoice_${invoiceNumber}.pdf`,
        contentHtml: pdfHtml,
      },
    };
  }
}
