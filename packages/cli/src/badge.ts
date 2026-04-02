#!/usr/bin/env node
import { getGHSDate } from 'ghs-time';

const ghs = getGHSDate(new Date());
process.stdout.write(`${ghs.fullDate} ${ghs.beats}\n`);
