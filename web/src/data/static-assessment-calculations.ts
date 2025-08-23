// Enhanced calculation functions for static assessment engine
// Based on sleep science and improved logic

export interface CalculationResult {
  value: number | boolean;
  confidence: number; // 0-1
  reasoning: string;
}

// Enhanced point mapping with more granular scoring
export const PointMap = {
  best: 5,
  good: 4,
  normal: 3,
  poor: 2,
  little: 1,
  none: 0
};

export const YesNoMap = {
  yes: true,
  no: false
};

// Sleep efficiency thresholds
const SLEEP_EFFICIENCY_THRESHOLD = 0.85; // 85% efficiency is considered good
const SLEEP_DURATION_MIN = 7; // Minimum recommended sleep hours
const SLEEP_DURATION_MAX = 9; // Maximum recommended sleep hours

// Lifestyle health thresholds
const UNHEALTHY_LIFESTYLE_THRESHOLD = 4; // Combined sport + sunshine score
const IDLE_LIFESTYLE_THRESHOLD = 5; // Combined pressure + lively score
const AFFECTED_BEHAVIOR_THRESHOLD = 3; // Number of negative behaviors

/**
 * Calculate sleep hours from bedtime and wake time
 */
export function getSleepHours(sleeptime: string, getuptime: string, hourstosleep?: number): number {
  if (hourstosleep) return hourstosleep;

  if (sleeptime && getuptime) {
    try {
      const sleep = new Date(`2000-01-01T${sleeptime}`);
      const getup = new Date(`2000-01-01T${getuptime}`);
      
      // If wake time is before sleep time, it's the next day
      if (getup <= sleep) {
        getup.setDate(getup.getDate() + 1);
      }
      
      const hours = Math.abs(getup.getTime() - sleep.getTime()) / (1000 * 60 * 60);
      return Math.round(hours * 10) / 10; // Round to 1 decimal place
    } catch (error) {
      console.error('Error calculating sleep hours:', error);
      return 0;
    }
  }
  
  return 0;
}

/**
 * Calculate sleep efficiency (actual sleep time / time in bed)
 */
export function calcSleepEfficiency(
  sleeptime: string, 
  getuptime: string, 
  hourstosleep: number, 
  hourstofallinsleep: number
): CalculationResult {
  const totalTimeInBed = getSleepHours(sleeptime, getuptime, hourstosleep);
  
  if (totalTimeInBed === 0) {
    return {
      value: false,
      confidence: 0,
      reasoning: '无法计算睡眠时间'
    };
  }
  
  const efficiency = hourstofallinsleep / totalTimeInBed;
  const isEfficient = efficiency >= SLEEP_EFFICIENCY_THRESHOLD;
  
  return {
    value: isEfficient,
    confidence: Math.min(efficiency, 1),
    reasoning: `睡眠效率: ${(efficiency * 100).toFixed(1)}% (${hourstofallinsleep}小时实际睡眠 / ${totalTimeInBed}小时在床上)`
  };
}

/**
 * Assess lifestyle health based on exercise and sunlight exposure
 */
export function isHealthy(sport: string, sunshine: string): CalculationResult {
  const sportScore = PointMap[sport as keyof typeof PointMap] || 0;
  const sunshineScore = PointMap[sunshine as keyof typeof PointMap] || 0;
  const totalScore = sportScore + sunshineScore;
  
  const isHealthy = totalScore >= UNHEALTHY_LIFESTYLE_THRESHOLD;
  const confidence = Math.min(totalScore / 10, 1); // Normalize to 0-1
  
  let reasoning = `运动评分: ${sportScore}, 阳光接触评分: ${sunshineScore}, 总分: ${totalScore}`;
  if (isHealthy) {
    reasoning += ' - 生活方式健康';
  } else {
    reasoning += ' - 需要改善生活方式';
  }
  
  return {
    value: !isHealthy, // Return true if unhealthy (to trigger intervention)
    confidence,
    reasoning
  };
}

/**
 * Assess if lifestyle is too idle/boring
 */
export function isIdle(pressure: string, lively: string): CalculationResult {
  const pressureScore = PointMap[pressure as keyof typeof PointMap] || 0;
  const livelyScore = PointMap[lively as keyof typeof PointMap] || 0;
  const totalScore = pressureScore + livelyScore;
  
  const isIdle = totalScore < IDLE_LIFESTYLE_THRESHOLD;
  const confidence = Math.min((10 - totalScore) / 10, 1);
  
  let reasoning = `压力评分: ${pressureScore}, 生活丰富度评分: ${livelyScore}, 总分: ${totalScore}`;
  if (isIdle) {
    reasoning += ' - 生活较为单调';
  } else {
    reasoning += ' - 生活较为丰富';
  }
  
  return {
    value: isIdle,
    confidence,
    reasoning
  };
}

/**
 * Check if bedroom/bed is overused as living space
 */
export function isStimuli(bedroom: string, bed: string): CalculationResult {
  const bedroomOveruse = YesNoMap[bedroom as keyof typeof YesNoMap] || false;
  const bedOveruse = YesNoMap[bed as keyof typeof YesNoMap] || false;
  
  const isStimuli = bedroomOveruse || bedOveruse;
  const confidence = bedroomOveruse && bedOveruse ? 1 : 0.7;
  
  let reasoning = '';
  if (bedroomOveruse && bedOveruse) {
    reasoning = '卧室和床都被过度使用';
  } else if (bedroomOveruse) {
    reasoning = '卧室被过度使用';
  } else if (bedOveruse) {
    reasoning = '床被过度使用';
  } else {
    reasoning = '卧室使用正常';
  }
  
  return {
    value: isStimuli,
    confidence,
    reasoning
  };
}

/**
 * Check if user is affected by insomnia (multiple negative behaviors)
 */
export function isAffected(...args: string[]): CalculationResult {
  let count = 0;
  const behaviors: string[] = [];
  
  args.forEach((value, index) => {
    if (YesNoMap[value as keyof typeof YesNoMap]) {
      count++;
      // Map behavior names for reasoning
      const behaviorNames = ['放弃工作学习', '减少社交活动', '过度休息', '抱怨失眠', '忽视亲友', '服用药物'];
      if (behaviorNames[index]) {
        behaviors.push(behaviorNames[index]);
      }
    }
  });
  
  const isAffected = count >= AFFECTED_BEHAVIOR_THRESHOLD;
  const confidence = Math.min(count / 6, 1);
  
  let reasoning = `负面行为数量: ${count}/${args.length}`;
  if (behaviors.length > 0) {
    reasoning += ` (${behaviors.join(', ')})`;
  }
  
  return {
    value: isAffected,
    confidence,
    reasoning
  };
}

/**
 * Calculate sleep quality score
 */
export function calculateSleepQuality(
  sleepregular: string,
  hourstofallinsleep: number,
  efficiency: number
): CalculationResult {
  let score = 0;
  let reasoning = '';
  
  // Regular sleep schedule
  if (sleepregular === 'yes') {
    score += 2;
    reasoning += '规律作息 +2分, ';
  }
  
  // Sleep duration
  if (hourstofallinsleep >= SLEEP_DURATION_MIN && hourstofallinsleep <= SLEEP_DURATION_MAX) {
    score += 3;
    reasoning += `睡眠时长合适(${hourstofallinsleep}小时) +3分, `;
  } else if (hourstofallinsleep >= 6 && hourstofallinsleep <= 10) {
    score += 1;
    reasoning += `睡眠时长一般(${hourstofallinsleep}小时) +1分, `;
  } else {
    reasoning += `睡眠时长不足(${hourstofallinsleep}小时) +0分, `;
  }
  
  // Sleep efficiency
  if (efficiency >= SLEEP_EFFICIENCY_THRESHOLD) {
    score += 3;
    reasoning += `睡眠效率良好(${(efficiency * 100).toFixed(1)}%) +3分, `;
  } else if (efficiency >= 0.7) {
    score += 1;
    reasoning += `睡眠效率一般(${(efficiency * 100).toFixed(1)}%) +1分, `;
  } else {
    reasoning += `睡眠效率差(${(efficiency * 100).toFixed(1)}%) +0分, `;
  }
  
  const maxScore = 8;
  const qualityScore = score / maxScore;
  
  return {
    value: qualityScore,
    confidence: qualityScore,
    reasoning: reasoning.slice(0, -2) + ` | 总分: ${score}/${maxScore}`
  };
}

/**
 * Check if user has shift work issues
 */
export function hasShiftWorkIssues(shiftwork: string, sleepregular: string): CalculationResult {
  const hasShiftWork = YesNoMap[shiftwork as keyof typeof YesNoMap] || false;
  const isRegular = sleepregular === 'yes';
  
  const hasIssues = hasShiftWork && !isRegular;
  const confidence = hasShiftWork ? 0.9 : 0.5;
  
  let reasoning = '';
  if (hasShiftWork) {
    reasoning = '需要倒班工作';
    if (!isRegular) {
      reasoning += '且作息不规律';
    }
  } else {
    reasoning = '无需倒班工作';
  }
  
  return {
    value: hasIssues,
    confidence,
    reasoning
  };
}

/**
 * Check if user has student-specific issues
 */
export function hasStudentIssues(
  status: string,
  holiday: string,
  bedtimeearly: string
): CalculationResult {
  if (status !== 'study') {
    return {
      value: false,
      confidence: 0,
      reasoning: '非学生用户'
    };
  }
  
  const hasHolidayIssues = YesNoMap[holiday as keyof typeof YesNoMap] || false;
  const hasBedtimeIssues = YesNoMap[bedtimeearly as keyof typeof YesNoMap] || false;
  
  const hasIssues = hasHolidayIssues || hasBedtimeIssues;
  const confidence = hasIssues ? 0.8 : 0.6;
  
  let reasoning = '学生用户';
  if (hasHolidayIssues) {
    reasoning += ' - 假期综合症';
  }
  if (hasBedtimeIssues) {
    reasoning += ' - 作息冲突';
  }
  
  return {
    value: hasIssues,
    confidence,
    reasoning
  };
}

// Export all calculation functions
export const calculationFunctions = {
  getSleepHours,
  calcSleepEfficiency,
  isHealthy,
  isIdle,
  isStimuli,
  isAffected,
  calculateSleepQuality,
  hasShiftWorkIssues,
  hasStudentIssues
};

export default calculationFunctions;
