/**
 * Enhanced click-outside detection utility that handles browser autocomplete dropdowns
 * and other edge cases that can cause premature closing of hover cards.
 */

export interface ClickOutsideOptions {
  /** Delay in milliseconds before processing the outside click (default: 50ms) */
  delay?: number;
  /** Additional selector to exclude from outside click detection */
  excludeSelectors?: string[];
}

/**
 * Creates an enhanced click-outside handler that properly handles browser autocomplete
 * @param isOpen - Boolean indicating if the element should be listening for outside clicks
 * @param onOutsideClick - Callback function to execute when outside click is detected
 * @param cardSelector - CSS selector for the card element
 * @param triggerSelector - CSS selector for the trigger element
 * @param options - Additional configuration options
 * @returns Cleanup function to remove the event listener
 */
export const createClickOutsideHandler = (
  isOpen: boolean,
  onOutsideClick: () => void,
  cardSelector: string,
  triggerSelector: string,
  options: ClickOutsideOptions = {}
) => {
  const { excludeSelectors = [] } = options;

  const handleClickOutside = (event: MouseEvent) => {
    if (!isOpen) return;

    const target = event.target as HTMLElement;
    if (!target) return;

    // Check if click is within our card or trigger
    const card = document.querySelector(cardSelector);
    const trigger = document.querySelector(triggerSelector);
    
    if (
      (card && card.contains(target)) ||
      (trigger && trigger.contains(target)) ||
      target.closest(triggerSelector)
    ) {
      return;
    }

    // Check for excluded selectors
    if (excludeSelectors.some(selector => target.closest(selector))) {
      return;
    }

    // Call the callback directly
    onOutsideClick();
  };

  // Add event listener
  document.addEventListener('click', handleClickOutside);

  // Return cleanup function
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
};

/**
 * React hook for enhanced click-outside detection
 */
import { useEffect } from 'react';

export const useClickOutside = (
  isOpen: boolean,
  onOutsideClick: () => void,
  cardSelector: string,
  triggerSelector: string,
  options?: ClickOutsideOptions
) => {
  useEffect(() => {
    if (!isOpen) return;

    const cleanup = createClickOutsideHandler(
      isOpen,
      onOutsideClick,
      cardSelector,
      triggerSelector,
      options
    );

    return cleanup;
  }, [isOpen, onOutsideClick, cardSelector, triggerSelector, options]);
};