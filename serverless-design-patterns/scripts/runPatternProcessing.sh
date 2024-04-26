#!/bin/bash

# env vars
source .env

pattern=$1

# function to start processing on AWS
runProcessing(){
    local patternName=$1
    echo "Running processing for $patternName"
    local API_ENDPOINT="$API_URL/$patternName"
    for i in {1..10}
    do
        echo "Request $i"

        curl -X GET "$API_ENDPOINT?tryNumber=$i"

        sleep 80

        echo "Deploying changes"
        pnpm sst deploy

        sleep 250
    done
}


case $pattern in
    "simpleComputing")
        runProcessing "simpleComputing"
        ;;
    "fanoutBasic")
        runProcessing "fanoutBasic"
        ;;
    "fanoutWithSNS")
        runProcessing "fanoutWithSNS"
        ;;
    *)
        echo "Invalid pattern name"
        ;;
esac


