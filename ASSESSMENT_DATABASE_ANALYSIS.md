# Assessment System Database Analysis

## Overview

This document analyzes the assessment system components to identify what resources and data need to be stored in the database. The analysis covers the current static data structure and provides recommendations for database migration.

## 🔍 Current Data Structure Analysis

### 1. Assessment Questions (`static-assessment-questions.ts`)

**Data Structure:**
```typescript
interface StaticQuestion {
  id: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'scale' | 'text' | 'number' | 'email' | 'date' | 'time';
  category: 'basic_info' | 'sleep_habits' | 'lifestyle' | 'work_study' | 'attitude' | 'environment';
  required: boolean;
  options?: Array<{
    value: string;
    text: string;
    score?: number;
  }>;
  depends?: {
    questionId: string;
    value: string;
  };
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}
```

**Database Requirements:**
- **Questions Table**: Store question definitions, types, categories, and dependencies
- **Question Options Table**: Store answer options with scoring values
- **Question Dependencies Table**: Store conditional logic for question flow
- **Question Categories Table**: Store question categories and metadata

### 2. Assessment Tags (`static-assessment-questions.ts`)

**Data Structure:**
```typescript
interface StaticTag {
  id: string;
  name: string;
  text: string;
  description: string;
  category: 'sleep' | 'lifestyle' | 'work' | 'student' | 'special' | 'behavior';
  priority: 'high' | 'medium' | 'low';
  calc: {
    type: 'simple' | 'function' | 'complex';
    question?: string;
    value?: string;
    func?: string;
    input?: string[];
    conditions?: Array<{
      question: string;
      value: string;
      operator?: 'equals' | 'not_equals' | 'greater_than' | 'less_than';
    }>;
  };
  interventions: string[];
  severity: 'mild' | 'moderate' | 'severe';
}
```

**Database Requirements:**
- **Tags Table**: Store tag definitions, categories, and priorities
- **Tag Calculations Table**: Store calculation logic and conditions
- **Tag Categories Table**: Store tag categories and metadata
- **Tag Interventions Table**: Store intervention mappings

### 3. Assessment Booklets (`static-assessment-booklets.ts`)

**Data Structure:**
```typescript
interface StaticBooklet {
  id: string;
  tag: string;
  title: string;
  description: string;
  category: 'sleep' | 'lifestyle' | 'work' | 'student' | 'special' | 'behavior' | 'environment';
  priority: 'high' | 'medium' | 'low';
  severity: 'mild' | 'moderate' | 'severe';
  content: {
    summary: string;
    problem: string;
    solution: string;
    steps: string[];
    tips: string[];
    warnings?: string[];
    resources?: {
      title: string;
      description: string;
      url?: string;
    }[];
  };
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedOutcome: string;
}
```

**Database Requirements:**
- **Booklets Table**: Store booklet definitions and metadata
- **Booklet Content Table**: Store structured content (summary, problem, solution)
- **Booklet Steps Table**: Store step-by-step instructions
- **Booklet Tips Table**: Store tips and advice
- **Booklet Resources Table**: Store external resources and links
- **Booklet Tags Table**: Store tag-to-booklet mappings

### 4. Calculation Functions (`static-assessment-calculations.ts`)

**Data Structure:**
```typescript
interface CalculationResult {
  value: number | boolean;
  confidence: number; // 0-1
  reasoning: string;
}
```

**Database Requirements:**
- **Calculation Functions Table**: Store function definitions and metadata
- **Function Parameters Table**: Store parameter definitions
- **Calculation Results Table**: Store calculation results and confidence scores

### 5. Assessment Results (`static-assessment-engine.ts`)

**Data Structure:**
```typescript
interface AssessmentResult {
  answers: Record<string, string>;
  calculatedTags: string[];
  matchedBooklets: StaticBooklet[];
  completedAt: Date;
}
```

**Database Requirements:**
- **Assessment Sessions Table**: Store assessment sessions and metadata
- **Assessment Answers Table**: Store user answers to questions
- **Assessment Results Table**: Store calculated tags and booklet matches
- **User Profiles Table**: Store user information and assessment history

## 🗄️ Proposed Database Schema

### Core Tables

#### 1. `assessment_questions`
```sql
CREATE TABLE assessment_questions (
  id VARCHAR(255) PRIMARY KEY,
  text TEXT NOT NULL,
  type ENUM('single_choice', 'multiple_choice', 'scale', 'text', 'number', 'email', 'date', 'time') NOT NULL,
  category VARCHAR(100) NOT NULL,
  required BOOLEAN DEFAULT false,
  placeholder VARCHAR(500),
  min_value DECIMAL(10,2),
  max_value DECIMAL(10,2),
  step_value DECIMAL(10,2),
  unit VARCHAR(50),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_order (order_index),
  INDEX idx_active (is_active)
);
```

#### 2. `assessment_question_options`
```sql
CREATE TABLE assessment_question_options (
  id VARCHAR(255) PRIMARY KEY,
  question_id VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  score DECIMAL(5,2),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE,
  INDEX idx_question (question_id),
  INDEX idx_order (order_index)
);
```

#### 3. `assessment_question_dependencies`
```sql
CREATE TABLE assessment_question_dependencies (
  id VARCHAR(255) PRIMARY KEY,
  question_id VARCHAR(255) NOT NULL,
  depends_on_question_id VARCHAR(255) NOT NULL,
  depends_on_value VARCHAR(255) NOT NULL,
  operator ENUM('equals', 'not_equals', 'greater_than', 'less_than') DEFAULT 'equals',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE,
  FOREIGN KEY (depends_on_question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE,
  INDEX idx_question (question_id),
  INDEX idx_dependency (depends_on_question_id)
);
```

#### 4. `assessment_tags`
```sql
CREATE TABLE assessment_tags (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  text VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
  severity ENUM('mild', 'moderate', 'severe') DEFAULT 'moderate',
  calc_type ENUM('simple', 'function', 'complex') NOT NULL,
  calc_question VARCHAR(255),
  calc_value VARCHAR(255),
  calc_function VARCHAR(255),
  calc_input JSON,
  calc_conditions JSON,
  interventions JSON,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_category (category),
  INDEX idx_priority (priority),
  INDEX idx_active (is_active)
);
```

#### 5. `assessment_booklets`
```sql
CREATE TABLE assessment_booklets (
  id VARCHAR(255) PRIMARY KEY,
  tag_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
  severity ENUM('mild', 'moderate', 'severe') DEFAULT 'moderate',
  summary TEXT,
  problem TEXT,
  solution TEXT,
  estimated_time VARCHAR(100),
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  expected_outcome TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tag_id) REFERENCES assessment_tags(id) ON DELETE CASCADE,
  INDEX idx_tag (tag_id),
  INDEX idx_category (category),
  INDEX idx_priority (priority),
  INDEX idx_active (is_active)
);
```

#### 6. `assessment_booklet_steps`
```sql
CREATE TABLE assessment_booklet_steps (
  id VARCHAR(255) PRIMARY KEY,
  booklet_id VARCHAR(255) NOT NULL,
  step_text TEXT NOT NULL,
  order_index INT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booklet_id) REFERENCES assessment_booklets(id) ON DELETE CASCADE,
  INDEX idx_booklet (booklet_id),
  INDEX idx_order (order_index)
);
```

#### 7. `assessment_booklet_tips`
```sql
CREATE TABLE assessment_booklet_tips (
  id VARCHAR(255) PRIMARY KEY,
  booklet_id VARCHAR(255) NOT NULL,
  tip_text TEXT NOT NULL,
  order_index INT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booklet_id) REFERENCES assessment_booklets(id) ON DELETE CASCADE,
  INDEX idx_booklet (booklet_id),
  INDEX idx_order (order_index)
);
```

#### 8. `assessment_booklet_resources`
```sql
CREATE TABLE assessment_booklet_resources (
  id VARCHAR(255) PRIMARY KEY,
  booklet_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  url VARCHAR(1000),
  order_index INT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booklet_id) REFERENCES assessment_booklets(id) ON DELETE CASCADE,
  INDEX idx_booklet (booklet_id),
  INDEX idx_order (order_index)
);
```

#### 9. `assessment_calculation_functions`
```sql
CREATE TABLE assessment_calculation_functions (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  parameters JSON NOT NULL,
  return_type ENUM('boolean', 'number') NOT NULL,
  function_code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_active (is_active)
);
```

### User Data Tables

#### 10. `assessment_sessions`
```sql
CREATE TABLE assessment_sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  session_token VARCHAR(255) UNIQUE,
  status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_session (session_token),
  INDEX idx_status (status)
);
```

#### 11. `assessment_answers`
```sql
CREATE TABLE assessment_answers (
  id VARCHAR(255) PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  question_id VARCHAR(255) NOT NULL,
  answer_value TEXT NOT NULL,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE,
  INDEX idx_session (session_id),
  INDEX idx_question (question_id),
  UNIQUE KEY unique_session_question (session_id, question_id)
);
```

#### 12. `assessment_results`
```sql
CREATE TABLE assessment_results (
  id VARCHAR(255) PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  calculated_tags JSON NOT NULL,
  matched_booklet_ids JSON NOT NULL,
  confidence_scores JSON,
  processing_time_ms INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  INDEX idx_session (session_id),
  INDEX idx_created (created_at)
);
```

## 📊 Data Migration Strategy

### Phase 1: Core Data Migration
1. **Questions Migration**: Convert static questions to database records
2. **Tags Migration**: Convert static tags to database records
3. **Booklets Migration**: Convert static booklets to database records
4. **Functions Migration**: Convert calculation functions to database records

### Phase 2: User Data Implementation
1. **Session Management**: Implement assessment session tracking
2. **Answer Storage**: Store user answers in database
3. **Result Storage**: Store assessment results in database
4. **User Profiles**: Implement user profile and history tracking

### Phase 3: Advanced Features
1. **Analytics**: Implement assessment analytics and reporting
2. **Personalization**: Add user-specific recommendations
3. **A/B Testing**: Support for different assessment versions
4. **Content Management**: Admin interface for managing content

## 🔧 Implementation Recommendations

### 1. Database Choice
- **Primary**: PostgreSQL (recommended for complex queries and JSON support)
- **Alternative**: MySQL 8.0+ (with JSON support)
- **NoSQL Option**: MongoDB (if flexibility is priority)

### 2. Caching Strategy
- **Redis**: Cache frequently accessed questions and booklets
- **Application Cache**: Cache calculation functions and tag logic
- **CDN**: Cache static content and resources

### 3. Performance Considerations
- **Indexing**: Proper indexing on frequently queried fields
- **Partitioning**: Partition large tables by date or user
- **Connection Pooling**: Implement database connection pooling
- **Query Optimization**: Optimize complex assessment queries

### 4. Security Considerations
- **Data Encryption**: Encrypt sensitive user data
- **Access Control**: Implement role-based access control
- **Audit Logging**: Log all assessment activities
- **Data Retention**: Implement data retention policies

## 📈 Estimated Data Volume

### Current Static Data
- **Questions**: ~31 questions
- **Tags**: ~15 tags
- **Booklets**: ~15 booklets
- **Functions**: ~6 calculation functions

### Projected User Data (per 10,000 users)
- **Sessions**: ~15,000 sessions (1.5 per user)
- **Answers**: ~465,000 answers (31 questions × 15,000 sessions)
- **Results**: ~15,000 results (1 per session)

### Storage Requirements
- **Core Data**: ~5MB (static content)
- **User Data**: ~50MB per 10,000 users
- **Total**: ~55MB for 10,000 users

## 🚀 Next Steps

1. **Database Setup**: Create database schema and tables
2. **Migration Scripts**: Develop data migration scripts
3. **API Development**: Create RESTful APIs for assessment data
4. **Testing**: Implement comprehensive testing suite
5. **Deployment**: Deploy database and update application
6. **Monitoring**: Implement monitoring and analytics

## 📋 Migration Checklist

- [ ] Design and create database schema
- [ ] Develop data migration scripts
- [ ] Create database access layer
- [ ] Update assessment engine to use database
- [ ] Implement session management
- [ ] Add user authentication and profiles
- [ ] Create admin interface for content management
- [ ] Implement analytics and reporting
- [ ] Add monitoring and logging
- [ ] Performance testing and optimization
- [ ] Security audit and implementation
- [ ] Documentation and training materials

This analysis provides a comprehensive foundation for migrating the assessment system from static files to a robust database-driven architecture.
