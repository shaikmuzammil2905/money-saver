// OTTMoneySaver Central Payment & Contact Configuration

export const DEFAULT_PAYMENT_CONFIG = {
  // Google Pay UPI link or web payment link
  gpayLink: 'upi://pay?pa=6305151531@ybl&pn=OTTMoneySaver&cu=INR',
  
  // PhonePe UPI link or web payment link
  phonepeLink: 'upi://pay?pa=6305151531@ybl&pn=OTTMoneySaver&cu=INR',
  
  // Fallback UPI ID for copy-paste
  upiId: '6305151531@ybl',

  // Official WhatsApp Order Numbers (without + symbol)
  whatsappNumber: '916305151531',           // Primary WhatsApp
  whatsappNumberSecondary: '917013931261',  // Secondary WhatsApp

  // Contact Phone Numbers
  phoneNumber: '6305151531',                // Primary Phone
  phoneNumberSecondary: '7013931261',       // Secondary Phone

  // Location / Address
  businessLocation: 'Hyderabad, Telangana, India'
};
