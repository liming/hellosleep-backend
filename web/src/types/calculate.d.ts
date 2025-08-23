declare module '../../../prompts/calculate.js' {
  export function getSleepHours(sleeptime: string, getuptime: string, hourstosleep: number): number;
  export function calcSleepEfficiency(sleeptime: string, getuptime: string, hourstosleep: number, hourstofallinsleep: number): boolean;
  export function isHealthy(sport: string, sunshine: string): boolean;
  export function isIdle(pressure: string, lively: string): boolean;
  export function isStimuli(bedroom: string, bed: string): boolean;
  export function isAffected(...args: string[]): boolean;

  const calculateFunctions: {
    getSleepHours: typeof getSleepHours;
    calcSleepEfficiency: typeof calcSleepEfficiency;
    isHealthy: typeof isHealthy;
    isIdle: typeof isIdle;
    isStimuli: typeof isStimuli;
    isAffected: typeof isAffected;
  };

  export default calculateFunctions;
}
