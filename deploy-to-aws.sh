#!/bin/bash

# Farm Funding Matcher - Automated AWS Amplify Deployment Script
# This script automates the entire deployment process to AWS Amplify

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}\n"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Generate random JWT secret
generate_jwt_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Main script starts here
print_header "Farm Funding Matcher - AWS Amplify Deployment"

# Step 1: Check prerequisites
print_header "Step 1: Checking Prerequisites"

if ! command_exists git; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi
print_success "Git is installed"

if ! command_exists aws; then
    print_error "AWS CLI is not installed. Please install it from: https://aws.amazon.com/cli/"
    exit 1
fi
print_success "AWS CLI is installed"

if ! command_exists gh; then
    print_error "GitHub CLI is not installed. Please install it from: https://cli.github.com/"
    exit 1
fi
print_success "GitHub CLI is installed"

# Check AWS credentials
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    print_error "AWS credentials not configured. Run: aws configure"
    exit 1
fi
print_success "AWS credentials are configured"

# Check GitHub authentication
if ! gh auth status >/dev/null 2>&1; then
    print_error "GitHub CLI not authenticated. Run: gh auth login"
    exit 1
fi
print_success "GitHub CLI is authenticated"

# Step 2: Get repository information
print_header "Step 2: Repository Setup"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository. Please initialize git first."
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
print_info "Current branch: $CURRENT_BRANCH"

# Check if remote exists
if ! git remote get-url origin >/dev/null 2>&1; then
    print_warning "No remote repository found. Creating GitHub repository..."
    
    read -p "Enter repository name (default: farm-funding-matcher): " REPO_NAME
    REPO_NAME=${REPO_NAME:-farm-funding-matcher}
    
    read -p "Make repository private? (y/N): " PRIVATE
    if [[ $PRIVATE =~ ^[Yy]$ ]]; then
        gh repo create "$REPO_NAME" --private --source=. --remote=origin
    else
        gh repo create "$REPO_NAME" --public --source=. --remote=origin
    fi
    
    print_success "GitHub repository created"
else
    REPO_URL=$(git remote get-url origin)
    print_success "Remote repository: $REPO_URL"
fi

# Step 3: Generate JWT secret
print_header "Step 3: Generating JWT Secret"

JWT_SECRET=$(generate_jwt_secret)
print_success "JWT secret generated: ${JWT_SECRET:0:8}..."

# Step 4: Commit and push code
print_header "Step 4: Committing and Pushing Code"

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    print_info "Uncommitted changes detected. Committing..."
    git add .
    git commit -m "Deploy to AWS Amplify - $(date '+%Y-%m-%d %H:%M:%S')"
    print_success "Changes committed"
else
    print_info "No uncommitted changes"
fi

# Push to GitHub
print_info "Pushing to GitHub..."
git push -u origin "$CURRENT_BRANCH"
print_success "Code pushed to GitHub"

# Get repository details for Amplify
REPO_FULL=$(gh repo view --json nameWithOwner -q .nameWithOwner)
print_info "Repository: $REPO_FULL"

# Step 5: Create AWS Amplify App
print_header "Step 5: Creating AWS Amplify App"

read -p "Enter AWS region (default: us-east-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

read -p "Enter app name (default: farm-funding-matcher): " APP_NAME
APP_NAME=${APP_NAME:-farm-funding-matcher}

print_info "Creating Amplify app..."

# Get GitHub token for Amplify
print_info "You'll need a GitHub personal access token with 'repo' scope"
print_info "Create one at: https://github.com/settings/tokens/new"
read -sp "Enter GitHub personal access token: " GITHUB_TOKEN
echo

# Create Amplify app
APP_ID=$(aws amplify create-app \
    --name "$APP_NAME" \
    --repository "https://github.com/$REPO_FULL" \
    --access-token "$GITHUB_TOKEN" \
    --region "$AWS_REGION" \
    --platform WEB \
    --query 'app.appId' \
    --output text)

if [ -z "$APP_ID" ]; then
    print_error "Failed to create Amplify app"
    exit 1
fi

print_success "Amplify app created with ID: $APP_ID"

# Step 6: Configure environment variables
print_header "Step 6: Configuring Environment Variables"

print_info "Setting environment variables..."

aws amplify update-app \
    --app-id "$APP_ID" \
    --region "$AWS_REGION" \
    --environment-variables \
        JWT_SECRET="$JWT_SECRET" \
        NODE_ENV="production" \
    >/dev/null

print_success "Environment variables configured"

# Step 7: Create branch and configure build settings
print_header "Step 7: Configuring Build Settings"

# Create branch in Amplify
aws amplify create-branch \
    --app-id "$APP_ID" \
    --branch-name "$CURRENT_BRANCH" \
    --region "$AWS_REGION" \
    --enable-auto-build \
    >/dev/null

print_success "Branch '$CURRENT_BRANCH' connected to Amplify"

# Update build settings
BUILD_SPEC='{
  "version": 1,
  "frontend": {
    "phases": {
      "preBuild": {
        "commands": [
          "npm ci"
        ]
      },
      "build": {
        "commands": [
          "echo \"Build completed\""
        ]
      }
    },
    "artifacts": {
      "baseDirectory": "/",
      "files": [
        "**/*"
      ]
    }
  }
}'

aws amplify update-app \
    --app-id "$APP_ID" \
    --region "$AWS_REGION" \
    --build-spec "$BUILD_SPEC" \
    >/dev/null

print_success "Build settings configured"

# Step 8: Trigger deployment
print_header "Step 8: Triggering Deployment"

print_info "Starting deployment..."

JOB_ID=$(aws amplify start-job \
    --app-id "$APP_ID" \
    --branch-name "$CURRENT_BRANCH" \
    --job-type RELEASE \
    --region "$AWS_REGION" \
    --query 'jobSummary.jobId' \
    --output text)

print_success "Deployment started (Job ID: $JOB_ID)"

# Wait for deployment to complete
print_info "Waiting for deployment to complete (this may take a few minutes)..."

while true; do
    JOB_STATUS=$(aws amplify get-job \
        --app-id "$APP_ID" \
        --branch-name "$CURRENT_BRANCH" \
        --job-id "$JOB_ID" \
        --region "$AWS_REGION" \
        --query 'job.summary.status' \
        --output text)
    
    if [ "$JOB_STATUS" = "SUCCEED" ]; then
        print_success "Deployment completed successfully!"
        break
    elif [ "$JOB_STATUS" = "FAILED" ] || [ "$JOB_STATUS" = "CANCELLED" ]; then
        print_error "Deployment failed with status: $JOB_STATUS"
        exit 1
    else
        echo -n "."
        sleep 10
    fi
done

# Step 9: Get and display the live URL
print_header "Step 9: Deployment Complete!"

APP_URL="https://$CURRENT_BRANCH.$APP_ID.amplifyapp.com"

print_success "Your app is now live!"
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Live URL: ${BLUE}$APP_URL${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

print_info "AWS Amplify Console: https://$AWS_REGION.console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$APP_ID"
print_info "GitHub Repository: https://github.com/$REPO_FULL"

echo -e "\n${YELLOW}Important:${NC}"
echo "• JWT Secret has been set automatically"
echo "• Save your app details for future reference"
echo "• Future pushes to '$CURRENT_BRANCH' will auto-deploy"

print_success "Deployment script completed successfully!"
