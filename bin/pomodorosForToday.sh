#!/bin/bash
cat $(realpath "$(dirname $BASH_SOURCE)/../statsfile") | grep "$(date | grep -Po "\w{3}\s\w{3}\s\d+")"
