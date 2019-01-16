#!/usr/bin/env bash

sync() {
    git submodule update --recursive --remote
}

$1
