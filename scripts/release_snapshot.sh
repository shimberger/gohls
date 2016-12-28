#!/bin/bash

#Build
./scripts/prep_release.sh snapshot

# Push
aws s3 cp --region us-east-1 build/gohls-osx-snapshot.tar.gz s3://gohls/
aws s3 cp --region us-east-1 build/gohls-linux-amd64-snapshot.tar.gz s3://gohls/
aws s3 cp --region us-east-1 build/gohls-windows-amd64-snapshot.tar.gz s3://gohls/