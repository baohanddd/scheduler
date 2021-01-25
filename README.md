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

## API

### 创建定时任务

`POST /jobs`

Request
```json
{
	"url": "https://fl.org/fu/api/notifications",
	"method": "get",
	"at": 1667488661,
	"headers": {
		"Authorization": "abc"
	},
	"params": {
		"user_id": "5d144e2da104af0933023753"
	}
}
```

Response:
```json
{
    "url": "https://fl.org/fu/api/notifications",
    "method": "get",
    "at": 1667488661,
    "headers": {
      "Authorization": "abc"
    },
    "params": {
      "user_id": "5d144e2da104af0933023753"
    },
    "id": "69f74150-5eb7-11eb-aed0-0fd571a8231f"
}
```

### 删除定时任务

`DELETE /jobs/{id}`

Example:

`DELETE /jobs/c7918650-cd58-11e9-a365-719bbc8f9d6a`

Request: None

Response: 
```json
{
    "error": 0,
    "message": "success"
}
```

### 查询已注册定时任务

`GET /jobs`

Request: None

Response:
```json
[
    {
        "url": "https://fl.org/fu/api/enterprise/appointments/600e2df141b20d206475d2ee/room/participant",
        "method": "PUT",
        "at": 1611631920,
        "headers": {
            "Authorization": "abc"
        },
        "params": [],
        "id": "bbfe2a60-5eb5-11eb-aed0-0fd571a8231f"
    },
    ...
    {
        "url": "https://fl..org/fu/api/enterprise/appointments/600e2df141b20d206475d2ee/room",
        "method": "DELETE",
        "at": 1611631800,
        "headers": {
            "Authorization": "abc"
        },
        "params": {
            "appointment_id": "600e2df141b20d206475d2ee"
        },
        "id": "bbf7e8d0-5eb5-11eb-aed0-0fd571a8231f"
    }
]
```