# Assessment System Language Schema Analysis

## Overview

This document analyzes different approaches for handling multiple languages in the assessment system database schema. The analysis considers the current bilingual structure (Chinese and English) and provides recommendations for scalable multilingual support.

## 🔍 Current Language Structure

### Current Implementation
- **Primary Language**: Chinese (zh) - default
- **Secondary Language**: English (en) - explicit locale
- **URL Structure**: `/zh/assessment` (default), `/en/assessment` (explicit)
- **Translation System**: Centralized TypeScript translation files
- **Content**: Currently only Chinese content in static files

### Current Translation Pattern
```typescript
export const translations = {
  en: {
    sleepAssessment: 'Sleep Assessment',
    startAssessment: 'Start Assessment',
    // ... more translations
  },
  zh: {
    sleepAssessment: '睡眠评估',
    startAssessment: '开始评估',
    // ... more translations
  }
};
```

## 🏗️ Database Schema Approaches

### Approach 1: Separate Tables per Language

#### Structure
```sql
-- Chinese questions
CREATE TABLE assessment_questions_zh (
  id VARCHAR(255) PRIMARY KEY,
  text TEXT NOT NULL,
  type ENUM('single_choice', 'multiple_choice', 'scale', 'text', 'number', 'email', 'date', 'time') NOT NULL,
  category VARCHAR(100) NOT NULL,
  -- ... other fields
);

-- English questions
CREATE TABLE assessment_questions_en (
  id VARCHAR(255) PRIMARY KEY,
  text TEXT NOT NULL,
  type ENUM('single_choice', 'multiple_choice', 'scale', 'text', 'number', 'email', 'date', 'time') NOT NULL,
  category VARCHAR(100) NOT NULL,
  -- ... other fields
);
```

#### Pros
- ✅ **Simple queries**: Direct language-specific queries
- ✅ **Performance**: No JOINs needed for language-specific data
- ✅ **Isolation**: Language-specific data is completely separate
- ✅ **Easy maintenance**: Clear separation of concerns

#### Cons
- ❌ **Data duplication**: Structural data (types, categories, logic) is duplicated
- ❌ **Synchronization issues**: Keeping structural data in sync across languages
- ❌ **Scalability**: Adding new languages requires new tables
- ❌ **Complex updates**: Structural changes require updates to all language tables

### Approach 2: Single Table with Language Columns

#### Structure
```sql
CREATE TABLE assessment_questions (
  id VARCHAR(255) PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
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
  UNIQUE KEY unique_id_locale (id, locale),
  INDEX idx_locale (locale),
  INDEX idx_category (category),
  INDEX idx_order (order_index)
);
```

#### Pros
- ✅ **Single source of truth**: All languages in one table
- ✅ **Easy language addition**: Just add new rows with different locale
- ✅ **Consistent structure**: All languages follow same schema
- ✅ **Simple queries**: `WHERE locale = 'en'` or `WHERE locale = 'zh'`

#### Cons
- ❌ **Data duplication**: Structural data repeated for each language
- ❌ **Larger table size**: More rows due to language duplication
- ❌ **Complex constraints**: Need to ensure structural consistency across languages

### Approach 3: Hybrid Approach (Recommended)

#### Structure
```sql
-- Core question structure (language-independent)
CREATE TABLE assessment_questions (
  id VARCHAR(255) PRIMARY KEY,
  type ENUM('single_choice', 'multiple_choice', 'scale', 'text', 'number', 'email', 'date', 'time') NOT NULL,
  category VARCHAR(100) NOT NULL,
  required BOOLEAN DEFAULT false,
  min_value DECIMAL(10,2),
  max_value DECIMAL(10,2),
  step_value DECIMAL(10,2),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_order (order_index),
  INDEX idx_active (is_active)
);

-- Language-specific question content
CREATE TABLE assessment_question_translations (
  id VARCHAR(255) PRIMARY KEY,
  question_id VARCHAR(255) NOT NULL,
  locale VARCHAR(10) NOT NULL,
  text TEXT NOT NULL,
  placeholder VARCHAR(500),
  unit VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_question_locale (question_id, locale),
  INDEX idx_locale (locale),
  INDEX idx_question (question_id)
);

-- Language-specific question options
CREATE TABLE assessment_question_option_translations (
  id VARCHAR(255) PRIMARY KEY,
  option_id VARCHAR(255) NOT NULL,
  locale VARCHAR(10) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (option_id) REFERENCES assessment_question_options(id) ON DELETE CASCADE,
  UNIQUE KEY unique_option_locale (option_id, locale),
  INDEX idx_locale (locale),
  INDEX idx_option (option_id)
);
```

#### Pros
- ✅ **Optimal structure**: Language-independent data separated from translations
- ✅ **No data duplication**: Structural data stored once
- ✅ **Scalable**: Easy to add new languages
- ✅ **Flexible**: Can have different translation completeness per language
- ✅ **Performance**: Efficient queries with proper indexing
- ✅ **Consistency**: Structural integrity maintained across languages

#### Cons
- ❌ **More complex queries**: Requires JOINs for complete data
- ❌ **More tables**: Additional translation tables
- ❌ **Migration complexity**: More complex initial setup

## 🎯 Recommended Approach: Hybrid with JSON Support

### Enhanced Hybrid Approach

#### Core Tables (Language-Independent)
```sql
-- Core question structure
CREATE TABLE assessment_questions (
  id VARCHAR(255) PRIMARY KEY,
  type ENUM('single_choice', 'multiple_choice', 'scale', 'text', 'number', 'email', 'date', 'time') NOT NULL,
  category VARCHAR(100) NOT NULL,
  required BOOLEAN DEFAULT false,
  min_value DECIMAL(10,2),
  max_value DECIMAL(10,2),
  step_value DECIMAL(10,2),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_order (order_index),
  INDEX idx_active (is_active)
);

-- Core question options (language-independent)
CREATE TABLE assessment_question_options (
  id VARCHAR(255) PRIMARY KEY,
  question_id VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  score DECIMAL(5,2),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE,
  INDEX idx_question (question_id),
  INDEX idx_order (order_index)
);

-- Core tags (language-independent)
CREATE TABLE assessment_tags (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
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

-- Core booklets (language-independent)
CREATE TABLE assessment_booklets (
  id VARCHAR(255) PRIMARY KEY,
  tag_id VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
  severity ENUM('mild', 'moderate', 'severe') DEFAULT 'moderate',
  estimated_time VARCHAR(100),
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
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

#### Translation Tables (Language-Specific)
```sql
-- Question translations
CREATE TABLE assessment_question_translations (
  id VARCHAR(255) PRIMARY KEY,
  question_id VARCHAR(255) NOT NULL,
  locale VARCHAR(10) NOT NULL,
  text TEXT NOT NULL,
  placeholder VARCHAR(500),
  unit VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_question_locale (question_id, locale),
  INDEX idx_locale (locale),
  INDEX idx_question (question_id)
);

-- Question option translations
CREATE TABLE assessment_question_option_translations (
  id VARCHAR(255) PRIMARY KEY,
  option_id VARCHAR(255) NOT NULL,
  locale VARCHAR(10) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (option_id) REFERENCES assessment_question_options(id) ON DELETE CASCADE,
  UNIQUE KEY unique_option_locale (option_id, locale),
  INDEX idx_locale (locale),
  INDEX idx_option (option_id)
);

-- Tag translations
CREATE TABLE assessment_tag_translations (
  id VARCHAR(255) PRIMARY KEY,
  tag_id VARCHAR(255) NOT NULL,
  locale VARCHAR(10) NOT NULL,
  text VARCHAR(500) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tag_id) REFERENCES assessment_tags(id) ON DELETE CASCADE,
  UNIQUE KEY unique_tag_locale (tag_id, locale),
  INDEX idx_locale (locale),
  INDEX idx_tag (tag_id)
);

-- Booklet translations
CREATE TABLE assessment_booklet_translations (
  id VARCHAR(255) PRIMARY KEY,
  booklet_id VARCHAR(255) NOT NULL,
  locale VARCHAR(10) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  summary TEXT,
  problem TEXT,
  solution TEXT,
  expected_outcome TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booklet_id) REFERENCES assessment_booklets(id) ON DELETE CASCADE,
  UNIQUE KEY unique_booklet_locale (booklet_id, locale),
  INDEX idx_locale (locale),
  INDEX idx_booklet (booklet_id)
);

-- Booklet content translations (steps, tips, resources)
CREATE TABLE assessment_booklet_content_translations (
  id VARCHAR(255) PRIMARY KEY,
  content_id VARCHAR(255) NOT NULL,
  content_type ENUM('step', 'tip', 'resource') NOT NULL,
  locale VARCHAR(10) NOT NULL,
  text TEXT NOT NULL,
  title VARCHAR(500),
  description TEXT,
  url VARCHAR(1000),
  order_index INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_content_locale (content_id, locale),
  INDEX idx_locale (locale),
  INDEX idx_content (content_id),
  INDEX idx_type (content_type),
  INDEX idx_order (order_index)
);
```

## 🔧 Implementation Strategy

### Phase 1: Core Structure
1. **Create core tables** with language-independent data
2. **Create translation tables** for language-specific content
3. **Migrate existing Chinese data** to core + translation structure
4. **Add English translations** to translation tables

### Phase 2: API Layer
1. **Create language-aware queries** that JOIN core + translation tables
2. **Implement fallback logic** (default to Chinese if translation missing)
3. **Add language detection** from URL or user preferences
4. **Create translation management** API endpoints

### Phase 3: Content Management
1. **Admin interface** for managing translations
2. **Translation completeness** tracking and reporting
3. **Bulk import/export** for translation data
4. **Translation workflow** for content updates

## 📊 Query Examples

### Get Questions with Translations
```sql
SELECT 
  q.id,
  q.type,
  q.category,
  q.required,
  qt.text,
  qt.placeholder,
  qt.unit
FROM assessment_questions q
LEFT JOIN assessment_question_translations qt 
  ON q.id = qt.question_id AND qt.locale = 'en'
WHERE q.is_active = true
ORDER BY q.order_index;
```

### Get Complete Question with Options
```sql
SELECT 
  q.id,
  q.type,
  q.category,
  qt.text as question_text,
  qt.placeholder,
  qt.unit,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'id', o.id,
      'value', o.value,
      'score', o.score,
      'text', ot.text
    )
  ) as options
FROM assessment_questions q
LEFT JOIN assessment_question_translations qt 
  ON q.id = qt.question_id AND qt.locale = 'en'
LEFT JOIN assessment_question_options o 
  ON q.id = o.question_id
LEFT JOIN assessment_question_option_translations ot 
  ON o.id = ot.option_id AND ot.locale = 'en'
WHERE q.id = 'status' AND q.is_active = true
GROUP BY q.id;
```

### Get Booklets with Content
```sql
SELECT 
  b.id,
  b.category,
  b.priority,
  b.difficulty,
  bt.title,
  bt.description,
  bt.summary,
  bt.problem,
  bt.solution,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'type', bct.content_type,
      'text', bct.text,
      'order', bct.order_index
    )
  ) as content
FROM assessment_booklets b
LEFT JOIN assessment_booklet_translations bt 
  ON b.id = bt.booklet_id AND bt.locale = 'en'
LEFT JOIN assessment_booklet_content_translations bct 
  ON b.id = bct.content_id AND bct.locale = 'en'
WHERE b.is_active = true
GROUP BY b.id;
```

## 🎯 Benefits of Recommended Approach

### 1. **Scalability**
- Easy to add new languages without schema changes
- Efficient storage with no structural data duplication
- Flexible translation completeness per language

### 2. **Performance**
- Optimized queries with proper indexing
- Efficient JOINs for language-specific data
- Caching-friendly structure

### 3. **Maintainability**
- Clear separation of concerns
- Easy to manage translations independently
- Consistent data structure across languages

### 4. **Flexibility**
- Support for partial translations
- Easy fallback to default language
- Simple content management workflows

### 5. **Future-Proof**
- Ready for additional languages
- Supports complex content structures
- Compatible with modern database features

## 📋 Migration Checklist

- [ ] Design hybrid schema with core + translation tables
- [ ] Create database migration scripts
- [ ] Migrate existing Chinese data to new structure
- [ ] Add English translations
- [ ] Update API layer for language-aware queries
- [ ] Implement fallback logic
- [ ] Create translation management interface
- [ ] Add translation completeness tracking
- [ ] Performance testing and optimization
- [ ] Documentation and training materials

This hybrid approach provides the best balance of performance, scalability, and maintainability for the multilingual assessment system.
