Scheduler
====

The scheduler will trigger scheduled tasks on time.
It's using LevelDB instead of Redis to persistent jobs in v2.

The debug logs will be found in `combined.log`.
The error logs will be found in `error.log`.

## How to Use

```
docker build . -t timer:v2

docker run -d --rm --name=timer -v=$(pwd)/db:/var/timer/db -p=1377:1377 timer:v2

docker logs timer --tail 50 -f
```