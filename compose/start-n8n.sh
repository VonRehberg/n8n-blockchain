#!/bin/bash

sleep 5

n8n import:credentials --input=/credentials/1.json
ls /workflows/*.json | sed 's/^\([^0-9]*\)\([0-9]*\)/\1 \2/' | sort -k2,2n | tr -d ' ' |
while read filename; do
    n8n import:workflow --input=$filename
done

n8n start

