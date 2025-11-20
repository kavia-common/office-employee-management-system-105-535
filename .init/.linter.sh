#!/bin/bash
cd /home/kavia/workspace/code-generation/office-employee-management-system-105-535/nodejs_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

