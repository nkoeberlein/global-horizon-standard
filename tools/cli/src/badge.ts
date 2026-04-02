import { getGHSDate } from './ghs-converter';

const ghs = getGHSDate(new Date());
console.log(`${ghs.fullDate} ${ghs.beats}`);