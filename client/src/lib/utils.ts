import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class values using clsx and tailwind-merge
 * Used for conditional and dynamic class names in components
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats currency in USD format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Calculates the discounted price
 */
export function calculateDiscountedPrice(price: number, discountPercentage: number = 0): number {
  return price * (1 - discountPercentage / 100);
}

/**
 * Truncates text to a specific length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generates a random booking ID format
 */
export function generateBookingId(id: number): string {
  return `BK-${id.toString().padStart(7, '0')}`;
}

/**
 * Get star rating display for a given rating
 */
export function getStarRating(rating: number): { filled: number, half: boolean, empty: number } {
  const filled = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - filled - (half ? 1 : 0);
  
  return { filled, half, empty };
}
