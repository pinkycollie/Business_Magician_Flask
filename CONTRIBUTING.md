# Contributing to 360 Business Magician

Thank you for considering contributing to 360 Business Magician! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Development Environment Setup](#development-environment-setup)
3. [Code Style and Guidelines](#code-style-and-guidelines)
4. [Submitting Changes](#submitting-changes)
5. [Database Management](#database-management)
6. [Testing](#testing)
7. [Deployment](#deployment)

## Project Overview

360 Business Magician is a comprehensive platform designed to support deaf entrepreneurs through the complete business lifecycle. The platform features:

- Business formation and planning tools
- Document management
- ASL video guidance
- VR counselor integration
- SBA resource library
- Interactive lifecycle navigation

## Development Environment Setup

### Prerequisites

- Node.js (v20+)
- PostgreSQL database (or Docker)
- Git

### Setting Up Your Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/360-business-magician.git
   cd 360-business-magician
   ```

2. Run the setup script:
   ```bash
   node scripts/setup.js
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Using Docker (Alternative)

We provide a Docker Compose configuration for easier setup:

1. Start the Docker environment:
   ```bash
   docker-compose up -d
   ```

2. The application will be available at http://localhost:8080

## Code Style and Guidelines

- Follow the existing code style in the project
- Use TypeScript for type safety
- Document your code with comments
- Follow accessibility best practices, particularly for ASL content
- Ensure responsive design for mobile users

## Submitting Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit with clear messages

3. Push your branch and open a Pull Request

4. Ensure all CI checks pass before requesting review

## Database Management

We use Drizzle ORM for database operations.

### Schema Changes

1. Update the schema definition in `shared/schema.ts`
2. Generate migrations:
   ```bash
   npm run db:generate
   ```
3. Apply changes to the database:
   ```bash
   npm run db:push
   ```

### Working with Database

- Always use the `IStorage` interface for database operations
- Update both `MemStorage` and `DatabaseStorage` when adding new features
- Follow the pattern of existing repository methods

## Testing

- Write tests for new features
- Run tests before submitting PR:
  ```bash
  npm test
  ```

## Deployment

### Vercel Deployment

1. Configure environment variables in Vercel
2. Deploy using:
   ```bash
   node scripts/vercel-deploy.js
   ```

### Using CI/CD Pipeline

The project is set up with GitHub Actions for CI/CD:

1. Push to the main branch to trigger deployment
2. Check the Actions tab for deployment status

## Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Vercel Documentation](https://vercel.com/docs)