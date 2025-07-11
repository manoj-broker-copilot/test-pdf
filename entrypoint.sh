#!/bin/bash
set -e

# Start SSHD
service ssh start

# Start your Node.js app
exec node dist/main.js