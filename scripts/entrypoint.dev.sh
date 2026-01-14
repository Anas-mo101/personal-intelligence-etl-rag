#!/bin/bash

# --------------------------------------------------
#   1) Runs migrations
#   2) Seeds the database (skipping if already run)
#   3) Starts the development server
# --------------------------------------------------

if [ $1 != "true" ]; then
    echo "==> Running DB migrations..." 
    npm run prisma:generate
    npm run prisma:push
    

    echo "==> Seeding the DB (skipping if already run)..."
    npm run prisma:seed
fi

echo "==> Starting the development server..."
npm run dev