#!/usr/bin/env node

import { SummaryRunner } from './summary/summary-runner.mjs';

const summaryRunner = await SummaryRunner.create();
summaryRunner.run();
