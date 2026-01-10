#!/bin/bash

# --------------------------------------------------
#   1) Runs migrations
#   2) Seeds the database (skipping if already run)
#   3) Starts the production server
# --------------------------------------------------

echo "==> Running DB migrations..." 
npx prisma generate
npx prisma db push

echo "==> Seeding the DB (skipping if already run)..."
npx prisma db seed

echo "==> Starting the production server..."
npm run start:prod