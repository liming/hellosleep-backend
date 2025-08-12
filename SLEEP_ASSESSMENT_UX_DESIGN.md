# Sleep Assessment UX Design & Wireframes

## 🎯 Design Philosophy

### **User-Centered Approach**
- **Progressive Disclosure**: One question per screen to reduce cognitive load
- **Visual Feedback**: Clear progress indicators and selection states
- **Calming Design**: Sleep-themed colors and smooth transitions
- **Accessibility**: Clear typography and high contrast for all users

### **Key UX Principles**
1. **Reduce Anxiety**: Friendly, non-judgmental language
2. **Build Trust**: Clear privacy statements and progress saving
3. **Provide Value**: Immediate, actionable insights
4. **Encourage Completion**: Engaging, not overwhelming

## 📱 User Flow

### **1. Landing Page (`/assessment`)**
**Purpose**: Introduce the assessment and set expectations

**Key Elements**:
- Clear value proposition
- 3-step process overview
- Assessment categories preview
- Time estimate (5-10 minutes)
- Privacy assurance
- Prominent CTA button

**UX Patterns**:
- Hero section with clear hierarchy
- Visual step indicators
- Category cards with icons
- Trust signals (privacy, time estimate)

### **2. Question Flow (`/assessment/questions`)**
**Purpose**: Collect user responses efficiently

**Key Elements**:
- Progress bar with percentage
- Category badges for context
- Single question focus
- Multiple choice options
- Scale questions (1-10)
- Text input for open-ended questions
- Navigation (Previous/Next)

**UX Patterns**:
- One question per screen
- Visual progress indicator
- Clear option selection states
- Disabled states for validation
- Auto-save functionality

### **3. Results Page (`/assessment/results`)**
**Purpose**: Present personalized insights and recommendations

**Key Elements**:
- Overall sleep score (visual)
- Category breakdown
- Detailed analysis
- Personalized recommendations
- Action buttons (Save, Retake, Share)

**UX Patterns**:
- Score visualization (circle chart)
- Category cards with metrics
- Numbered recommendations
- Clear call-to-actions

## 🎨 Visual Design System

### **Color Palette**
- **Primary**: Blue (#2563EB) - Trust, calm, professional
- **Secondary**: Indigo (#4F46E5) - Depth, wisdom
- **Success**: Green (#10B981) - Positive, healthy
- **Warning**: Orange (#F59E0B) - Attention, improvement needed
- **Error**: Red (#EF4444) - Issues, problems
- **Neutral**: Gray scale for text and backgrounds

### **Typography**
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable, comfortable line height
- **Chinese**: Proper font weights for readability

### **Spacing & Layout**
- **Consistent padding**: 8px grid system
- **Card-based design**: White cards on gradient background
- **Rounded corners**: 12px for cards, 8px for buttons
- **Shadows**: Subtle depth for hierarchy

## 📋 Question Types & Interactions

### **1. Single Choice Questions**
```
Question: "您每晚通常睡几个小时？"
Options: [少于5小时] [5-6小时] [6-7小时] [7-8小时] [超过8小时]
Interaction: Click to select, visual feedback
```

### **2. Scale Questions (1-10)**
```
Question: "您如何评价自己的整体睡眠质量？"
Scale: [1] -------- [10]
Labels: "很差" "很好"
Interaction: Slider with real-time value display
```

### **3. Text Input**
```
Question: "请描述您最近的睡眠困扰..."
Input: Multi-line text area
Placeholder: "请详细描述..."
Interaction: Auto-expanding text area
```

## 🔄 State Management

### **Progress Tracking**
- Current question index
- Completed answers
- Progress percentage
- Auto-save to localStorage

### **Validation States**
- Required field validation
- Disabled button states
- Error messages (if needed)

### **Loading States**
- Question transitions
- Results generation
- Save operations

## 📊 Results Visualization

### **Overall Score**
- Circular progress indicator
- Score out of 10
- Color-coded (Red/Orange/Green)
- Descriptive label

### **Category Breakdown**
- Individual category scores
- Visual indicators (icons, colors)
- Key metrics display
- Trend indicators

### **Recommendations**
- Numbered list
- Actionable advice
- Priority indicators
- Related resources

## 🚀 Advanced Features (Future)

### **Smart Question Flow**
- Adaptive questions based on previous answers
- Skip irrelevant questions
- Dynamic question count

### **Progress Persistence**
- Save to cloud
- Resume from any device
- Multiple assessment history

### **Social Features**
- Share results (anonymously)
- Compare with others
- Community insights

### **Integration**
- Export to PDF
- Send to healthcare provider
- Calendar integration for sleep tracking

## 📱 Responsive Design

### **Mobile-First Approach**
- Touch-friendly buttons (44px minimum)
- Swipe gestures for navigation
- Optimized for one-handed use
- Reduced cognitive load

### **Desktop Enhancements**
- Larger click targets
- Hover states
- Keyboard navigation
- Multi-column layouts

## ♿ Accessibility

### **WCAG 2.1 AA Compliance**
- High contrast ratios
- Keyboard navigation
- Screen reader support
- Focus indicators
- Alternative text for images

### **Cognitive Accessibility**
- Clear, simple language
- Consistent navigation
- Predictable interactions
- Error prevention

## 🧪 User Testing Scenarios

### **Scenario 1: First-Time User**
1. Lands on assessment page
2. Reads overview and categories
3. Starts assessment
4. Completes all questions
5. Reviews results
6. Saves or shares results

### **Scenario 2: Returning User**
1. Resumes previous assessment
2. Continues from last question
3. Completes remaining questions
4. Compares with previous results

### **Scenario 3: Mobile User**
1. Uses mobile device
2. Swipes through questions
3. Uses touch interactions
4. Views results on small screen

## 📈 Success Metrics

### **Completion Rate**
- Target: >80% completion rate
- Track drop-off points
- Optimize problematic questions

### **User Satisfaction**
- Post-assessment survey
- Net Promoter Score
- User feedback collection

### **Engagement**
- Time spent on assessment
- Return visits
- Result sharing rate

## 🔧 Technical Implementation

### **Frontend Framework**
- Next.js with TypeScript
- Tailwind CSS for styling
- React hooks for state management
- Local storage for persistence

### **Backend Integration**
- Question bank API
- Results calculation engine
- User data storage
- Analytics tracking

### **Performance**
- Lazy loading for questions
- Optimized images and icons
- Fast page transitions
- Minimal bundle size

## 📝 Content Guidelines

### **Question Writing**
- Use simple, clear language
- Avoid medical jargon
- Be culturally sensitive
- Provide context when needed

### **Results Language**
- Positive, encouraging tone
- Actionable recommendations
- Avoid alarming language
- Provide hope and solutions

### **Localization**
- Chinese as primary language
- English support for international users
- Cultural adaptations
- Regional sleep patterns

---

## 🎯 Next Steps

1. **Review wireframes** at `/assessment/wireframes`
2. **Gather feedback** from stakeholders
3. **Refine design** based on feedback
4. **Implement core functionality**
5. **User testing** with target audience
6. **Iterate and improve**

The wireframe prototype is available at: `http://localhost:3001/assessment/wireframes` 