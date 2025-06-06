# 360 Business Magician - Automated Code Generation

A comprehensive code generation system for rapidly building deaf-first business applications with full accessibility support.

## Quick Start

### Using Plop Generators (Recommended)

```bash
# Install plop globally
npm install -g plop

# Generate a new business component
plop business-component

# Generate a complete feature
plop feature

# Generate ASL video component
plop asl-component

# Generate API endpoint
plop api-endpoint

# Generate business tool
plop business-tool
```

### Using Yeoman Generator

```bash
# Install Yeoman and the generator
npm install -g yo generator-360-business-magician

# Create a new project
yo 360-business-magician

# Or create specific components
yo 360-business-magician:component
yo 360-business-magician:asl
yo 360-business-magician:tool
```

## Available Generators

### 1. Business Component Generator
Creates React components with optional ASL support and database integration.

**Features:**
- React component with TypeScript
- HTMX view template
- ASL video integration
- Database schema (optional)
- API routes (optional)

**Usage:**
```bash
plop business-component
```

### 2. ASL Component Generator
Specialized generator for ASL video components with accessibility features.

**Features:**
- Video player with custom controls
- Transcript support
- Speed adjustment
- Captions and subtitles
- Mobile-responsive design

**Usage:**
```bash
plop asl-component
```

### 3. API Endpoint Generator
Creates RESTful API endpoints with full CRUD operations.

**Features:**
- GET, POST, PUT, DELETE routes
- Zod validation
- Authentication middleware
- Error handling
- TypeScript types

**Usage:**
```bash
plop api-endpoint
```

### 4. Business Tool Generator
Generates complete business tools with dashboard integration.

**Features:**
- Tool interface components
- Service layer
- Database integration
- Export capabilities
- Progress tracking

**Usage:**
```bash
plop business-tool
```

### 5. Complete Feature Generator
Creates full-stack features with frontend, backend, and database components.

**Features:**
- React pages and hooks
- API routes
- Database schema
- HTMX views
- WebSocket support (optional)
- AI integration (optional)

**Usage:**
```bash
plop feature
```

## Template Customization

### Adding Custom Templates

1. Create new template files in the `templates/` directory
2. Use Handlebars syntax for variable substitution
3. Add the template to `plopfile.js`

Example template structure:
```
templates/
├── component.tsx.hbs
├── htmx-view.html.hbs
├── api-route.ts.hbs
├── asl-component.tsx.hbs
└── custom-template.hbs
```

### Template Variables

Common variables available in all templates:
- `{{name}}` - Component/feature name
- `{{pascalCase name}}` - PascalCase version
- `{{camelCase name}}` - camelCase version
- `{{kebabCase name}}` - kebab-case version
- `{{titleCase name}}` - Title Case version
- `{{aslSupport}}` - Boolean for ASL support
- `{{database}}` - Boolean for database integration

### Conditional Blocks

Use Handlebars conditionals for optional features:
```handlebars
{{#if aslSupport}}
import { ASLVideoPlayer } from '@/components/asl/ASLVideoPlayer';
{{/if}}

{{#if (eq type 'tool')}}
// Tool-specific code
{{/if}}
```

## GitHub Repository Templates

### Repository Structure
```
your-project/
├── .github/
│   └── workflows/
│       └── auto-deploy.yml
├── client/
├── server/
├── shared/
├── views/
├── templates/
├── plopfile.js
├── package.json
└── README.md
```

### Automated Deployment

The generated projects include GitHub Actions for automatic deployment:

1. **Test Pipeline**: Runs on every push and PR
2. **Staging Deployment**: Deploys to staging on `develop` branch
3. **Production Deployment**: Deploys to production on `main` branch

### Environment Setup

Required environment variables:
```bash
# Core Application
DATABASE_URL=postgresql://...
SESSION_SECRET=your-session-secret

# AI Services
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key

# External Services
NOTION_API_KEY=your-notion-key
NOTION_DATABASE_ID=your-notion-db-id
NORTHWEST_API_KEY=your-northwest-key

# Deployment
REPLIT_TOKEN=your-replit-token
```

## Development Workflow

### 1. Component Development
```bash
# Generate a new component
plop business-component

# Follow prompts to configure:
# - Component name
# - Component type (tool/widget/form)
# - ASL support
# - Database integration

# Generated files:
# - client/src/components/your-component/YourComponent.tsx
# - views/your-component.html
# - server/routes/your-component.ts (if database enabled)
```

### 2. Feature Development
```bash
# Generate a complete feature
plop feature

# Generated structure:
# - Frontend page and hooks
# - Backend API routes
# - Database schema
# - HTMX views
# - WebSocket handlers (if real-time)
# - AI services (if AI enabled)
```

### 3. Testing and Deployment
```bash
# Run local development
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build

# Deploy (automatic via GitHub Actions)
git push origin main
```

## Advanced Features

### ASL Video Integration

All generated components can include ASL video support:
- Custom video player with accessibility controls
- Transcript integration
- Caption support
- Mobile-responsive design
- Progress tracking

### AI Assistant Integration

Components can integrate with the Butch AI assistant:
- Context-aware responses
- Business guidance
- Tool recommendations
- Real-time assistance

### Database Integration

Generated components include:
- Drizzle ORM schemas
- Type-safe database operations
- Migration support
- Relationship mapping

### Real-time Features

Optional WebSocket integration for:
- Live collaboration
- Real-time updates
- Chat functionality
- Progress synchronization

## Best Practices

### Component Design
- Always include ASL support for deaf accessibility
- Use semantic HTML for screen readers
- Implement keyboard navigation
- Provide visual feedback for actions

### Code Organization
- Follow the established folder structure
- Use TypeScript for type safety
- Implement proper error handling
- Write comprehensive tests

### Performance
- Lazy load components when possible
- Optimize video delivery
- Implement caching strategies
- Monitor bundle sizes

## Contributing

### Adding New Generators

1. Create template files in `templates/`
2. Add generator configuration to `plopfile.js`
3. Test with sample data
4. Update documentation
5. Submit pull request

### Template Guidelines

- Use Handlebars for templating
- Include comprehensive error handling
- Follow accessibility best practices
- Provide clear documentation
- Test on multiple screen sizes

## Support

- **Documentation**: [GitHub Repository](https://github.com/pinksync/360-business-magician)
- **Issues**: [GitHub Issues](https://github.com/pinksync/360-business-magician/issues)
- **Email**: team@pinksync.com

## License

MIT License - see LICENSE file for details.