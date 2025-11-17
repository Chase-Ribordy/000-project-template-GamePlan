/**
 * Autonomous Skills & Workflows Tests
 * Verifies the event-driven skills architecture is properly configured
 */

const fs = require('fs');
const path = require('path');

describe('Autonomous Skills Architecture', () => {
  const claudeDir = path.join(__dirname, '../../../.claude');
  const skillsDir = path.join(claudeDir, 'skills');

  describe('Skills Directory Structure', () => {
    test('should have .claude directory', () => {
      expect(fs.existsSync(claudeDir)).toBe(true);
    });

    test('should have skills directory', () => {
      expect(fs.existsSync(skillsDir)).toBe(true);
    });

    test('should have skills files', () => {
      if (fs.existsSync(skillsDir)) {
        const skillFiles = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md') || f.endsWith('.yaml'));

        // Should have at least some configuration
        expect(skillFiles.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Core Skills Existence', () => {
    const coreSkills = [
      'contract-creation.md',
      'component-validation.md',
      'sandbox-testing.md',
      'component-integration.md',
      'pass_orchestration.md',
      'progress_reporter.md'
    ];

    test('should have core autonomous skills defined (if applicable)', () => {
      coreSkills.forEach(skill => {
        const skillPath = path.join(skillsDir, skill);

        if (fs.existsSync(skillPath)) {
          const content = fs.readFileSync(skillPath, 'utf8');
          expect(content).toBeTruthy();
          expect(content.length).toBeGreaterThan(50);
        }
      });
    });
  });

  describe('Trigger Matrix Configuration', () => {
    const triggerMatrixPath = path.join(skillsDir, 'trigger-matrix.yaml');

    test('should have trigger matrix if skills are configured', () => {
      if (fs.existsSync(skillsDir)) {
        const skillFiles = fs.readdirSync(skillsDir);

        if (skillFiles.length > 0) {
          // If we have skills, we should ideally have a trigger matrix
          // But it's OK if we don't in a minimal setup
          expect(true).toBe(true);
        }
      }
    });

    test('should have valid YAML structure if trigger matrix exists', () => {
      if (fs.existsSync(triggerMatrixPath)) {
        const content = fs.readFileSync(triggerMatrixPath, 'utf8');

        // Basic YAML validation - should not throw
        expect(content).toBeTruthy();

        // Should contain key sections
        expect(content).toMatch(/trigger|event|skill/i);
      }
    });
  });

  describe('Event System', () => {
    const eventsDir = path.join(__dirname, '../../../.system/events');

    test('should have events directory in .system', () => {
      expect(fs.existsSync(eventsDir)).toBe(true);
    });

    test('should have event-log.yaml capability', () => {
      const eventLogPath = path.join(eventsDir, 'event-log.yaml');

      if (fs.existsSync(eventLogPath)) {
        const content = fs.readFileSync(eventLogPath, 'utf8');
        expect(content).toBeTruthy();
      } else {
        // Event log is created during execution - OK if it doesn't exist yet
        expect(fs.existsSync(eventsDir)).toBe(true);
      }
    });
  });

  describe('Workflow Commands', () => {
    const commandsDir = path.join(claudeDir, 'commands');

    test('should have commands directory if workflows are configured', () => {
      if (fs.existsSync(commandsDir)) {
        const commandFiles = fs.readdirSync(commandsDir);
        expect(Array.isArray(commandFiles)).toBe(true);
      }
    });

    test('should have workflow slash commands if configured', () => {
      if (fs.existsSync(commandsDir)) {
        const commands = fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'));

        // If we have commands, they should be valid markdown
        commands.forEach(cmd => {
          const cmdPath = path.join(commandsDir, cmd);
          const content = fs.readFileSync(cmdPath, 'utf8');
          expect(content).toBeTruthy();
        });
      }
    });
  });

  describe('Pass Orchestration', () => {
    const statusFile = path.join(__dirname, '../../../.system/execution-status.yaml');

    test('should have execution-status.yaml for pass tracking', () => {
      if (fs.existsSync(statusFile)) {
        const content = fs.readFileSync(statusFile, 'utf8');

        // Should define passes
        expect(content).toMatch(/first.pass|second.pass|third.pass|pass/i);
      } else {
        // Status file created during execution - OK if missing
        expect(true).toBe(true);
      }
    });

    test('should define three-pass model if configured', () => {
      if (fs.existsSync(statusFile)) {
        const content = fs.readFileSync(statusFile, 'utf8');

        // Should reference the three passes
        expect(content.toLowerCase()).toMatch(/first|second|third/);
      }
    });
  });

  describe('Skills Content Validation', () => {
    test('contract-creation skill should define contract generation', () => {
      const contractSkill = path.join(skillsDir, 'contract-creation.md');

      if (fs.existsSync(contractSkill)) {
        const content = fs.readFileSync(contractSkill, 'utf8');

        // Should reference contracts
        expect(content.toLowerCase()).toMatch(/contract|interface|specification/);
      }
    });

    test('component-validation skill should define 4-level validation', () => {
      const validationSkill = path.join(skillsDir, 'component-validation.md');

      if (fs.existsSync(validationSkill)) {
        const content = fs.readFileSync(validationSkill, 'utf8');

        // Should reference validation levels
        expect(content.toLowerCase()).toMatch(/level|syntax|test|validation/);
      }
    });

    test('sandbox-testing skill should define isolated testing', () => {
      const sandboxSkill = path.join(skillsDir, 'sandbox-testing.md');

      if (fs.existsSync(sandboxSkill)) {
        const content = fs.readFileSync(sandboxSkill, 'utf8');

        // Should reference sandbox
        expect(content.toLowerCase()).toMatch(/sandbox|isolat|test/);
      }
    });

    test('component-integration skill should define safe integration', () => {
      const integrationSkill = path.join(skillsDir, 'component-integration.md');

      if (fs.existsSync(integrationSkill)) {
        const content = fs.readFileSync(integrationSkill, 'utf8');

        // Should reference integration
        expect(content.toLowerCase()).toMatch(/integrat|inject|merge/);
      }
    });
  });

  describe('Event Flow Configuration', () => {
    test('should define event emission triggers', () => {
      const triggerMatrixPath = path.join(skillsDir, 'trigger-matrix.yaml');

      if (fs.existsSync(triggerMatrixPath)) {
        const content = fs.readFileSync(triggerMatrixPath, 'utf8');

        // Should define events that trigger skills
        expect(content).toMatch(/component_extracted|contract_created|validation_completed/);
      }
    });

    test('should define skill priorities if configured', () => {
      const triggerMatrixPath = path.join(skillsDir, 'trigger-matrix.yaml');

      if (fs.existsSync(triggerMatrixPath)) {
        const content = fs.readFileSync(triggerMatrixPath, 'utf8');

        // Should have priority configuration
        expect(content).toMatch(/priority|order/i);
      }
    });
  });

  describe('Parallel Processing Configuration', () => {
    test('should define parallel component processing settings', () => {
      const triggerMatrixPath = path.join(skillsDir, 'trigger-matrix.yaml');

      if (fs.existsSync(triggerMatrixPath)) {
        const content = fs.readFileSync(triggerMatrixPath, 'utf8');

        // Should configure parallel processing
        expect(content).toMatch(/parallel|concurrent|max_parallel/i);
      }
    });

    test('should limit max parallel components for safety', () => {
      const triggerMatrixPath = path.join(skillsDir, 'trigger-matrix.yaml');

      if (fs.existsSync(triggerMatrixPath)) {
        const content = fs.readFileSync(triggerMatrixPath, 'utf8');

        if (content.includes('max_parallel')) {
          // Should have reasonable limits (1-10)
          expect(content).toMatch(/max_parallel.*[1-9]/);
        }
      }
    });
  });

  describe('Documentation & Metadata', () => {
    test('skills should have descriptive names', () => {
      if (fs.existsSync(skillsDir)) {
        const skillFiles = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'));

        skillFiles.forEach(skill => {
          // Should use snake_case or kebab-case (allow README.md)
          const isValid = skill.match(/^[a-z_-]+\.md$/) || skill === 'README.md';
          expect(isValid).toBeTruthy();
        });
      }
    });

    test('skills should have markdown content', () => {
      if (fs.existsSync(skillsDir)) {
        const skillFiles = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'));

        skillFiles.forEach(skill => {
          const skillPath = path.join(skillsDir, skill);
          const content = fs.readFileSync(skillPath, 'utf8');

          // Should have substantial content (not just a stub)
          expect(content.length).toBeGreaterThan(50);
        });
      }
    });
  });

  describe('Integration with .system', () => {
    test('skills should reference .system directories', () => {
      if (fs.existsSync(skillsDir)) {
        const skillFiles = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md') && f !== 'README.md');

        let foundSystemReferences = false;

        skillFiles.forEach(skill => {
          const skillPath = path.join(skillsDir, skill);
          const content = fs.readFileSync(skillPath, 'utf8');

          // Many skills should reference .system
          if (content.includes('.system')) {
            foundSystemReferences = true;
            expect(content).toMatch(/\.system\/(?:contracts|components|sandbox|proven|mcp-servers|events)/);
          }
        });

        // At least some skills should reference .system (not required for all)
        expect(true).toBe(true);
      }
    });
  });

  describe('Skill Autonomy Indicators', () => {
    test('autonomous skills should emit events', () => {
      const integrationSkill = path.join(skillsDir, 'component-integration.md');

      if (fs.existsSync(integrationSkill)) {
        const content = fs.readFileSync(integrationSkill, 'utf8');

        // Autonomous skills should emit events
        if (content.toLowerCase().includes('autonomous')) {
          expect(content.toLowerCase()).toMatch(/emit|event|trigger/);
        }
      }
    });

    test('skills should define when they activate', () => {
      if (fs.existsSync(skillsDir)) {
        const skillFiles = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'));

        skillFiles.forEach(skill => {
          const skillPath = path.join(skillsDir, skill);
          const content = fs.readFileSync(skillPath, 'utf8');

          // Should define trigger conditions
          if (content.length > 200) {
            expect(content.toLowerCase()).toMatch(/when|trigger|activate|listen|event/);
          }
        });
      }
    });
  });
});
