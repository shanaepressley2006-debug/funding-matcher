#!/bin/bash

# Farm Funding Matcher - Quick Deploy Script
# Simple script to push code and guide through manual AWS Amplify setup

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_step() {
    echo -e "${CYAN}▶ $1${NC}"
}

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}\n"
}

# Generate random JWT secret
generate_jwt_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Main script starts here
clear
print_header "Farm Funding Matcher - Quick Deploy"

# Check if git is installed
if ! command -v git >/dev/null 2>&1; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository. Please run 'git init' first."
    exit 1
fi

# Step 1: Push to GitHub
print_header "Step 1: Pushing Code to GitHub"

CURRENT_BRANCH=$(git branch --show-current)
print_info "Current branch: $CURRENT_BRANCH"

# Check if remote exists
if ! git remote get-url origin >/dev/null 2>&1; then
    print_error "No remote repository configured."
    echo -e "\n${YELLOW}Please create a GitHub repository and add it as remote:${NC}"
    echo "  1. Go to https://github.com/new"
    echo "  2. Create a new repository"
    echo "  3. Run: git remote add origin <your-repo-url>"
    echo "  4. Run this script again"
    exit 1
fi

REPO_URL=$(git remote get-url origin)
print_success "Remote repository: $REPO_URL"

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    print_info "Uncommitted changes detected."
    read -p "Commit changes? (Y/n): " COMMIT
    if [[ ! $COMMIT =~ ^[Nn]$ ]]; then
        git add .
        read -p "Enter commit message (default: 'Deploy update'): " COMMIT_MSG
        COMMIT_MSG=${COMMIT_MSG:-Deploy update}
        git commit -m "$COMMIT_MSG"
        print_success "Changes committed"
    fi
fi

# Push to GitHub
print_info "Pushing to GitHub..."
if git push -u origin "$CURRENT_BRANCH" 2>/dev/null; then
    print_success "Code pushed to GitHub successfully!"
else
    print_error "Failed to push. Please check your GitHub credentials."
    exit 1
fi

# Step 2: Generate JWT Secret
print_header "Step 2: JWT Secret"

JWT_SECRET=$(generate_jwt_secret)
echo -e "${GREEN}Your JWT Secret:${NC}"
echo -e "${YELLOW}$JWT_SECRET${NC}"
echo -e "\n${BLUE}Copy this secret - you'll need it in Step 4!${NC}"

read -p "Press Enter to continue..."

# Step 3: Open AWS Amplify Console
print_header "Step 3: Opening AWS Amplify Console"

AWS_CONSOLE_URL="https://console.aws.amazon.com/amplify/home"

print_info "Opening AWS Amplify Console in your browser..."
if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$AWS_CONSOLE_URL" 2>/dev/null
elif command -v open >/dev/null 2>&1; then
    open "$AWS_CONSOLE_URL" 2>/dev/null
else
    print_info "Please open this URL manually: $AWS_CONSOLE_URL"
fi

print_success "AWS Console should open in your browser"

# Step 4: Display step-by-step instructions
print_header "Step 4: Follow These Instructions"

echo -e "${CYAN}┌─────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│  AWS Amplify Setup Instructions                         │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────┘${NC}\n"

echo -e "${YELLOW}1. Create New App${NC}"
echo "   • Click 'New app' → 'Host web app'"
echo "   • Select 'GitHub' as your Git provider"
echo "   • Authorize AWS Amplify to access your GitHub"

echo -e "\n${YELLOW}2. Select Repository${NC}"
echo "   • Choose your repository from the list"
echo "   • Select branch: ${GREEN}$CURRENT_BRANCH${NC}"
echo "   • Click 'Next'"

echo -e "\n${YELLOW}3. Configure Build Settings${NC}"
echo "   • App name: farm-funding-matcher (or your choice)"
echo "   • Leave build settings as default"
echo "   • Click 'Advanced settings'"

echo -e "\n${YELLOW}4. Add Environment Variables${NC}"
echo "   • Click 'Add environment variable'"
echo "   • Variable 1:"
echo "     - Key: ${GREEN}JWT_SECRET${NC}"
echo "     - Value: ${GREEN}$JWT_SECRET${NC}"
echo "   • Variable 2:"
echo "     - Key: ${GREEN}NODE_ENV${NC}"
echo "     - Value: ${GREEN}production${NC}"

echo -e "\n${YELLOW}5. Deploy${NC}"
echo "   • Click 'Next'"
echo "   • Review settings"
echo "   • Click 'Save and deploy'"

echo -e "\n${YELLOW}6. Wait for Deployment${NC}"
echo "   • Deployment takes 3-5 minutes"
echo "   • Watch the progress in the console"
echo "   • Once complete, you'll see a green checkmark"

echo -e "\n${YELLOW}7. Access Your App${NC}"
echo "   • Click on the deployment URL"
echo "   • Your app is now live!"

echo -e "\n${CYAN}┌─────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│  Important Notes                                        │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────┘${NC}\n"

echo "• Future pushes to '$CURRENT_BRANCH' will auto-deploy"
echo "• You can view deployment logs in the Amplify console"
echo "• To update environment variables, go to:"
echo "  App Settings → Environment variables"

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Repository: $REPO_URL${NC}"
echo -e "${GREEN}  Branch: $CURRENT_BRANCH${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

print_success "Quick deploy preparation complete!"

echo -e "\n${BLUE}Need help?${NC}"
echo "• AWS Amplify Docs: https://docs.aws.amazon.com/amplify/"
echo "• GitHub Issues: $REPO_URL/issues"

# Optional: Save JWT secret to a file
read -p "Save JWT secret to .env.production? (y/N): " SAVE_ENV
if [[ $SAVE_ENV =~ ^[Yy]$ ]]; then
    echo "JWT_SECRET=$JWT_SECRET" > .env.production
    echo "NODE_ENV=production" >> .env.production
    print_success "JWT secret saved to .env.production"
    print_info "Remember to add .env.production to .gitignore!"
    
    if ! grep -q ".env.production" .gitignore 2>/dev/null; then
        echo ".env.production" >> .gitignore
        print_success "Added .env.production to .gitignore"
    fi
fi

echo -e "\n${GREEN}Happy deploying! 🚀${NC}\n"
