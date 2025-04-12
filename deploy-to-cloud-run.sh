#!/bin/bash
# Deploy 360 Business Magician to Google Cloud Run

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration - Free Tier Optimized
PROJECT_ID="business-magician"
REGION="us-central1"
SERVICE_NAME="business-magician-api"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"
MIN_INSTANCES=0          # Scale to zero when not in use (free tier friendly)
MAX_INSTANCES=1          # Limit to 1 instance to control costs
MEMORY="256Mi"           # Reduced memory to stay within free tier limits
CPU="1"                  # Shared CPU (costs less)
TIMEOUT="300s"
CONCURRENCY=80
CONTAINER_PORT=8080      # Default port for the container

# Check for gcloud CLI
if ! command -v gcloud &> /dev/null; then
  echo -e "${RED}Error: Google Cloud CLI (gcloud) is not installed.${NC}"
  echo "Please install it from: https://cloud.google.com/sdk/docs/install"
  exit 1
fi

# Check authentication
GCLOUD_AUTH=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null)
if [ -z "$GCLOUD_AUTH" ]; then
  echo -e "${YELLOW}You need to log in to Google Cloud SDK first${NC}"
  gcloud auth login
fi

# Set the project
echo -e "${GREEN}Setting project to: $PROJECT_ID${NC}"
gcloud config set project $PROJECT_ID

# Check for Docker
if ! command -v docker &> /dev/null; then
  echo -e "${RED}Error: Docker is not installed.${NC}"
  echo "Please install Docker from: https://docs.docker.com/get-docker/"
  exit 1
fi

# Check if the Docker daemon is running
if ! docker info &> /dev/null; then
  echo -e "${RED}Error: Docker daemon is not running.${NC}"
  echo "Please start Docker and try again."
  exit 1
fi

# Configure Docker to use gcloud as a credential helper
echo -e "${GREEN}Configuring Docker for Google Container Registry...${NC}"
gcloud auth configure-docker gcr.io --quiet

# Build the Docker image
echo -e "${GREEN}Building Docker image...${NC}"
docker build -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Docker build failed.${NC}"
  exit 1
fi

# Push the image to Google Container Registry
echo -e "${GREEN}Pushing image to Google Container Registry...${NC}"
docker push $IMAGE_NAME

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to push Docker image.${NC}"
  exit 1
fi

# Check if the service already exists
SERVICE_EXISTS=$(gcloud run services list --platform managed --region $REGION --format="value(metadata.name)" --filter="metadata.name=$SERVICE_NAME" 2>/dev/null)

# Prepare environment variables for the service
ENV_VARS=""

# Ask for API keys (only if they're not already set as environment variables)
function ask_for_secret {
  local VAR_NAME=$1
  local DESCRIPTION=$2
  
  if [ -z "${!VAR_NAME}" ]; then
    echo -e "${YELLOW}$DESCRIPTION${NC}"
    read -s -p "$VAR_NAME: " SECRET_VALUE
    echo
    
    if [ -n "$SECRET_VALUE" ]; then
      ENV_VARS="$ENV_VARS,$VAR_NAME=$SECRET_VALUE"
    fi
  else
    ENV_VARS="$ENV_VARS,$VAR_NAME=${!VAR_NAME}"
    echo -e "${GREEN}Using $VAR_NAME from environment${NC}"
  fi
}

# Required environment variables
ask_for_secret "NOTION_API_KEY" "Enter your Notion API key for database integration"
ask_for_secret "NOTION_DATABASE_ID" "Enter your Notion database ID"
ask_for_secret "OPENAI_API_KEY" "Enter your OpenAI API key for AI features"
ask_for_secret "ANTHROPIC_API_KEY" "Enter your Anthropic API key (optional, press Enter to skip)"

# Remove the leading comma if ENV_VARS is not empty
if [ -n "$ENV_VARS" ]; then
  ENV_VARS="${ENV_VARS:1}"
fi

# Check if we have access to the storage buckets
echo -e "${GREEN}Checking access to Cloud Storage buckets...${NC}"
DATA_BUCKET="business-magician-api-data"
ASSETS_BUCKET="business-magician-api-vercel-assets"

# Check if buckets exist, create them if not
function check_bucket {
  local BUCKET_NAME=$1
  local BUCKET_EXISTS=$(gsutil ls -p $PROJECT_ID 2>/dev/null | grep -c "gs://$BUCKET_NAME/")
  
  if [ $BUCKET_EXISTS -eq 0 ]; then
    echo -e "${YELLOW}Bucket gs://$BUCKET_NAME/ doesn't exist. Creating it...${NC}"
    gsutil mb -p $PROJECT_ID -l $REGION gs://$BUCKET_NAME/
    
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Bucket gs://$BUCKET_NAME/ created successfully.${NC}"
      
      if [[ $BUCKET_NAME == *"-vercel-assets" ]]; then
        echo -e "${GREEN}Making assets bucket publicly readable...${NC}"
        gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME/
      fi
    else
      echo -e "${RED}Failed to create bucket gs://$BUCKET_NAME/.${NC}"
    fi
  else
    echo -e "${GREEN}Bucket gs://$BUCKET_NAME/ exists.${NC}"
  fi
}

check_bucket $DATA_BUCKET
check_bucket $ASSETS_BUCKET

# Deploy to Cloud Run
if [ -z "$SERVICE_EXISTS" ]; then
  echo -e "${GREEN}Creating new Cloud Run service: $SERVICE_NAME${NC}"
  gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --memory $MEMORY \
    --cpu $CPU \
    --timeout $TIMEOUT \
    --concurrency $CONCURRENCY \
    --min-instances $MIN_INSTANCES \
    --max-instances $MAX_INSTANCES \
    --allow-unauthenticated \
    --set-env-vars="$ENV_VARS"
else
  echo -e "${GREEN}Updating existing Cloud Run service: $SERVICE_NAME${NC}"
  gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --memory $MEMORY \
    --cpu $CPU \
    --timeout $TIMEOUT \
    --concurrency $CONCURRENCY \
    --min-instances $MIN_INSTANCES \
    --max-instances $MAX_INSTANCES \
    --set-env-vars="$ENV_VARS"
fi

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to deploy to Cloud Run.${NC}"
  exit 1
fi

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format="value(status.url)")

echo -e "${GREEN}Deployment successful!${NC}"
echo -e "Your 360 Business Magician is now running at: ${YELLOW}$SERVICE_URL${NC}"

# Save service information to the data bucket
echo -e "${GREEN}Saving deployment information to Cloud Storage...${NC}"
DEPLOY_INFO="{
  \"service\": \"$SERVICE_NAME\",
  \"url\": \"$SERVICE_URL\",
  \"deployedAt\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
  \"version\": \"$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')\",
  \"environment\": \"production\"
}"

echo "$DEPLOY_INFO" > deployment-info.json
gsutil cp deployment-info.json gs://$DATA_BUCKET/deployments/latest.json

# Final instructions
echo
echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}Deployment complete! Next steps:${NC}"
echo -e "1. Verify the API is working by visiting: ${YELLOW}$SERVICE_URL/api/health${NC}"
echo -e "2. Update your frontend configuration to point to this backend"
echo -e "3. Deploy your frontend using Vercel"
echo -e "${GREEN}===============================================${NC}"

exit 0