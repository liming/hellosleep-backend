
const HOURS_THRESHOLD = 0.7;
// const NORMAL_SLEEP_HOURS = 7;
const UNHEALTH_THRESHOLD = 4;
const IDLE_THRESHOLD = 5;
const AFFECT_THRESHOLD = 3;

const PointMap = {
  best: 5,
  normal: 3,
  little: 1,
  none: 0
};

const YesNo = {
  yes: true,
  no: false
};

function getSleepHours(sleeptime, getuptime, hourstosleep) {
  let hours;

  if (sleeptime && getuptime) {
    // calculate the hours trying to sleep
    const sleep = new Date(sleeptime);
    const getup = new Date(getuptime);

    // make sure getup is tomorrow
    getup.setDate(getup.getDate() + 1);

    hours = Math.abs(getup - sleep) / 36e5;
  }

  if (hourstosleep) hours = hourstosleep;

  return hours;
}

function calcSleepEfficiency(sleeptime, getuptime, hourstosleep, hourstofallinsleep) {

  const hours = getSleepHours(sleeptime, getuptime, hourstosleep);

  return (hourstofallinsleep / hours) < HOURS_THRESHOLD;
}

function isHealthy(sport, sunshine) {
  const totalPoint = PointMap[sport] + PointMap[sunshine];

  return totalPoint < UNHEALTH_THRESHOLD;
}

function isIdle(pressure, lively) {
  const totalPoint = PointMap[pressure] + PointMap[lively];

  return totalPoint < IDLE_THRESHOLD;
}

function isStimuli(bedroom, bed) {
  return YesNo[bedroom] || YesNo[bed];
}

function isAffected() {
  let count = 0;
  const args = Array.prototype.slice.call(arguments);

  args.forEach(value => {
    if (YesNo[value]) count++;
  });

  return (count >= AFFECT_THRESHOLD);
}

export default {
  getSleepHours,
  calcSleepEfficiency,
  isHealthy,
  isIdle,
  isStimuli,
  isAffected
};
