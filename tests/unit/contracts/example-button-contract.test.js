/**
 * Contract Compliance Tests for Example Button
 * Tests against: .system/contracts/example-button-contract.md
 */

const ExampleButton = require('../../fixtures/button-component-mock');

describe('Example Button - Contract Compliance', () => {
  let container;

  beforeEach(() => {
    // Setup DOM container
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Cleanup
    document.body.removeChild(container);
  });

  describe('✅ Level 2: Inputs Validation', () => {
    test('should accept required props: label and containerId', () => {
      const button = new ExampleButton({
        label: 'Click Me',
        containerId: 'test-container'
      });

      expect(button).toBeDefined();
      expect(button.config.label).toBe('Click Me');
      expect(button.config.containerId).toBe('test-container');
    });

    test('should accept optional props: onClick, variant, disabled', () => {
      const mockOnClick = jest.fn();
      const button = new ExampleButton({
        label: 'Click Me',
        containerId: 'test-container',
        onClick: mockOnClick,
        variant: 'secondary',
        disabled: false
      });

      expect(button.config.onClick).toBe(mockOnClick);
      expect(button.config.variant).toBe('secondary');
      expect(button.config.disabled).toBe(false);
    });

    test('should throw error when label is missing', () => {
      expect(() => {
        new ExampleButton({
          containerId: 'test-container'
        });
      }).toThrow('label is required');
    });

    test('should throw error when containerId is missing', () => {
      expect(() => {
        new ExampleButton({
          label: 'Click Me'
        });
      }).toThrow('containerId is required');
    });

    test('should throw error when container does not exist', () => {
      expect(() => {
        new ExampleButton({
          label: 'Click Me',
          containerId: 'non-existent-container'
        });
      }).toThrow('Container #non-existent-container not found');
    });
  });

  describe('✅ Level 2: Outputs Validation', () => {
    let button;

    beforeEach(() => {
      button = new ExampleButton({
        label: 'Test Button',
        containerId: 'test-container'
      });
    });

    afterEach(() => {
      button.destroy();
    });

    test('should return element property', () => {
      expect(button.element).toBeInstanceOf(HTMLElement);
      expect(button.element.tagName).toBe('BUTTON');
    });

    test('should provide getCount method', () => {
      expect(typeof button.getCount).toBe('function');
      expect(button.getCount()).toBe(0);
    });

    test('should provide reset method', () => {
      expect(typeof button.reset).toBe('function');

      // Click button to increment count
      button.element.click();
      expect(button.getCount()).toBe(1);

      // Reset should set count back to 0
      button.reset();
      expect(button.getCount()).toBe(0);
    });

    test('should provide destroy method', () => {
      expect(typeof button.destroy).toBe('function');

      const element = button.element;
      button.destroy();

      expect(button.element).toBeNull();
      expect(document.body.contains(element)).toBe(false);
    });

    test('should emit onClick event with count', () => {
      const mockOnClick = jest.fn();
      const buttonWithCallback = new ExampleButton({
        label: 'Test',
        containerId: 'test-container',
        onClick: mockOnClick
      });

      buttonWithCallback.element.click();

      expect(mockOnClick).toHaveBeenCalledWith(
        expect.objectContaining({
          count: 1,
          timestamp: expect.any(Number),
          element: buttonWithCallback.element
        })
      );

      buttonWithCallback.destroy();
    });
  });

  describe('✅ Level 3: CSS Namespace Compliance', () => {
    test('should use .component-example-button prefix for all classes', () => {
      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-container'
      });

      const className = button.element.className;

      // Must start with component-example-button
      expect(className).toContain('component-example-button');

      // All classes should use the proper prefix
      const classes = className.split(' ');
      classes.forEach(cls => {
        expect(cls).toMatch(/^component-example-button/);
      });

      button.destroy();
    });

    test('should use variant-specific classes with proper namespace', () => {
      const variants = ['primary', 'secondary', 'danger', 'success'];

      variants.forEach(variant => {
        const button = new ExampleButton({
          label: 'Test',
          containerId: 'test-container',
          variant
        });

        expect(button.element.className).toContain(`component-example-button-${variant}`);
        button.destroy();
      });
    });

    test('should NOT use reserved classes: .btn, .button, .primary', () => {
      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-container',
        variant: 'primary'
      });

      const className = button.element.className;
      const classes = className.split(' ');

      // Should NOT contain these reserved standalone classes
      expect(classes).not.toContain('btn');
      expect(classes).not.toContain('button');
      expect(classes).not.toContain('primary'); // Standalone "primary" is reserved, but "component-example-button-primary" is OK

      button.destroy();
    });
  });

  describe('✅ Level 2: Event Emission', () => {
    test('should emit custom button-clicked event', (done) => {
      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-container'
      });

      button.element.addEventListener('button-clicked', (event) => {
        expect(event.detail).toEqual({
          count: 1,
          label: 'Test'
        });
        button.destroy();
        done();
      });

      button.element.click();
    });

    test('should increment count with each click', () => {
      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-container'
      });

      expect(button.getCount()).toBe(0);

      button.element.click();
      expect(button.getCount()).toBe(1);

      button.element.click();
      expect(button.getCount()).toBe(2);

      button.element.click();
      expect(button.getCount()).toBe(3);

      button.destroy();
    });
  });

  describe('✅ Level 2: DOM Requirements', () => {
    test('should render in correct container', () => {
      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-container'
      });

      const containerElement = document.getElementById('test-container');
      expect(containerElement.contains(button.element)).toBe(true);

      button.destroy();
    });

    test('should have proper data attribute', () => {
      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-container'
      });

      expect(button.element.getAttribute('data-component')).toBe('example-button');

      button.destroy();
    });

    test('should update text content with click count', () => {
      const button = new ExampleButton({
        label: 'Click Me',
        containerId: 'test-container'
      });

      expect(button.element.textContent).toBe('Click Me');

      button.element.click();
      expect(button.element.textContent).toBe('Click Me (1)');

      button.element.click();
      expect(button.element.textContent).toBe('Click Me (2)');

      button.destroy();
    });
  });

  describe('✅ Component Metadata for MCP', () => {
    test('should provide metadata for MCP registration', () => {
      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-container'
      });

      const metadata = button.getMetadata();

      expect(metadata).toEqual({
        name: 'example-button',
        cssNamespace: 'component-example-button',
        jsAPI: ['getCount', 'reset', 'destroy', 'getMetadata'],
        dependencies: [],
        events: ['button-clicked']
      });

      button.destroy();
    });
  });
});
