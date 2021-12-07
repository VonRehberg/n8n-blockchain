#!/bin/bash

sleep 5

n8n import:credentials --input=/credentials/1.json
n8n import:workflow --separate --input=/workflows

n8n start

