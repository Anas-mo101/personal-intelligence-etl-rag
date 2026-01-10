#!/bin/bash

# --------------------------------------------------
#   1) Runs migrations
#   2) Seeds the database (skipping if already run)
#   3) Starts the development server
# --------------------------------------------------

echo "==> Running DB migrations..." 
npx prisma generate
npx prisma db push

echo "==> Seeding the DB (skipping if already run)..."
npx prisma db seed

echo "==> Starting the development server..."
npm run dev