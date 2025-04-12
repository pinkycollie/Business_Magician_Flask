#!/bin/bash
# Google Cloud Platform Instance Manager for 360 Business Magician
# This script helps manage GCP instances, including restarting suspended instances

# Configuration
PROJECT_ID="business-magician"
ZONE="us-central1-a"      # Default zone, can be overridden with -z flag
INSTANCE_NAME=""          # Will be set by command-line argument

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function print_help {
  echo -e "${YELLOW}GCP Instance Manager for 360 Business Magician${NC}"
  echo
  echo "Usage: $0 [COMMAND] -i INSTANCE_NAME [-z ZONE] [-p PROJECT_ID]"
  echo
  echo "Commands:"
  echo "  status    - Check the status of an instance"
  echo "  start     - Start an instance (restarts if suspended)"
  echo "  stop      - Stop an instance"
  echo "  restart   - Restart an instance"
  echo "  list      - List all instances in the project"
  echo "  export    - Export an instance (create snapshot)"
  echo "  import    - Import an instance from a snapshot"
  echo
  echo "Options:"
  echo "  -i, --instance   Instance name (required for all commands except list)"
  echo "  -z, --zone       GCP zone (default: us-central1-a)"
  echo "  -p, --project    GCP project ID (default: business-magician)"
  echo "  -h, --help       Show this help message"
  echo
  echo "Examples:"
  echo "  $0 status -i admin-username"
  echo "  $0 start -i admin-username -z us-west1-b"
  echo "  $0 list"
  echo
}

function check_dependencies {
  if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: Google Cloud SDK (gcloud) is not installed or not in PATH${NC}"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
  fi
}

function check_auth {
  GCLOUD_AUTH=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null)
  if [ -z "$GCLOUD_AUTH" ]; then
    echo -e "${YELLOW}You need to log in to Google Cloud SDK first${NC}"
    gcloud auth login
  fi
}

function set_project {
  gcloud config set project $PROJECT_ID
}

function list_instances {
  echo -e "${GREEN}Listing instances in project ${PROJECT_ID}...${NC}"
  gcloud compute instances list --project=$PROJECT_ID
}

function check_instance_status {
  if [ -z "$INSTANCE_NAME" ]; then
    echo -e "${RED}Error: Instance name is required. Use -i or --instance flag.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Checking status of instance ${INSTANCE_NAME}...${NC}"
  STATUS=$(gcloud compute instances describe $INSTANCE_NAME \
    --zone=$ZONE \
    --project=$PROJECT_ID \
    --format="value(status)" 2>/dev/null)
    
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Instance $INSTANCE_NAME not found in zone $ZONE${NC}"
    exit 1
  fi
  
  echo -e "Instance status: ${YELLOW}$STATUS${NC}"
  return 0
}

function start_instance {
  if [ -z "$INSTANCE_NAME" ]; then
    echo -e "${RED}Error: Instance name is required. Use -i or --instance flag.${NC}"
    exit 1
  fi
  
  # Check current status
  STATUS=$(gcloud compute instances describe $INSTANCE_NAME \
    --zone=$ZONE \
    --project=$PROJECT_ID \
    --format="value(status)" 2>/dev/null)
    
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Instance $INSTANCE_NAME not found in zone $ZONE${NC}"
    exit 1
  fi
  
  if [ "$STATUS" == "RUNNING" ]; then
    echo -e "${YELLOW}Instance $INSTANCE_NAME is already running.${NC}"
    return 0
  fi
  
  echo -e "${GREEN}Starting instance ${INSTANCE_NAME}...${NC}"
  gcloud compute instances start $INSTANCE_NAME \
    --zone=$ZONE \
    --project=$PROJECT_ID
    
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Instance $INSTANCE_NAME started successfully.${NC}"
    # Get the external IP
    EXTERNAL_IP=$(gcloud compute instances describe $INSTANCE_NAME \
      --zone=$ZONE \
      --project=$PROJECT_ID \
      --format="value(networkInterfaces[0].accessConfigs[0].natIP)")
      
    echo -e "External IP: ${YELLOW}$EXTERNAL_IP${NC}"
  else
    echo -e "${RED}Failed to start instance $INSTANCE_NAME.${NC}"
    exit 1
  fi
}

function stop_instance {
  if [ -z "$INSTANCE_NAME" ]; then
    echo -e "${RED}Error: Instance name is required. Use -i or --instance flag.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Stopping instance ${INSTANCE_NAME}...${NC}"
  gcloud compute instances stop $INSTANCE_NAME \
    --zone=$ZONE \
    --project=$PROJECT_ID
    
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Instance $INSTANCE_NAME stopped successfully.${NC}"
  else
    echo -e "${RED}Failed to stop instance $INSTANCE_NAME.${NC}"
    exit 1
  fi
}

function restart_instance {
  if [ -z "$INSTANCE_NAME" ]; then
    echo -e "${RED}Error: Instance name is required. Use -i or --instance flag.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Restarting instance ${INSTANCE_NAME}...${NC}"
  gcloud compute instances reset $INSTANCE_NAME \
    --zone=$ZONE \
    --project=$PROJECT_ID
    
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Instance $INSTANCE_NAME restarted successfully.${NC}"
    # Get the external IP
    EXTERNAL_IP=$(gcloud compute instances describe $INSTANCE_NAME \
      --zone=$ZONE \
      --project=$PROJECT_ID \
      --format="value(networkInterfaces[0].accessConfigs[0].natIP)")
      
    echo -e "External IP: ${YELLOW}$EXTERNAL_IP${NC}"
  else
    echo -e "${RED}Failed to restart instance $INSTANCE_NAME.${NC}"
    exit 1
  fi
}

function export_instance {
  if [ -z "$INSTANCE_NAME" ]; then
    echo -e "${RED}Error: Instance name is required. Use -i or --instance flag.${NC}"
    exit 1
  fi
  
  SNAPSHOT_NAME="${INSTANCE_NAME}-snapshot-$(date +%Y%m%d-%H%M%S)"
  DISK_NAME=$(gcloud compute instances describe $INSTANCE_NAME \
    --zone=$ZONE \
    --project=$PROJECT_ID \
    --format="value(disks[0].source.basename())" 2>/dev/null)
    
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Instance $INSTANCE_NAME not found in zone $ZONE${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Creating snapshot ${SNAPSHOT_NAME} from instance ${INSTANCE_NAME}...${NC}"
  gcloud compute disks snapshot $DISK_NAME \
    --snapshot-names=$SNAPSHOT_NAME \
    --zone=$ZONE \
    --project=$PROJECT_ID
    
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Snapshot $SNAPSHOT_NAME created successfully.${NC}"
  else
    echo -e "${RED}Failed to create snapshot from instance $INSTANCE_NAME.${NC}"
    exit 1
  fi
}

function import_instance {
  if [ -z "$INSTANCE_NAME" ]; then
    echo -e "${RED}Error: Instance name is required. Use -i or --instance flag.${NC}"
    exit 1
  fi
  
  # List available snapshots and ask user to select one
  echo -e "${GREEN}Available snapshots:${NC}"
  gcloud compute snapshots list --project=$PROJECT_ID --filter="name~'.*snapshot.*'" --sort-by=creationTimestamp
  
  echo -e "${YELLOW}Enter the name of the snapshot to import:${NC}"
  read SNAPSHOT_NAME
  
  if [ -z "$SNAPSHOT_NAME" ]; then
    echo -e "${RED}Error: Snapshot name is required.${NC}"
    exit 1
  fi
  
  # Check if snapshot exists
  gcloud compute snapshots describe $SNAPSHOT_NAME --project=$PROJECT_ID &> /dev/null
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Snapshot $SNAPSHOT_NAME not found.${NC}"
    exit 1
  fi
  
  # Check if instance already exists
  gcloud compute instances describe $INSTANCE_NAME --zone=$ZONE --project=$PROJECT_ID &> /dev/null
  if [ $? -eq 0 ]; then
    echo -e "${YELLOW}Warning: Instance $INSTANCE_NAME already exists.${NC}"
    echo -e "Do you want to overwrite it? (y/n)"
    read OVERWRITE
    
    if [ "$OVERWRITE" != "y" ] && [ "$OVERWRITE" != "Y" ]; then
      echo -e "${YELLOW}Import cancelled.${NC}"
      exit 0
    fi
    
    # Stop the instance before replacing it
    stop_instance
  fi
  
  # Create a new disk from the snapshot
  DISK_NAME="${INSTANCE_NAME}-disk"
  echo -e "${GREEN}Creating disk ${DISK_NAME} from snapshot ${SNAPSHOT_NAME}...${NC}"
  gcloud compute disks create $DISK_NAME \
    --source-snapshot=$SNAPSHOT_NAME \
    --zone=$ZONE \
    --project=$PROJECT_ID
    
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create disk from snapshot.${NC}"
    exit 1
  fi
  
  # Create a new instance with the disk
  echo -e "${GREEN}Creating instance ${INSTANCE_NAME} from disk ${DISK_NAME}...${NC}"
  gcloud compute instances create $INSTANCE_NAME \
    --disk="name=${DISK_NAME},boot=yes,auto-delete=yes" \
    --zone=$ZONE \
    --project=$PROJECT_ID
    
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Instance $INSTANCE_NAME created successfully from snapshot $SNAPSHOT_NAME.${NC}"
    # Get the external IP
    EXTERNAL_IP=$(gcloud compute instances describe $INSTANCE_NAME \
      --zone=$ZONE \
      --project=$PROJECT_ID \
      --format="value(networkInterfaces[0].accessConfigs[0].natIP)")
      
    echo -e "External IP: ${YELLOW}$EXTERNAL_IP${NC}"
  else
    echo -e "${RED}Failed to create instance from snapshot.${NC}"
    exit 1
  fi
}

# Parse command-line arguments
COMMAND=$1
shift

while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -i|--instance)
      INSTANCE_NAME="$2"
      shift
      shift
      ;;
    -z|--zone)
      ZONE="$2"
      shift
      shift
      ;;
    -p|--project)
      PROJECT_ID="$2"
      shift
      shift
      ;;
    -h|--help)
      print_help
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $key${NC}"
      print_help
      exit 1
      ;;
  esac
done

# Execute the appropriate command
check_dependencies
check_auth
set_project

case $COMMAND in
  status)
    check_instance_status
    ;;
  start)
    start_instance
    ;;
  stop)
    stop_instance
    ;;
  restart)
    restart_instance
    ;;
  list)
    list_instances
    ;;
  export)
    export_instance
    ;;
  import)
    import_instance
    ;;
  *)
    echo -e "${RED}Unknown command: $COMMAND${NC}"
    print_help
    exit 1
    ;;
esac

exit 0