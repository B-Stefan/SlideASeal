var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define([], function() {
  var Player;
  return Player = (function() {
    Player.sides = {
      LEFT: 10,
      RIGHT: 20
    };

    function Player(name, sessionId) {
      this.setName = __bind(this.setName, this);
      this.getName = __bind(this.getName, this);
      this.getSide = __bind(this.getSide, this);
      this.setSide = __bind(this.setSide, this);
      this.getSessionId = __bind(this.getSessionId, this);
      this.name = name;
      this.sessionid = sessionId;
      this.side = null;
    }

    Player.prototype.getSessionId = function() {
      return this.sessionid;
    };

    Player.prototype.setSide = function(side) {
      return this.side = side;
    };

    Player.prototype.getSide = function() {
      return this.side;
    };

    Player.prototype.getName = function() {
      return this.name;
    };

    Player.prototype.setName = function(name) {
      return this.name = name;
    };

    return Player;

  })();
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL1N0ZWZhbi9Eb3dubG9hZHMvU2xpZGVBU2VhbC9wdWJsaWMvamF2YXNjcmlwdHMvYXBwL1BsYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9TdGVmYW4vRG93bmxvYWRzL1NsaWRlQVNlYWwvYXNzZXRzL2phdmFzY3JpcHRzL2FwcC9QbGF5ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsa0ZBQUE7O0FBQUEsTUFBQSxDQUFPLEVBQVAsRUFBVyxTQUFBLEdBQUE7QUFHVCxNQUFBLE1BQUE7U0FBTTtBQUtKLElBQUEsTUFBQyxDQUFBLEtBQUQsR0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLEVBQU47QUFBQSxNQUNBLEtBQUEsRUFBTyxFQURQO0tBREYsQ0FBQTs7QUFJYSxJQUFBLGdCQUFDLElBQUQsRUFBTSxTQUFOLEdBQUE7QUFDWCwrQ0FBQSxDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSwrQ0FBQSxDQUFBO0FBQUEseURBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFSLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsU0FEYixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBRlIsQ0FEVztJQUFBLENBSmI7O0FBQUEscUJBU0EsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFLLElBQUMsQ0FBQSxVQUFOO0lBQUEsQ0FUZCxDQUFBOztBQUFBLHFCQWFBLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTthQUNQLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FERDtJQUFBLENBYlQsQ0FBQTs7QUFBQSxxQkFrQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxLQURNO0lBQUEsQ0FsQlQsQ0FBQTs7QUFBQSxxQkFxQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxLQURNO0lBQUEsQ0FyQlQsQ0FBQTs7QUFBQSxxQkF1QkEsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO2FBQ1AsSUFBQyxDQUFBLElBQUQsR0FBUSxLQUREO0lBQUEsQ0F2QlQsQ0FBQTs7a0JBQUE7O09BUk87QUFBQSxDQUFYLENBQUEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSBbXSwgKCktPlxuICAjQGNsYXNzXG4gICNQbGF5ZXIgY2xhc3NcbiAgY2xhc3MgUGxheWVyXG5cbiAgICAjQHN0YXRpY1xuICAgICNAZW51bVxuICAgICNSZXByZXNlbnRzIHRoZSBzaWRlcyBvZiB0aGUgcGxheWVyc1xuICAgIEBzaWRlczpcbiAgICAgIExFRlQ6IDEwXG4gICAgICBSSUdIVDogMjBcblxuICAgIGNvbnN0cnVjdG9yOiAobmFtZSxzZXNzaW9uSWQpLT5cbiAgICAgIEBuYW1lID0gbmFtZVxuICAgICAgQHNlc3Npb25pZCA9IHNlc3Npb25JZFxuICAgICAgQHNpZGUgPSBudWxsXG5cbiAgICBnZXRTZXNzaW9uSWQ6ICgpPT4gQHNlc3Npb25pZFxuXG4gICAgI1NldCB0aGUgc2lkZSBvZiB0aGUgUGxheWVyXG4gICAgI0BwYXJhbSB7UGxheWVyLnNpZGV9IHNpZGVcbiAgICBzZXRTaWRlOiAoc2lkZSk9PlxuICAgICAgQHNpZGUgPSBzaWRlXG5cbiAgICAjIFJldHVybnMgdGhlIHNpZGUgb2YgdGhlIFBsYXllclxuICAgICMgQHJldHVybiBQbGF5ZXIuc2lkZVxuICAgIGdldFNpZGU6ICgpPT5cbiAgICAgIEBzaWRlXG5cbiAgICBnZXROYW1lOiAoKT0+XG4gICAgICBAbmFtZVxuICAgIHNldE5hbWU6IChuYW1lKSA9PlxuICAgICAgQG5hbWUgPSBuYW1lXG5cbiJdfQ==
