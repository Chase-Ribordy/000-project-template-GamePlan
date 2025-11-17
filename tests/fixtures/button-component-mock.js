/**
 * Mock implementation of Example Button Component
 * Based on: .system/contracts/example-button-contract.md
 */

class ExampleButton {
  constructor(config) {
    this.config = config;
    this.clickCount = 0;
    this.element = null;
    this.validateInputs(config);
    this.render();
  }

  /**
   * Validate required inputs per contract
   */
  validateInputs(config) {
    if (!config.label) {
      throw new Error('ExampleButton: label is required');
    }
    if (!config.containerId) {
      throw new Error('ExampleButton: containerId is required');
    }
  }

  /**
   * Render the button element
   */
  render() {
    const container = document.getElementById(this.config.containerId);
    if (!container) {
      throw new Error(`ExampleButton: Container #${this.config.containerId} not found`);
    }

    // Create button with proper CSS namespace
    this.element = document.createElement('button');
    this.element.className = this.getButtonClass();
    this.element.textContent = this.config.label;
    this.element.setAttribute('data-component', 'example-button');

    // Attach click handler
    this.element.addEventListener('click', this.handleClick.bind(this));

    // Append to container
    container.appendChild(this.element);
  }

  /**
   * Get button class based on variant (CSS Contract: .component-example-button-)
   */
  getButtonClass() {
    const base = 'component-example-button';
    const variant = this.config.variant || 'primary';
    return `${base} ${base}-${variant}`;
  }

  /**
   * Handle click events
   */
  handleClick(event) {
    this.clickCount++;

    // Update button text with count
    this.element.textContent = `${this.config.label} (${this.clickCount})`;

    // Call user's onClick callback if provided
    if (this.config.onClick) {
      this.config.onClick({
        count: this.clickCount,
        timestamp: Date.now(),
        element: this.element
      });
    }

    // Emit custom event
    const customEvent = new CustomEvent('button-clicked', {
      detail: {
        count: this.clickCount,
        label: this.config.label
      }
    });
    this.element.dispatchEvent(customEvent);
  }

  /**
   * API: Get current click count
   */
  getCount() {
    return this.clickCount;
  }

  /**
   * API: Reset click count
   */
  reset() {
    this.clickCount = 0;
    this.element.textContent = this.config.label;
  }

  /**
   * API: Destroy component and cleanup
   */
  destroy() {
    if (this.element) {
      this.element.removeEventListener('click', this.handleClick);
      this.element.remove();
      this.element = null;
    }
  }

  /**
   * API: Get component metadata for MCP registration
   */
  getMetadata() {
    return {
      name: 'example-button',
      cssNamespace: 'component-example-button',
      jsAPI: ['getCount', 'reset', 'destroy', 'getMetadata'],
      dependencies: [],
      events: ['button-clicked']
    };
  }
}

module.exports = ExampleButton;
