const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(
      'Welcome to the ' + chalk.red('360 Business Magician') + ' generator!'
    ));

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: this.appname
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: 'A deaf-first business formation platform'
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose your template:',
        choices: [
          {
            name: 'Full Platform (React + HTMX + AI)',
            value: 'full'
          },
          {
            name: 'Business Tools Only',
            value: 'tools'
          },
          {
            name: 'ASL Components Library',
            value: 'asl'
          },
          {
            name: 'API Server Only',
            value: 'api'
          }
        ]
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features to include:',
        choices: [
          {
            name: 'ASL Video Support',
            value: 'asl',
            checked: true
          },
          {
            name: 'AI Assistant (Butch)',
            value: 'ai',
            checked: true
          },
          {
            name: 'Corporate Formation Services',
            value: 'corporate',
            checked: true
          },
          {
            name: 'Team Collaboration',
            value: 'collaboration',
            checked: false
          },
          {
            name: 'Real-time Chat',
            value: 'chat',
            checked: false
          },
          {
            name: 'Analytics Dashboard',
            value: 'analytics',
            checked: false
          }
        ]
      },
      {
        type: 'list',
        name: 'database',
        message: 'Database preference:',
        choices: [
          {
            name: 'PostgreSQL (Recommended)',
            value: 'postgresql'
          },
          {
            name: 'In-Memory (Development)',
            value: 'memory'
          }
        ]
      }
    ];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    // Core files
    this._copyTemplate('package.json');
    this._copyTemplate('README.md');
    this._copyTemplate('.gitignore');
    this._copyTemplate('.env.example');
    this._copyTemplate('tsconfig.json');
    this._copyTemplate('tailwind.config.ts');
    this._copyTemplate('vite.config.ts');

    // Server files
    this._copyTemplate('server/index.ts');
    this._copyTemplate('server/routes.ts');
    this._copyTemplate('server/storage.ts');
    
    if (this.props.database === 'postgresql') {
      this._copyTemplate('server/db.ts');
      this._copyTemplate('drizzle.config.ts');
    }

    // Client files based on template
    if (this.props.template === 'full' || this.props.template === 'tools') {
      this._copyTemplate('client/src/App.tsx');
      this._copyTemplate('client/src/main.tsx');
      this._copyTemplate('client/src/lib/queryClient.ts');
      this._copyTemplate('client/src/components/ui/button.tsx');
      this._copyTemplate('client/src/components/ui/card.tsx');
    }

    // ASL components
    if (this.props.features.includes('asl')) {
      this._copyTemplate('client/src/components/asl/ASLVideoPlayer.tsx');
      this._copyTemplate('views/asl-example.html');
    }

    // AI assistant
    if (this.props.features.includes('ai')) {
      this._copyTemplate('server/services/aiService.ts');
      this._copyTemplate('views/butch-ai-assistant.html');
    }

    // Corporate services
    if (this.props.features.includes('corporate')) {
      this._copyTemplate('views/corporate-services.html');
      this._copyTemplate('server/routes/corporate.ts');
    }

    // HTMX views
    this._copyTemplate('views/index.html');
    this._copyTemplate('views/interactive-360-experience.html');

    // Shared schema
    this._copyTemplate('shared/schema.ts');

    // Scripts
    this._copyTemplate('scripts/setup.js');
    this._copyTemplate('scripts/db-setup.js');

    // Configuration
    this._copyTemplate('plopfile.js');
  }

  _copyTemplate(file) {
    this.fs.copyTpl(
      this.templatePath(file),
      this.destinationPath(file),
      this.props
    );
  }

  install() {
    this.npmInstall();
  }

  end() {
    this.log(chalk.green('\n🎉 Your 360 Business Magician project is ready!'));
    this.log(chalk.yellow('\nNext steps:'));
    this.log('1. Copy your .env.example to .env and add your API keys');
    this.log('2. Run "npm run dev" to start the development server');
    this.log('3. Visit http://localhost:3000 to see your application');
    
    if (this.props.database === 'postgresql') {
      this.log('4. Run "npm run db:push" to set up your database');
    }
    
    this.log('\n📚 Documentation: https://github.com/pinksync/360-business-magician');
    this.log('💬 Support: team@pinksync.com');
  }
};