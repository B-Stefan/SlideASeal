var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

define(['Phaser', './Panel'], function(Phaser, Panel) {
  var UpcommingPanelsBoard;
  return UpcommingPanelsBoard = (function(_super) {
    __extends(UpcommingPanelsBoard, _super);

    UpcommingPanelsBoard.preload = function(game) {
      return console.log('');
    };

    function UpcommingPanelsBoard(game, gamefield, x, y) {
      if (y == null) {
        y = 100;
      }
      this.handleNetworkGameState = __bind(this.handleNetworkGameState, this);
      this.popNextPanel = __bind(this.popNextPanel, this);
      this.add = __bind(this.add, this);
      this.show = __bind(this.show, this);
      if (gamefield === void 0) {
        throw new Error("Please parse a Gamefield");
      }
      UpcommingPanelsBoard.__super__.constructor.call(this, game, null, 'UpcomingPanelsBoard', false, false);
      this.gamefield = gamefield;
      this.x = x != null ? x : game.world.width - 60;
      this.y = y;
    }

    UpcommingPanelsBoard.prototype.show = function() {
      this.game.world.addChild(this);
      this.x = this.game.world.width;
      return this.game.add.tween(this).to({
        x: this.game.world.width - 140
      }, 1000, Phaser.Easing.Linear.None, true);
    };

    UpcommingPanelsBoard.prototype.add = function(panel) {
      var index;
      if (!panel instanceof Panel) {
        throw new Error("Please parse a Panel Instance");
      }
      panel.setPosition(this.children.length + 1, 1);
      UpcommingPanelsBoard.__super__.add.call(this, panel);
      index = this.children.indexOf(panel);
      return panel.x = panel.x + (panel.getBounds().width / 3 * index);
    };

    UpcommingPanelsBoard.prototype.popNextPanel = function() {
      var nextPanel;
      nextPanel = this.children[0];
      this.remove(nextPanel);
      return nextPanel;
    };

    UpcommingPanelsBoard.prototype.handleNetworkGameState = function(data) {
      var panelId, _i, _len, _ref;
      this.removeAll(true);
      _ref = data.nextPanels;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        panelId = _ref[_i];
        this.add(new Panel(this.game, this, Panel.getTypeById(panelId)));
      }
      return this.gamefield.setPanelToPlace(this.popNextPanel());
    };

    return UpcommingPanelsBoard;

  })(Phaser.Group);
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL1N0ZWZhbi9Eb3dubG9hZHMvU2xpZGVBU2VhbC9wdWJsaWMvamF2YXNjcmlwdHMvYXBwL1VwY29taW5nUGFuZWxzQm9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvVXNlcnMvU3RlZmFuL0Rvd25sb2Fkcy9TbGlkZUFTZWFsL2Fzc2V0cy9qYXZhc2NyaXB0cy9hcHAvVXBjb21pbmdQYW5lbHNCb2FyZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7K0JBQUE7O0FBQUEsTUFBQSxDQUFPLENBQUUsUUFBRixFQUFZLFNBQVosQ0FBUCxFQUE4QixTQUFDLE1BQUQsRUFBUSxLQUFSLEdBQUE7QUFLNUIsTUFBQSxvQkFBQTtTQUFNO0FBSUosMkNBQUEsQ0FBQTs7QUFBQSxJQUFBLG9CQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsSUFBRCxHQUFBO2FBQ1IsT0FBTyxDQUFDLEdBQVIsQ0FBYSxFQUFiLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBVWEsSUFBQSw4QkFBQyxJQUFELEVBQU0sU0FBTixFQUFpQixDQUFqQixFQUFxQixDQUFyQixHQUFBOztRQUFxQixJQUFJO09BQ3BDO0FBQUEsNkVBQUEsQ0FBQTtBQUFBLHlEQUFBLENBQUE7QUFBQSx1Q0FBQSxDQUFBO0FBQUEseUNBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBRyxTQUFBLEtBQWEsTUFBaEI7QUFDRSxjQUFXLElBQUEsS0FBQSxDQUFPLDBCQUFQLENBQVgsQ0FERjtPQUFBO0FBQUEsTUFFQSxzREFBTSxJQUFOLEVBQVcsSUFBWCxFQUFrQixxQkFBbEIsRUFBdUMsS0FBdkMsRUFBNkMsS0FBN0MsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsU0FBRCxHQUFhLFNBSGIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLENBQUQsZUFBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBWCxHQUFtQixFQUo1QixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsQ0FBRCxHQUFLLENBTEwsQ0FEVztJQUFBLENBVmI7O0FBQUEsbUNBb0JBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixNQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVosQ0FBcUIsSUFBckIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsQ0FBRCxHQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBRGpCLENBQUE7YUFFQSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFWLENBQWdCLElBQWhCLENBQWtCLENBQUMsRUFBbkIsQ0FBc0I7QUFBQSxRQUFDLENBQUEsRUFBRyxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFaLEdBQWtCLEdBQXRCO09BQXRCLEVBQWtELElBQWxELEVBQXVELE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQTVFLEVBQWlGLElBQWpGLEVBSEk7SUFBQSxDQXBCTixDQUFBOztBQUFBLG1DQTZCQSxHQUFBLEdBQUssU0FBQyxLQUFELEdBQUE7QUFDSCxVQUFBLEtBQUE7QUFBQSxNQUFBLElBQUcsQ0FBQSxLQUFBLFlBQXFCLEtBQXhCO0FBQ0UsY0FBVSxJQUFBLEtBQUEsQ0FBTywrQkFBUCxDQUFWLENBREY7T0FBQTtBQUFBLE1BRUEsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLEdBQWlCLENBQW5DLEVBQXFDLENBQXJDLENBRkEsQ0FBQTtBQUFBLE1BR0EsOENBQU0sS0FBTixDQUhBLENBQUE7QUFBQSxNQUlBLEtBQUEsR0FBUSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBa0IsS0FBbEIsQ0FKUixDQUFBO2FBT0EsS0FBSyxDQUFDLENBQU4sR0FBVyxLQUFLLENBQUMsQ0FBTixHQUFVLENBQUMsS0FBSyxDQUFDLFNBQU4sQ0FBQSxDQUFpQixDQUFDLEtBQWxCLEdBQXdCLENBQXhCLEdBQTRCLEtBQTdCLEVBUmxCO0lBQUEsQ0E3QkwsQ0FBQTs7QUFBQSxtQ0F5Q0EsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFVBQUEsU0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxRQUFTLENBQUEsQ0FBQSxDQUF0QixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxDQUFRLFNBQVIsQ0FEQSxDQUFBO0FBRUEsYUFBTyxTQUFQLENBSFk7SUFBQSxDQXpDZCxDQUFBOztBQUFBLG1DQWdEQSxzQkFBQSxHQUF3QixTQUFDLElBQUQsR0FBQTtBQUN0QixVQUFBLHVCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQVgsQ0FBQSxDQUFBO0FBQ0E7QUFBQSxXQUFBLDJDQUFBOzJCQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsR0FBRCxDQUFTLElBQUEsS0FBQSxDQUFNLElBQUMsQ0FBQSxJQUFQLEVBQVksSUFBWixFQUFjLEtBQUssQ0FBQyxXQUFOLENBQWtCLE9BQWxCLENBQWQsQ0FBVCxDQUFBLENBREY7QUFBQSxPQURBO2FBSUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxlQUFYLENBQTJCLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FBM0IsRUFMc0I7SUFBQSxDQWhEeEIsQ0FBQTs7Z0NBQUE7O0tBSmlDLE1BQU0sQ0FBQyxPQUxkO0FBQUEsQ0FBOUIsQ0FBQSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lIFsnUGhhc2VyJywgJy4vUGFuZWwnXSwgKFBoYXNlcixQYW5lbCktPlxuXG4gICNDbGFzcyBjcmVhdGUgYSBCb2FyZCBvbiB0aGUgcmlnaHQgc2lkZSB0byBzaG93IHRoZSBuZXcgUGFuZWxzXG4gICNAc2VlIFBhbmVsXG4gICNAZXh0ZW5kcyBQaGFzZXIuR3JvdXBcbiAgY2xhc3MgVXBjb21taW5nUGFuZWxzQm9hcmQgZXh0ZW5kcyBQaGFzZXIuR3JvdXBcblxuICAgICNAc3RhdGljXG4gICAgI0xvYWQgYWxsIHJlcXVpcmVkIHNwcml0ZXMgYW5kIHNvXG4gICAgQHByZWxvYWQ6IChnYW1lKS0+XG4gICAgICBjb25zb2xlLmxvZygnJylcblxuXG5cbiAgICAjQ3JhdGUgYSBuZXcgVXBjb21pbmcgUGFuZWxzIEJvYXJkXG4gICAgI0BwYXJhbSB7UGhhc2VyLkdhbWV9IGdhbWVcbiAgICAjQHBhcmFtIHtHYW1lZmllZH0gZ2FtZWZpZWxkIC0gVGhlIEdhbWVmaWVsZFxuICAgICNAcGFyYW0ge2ludH0geFxuICAgICNAcGFyYW0ge2ludH0gW3k9MTAwXSBPcHRpb25hbCB5IGNvb3JkXG4gICAgY29uc3RydWN0b3I6IChnYW1lLGdhbWVmaWVsZCwgeCAsIHkgPSAxMDAgKS0+XG4gICAgICBpZiBnYW1lZmllbGQgPT0gdW5kZWZpbmVkXG4gICAgICAgIHRocm93ICBuZXcgRXJyb3IoXCJQbGVhc2UgcGFyc2UgYSBHYW1lZmllbGRcIilcbiAgICAgIHN1cGVyKGdhbWUsbnVsbCwgJ1VwY29taW5nUGFuZWxzQm9hcmQnLGZhbHNlLGZhbHNlKVxuICAgICAgQGdhbWVmaWVsZCA9IGdhbWVmaWVsZFxuICAgICAgQHggPSB4ID8gZ2FtZS53b3JsZC53aWR0aCAtIDYwXG4gICAgICBAeSA9IHlcblxuICAgICNTaG93cyB0aGUgQm9hcmRcbiAgICAjcmV0dXJuIHtQaGFzZXIuVHdlZW59XG4gICAgc2hvdzogKCk9PlxuICAgICAgQGdhbWUud29ybGQuYWRkQ2hpbGQoQClcbiAgICAgIEB4ID0gQGdhbWUud29ybGQud2lkdGhcbiAgICAgIEBnYW1lLmFkZC50d2VlbihAKS50byh7eDogQGdhbWUud29ybGQud2lkdGgtMTQwIH0sMTAwMCxQaGFzZXIuRWFzaW5nLkxpbmVhci5Ob25lLHRydWUpO1xuXG5cblxuICAgICNBZGQgYSBuZXcgcGFuZWwgYW5kIHNldCB0aGlzIGludG8gbGluZVxuICAgICNAcGFyYW0ge1BhbmVsfSBwYW5lbCB0aGUgcGFuZWwgdG8gYWRkXG4gICAgYWRkOiAocGFuZWwpPT5cbiAgICAgIGlmIG5vdCBwYW5lbCBpbnN0YW5jZW9mIFBhbmVsXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBsZWFzZSBwYXJzZSBhIFBhbmVsIEluc3RhbmNlXCIpXG4gICAgICBwYW5lbC5zZXRQb3NpdGlvbihAY2hpbGRyZW4ubGVuZ3RoKzEsMSlcbiAgICAgIHN1cGVyKHBhbmVsKVxuICAgICAgaW5kZXggPSBAY2hpbGRyZW4uaW5kZXhPZihwYW5lbClcblxuICAgICAgI1NldCBwYW5lbHMgbGlrZSBhIGNhcnBldFxuICAgICAgcGFuZWwueCA9ICBwYW5lbC54ICsgKHBhbmVsLmdldEJvdW5kcygpLndpZHRoLzMgKiBpbmRleClcblxuICAgICNSZW1vdmUgdGhlIG9sZGVzdCBQYW5lbCBpbiBjaGlsZHJlbiBBcnJheVxuICAgICNAcmV0dXJuIHtQYW5lbH1cbiAgICBwb3BOZXh0UGFuZWw6ID0+XG4gICAgICBuZXh0UGFuZWwgPSBAY2hpbGRyZW5bMF1cbiAgICAgIEByZW1vdmUobmV4dFBhbmVsKVxuICAgICAgcmV0dXJuIG5leHRQYW5lbFxuXG4gICAgI0hhbmRsZSBhIG5ldyBHYW1lc3RhdGUgYW5kIHVwZGF0ZSB0aGUgbmV3IFBhbmVsIEJvYXJkI1xuICAgICNAcmV0dXJuIHZvaWRcbiAgICBoYW5kbGVOZXR3b3JrR2FtZVN0YXRlOiAoZGF0YSk9PlxuICAgICAgQHJlbW92ZUFsbCh0cnVlKSAjUmVtb3ZlIGFsbCBvbGQgY2hpbGRzXG4gICAgICBmb3IgcGFuZWxJZCBpbiBkYXRhLm5leHRQYW5lbHNcbiAgICAgICAgQGFkZChuZXcgUGFuZWwoQGdhbWUsQCxQYW5lbC5nZXRUeXBlQnlJZChwYW5lbElkKSkpXG5cbiAgICAgIEBnYW1lZmllbGQuc2V0UGFuZWxUb1BsYWNlKEBwb3BOZXh0UGFuZWwoKSlcblxuIl19
