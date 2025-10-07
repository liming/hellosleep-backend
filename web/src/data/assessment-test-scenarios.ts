// Reusable assessment test scenarios for quick manual testing

export type AssessmentAnswers = Record<string, string>;

export const assessmentTestScenarios: Record<string, AssessmentAnswers> = {
  // Scenario 1: Moderate sleep issues (most common)
  moderate: {
    age_group: '26-35',
    status: 'work',
    sleepregular: 'no',
    sleeptime: '23:30',
    getuptime: '07:30',
    hourstosleep: '8',
    hourstofallinsleep: '6',
    sleep_quality: 'fair',
    sport: 'little',
    sunshine: 'little',
    pressure: 'best',
    lively: 'normal',
    bedroom: 'yes',
    bed: 'yes',
    noise: 'no',
    noisereason: 'neighbour',
    shiftwork: 'no',
    holiday: 'no',
    bedtimeearly: 'no',
    irresponsible: 'no',
    inactive: 'no',
    excessive_rest: 'no',
    complain: 'no',
    ignore: 'no',
    medicine: 'no'
  },

  // Scenario 2: Severe sleep issues
  severe: {
    age_group: '36-45',
    status: 'work',
    sleepregular: 'no',
    sleeptime: '01:00',
    getuptime: '09:30',
    hourstosleep: '10',
    hourstofallinsleep: '4',
    sleep_quality: 'poor',
    sport: 'none',
    sunshine: 'none',
    pressure: 'best',
    lively: 'little',
    bedroom: 'yes',
    bed: 'yes',
    noise: 'no',
    noisereason: 'snore',
    shiftwork: 'no',
    holiday: 'no',
    bedtimeearly: 'no',
    irresponsible: 'yes',
    inactive: 'yes',
    excessive_rest: 'yes',
    complain: 'yes',
    ignore: 'yes',
    medicine: 'yes'
  },

  // Scenario 3: Good sleep habits
  good: {
    age_group: '18-25',
    status: 'work',
    sleepregular: 'yes',
    sleeptime: '22:45',
    getuptime: '06:45',
    hourstosleep: '7',
    hourstofallinsleep: '7',
    sleep_quality: 'good',
    sport: 'best',
    sunshine: 'best',
    pressure: 'normal',
    lively: 'best',
    bedroom: 'no',
    bed: 'no',
    noise: 'yes',
    shiftwork: 'no',
    holiday: 'no',
    bedtimeearly: 'no',
    irresponsible: 'no',
    inactive: 'no',
    excessive_rest: 'no',
    complain: 'no',
    ignore: 'no',
    medicine: 'no'
  }
};

export function getScenarioNames(): string[] {
  return Object.keys(assessmentTestScenarios);
}

export function getScenario(name?: string | null): AssessmentAnswers | null {
  if (!name) return null;
  const key = name.toLowerCase();
  return assessmentTestScenarios[key] ?? null;
}


