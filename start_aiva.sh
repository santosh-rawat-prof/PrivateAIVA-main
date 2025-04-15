#!/bin/bash

gnome-terminal -- bash -c "cd api && npm i && npm start; exec bash"

gnome-terminal -- bash -c "cd frontend && npm i && npm run dev; exec bash"