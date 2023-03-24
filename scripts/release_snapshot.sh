#!/bin/bash
set -euo pipefail

#Build
./scripts/prep_release.sh snapshot

# Push
aws s3 cp --region us-east-1 './gohls-osx-${{ env.tag_name }}.tar.gz' s3://gohls/
aws s3 cp --region us-east-1 './gohls-osx-arm64-${{ env.tag_name }}.tar.gz' s3://gohls/
aws s3 cp --region us-east-1 './gohls-linux-386-${{ env.tag_name }}.tar.gz' s3://gohls/
aws s3 cp --region us-east-1 './gohls-linux-amd64-${{ env.tag_name }}.tar.gz' s3://gohls/
aws s3 cp --region us-east-1 './gohls-linux-arm64-${{ env.tag_name }}.tar.gz' s3://gohls/
aws s3 cp --region us-east-1 './gohls-windows-amd64-${{ env.tag_name }}.tar.gz' s3://gohls/