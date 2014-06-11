SlideASeal Protocol
==========

## Server to Client ##

### GameState Event ###
This event is broadcast to the clients and contains various game information of the new GameState.

* count increment when a new GameState is computed by the server.
* nextPanel contains the next panels. nextPanel[0] is the current panel.
* actions is an array of actions. There are two kinds of action objects. The slide action and the score action. The score action contains the serie count of panels in a row in the datafield and the orientation. 
* field contains a representation of the gamefield as a multidimensional array.

```
{
  "count": 2,
  "nextPanels": [ 3, 2, 1],
  "currentPlayer": "Stefan",
  "actions": [
    {
      "type": "Slide",
      "data": {
        "SlideIn": {
          "m": 0,
          "n": 5,
          "type": 3
        }
      },
      "SlideOut": {
        "m": 0,
        "n": 1
      }
    },
    {
      "type": "Score",
      "data": {
        "Score": {
          "m": 3,
          "n": 2,
          "count": 3,
          "orientation": "horizontal",
          "type": 2,
          "score": 30
        }
      }
    }
  ],
  "field": [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1]
  ]
}
```

### slidePostion Event ###
This event is send to the client to signal the current slider move the panel on the gamefield.

```
{
	"m": "1",
	"n": "0"
}
```

### notification Event ###
This event is send to the client to notification about game events.

```
{ "msg": "wait for a other player" }
{ "msg": "not your turn" }
{ "msg": "a player join the game", "name": "Peter" }
{ "msg": "a observer join the game", "name": "Frank" }
```


## Client to Server ##

### register Event ###
This event is send to the server to register a name and a sessionid that parse out of the dom.

Example: localhost:3000/session/hallowelt123/Stefan

```
{
	"registername": "Stefan",
	"sessionid": "hallowelt123"
}
```
### slide Event ###
This event is send to the server to signal the client slide a panel.

```
{
	"m": "1",
	"n": "0"
}
```

### slidePostion Event ###
This event is send to the server to signal the current slider move the panel on the gamefield. Only the current slider can send this event to the server.

```
{
	"m": "1",
	"n": "0"
}
```