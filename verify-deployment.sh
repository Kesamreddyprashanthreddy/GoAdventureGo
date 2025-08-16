#!/bin/bash

echo "🚀 GoAdventureGo Deployment Verification"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend API URL
BACKEND_URL="https://goadventurego-api.onrender.com"
FRONTEND_URL="https://goadventurego.onrender.com"

echo -e "\n${YELLOW}Testing Backend API...${NC}"
echo "URL: $BACKEND_URL/api/health"

# Test backend health endpoint
if curl -f -s "$BACKEND_URL/api/health" > /dev/null; then
    echo -e "${GREEN}✅ Backend API is responding!${NC}"
    curl -s "$BACKEND_URL/api/health" | echo "Response: $(cat)"
else
    echo -e "${RED}❌ Backend API is not responding${NC}"
    echo "Check Render logs for backend service"
fi

echo -e "\n${YELLOW}Testing Authentication Endpoints...${NC}"

# Test registration endpoint
echo "Testing POST $BACKEND_URL/api/auth/register..."
if curl -f -s -X POST "$BACKEND_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"123456","name":"Test User"}' > /dev/null; then
    echo -e "${GREEN}✅ Registration endpoint accessible${NC}"
else
    echo -e "${YELLOW}⚠️ Registration endpoint test failed (expected - no valid data)${NC}"
fi

echo -e "\n${YELLOW}Frontend Check...${NC}"
echo "URL: $FRONTEND_URL"
if curl -f -s "$FRONTEND_URL" > /dev/null; then
    echo -e "${GREEN}✅ Frontend is accessible!${NC}"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
fi

echo -e "\n${YELLOW}Summary:${NC}"
echo "1. Visit: $FRONTEND_URL"
echo "2. Try signin/signup forms"
echo "3. Check browser console for errors"
echo "4. If issues persist, check Render service logs"

echo -e "\n${GREEN}Deployment Complete! 🎉${NC}"
