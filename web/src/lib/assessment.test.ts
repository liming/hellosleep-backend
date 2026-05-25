import { getVisibleQuestions, processAssessment, questions, tags } from './assessment';

type Assertion = {
  condition: boolean;
  message: string;
};

const assertions: Assertion[] = [];

function assert(condition: boolean, message: string) {
  assertions.push({ condition, message });
}

function getTagNames(answerMap: Record<string, string>) {
  return processAssessment(answerMap).map((tag) => tag.name);
}

const baseline = {
  status: 'work',
  age_group: '26-35',
  sleepregular: 'yes',
  sleeptime: '23:00',
  getuptime: '07:00',
  hourstofallinsleep: '7',
  sport: 'best',
  busy: 'busy',
  sunshine: 'best',
  pressure: 'normal',
  lively: 'active',
  bedroom: 'no',
  bed: 'no',
  noise: 'yes',
  distraction: 'no',
  irresponsible: 'no',
  inactive: 'no',
  excessive_rest: 'no',
  complain: 'no',
  ignore: 'no',
};

// Inventory checks
const questionIds = new Set(questions.map((question) => question.id));
const tagNames = new Set(tags.map((tag) => tag.name));
assert(questionIds.has('busy'), 'Question set should include `busy`');
assert(questionIds.has('distraction'), 'Question set should include `distraction`');
assert(!questionIds.has('sleep_quality'), 'Question set should not include `sleep_quality`');
assert(tagNames.has('idle_lifestyle'), 'Tag set should include `idle_lifestyle`');
assert(tagNames.has('stress'), 'Tag set should include `stress`');
assert(tagNames.has('distraction'), 'Tag set should include `distraction`');
assert(!tagNames.has('poor_sleep_quality'), 'Tag set should not include `poor_sleep_quality`');

// Busy / idle trigger
const idleTags = getTagNames({
  ...baseline,
  status: 'retire',
  age_group: '55+',
  busy: 'very_idle',
  lively: 'normal',
});
assert(idleTags.includes('idle_lifestyle'), '`busy=very_idle` should trigger `idle_lifestyle`');

// Localized value compatibility
const localizedIdleTags = getTagNames({
  ...baseline,
  busy: '非常清闲',
  pressure: '压力适中',
  lively: '比较丰富活跃',
});
assert(localizedIdleTags.includes('idle_lifestyle'), 'Localized busy label should trigger `idle_lifestyle`');

// High pressure trigger
const stressTags = getTagNames({
  ...baseline,
  pressure: 'very_high',
});
assert(stressTags.includes('stress'), '`pressure=very_high` should trigger `stress`');

const localizedStressTags = getTagNames({
  ...baseline,
  pressure: '压力较大',
});
assert(localizedStressTags.includes('stress'), 'Localized pressure label should trigger `stress`');

// Distraction trigger
const distractionTags = getTagNames({
  ...baseline,
  distraction: 'yes',
});
assert(distractionTags.includes('distraction'), '`distraction=yes` should trigger `distraction`');

const localizedDistractionTags = getTagNames({
  ...baseline,
  distraction: '是',
});
assert(localizedDistractionTags.includes('distraction'), 'Localized yes/no should trigger `distraction`');

// Conditional visibility
const workVisible = new Set(
  getVisibleQuestions(questions, { status: 'work', sleepregular: 'yes' }).map((q) => q.id)
);
assert(workVisible.has('shiftwork'), 'Work flow should include `shiftwork`');
assert(!workVisible.has('holiday'), 'Work flow should exclude `holiday`');
assert(workVisible.has('distraction'), 'Work flow should include `distraction`');

const studyVisible = new Set(
  getVisibleQuestions(questions, { status: 'study', sleepregular: 'yes' }).map((q) => q.id)
);
assert(studyVisible.has('holiday'), 'Study flow should include `holiday`');
assert(!studyVisible.has('shiftwork'), 'Study flow should exclude `shiftwork`');

const failures = assertions.filter((item) => !item.condition);
if (failures.length > 0) {
  console.error('Assessment tests failed:');
  failures.forEach((failure) => console.error(`- ${failure.message}`));
  process.exit(1);
}

console.log(`Assessment tests passed (${assertions.length} assertions).`);
