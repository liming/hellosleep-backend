import { staticAssessmentEngine } from './static-assessment-engine';

export interface DatabaseTag {
  id: string;
  name: string;
  text: string;
  calcType: 'question' | 'function';
  calcQuestion?: string;
  calcValue?: string;
  calcFunction?: string;
  calcInput?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseBooklet {
  id: string;
  tag: string;
  factName: string;
  factDescription: string;
  content: Array<{
    lang: string;
    text: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseCalculationFunction {
  id: string;
  name: string;
  description: string;
  parameters: string[];
  returnType: 'boolean' | 'number';
  createdAt: Date;
  updatedAt: Date;
}

export class StaticAssessmentDatabase {
  /**
   * Export current static data for database migration
   */
  exportForMigration() {
    const data = staticAssessmentEngine.exportDataForDatabase();
    
    const tags: DatabaseTag[] = data.tags.map(tag => ({
      id: `tag_${tag.name}`,
      name: tag.name,
      text: tag.text,
      calcType: tag.calc.func ? 'function' : 'question',
      calcQuestion: tag.calc.question,
      calcValue: tag.calc.value,
      calcFunction: tag.calc.func,
      calcInput: tag.calc.input,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const booklets: DatabaseBooklet[] = data.booklets.map(booklet => ({
      id: booklet.id,
      tag: booklet.tag,
      factName: booklet.fact.name,
      factDescription: booklet.fact.description.zh,
      content: booklet.content,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const calculationFunctions: DatabaseCalculationFunction[] = [
      {
        id: 'func_getSleepHours',
        name: 'getSleepHours',
        description: '计算睡眠时间',
        parameters: ['sleeptime', 'getuptime', 'hourstosleep'],
        returnType: 'number',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'func_calcSleepEfficiency',
        name: 'calcSleepEfficiency',
        description: '计算睡眠效率',
        parameters: ['sleeptime', 'getuptime', 'hourstosleep', 'hourstofallinsleep'],
        returnType: 'boolean',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'func_isHealthy',
        name: 'isHealthy',
        description: '判断是否健康',
        parameters: ['sport', 'sunshine'],
        returnType: 'boolean',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'func_isIdle',
        name: 'isIdle',
        description: '判断是否空闲',
        parameters: ['pressure', 'lively'],
        returnType: 'boolean',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'func_isStimuli',
        name: 'isStimuli',
        description: '判断是否有刺激',
        parameters: ['bedroom', 'bed'],
        returnType: 'boolean',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'func_isAffected',
        name: 'isAffected',
        description: '判断是否受影响',
        parameters: ['irresponsible', 'inactive', 'excessive_rest', 'complain', 'ignore', 'medicine'],
        returnType: 'boolean',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return {
      tags,
      booklets,
      calculationFunctions,
      migrationDate: new Date(),
      version: '1.0.0'
    };
  }

  /**
   * Generate SQL migration script
   */
  generateSQLMigration() {
    const data = this.exportForMigration();
    
    let sql = `-- Static Assessment Engine Database Migration
-- Generated on: ${data.migrationDate.toISOString()}
-- Version: ${data.version}

-- Create tags table
CREATE TABLE IF NOT EXISTS assessment_tags (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  text VARCHAR(500) NOT NULL,
  calc_type ENUM('question', 'function') NOT NULL,
  calc_question VARCHAR(255),
  calc_value VARCHAR(255),
  calc_function VARCHAR(255),
  calc_input JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_calc_type (calc_type)
);

-- Create booklets table
CREATE TABLE IF NOT EXISTS assessment_booklets (
  id VARCHAR(255) PRIMARY KEY,
  tag VARCHAR(255) NOT NULL,
  fact_name VARCHAR(255) NOT NULL,
  fact_description TEXT NOT NULL,
  content JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tag (tag),
  FOREIGN KEY (tag) REFERENCES assessment_tags(name) ON DELETE CASCADE
);

-- Create calculation functions table
CREATE TABLE IF NOT EXISTS assessment_calculation_functions (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(500) NOT NULL,
  parameters JSON NOT NULL,
  return_type ENUM('boolean', 'number') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- Insert tags data
`;

    // Insert tags
    data.tags.forEach(tag => {
      sql += `INSERT INTO assessment_tags (id, name, text, calc_type, calc_question, calc_value, calc_function, calc_input) VALUES (
  '${tag.id}',
  '${tag.name}',
  '${tag.text.replace(/'/g, "''")}',
  '${tag.calcType}',
  ${tag.calcQuestion ? `'${tag.calcQuestion}'` : 'NULL'},
  ${tag.calcValue ? `'${tag.calcValue}'` : 'NULL'},
  ${tag.calcFunction ? `'${tag.calcFunction}'` : 'NULL'},
  ${tag.calcInput ? `'${JSON.stringify(tag.calcInput)}'` : 'NULL'}
);\n`;
    });

    sql += '\n-- Insert booklets data\n';

    // Insert booklets
    data.booklets.forEach(booklet => {
      sql += `INSERT INTO assessment_booklets (id, tag, fact_name, fact_description, content) VALUES (
  '${booklet.id}',
  '${booklet.tag}',
  '${booklet.factName.replace(/'/g, "''")}',
  '${booklet.factDescription.replace(/'/g, "''")}',
  '${JSON.stringify(booklet.content).replace(/'/g, "''")}'
);\n`;
    });

    sql += '\n-- Insert calculation functions data\n';

    // Insert calculation functions
    data.calculationFunctions.forEach(func => {
      sql += `INSERT INTO assessment_calculation_functions (id, name, description, parameters, return_type) VALUES (
  '${func.id}',
  '${func.name}',
  '${func.description.replace(/'/g, "''")}',
  '${JSON.stringify(func.parameters)}',
  '${func.returnType}'
);\n`;
    });

    return sql;
  }

  /**
   * Generate Strapi migration files
   */
  generateStrapiMigration() {
    const data = this.exportForMigration();
    
    return {
      'assessment-tags.json': {
        data: data.tags.map(tag => ({
          name: tag.name,
          text: tag.text,
          calcType: tag.calcType,
          calcQuestion: tag.calcQuestion,
          calcValue: tag.calcValue,
          calcFunction: tag.calcFunction,
          calcInput: tag.calcInput,
          publishedAt: new Date().toISOString()
        }))
      },
      'assessment-booklets.json': {
        data: data.booklets.map(booklet => ({
          tag: booklet.tag,
          factName: booklet.factName,
          factDescription: booklet.factDescription,
          content: booklet.content,
          publishedAt: new Date().toISOString()
        }))
      },
      'assessment-calculation-functions.json': {
        data: data.calculationFunctions.map(func => ({
          name: func.name,
          description: func.description,
          parameters: func.parameters,
          returnType: func.returnType,
          publishedAt: new Date().toISOString()
        }))
      }
    };
  }

  /**
   * Generate TypeScript interfaces for database models
   */
  generateTypeScriptInterfaces() {
    return `
// Database Models for Static Assessment Engine

export interface AssessmentTag {
  id: string;
  name: string;
  text: string;
  calcType: 'question' | 'function';
  calcQuestion?: string;
  calcValue?: string;
  calcFunction?: string;
  calcInput?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentBooklet {
  id: string;
  tag: string;
  factName: string;
  factDescription: string;
  content: Array<{
    lang: string;
    text: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentCalculationFunction {
  id: string;
  name: string;
  description: string;
  parameters: string[];
  returnType: 'boolean' | 'number';
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentResult {
  id: string;
  userId?: string;
  answers: Record<string, string>;
  calculatedTags: string[];
  matchedBookletIds: string[];
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
`;
  }
}

// Export singleton instance
export const staticAssessmentDatabase = new StaticAssessmentDatabase();
