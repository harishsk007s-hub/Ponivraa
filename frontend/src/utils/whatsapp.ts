export const WHATSAPP_PHONE = '918098202289';
export const DISPLAY_PHONE = '+91 80982 02289';
export const BRAND_EMAIL = 'ponivraa@gmail.com';
export const FARM_LOCATION = 'Alagarkovil, Tamil Nadu';
export const GOOGLE_MAPS_LINK = 'https://maps.google.com/?q=Alagarkovil,+Tamil+Nadu';

/**
 * Builds direct WhatsApp URL with pre-filled text
 */
export const getWhatsAppUrl = (customMessage?: string): string => {
  const text = customMessage || 'Hello Ponivraa team, I would like to order fresh farm harvest from Alagarkovil.';
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
};

/**
 * Builds WhatsApp URL for a specific product enquiry / quick order
 */
export const getProductWhatsAppUrl = (
  productName: string,
  quantity: number = 1,
  price: number,
  variant?: string,
  isHoney?: boolean
): string => {
  const unitText = isHoney || variant ? variant || 'Jar' : `${quantity} KG`;
  const msg = 
`Hello Ponivraa Farm,
I would like to order:
- Product: ${productName}
- Variant / Quantity: ${unitText}
- Price: ₹${price}
- Total Estimate: ₹${price * quantity}

Please confirm availability for delivery from Alagarkovil.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
};

/**
 * Builds WhatsApp URL for completed order details in exact required format
 */
export const getOrderConfirmationWhatsAppUrl = (
  orderId: string,
  customerName: string,
  phone: string,
  address: string,
  items: Array<{ name: string; quantity: number; price: number; category?: string; selectedVariant?: string }>,
  totalAmount: number,
  pincode?: string
): string => {
  const itemsText = (items || [])
    .map((item) => {
      const isHoney = item.category === 'Honey' || (item.selectedVariant && item.selectedVariant !== 'kg');
      const variantStr = isHoney
        ? `(x${item.quantity} ${item.selectedVariant || 'Jar'})`
        : `(x${item.quantity} KG)`;
      const lineTotal = Number(item.price) * Number(item.quantity);
      return `▫️ *${item.name}* ${variantStr} - ₹${lineTotal}`;
    })
    .join('\n');

  const fullAddress =
    pincode && !address.includes(pincode)
      ? `${address.trim()}, ${pincode.trim()}`
      : address.trim();

  const msg = [
    `🛍️ *NEW ORDER PLACED - PONIVRAA FARM*`,
    ``,
    `📌 *Order ID:* ${orderId}`,
    ``,
    `👤 *Customer Details:*`,
    `- Name: ${customerName}`,
    `- Phone: ${phone}`,
    `- Address: ${fullAddress}`,
    ``,
    `📦 *Items Ordered:*`,
    itemsText,
    ``,
    `💰 *Total Amount:* ₹${totalAmount}`,
    `🚚 *Delivery:* FREE across Tamil Nadu`,
    `✅ *Status:* PENDING`,
    ``,
    `---`,
    `_I am sending this for order confirmation and will attach my payment screenshot below._`,
  ].join('\n');

  const cleanPhone = WHATSAPP_PHONE.replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedMessage = encodeURIComponent(msg);

  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
};
