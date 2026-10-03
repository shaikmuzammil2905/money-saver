// Authoritative Coupon & Timezone Utility for OTTMoneySaver
// Business Timezone: Asia/Kolkata (IST = UTC + 5 hours 30 minutes)

export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/**
 * Returns current timestamp in milliseconds
 */
export function getNowMs() {
  return Date.now();
}

/**
 * Parses any ISO / date string safely to UTC milliseconds
 */
export function parseDateToMs(dateVal) {
  if (!dateVal) return null;
  const d = new Date(dateVal);
  const time = d.getTime();
  return isNaN(time) ? null : time;
}

/**
 * Converts a UTC ISO string into an HTML <input type="datetime-local"> format (YYYY-MM-DDTHH:mm) in IST
 */
export function toISTDatetimeLocal(isoString) {
  if (!isoString) return '';
  try {
    const utcMs = parseDateToMs(isoString);
    if (!utcMs) return '';
    const istDate = new Date(utcMs + IST_OFFSET_MS);
    const pad = (n) => String(n).padStart(2, '0');
    return `${istDate.getUTCFullYear()}-${pad(istDate.getUTCMonth() + 1)}-${pad(istDate.getUTCDate())}T${pad(istDate.getUTCHours())}:${pad(istDate.getUTCMinutes())}`;
  } catch {
    return '';
  }
}

/**
 * Converts an HTML <input type="datetime-local"> (YYYY-MM-DDTHH:mm) entered in IST into a UTC ISO string
 */
export function fromISTDatetimeLocalToISO(datetimeLocal) {
  if (!datetimeLocal || !datetimeLocal.trim()) return null;
  try {
    const [datePart, timePart] = datetimeLocal.split('T');
    if (!datePart || !timePart) return null;
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) return null;

    // Interpret (year, month, day, hour, minute) as IST time, subtract 5.5 hours to get UTC
    const utcMs = Date.UTC(year, month - 1, day, hour, minute, 0, 0) - IST_OFFSET_MS;
    return new Date(utcMs).toISOString();
  } catch {
    return null;
  }
}

/**
 * Formats a date value into human-readable IST string: "DD Mon YYYY hh:mm AM/PM IST"
 */
export function formatIST(dateVal) {
  if (!dateVal) return '—';
  try {
    const utcMs = parseDateToMs(dateVal);
    if (!utcMs) return String(dateVal);
    const istDate = new Date(utcMs + IST_OFFSET_MS);
    const pad = (n) => String(n).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const h = istDate.getUTCHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${pad(istDate.getUTCDate())} ${months[istDate.getUTCMonth()]} ${istDate.getUTCFullYear()} ${pad(h12)}:${pad(istDate.getUTCMinutes())} ${ampm} IST`;
  } catch {
    return String(dateVal);
  }
}

/**
 * Single Authoritative Coupon Status Determination
 * Status Lifecycle:
 * - is_active === false -> DISABLED
 * - start_at > current time -> SCHEDULED
 * - expires_at <= current time -> EXPIRED
 * - otherwise -> ACTIVE
 */
export function getCouponStatus(coupon, nowMs = Date.now()) {
  if (!coupon) return { status: 'DISABLED', label: 'Disabled', color: 'slate' };

  if (coupon.is_active === false) {
    return { status: 'DISABLED', label: 'Disabled', color: 'slate' };
  }

  const startMs = parseDateToMs(coupon.starts_at);
  if (startMs && nowMs < startMs) {
    return { status: 'SCHEDULED', label: 'Scheduled', color: 'blue' };
  }

  const expMs = parseDateToMs(coupon.expires_at);
  if (expMs && nowMs >= expMs) {
    return { status: 'EXPIRED', label: 'Expired', color: 'red' };
  }

  return { status: 'ACTIVE', label: 'Active', color: 'emerald' };
}

/**
 * Comprehensive Coupon Validation against cart
 */
export function validateCouponAgainstCart(coupon, cartTotal = 0, cartItems = [], nowMs = Date.now()) {
  if (!coupon) {
    return { valid: false, message: 'Coupon not found.' };
  }

  const statusObj = getCouponStatus(coupon, nowMs);

  if (statusObj.status === 'DISABLED') {
    return { valid: false, message: 'Coupon is disabled.' };
  }

  if (statusObj.status === 'SCHEDULED') {
    return { valid: false, message: 'Coupon is not active yet.' };
  }

  if (statusObj.status === 'EXPIRED') {
    return { valid: false, isExpired: true, message: 'This coupon has expired.' };
  }

  // Check Usage Limit
  if (coupon.usage_limit && Number(coupon.usage_limit) > 0) {
    const usedCount = Number(coupon.used_count || 0);
    if (usedCount >= Number(coupon.usage_limit)) {
      return { valid: false, message: 'Coupon usage limit reached.' };
    }
  }

  // Check Minimum Order Amount
  if (coupon.min_order_amount && cartTotal < Number(coupon.min_order_amount)) {
    return {
      valid: false,
      message: `Minimum order amount of ₹${Number(coupon.min_order_amount).toLocaleString()} not met.`
    };
  }

  // Check Applicable Categories / Products
  let eligibleTotal = cartTotal;

  if (coupon.apply_to === 'categories' && Array.isArray(coupon.allowed_categories) && coupon.allowed_categories.length > 0) {
    const allowed = coupon.allowed_categories.map((c) => String(c).toLowerCase());
    const matchingItems = cartItems.filter((item) => {
      const itemCat = String(item.category || item.categoryGroup || '').toLowerCase();
      return allowed.some((a) => itemCat.includes(a) || a.includes(itemCat));
    });

    if (matchingItems.length === 0) {
      return { valid: false, message: 'Coupon is not applicable to the items in your cart.' };
    }
    eligibleTotal = matchingItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  } else if (coupon.apply_to === 'products' && Array.isArray(coupon.allowed_product_ids) && coupon.allowed_product_ids.length > 0) {
    const allowedIds = coupon.allowed_product_ids.map((id) => String(id).toLowerCase());
    const matchingItems = cartItems.filter((item) =>
      allowedIds.includes(String(item.id || '').toLowerCase()) ||
      allowedIds.includes(String(item.slug_id || '').toLowerCase()) ||
      allowedIds.includes(String(item.productId || '').toLowerCase())
    );

    if (matchingItems.length === 0) {
      return { valid: false, message: 'Coupon is not applicable to the selected products in your cart.' };
    }
    eligibleTotal = matchingItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  }

  // Calculate Discount Amount
  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = Math.round((eligibleTotal * Number(coupon.discount_value)) / 100);
    if (coupon.max_discount && Number(coupon.max_discount) > 0) {
      discount = Math.min(discount, Number(coupon.max_discount));
    }
  } else {
    discount = Number(coupon.discount_value) || 0;
  }

  if (discount > eligibleTotal) discount = eligibleTotal;
  if (discount > cartTotal) discount = cartTotal;
  if (discount < 0) discount = 0;

  return {
    valid: true,
    coupon,
    discount,
    message: `Coupon "${coupon.code}" applied successfully! (₹${discount.toLocaleString()} savings)`
  };
}
