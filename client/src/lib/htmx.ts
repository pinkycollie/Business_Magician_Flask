/**
 * HTMX integration utilities
 * This file provides helpers for using HTMX with React components
 */

// Initialize HTMX when needed
export const initializeHtmx = (): void => {
  // Check if HTMX is already in the window object
  if (!(window as any).htmx) {
    console.warn('HTMX not found in window object. Make sure it is loaded properly.');
    return;
  }
  
  // Process any HTMX elements that might have been added by React
  (window as any).htmx.process(document.body);
};

// Process HTMX on a specific element
export const processHtmx = (element: HTMLElement): void => {
  if (!(window as any).htmx) {
    console.warn('HTMX not found in window object. Make sure it is loaded properly.');
    return;
  }
  
  (window as any).htmx.process(element);
};

// Add custom HTMX event handlers
export const addHtmxEventListener = (element: HTMLElement, event: string, handler: (event: Event) => void): void => {
  element.addEventListener(`htmx:${event}`, handler);
};

// Remove custom HTMX event handlers
export const removeHtmxEventListener = (element: HTMLElement, event: string, handler: (event: Event) => void): void => {
  element.removeEventListener(`htmx:${event}`, handler);
};

// Trigger HTMX request manually
export const triggerHtmxRequest = (element: HTMLElement): void => {
  if (!(window as any).htmx) {
    console.warn('HTMX not found in window object. Make sure it is loaded properly.');
    return;
  }
  
  (window as any).htmx.trigger(element, 'htmx:trigger');
};

// Add HTMX attributes to an element dynamically
export const addHtmxAttributes = (element: HTMLElement, attributes: Record<string, string>): void => {
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  
  // Process the element to activate HTMX
  if ((window as any).htmx) {
    (window as any).htmx.process(element);
  }
};

// Custom hook pattern (to be used in a React component)
export const useHtmxAfterRender = (callback: () => void): void => {
  setTimeout(() => {
    if ((window as any).htmx) {
      callback();
    }
  }, 0);
};
