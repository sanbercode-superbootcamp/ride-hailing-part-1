# Tugas 9 Ride Hailing Part 1

## Introduction
Now, I have a task about creating service for ride hailing app. Meanwhile, this task is divided to three services such as tracker service, position service, and scoring/performance service. This task uses Postgresql as event storage and NATS as event emitter.
Hope you enjoy it!  

## Testing w/ httpie
Driver Tracker Service

- `http POST localhost:3000/track rider_id=4 north=1 south=0 west=0 east=1`

Position Service
- `http localhost:3001/position/4`

Score Service
- `http localhost:3002/score/4`

Keywords : Service, Sequelize, Postgresql, NATS, Express, Ride Hailing.
---
***created by arifintahu***
