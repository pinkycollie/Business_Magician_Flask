/**
 * 360 Business Magician - Plop Generator Configuration
 * Automated code generation for rapid development
 */

export default function (plop) {
  // Business Component Generator
  plop.setGenerator('business-component', {
    description: 'Generate a new business component with full functionality',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (e.g., BusinessPlan, TaskManager):',
        validate: (input) => input.length > 0 || 'Component name is required'
      },
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: [
          { name: 'Business Tool', value: 'tool' },
          { name: 'ASL Video Component', value: 'asl' },
          { name: 'Dashboard Widget', value: 'widget' },
          { name: 'Form Component', value: 'form' },
          { name: 'API Endpoint', value: 'api' }
        ]
      },
      {
        type: 'confirm',
        name: 'aslSupport',
        message: 'Include ASL video support?',
        default: true
      },
      {
        type: 'confirm',
        name: 'database',
        message: 'Include database schema?',
        default: false
      }
    ],
    actions: function(data) {
      const actions = [];
      
      // Generate React component
      if (data.type !== 'api') {
        actions.push({
          type: 'add',
          path: 'client/src/components/{{kebabCase name}}/{{pascalCase name}}.tsx',
          templateFile: 'templates/component.tsx.hbs'
        });
      }
      
      // Generate HTMX view
      actions.push({
        type: 'add',
        path: 'views/{{kebabCase name}}.html',
        templateFile: 'templates/htmx-view.html.hbs'
      });
      
      // Generate API routes
      if (data.type === 'api' || data.database) {
        actions.push({
          type: 'add',
          path: 'server/routes/{{kebabCase name}}.ts',
          templateFile: 'templates/api-route.ts.hbs'
        });
      }
      
      // Generate database schema
      if (data.database) {
        actions.push({
          type: 'modify',
          path: 'shared/schema.ts',
          pattern: '// PLOP_INJECT_SCHEMA',
          template: `
// {{pascalCase name}} Schema
export const {{camelCase name}}Table = pgTable('{{snake_case name}}', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const {{camelCase name}}Relations = relations({{camelCase name}}Table, ({ many }) => ({
  // Add relations here
}));

export type {{pascalCase name}} = typeof {{camelCase name}}Table.$inferSelect;
export type Insert{{pascalCase name}} = typeof {{camelCase name}}Table.$inferInsert;

// PLOP_INJECT_SCHEMA`
        });
      }
      
      return actions;
    }
  });

  // API Endpoint Generator
  plop.setGenerator('api-endpoint', {
    description: 'Generate RESTful API endpoint with full CRUD operations',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'API endpoint name (e.g., businesses, tasks):',
        validate: (input) => input.length > 0 || 'Endpoint name is required'
      },
      {
        type: 'checkbox',
        name: 'methods',
        message: 'HTTP methods to generate:',
        choices: [
          { name: 'GET (List & Detail)', value: 'get', checked: true },
          { name: 'POST (Create)', value: 'post', checked: true },
          { name: 'PUT (Update)', value: 'put', checked: true },
          { name: 'DELETE (Remove)', value: 'delete', checked: false }
        ]
      },
      {
        type: 'confirm',
        name: 'auth',
        message: 'Require authentication?',
        default: true
      },
      {
        type: 'confirm',
        name: 'validation',
        message: 'Include Zod validation?',
        default: true
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'server/routes/{{kebabCase name}}.ts',
        templateFile: 'templates/api-crud.ts.hbs'
      },
      {
        type: 'modify',
        path: 'server/routes.ts',
        pattern: '// PLOP_INJECT_ROUTES',
        template: `
  // {{pascalCase name}} routes
  app.use('/api/{{kebabCase name}}', (await import('./routes/{{kebabCase name}}.js')).default);
  
  // PLOP_INJECT_ROUTES`
      }
    ]
  });

  // ASL Video Component Generator
  plop.setGenerator('asl-component', {
    description: 'Generate ASL video component with accessibility features',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'ASL component name:',
        validate: (input) => input.length > 0 || 'Component name is required'
      },
      {
        type: 'input',
        name: 'videoUrl',
        message: 'Default ASL video URL (optional):',
        default: ''
      },
      {
        type: 'list',
        name: 'context',
        message: 'Usage context:',
        choices: [
          { name: 'Business Formation', value: 'formation' },
          { name: 'Task Instructions', value: 'instructions' },
          { name: 'Tool Tutorial', value: 'tutorial' },
          { name: 'General Information', value: 'general' }
        ]
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'client/src/components/asl/{{pascalCase name}}ASL.tsx',
        templateFile: 'templates/asl-component.tsx.hbs'
      },
      {
        type: 'add',
        path: 'views/asl/{{kebabCase name}}-asl.html',
        templateFile: 'templates/asl-view.html.hbs'
      }
    ]
  });

  // Business Tool Generator
  plop.setGenerator('business-tool', {
    description: 'Generate complete business tool with dashboard integration',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Tool name (e.g., BusinessPlanGenerator, FinancialCalculator):',
        validate: (input) => input.length > 0 || 'Tool name is required'
      },
      {
        type: 'list',
        name: 'category',
        message: 'Tool category:',
        choices: [
          { name: 'Planning & Strategy', value: 'planning' },
          { name: 'Financial Management', value: 'financial' },
          { name: 'Marketing & Sales', value: 'marketing' },
          { name: 'Operations', value: 'operations' },
          { name: 'Legal & Compliance', value: 'legal' }
        ]
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Tool features:',
        choices: [
          { name: 'Data Export (PDF/Excel)', value: 'export' },
          { name: 'Real-time Collaboration', value: 'collaboration' },
          { name: 'AI Assistance', value: 'ai' },
          { name: 'Progress Tracking', value: 'progress' },
          { name: 'Template Library', value: 'templates' }
        ]
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'client/src/tools/{{kebabCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'templates/business-tool.tsx.hbs'
      },
      {
        type: 'add',
        path: 'views/tools/{{kebabCase name}}.html',
        templateFile: 'templates/tool-view.html.hbs'
      },
      {
        type: 'add',
        path: 'server/services/{{kebabCase name}}Service.ts',
        templateFile: 'templates/tool-service.ts.hbs'
      }
    ]
  });

  // Complete Feature Generator
  plop.setGenerator('feature', {
    description: 'Generate complete feature with frontend, backend, and database',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Feature name (e.g., ProjectManagement, TeamCollaboration):',
        validate: (input) => input.length > 0 || 'Feature name is required'
      },
      {
        type: 'confirm',
        name: 'hasAuth',
        message: 'Requires user authentication?',
        default: true
      },
      {
        type: 'confirm',
        name: 'hasRealtime',
        message: 'Include real-time features (WebSocket)?',
        default: false
      },
      {
        type: 'confirm',
        name: 'hasAI',
        message: 'Include AI integration?',
        default: false
      }
    ],
    actions: function(data) {
      const actions = [
        // Frontend components
        {
          type: 'add',
          path: 'client/src/pages/{{kebabCase name}}/{{pascalCase name}}Page.tsx',
          templateFile: 'templates/feature-page.tsx.hbs'
        },
        {
          type: 'add',
          path: 'client/src/hooks/use{{pascalCase name}}.tsx',
          templateFile: 'templates/feature-hook.tsx.hbs'
        },
        // Backend API
        {
          type: 'add',
          path: 'server/routes/{{kebabCase name}}.ts',
          templateFile: 'templates/feature-api.ts.hbs'
        },
        // Database schema
        {
          type: 'modify',
          path: 'shared/schema.ts',
          pattern: '// PLOP_INJECT_SCHEMA',
          templateFile: 'templates/feature-schema.ts.hbs'
        },
        // HTMX view
        {
          type: 'add',
          path: 'views/{{kebabCase name}}.html',
          templateFile: 'templates/feature-view.html.hbs'
        }
      ];

      // Add WebSocket handler if real-time features requested
      if (data.hasRealtime) {
        actions.push({
          type: 'add',
          path: 'server/websocket/{{kebabCase name}}Handler.ts',
          templateFile: 'templates/websocket-handler.ts.hbs'
        });
      }

      // Add AI service if AI integration requested
      if (data.hasAI) {
        actions.push({
          type: 'add',
          path: 'server/services/{{kebabCase name}}AIService.ts',
          templateFile: 'templates/ai-service.ts.hbs'
        });
      }

      return actions;
    }
  });

  // Test Generator
  plop.setGenerator('test', {
    description: 'Generate test files for existing components',
    prompts: [
      {
        type: 'input',
        name: 'componentPath',
        message: 'Path to component to test (relative to src/):',
        validate: (input) => input.length > 0 || 'Component path is required'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'client/src/{{componentPath}}.test.tsx',
        templateFile: 'templates/test.tsx.hbs'
      }
    ]
  });

  // Custom helpers
  plop.setHelper('snake_case', (text) => {
    return plop.getHelper('kebabCase')(text).replace(/-/g, '_');
  });
}