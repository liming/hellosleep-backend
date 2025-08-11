# Failed Articles - Migration Issues

## Overview

This document tracks articles that failed to import during the migration process and provides details for future resolution.

## Failed Articles List

### 1. "写给失眠的学生 - 学会换气，才能游向更广阔的世界"

**Migration Date**: August 11, 2025  
**Error Type**: Validation Error - Invalid Internal Link  
**Error Message**: `Please specify a valid link`  
**Invalid Link**: `5b35dfcbd49e3a40708f7f78`  
**Location in Content**: `body[24].children[1].url`  
**Article Type**: Tutorial  
**Category**: Special Topics  

**Issue Description**: 
The article contains an internal link that references a non-existent article ID from the original Strapi 3 system.

**Resolution Required**:
- Remove the invalid link
- Replace with correct internal link (if target article exists)
- Or convert to plain text

---

### 2. "走出失眠 | 更生会讲座"

**Migration Date**: August 11, 2025  
**Error Type**: Validation Error - Invalid Internal Link  
**Error Message**: `Please specify a valid link`  
**Invalid Link**: `tutorial/5b46e991bf28873e046e1af8`  
**Location in Content**: `body[11].children[1].url`  
**Article Type**: Tutorial  
**Category**: Special Topics  

**Issue Description**: 
The article contains an internal link with a malformed URL that doesn't match the new system's URL structure.

**Resolution Required**:
- Fix the URL format to match new system
- Verify if target article exists in new system
- Update link or remove if target doesn't exist

---

### 3. "怎样对待恼人的噪音？"

**Migration Date**: August 11, 2025  
**Error Type**: Validation Error - Invalid Internal Link  
**Error Message**: `Please specify a valid link`  
**Invalid Link**: `t/category/5b35dff7d49e3a40708f7f79`  
**Location in Content**: `body[31].children[1].children[1].url`  
**Article Type**: Tutorial  
**Category**: Common Questions  

**Issue Description**: 
The article contains an internal link that references a non-existent category from the original Strapi 3 system.

**Resolution Required**:
- Remove the invalid category link
- Replace with correct category link (if category exists)
- Or convert to plain text

---

## Technical Details

### Error Pattern
All three failed articles have the same error pattern:
- **Error**: `Please specify a valid link`
- **Cause**: Invalid internal links in Lexical JSON content
- **Impact**: Prevents article import due to Strapi validation

### Link Types Found
1. **Article ID Links**: `5b35dfcbd49e3a40708f7f78` (old Strapi 3 article IDs)
2. **Malformed Tutorial Links**: `tutorial/5b46e991bf28873e046e1af8` (incorrect URL format)
3. **Category Links**: `t/category/5b35dff7d49e3a40708f7f79` (old category references)

### Migration Script Location
The failed articles are in the migrated data file:
- **File**: `migrated-remote-articles-improved.json`
- **Status**: Present but not imported due to validation errors

## Resolution Strategies

### Option 1: Manual Fix in Strapi Admin
1. Import articles without the problematic content
2. Manually edit in Strapi admin to fix links
3. Pros: Quick fix, visual editing
4. Cons: Time-consuming, manual work

### Option 2: Enhanced Migration Script
1. Add link validation to migration script
2. Automatically clean/fix invalid links
3. Pros: Automated, consistent
4. Cons: Requires development time

### Option 3: Content Review and Update
1. Review all internal linking strategy
2. Update links to match new system structure
3. Pros: Systematic approach
4. Cons: Requires content strategy decisions

## Next Steps

1. **Immediate**: Import remaining 155 articles (already completed)
2. **Short-term**: Decide on resolution strategy for failed articles
3. **Long-term**: Implement link validation in migration process

## Notes

- These failures represent 2.2% of total articles (3/158)
- All failures are content-related, not technical migration issues
- The migration process itself is working correctly
- Category linking is working perfectly for successful imports

## Status

**Current Status**: ✅ **MIGRATION COMPLETE** (155/158 articles successfully imported)  
**Failed Articles**: ⚠️ **PENDING RESOLUTION** (3 articles need manual intervention) 