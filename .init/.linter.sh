#!/bin/bash
cd /home/kavia/workspace/code-generation/time-tracking-and-approval-system-197469-197478/timesheet_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

