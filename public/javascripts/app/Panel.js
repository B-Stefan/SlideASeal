var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

define(['Phaser', "jquery"], function(Phaser, $) {
  var Panel, PanelType;
  PanelType = (function() {
    PanelType.baseUrl = 'http://' + window.location.host + '/Images/panels/';

    PanelType.defaultExtention = '.png';

    function PanelType(name, id) {
      this.getImageUrl = __bind(this.getImageUrl, this);
      this.getId = __bind(this.getId, this);
      this.getName = __bind(this.getName, this);
      this.name = name;
      this.id = id;
    }

    PanelType.prototype.getName = function() {
      return this.name;
    };

    PanelType.prototype.getId = function() {
      return this.id;
    };

    PanelType.prototype.getImageUrl = function() {
      return PanelType.baseUrl + this.name + PanelType.defaultExtention;
    };

    return PanelType;

  })();
  return Panel = (function(_super) {
    __extends(Panel, _super);

    Panel.getDefaultPanelBorder = function() {
      return 11;
    };

    Panel.moveDirections = {
      LEFT: 10,
      RIGHT: 20,
      DOWN: 30,
      TOP: 40
    };

    Panel.getTypeRandom = function() {
      var key, randomType, value, values, _ref;
      values = [];
      _ref = Panel.types;
      for (key in _ref) {
        value = _ref[key];
        values.push(value);
      }
      randomType = values[Math.floor(Math.random() * values.length)];
      return randomType;
    };

    Panel.getTypeById = function(id) {
      var key, value, _ref;
      _ref = Panel.types;
      for (key in _ref) {
        value = _ref[key];
        if (id === value.getId()) {
          return value;
        }
      }
      return null;
    };

    Panel.types = {
      ANCHOR: new PanelType('ANCHOR', 1),
      WHEEL: new PanelType('WHEEL', 2),
      LIFEBELT: new PanelType('LIFEBELT', 3),
      FISH_REST: new PanelType('FISH_REST', 4),
      BALL: new PanelType('BALL', 5),
      FISH: new PanelType('FISH', 6),
      BARREL: new PanelType('BARREL', 7)
    };

    Panel.loadAllTypes = function(game) {
      var key, type, _ref;
      _ref = Panel.types;
      for (key in _ref) {
        type = _ref[key];
        game.load.image(type.getName(), type.getImageUrl());
      }
      return game.load.image("Panel_Background", PanelType.baseUrl + "ALLUBOX.png");
    };

    function Panel(game, parent, type) {
      this.getType = __bind(this.getType, this);
      this.setType = __bind(this.setType, this);
      this.getCol = __bind(this.getCol, this);
      this.getRow = __bind(this.getRow, this);
      this.setCol = __bind(this.setCol, this);
      this.setRow = __bind(this.setRow, this);
      this.getNeighbour = __bind(this.getNeighbour, this);
      this.kill = __bind(this.kill, this);
      this.slide = __bind(this.slide, this);
      this.show = __bind(this.show, this);
      this.setPositionNeighbour = __bind(this.setPositionNeighbour, this);
      this.setPosition = __bind(this.setPosition, this);
      if (!type in Panel.types) {
        console.log("please parse one of the following type", Panel.types);
      }
      Panel.__super__.constructor.call(this, game, parent, 'PANEL_GROUP', true);
      this.backgroundSprite = this.create(0, 0, 'Panel_Background');
      this.typeSprite = this.create(0, 0, type.getName());
      this.backgroundSprite.anchor.setTo(0.5, 0.5);
      this.typeSprite.anchor.setTo(0.5, 0.5);
      this.typeSprite.scale.setTo(0.8, 0.8);
      this.setType(type);
      this._SAS_col = -1;
      this._SAS_row = -1;
    }

    Panel.prototype.setPosition = function(row, col, border, animation) {
      var bounds, newX, newY;
      if (border == null) {
        border = Panel.getDefaultPanelBorder();
      }
      if (animation == null) {
        animation = false;
      }
      this.setRow(row);
      this.setCol(col);
      bounds = this.getBounds();
      newY = row * (bounds.height + border);
      newX = col * (bounds.width + border);
      if (animation === false) {
        this.y = newY;
        return this.x = newX;
      } else {
        return this.game.add.tween(this).to({
          x: newX,
          y: newY
        }, 1000, Phaser.Easing.Quadratic.In, false, 0, false);
      }
    };

    Panel.prototype.setPositionNeighbour = function(row, col, position, anchorBounds, border) {
      var selfBounds;
      if (border == null) {
        border = Panel.getDefaultPanelBorder();
      }
      this.setPosition(row, col, border);
      if (!position in Panel.moveDirections) {
        throw new Error("Please parse a moveDirection as Positoin ");
      }
      if (anchorBounds === void 0) {
        anchorBounds = this.parent.getBounds();
      }
      if (anchorBounds !== null) {
        this.x = this.x + anchorBounds.left;
        this.y = this.y + anchorBounds.top;
      }
      selfBounds = this.getBounds();
      this.x = this.x + selfBounds.width / 2;
      this.y = this.y + selfBounds.height / 2;
      switch (position) {
        case Panel.moveDirections.LEFT:
          return this.x = this.x - selfBounds.width - border;
        case Panel.moveDirections.RIGHT:
          return this.x = this.x + selfBounds.width + border;
        case Panel.moveDirections.TOP:
          return this.y = this.y - selfBounds.height - border;
      }
    };

    Panel.prototype.show = function() {
      this.typeSprite.alpha = 1;
      return this.backgroundSprite.alpha = 1;
    };

    Panel.prototype.slide = function(direction) {
      var downTween, neighbour, neighbourDown, neighbourTween, position, tween;
      console.log("Slide=>", this.getRow(), this.getCol());
      if (!direction in Panel.moveDirections) {
        throw new Error("Please parse a Panel.moveDirection");
      }
      switch (direction) {
        case Panel.moveDirections.DOWN:
          position = Panel.moveDirections.TOP;
          break;
        case Panel.moveDirections.LEFT:
          position = Panel.moveDirections.LEFT;
          break;
        case Panel.moveDirections.RIGHT:
          position = Panel.moveDirections.RIGHT;
          break;
        case Panel.moveDirections.TOP:
          position = Panel.moveDirections.DOWN;
      }
      neighbour = this.getNeighbour(position);
      if (neighbour !== null) {
        neighbourTween = neighbour.slide(direction);
      } else {
        console.log("END");
      }
      switch (direction) {
        case Panel.moveDirections.DOWN:
          tween = this.setPosition(this.getRow() + 1, this.getCol(), Panel.getDefaultPanelBorder(), true);
          break;
        case Panel.moveDirections.RIGHT:
          tween = this.setPosition(this.getRow(), this.getCol() + 1, Panel.getDefaultPanelBorder(), true);
          break;
        case Panel.moveDirections.LEFT:
          tween = this.setPosition(this.getRow(), this.getCol() - 1, Panel.getDefaultPanelBorder(), true);
          break;
        case Panel.moveDirections.TOP:
          tween = this.setPosition(this.getRow() - 1, this.getCol(), Panel.getDefaultPanelBorder(), true);
      }
      neighbourDown = this.getNeighbour(Panel.moveDirections.DOWN);
      if (neighbourDown === null && this.getRow() !== this.parent.getSize() - 1) {
        downTween = this.slide(Panel.moveDirections.DOWN);
        if (direction !== Panel.moveDirections.DOWN) {
          tween.onComplete.add(function() {
            return downTween.start();
          }, this);
        } else {
          tween.onStart.add(function() {
            return downTween.start();
          }, this);
        }
      }
      tween.onComplete.add(function() {
        var killTween;
        if (this.parent !== void 0) {
          if (this.getCol() === this.parent.getSize() || this.getCol() === -1 || this.getRow() === this.parent.getSize()) {
            killTween = this.kill();
            return killTween.start();
          }
        }
      }, this);
      if (neighbourTween !== void 0) {
        if (direction !== Panel.moveDirections.DOWN) {
          neighbourTween.onStart.add(function() {
            return tween.start();
          }, this);
          return neighbourTween;
        } else {
          tween.onStart.add(function() {
            return neighbourTween.start();
          }, this);
          return tween;
        }
      } else {
        return tween;
      }
    };

    Panel.prototype.kill = function() {
      var neighbour, neighbourTween, tween;
      tween = this.game.add.tween(this.scale).to({
        x: 0.001,
        y: 0.001
      }, 300, Phaser.Easing.Quadratic.Out, false, 0, false);
      neighbour = this.getNeighbour(Panel.moveDirections.TOP);
      tween.onComplete.add(function() {
        return this.parent.remove(this, true);
      }, this);
      if (neighbour !== null) {
        neighbourTween = neighbour.slide(Panel.moveDirections.DOWN);
        tween.onStart.add(function() {
          return neighbourTween.start();
        }, this);
      }
      return tween;
    };

    Panel.prototype.getNeighbour = function(position) {
      var result;
      if (!position in Panel.moveDirections) {
        throw new Error("Please parse a Panel.moveDirection");
      } else if (this.parent === null || this.parent === void 0) {
        console.log("Get getNeighbour from panel without parent ", this.getRow(), this.getCol());
        return null;
      }
      result = null;
      switch (position) {
        case Panel.moveDirections.DOWN:
          result = this.parent.getPanel(this.getRow() + 1, this.getCol());
          break;
        case Panel.moveDirections.RIGHT:
          result = this.parent.getPanel(this.getRow(), this.getCol() + 1);
          break;
        case Panel.moveDirections.LEFT:
          result = this.parent.getPanel(this.getRow(), this.getCol() - 1);
          break;
        case Panel.moveDirections.TOP:
          result = this.parent.getPanel(this.getRow() - 1, this.getCol());
      }
      return result;
    };

    Panel.prototype.setRow = function(row) {
      return this._SAS_row = row;
    };

    Panel.prototype.setCol = function(col) {
      return this._SAS_col = col;
    };

    Panel.prototype.getRow = function() {
      return this._SAS_row;
    };

    Panel.prototype.getCol = function() {
      return this._SAS_col;
    };

    Panel.prototype.setType = function(type) {
      return this._SAS_type = type;
    };

    Panel.prototype.getType = function() {
      return this._SAS_type;
    };

    return Panel;

  })(Phaser.Group);
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL1N0ZWZhbi9Eb3dubG9hZHMvU2xpZGVBU2VhbC9wdWJsaWMvamF2YXNjcmlwdHMvYXBwL1BhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL1N0ZWZhbi9Eb3dubG9hZHMvU2xpZGVBU2VhbC9hc3NldHMvamF2YXNjcmlwdHMvYXBwL1BhbmVsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOzsrQkFBQTs7QUFBQSxNQUFBLENBQU8sQ0FBRSxRQUFGLEVBQVksUUFBWixDQUFQLEVBQTZCLFNBQUMsTUFBRCxFQUFTLENBQVQsR0FBQTtBQUkzQixNQUFBLGdCQUFBO0FBQUEsRUFBTTtBQUNKLElBQUEsU0FBQyxDQUFBLE9BQUQsR0FBWSxTQUFBLEdBQVcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUEzQixHQUFtQyxpQkFBL0MsQ0FBQTs7QUFBQSxJQUNBLFNBQUMsQ0FBQSxnQkFBRCxHQUFxQixNQURyQixDQUFBOztBQUVhLElBQUEsbUJBQUMsSUFBRCxFQUFNLEVBQU4sR0FBQTtBQUNYLHVEQUFBLENBQUE7QUFBQSwyQ0FBQSxDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFSLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxFQUFELEdBQU0sRUFETixDQURXO0lBQUEsQ0FGYjs7QUFBQSx3QkFLQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQUssSUFBQyxDQUFBLEtBQU47SUFBQSxDQUxULENBQUE7O0FBQUEsd0JBTUEsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUFLLElBQUMsQ0FBQSxHQUFOO0lBQUEsQ0FOUCxDQUFBOztBQUFBLHdCQU9BLFdBQUEsR0FBYSxTQUFBLEdBQUE7YUFBTSxTQUFTLENBQUMsT0FBVixHQUFvQixJQUFDLENBQUEsSUFBckIsR0FBNEIsU0FBUyxDQUFDLGlCQUE1QztJQUFBLENBUGIsQ0FBQTs7cUJBQUE7O01BREYsQ0FBQTtTQWNN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Q0FBQTs7QUFBQSxvQkF3T0EsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUFLLElBQUMsQ0FBQSxTQUFOO0lBQUEsQ0F4T1IsQ0FBQTs7QUFBQSxvQkEwT0EsT0FBQSxHQUFRLFNBQUMsSUFBRCxHQUFBO2FBQ04sSUFBQyxDQUFBLFNBQUQsR0FBYSxLQURQO0lBQUEsQ0ExT1IsQ0FBQTs7QUFBQSxvQkE4T0EsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUFLLElBQUMsQ0FBQSxVQUFOO0lBQUEsQ0E5T1QsQ0FBQTs7aUJBQUE7O0tBTGtCLE1BQU0sQ0FBQyxPQWxCQTtBQUFBLENBQTdCLENBQUEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSBbJ1BoYXNlcicsIFwianF1ZXJ5XCJdLCAoUGhhc2VyLCAkKS0+XG5cbiAgI0RlZmluZSBhIHBhbmVsIHR5cGUgKEFOQ0hPUiwgV0hFRUwpXG4gICNAY2xhc3NcbiAgY2xhc3MgUGFuZWxUeXBlXG4gICAgQGJhc2VVcmwgPSAnaHR0cDovLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArICcvSW1hZ2VzL3BhbmVscy8nXG4gICAgQGRlZmF1bHRFeHRlbnRpb24gPSAnLnBuZydcbiAgICBjb25zdHJ1Y3RvcjogKG5hbWUsaWQpLT5cbiAgICAgIEBuYW1lID0gbmFtZVxuICAgICAgQGlkID0gaWRcbiAgICBnZXROYW1lOiAoKT0+IEBuYW1lXG4gICAgZ2V0SWQ6ICgpPT4gQGlkXG4gICAgZ2V0SW1hZ2VVcmw6ICgpPT4gIFBhbmVsVHlwZS5iYXNlVXJsICsgQG5hbWUgKyBQYW5lbFR5cGUuZGVmYXVsdEV4dGVudGlvblxuXG5cbiAgI0RlZmluZSBhIFBhbmVsIHdpdGggYmFja2dyb3VuZCBhbmQgcm93L2NvbCBwb3NpdGlvblxuICAjQGNsYXNzIFBhbmVsXG4gICNAZXh0ZW5kcyBQaGFzZXIuR3JvdXBcbiAgY2xhc3MgUGFuZWwgZXh0ZW5kcyBQaGFzZXIuR3JvdXBcblxuXG4gICAgIyBAc3RhdGljXG4gICAgIyBEZWZhdWx0IGJvcmRlciBiZXR3ZWVuIDIgUGFuZWxzIG9uIHRoZSBHYW1lZmllbGQgYW5kIFVwY29taW5nUGFuZWxCb2FkXG4gICAgQGdldERlZmF1bHRQYW5lbEJvcmRlcjogKCktPiAxMVxuXG5cbiAgICAjIEBzdGF0aWNcbiAgICAjIEBlbnVtXG4gICAgQG1vdmVEaXJlY3Rpb25zID0ge1xuICAgICAgTEVGVDogMTBcbiAgICAgIFJJR0hUOiAyMFxuICAgICAgRE9XTjogMzBcbiAgICAgIFRPUDogNDBcbiAgICB9XG5cbiAgICAjQHN0YXRpY1xuICAgICNAZGVzYzogUmV1dHJucyBhIHJhbmRvbSB0eXBlXG4gICAgQGdldFR5cGVSYW5kb206KCkgLT5cbiAgICAgIHZhbHVlcyA9IFtdXG4gICAgICBmb3Iga2V5LCB2YWx1ZSBvZiBQYW5lbC50eXBlc1xuICAgICAgICB2YWx1ZXMucHVzaCh2YWx1ZSlcblxuICAgICAgcmFuZG9tVHlwZSA9IHZhbHVlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2YWx1ZXMubGVuZ3RoKV1cbiAgICAgIHJldHVybiByYW5kb21UeXBlXG5cbiAgICAjQHN0YXRpY1xuICAgICNAZGVzYzogUmV0dXJucyB0aGUgdHlwZSB3aXRoIHRoZSBpZCBzXG4gICAgI0ByZXR1cm4ge1BhbmVsfG51bGx9IHRoZSBwYW5lbCB3aXRoIHRoZSBpZFxuICAgIEBnZXRUeXBlQnlJZDooaWQpIC0+XG4gICAgICBmb3Iga2V5LCB2YWx1ZSBvZiBQYW5lbC50eXBlc1xuICAgICAgICBpZiBpZCA9PSB2YWx1ZS5nZXRJZCgpXG4gICAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICByZXR1cm4gbnVsbFxuXG4gICAgIyBAc3RhdGljXG4gICAgIyBAZW51bVxuICAgIEB0eXBlcyAgPSB7XG4gICAgICBBTkNIT1I6ICAgbmV3IFBhbmVsVHlwZSgnQU5DSE9SJywxKVxuICAgICAgV0hFRUw6ICAgIG5ldyBQYW5lbFR5cGUoJ1dIRUVMJywyKVxuICAgICAgTElGRUJFTFQ6IG5ldyBQYW5lbFR5cGUoJ0xJRkVCRUxUJywzKVxuICAgICAgRklTSF9SRVNUOm5ldyBQYW5lbFR5cGUoJ0ZJU0hfUkVTVCcsNClcbiAgICAgIEJBTEw6ICAgICBuZXcgUGFuZWxUeXBlKCdCQUxMJyw1KVxuICAgICAgRklTSDogICAgIG5ldyBQYW5lbFR5cGUoJ0ZJU0gnLDYpXG4gICAgICBCQVJSRUw6ICAgbmV3IFBhbmVsVHlwZSgnQkFSUkVMJyw3KVxuICAgIH1cblxuICAgIEBsb2FkQWxsVHlwZXM6IChnYW1lKS0+XG5cbiAgICAgIGZvciBrZXksdHlwZSBvZiBQYW5lbC50eXBlc1xuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UodHlwZS5nZXROYW1lKCksIHR5cGUuZ2V0SW1hZ2VVcmwoKSlcblxuICAgICAgZ2FtZS5sb2FkLmltYWdlKFwiUGFuZWxfQmFja2dyb3VuZFwiLCBQYW5lbFR5cGUuYmFzZVVybCArIFwiQUxMVUJPWC5wbmdcIilcblxuXG4gICAgY29uc3RydWN0b3IgOiAoZ2FtZSxwYXJlbnQsIHR5cGUpIC0+XG4gICAgICBpZiBub3QgdHlwZSBvZiBQYW5lbC50eXBlc1xuICAgICAgICBjb25zb2xlLmxvZyhcInBsZWFzZSBwYXJzZSBvbmUgb2YgdGhlIGZvbGxvd2luZyB0eXBlXCIsIFBhbmVsLnR5cGVzKVxuXG5cbiAgICAgIHN1cGVyKGdhbWUscGFyZW50LCdQQU5FTF9HUk9VUCcsdHJ1ZSkjdHlwZS5nZXROYW1lKCkpXG5cblxuICAgICAgQGJhY2tncm91bmRTcHJpdGUgPSBAY3JlYXRlKDAsMCwgJ1BhbmVsX0JhY2tncm91bmQnKVxuICAgICAgQHR5cGVTcHJpdGUgPSBAY3JlYXRlKDAsMCwgdHlwZS5nZXROYW1lKCkpXG5cblxuICAgICAgI1NldCBBbmNob3IgdG8gbWlkZGVsXG5cbiAgICAgIEBiYWNrZ3JvdW5kU3ByaXRlLmFuY2hvci5zZXRUbygwLjUsMC41KVxuICAgICAgQHR5cGVTcHJpdGUuYW5jaG9yLnNldFRvKDAuNSwwLjUpXG5cbiAgICAgICNDb3JyZWN0IGFuY2hvclxuXG4gICAgICAjQ29ycmVjdCBhbmNob3IgYW5kIHNjYWxlXG5cbiAgICAgIEB0eXBlU3ByaXRlLnNjYWxlLnNldFRvKDAuOCwwLjgpXG5cblxuICAgICAgQHNldFR5cGUodHlwZSlcblxuICAgICAgQF9TQVNfY29sID0gLTFcbiAgICAgIEBfU0FTX3JvdyA9IC0xXG5cbiAgICBzZXRQb3NpdGlvbjogKHJvdyxjb2wsIGJvcmRlcj1QYW5lbC5nZXREZWZhdWx0UGFuZWxCb3JkZXIoKSwgYW5pbWF0aW9uID0gZmFsc2UpPT5cbiAgICAgIEBzZXRSb3cocm93KVxuICAgICAgQHNldENvbChjb2wpXG4gICAgICBib3VuZHMgPSBAZ2V0Qm91bmRzKClcbiAgICAgIG5ld1kgPSAgcm93ICogKGJvdW5kcy5oZWlnaHQgKyBib3JkZXIpXG4gICAgICBuZXdYID0gIGNvbCAqIChib3VuZHMud2lkdGggKyBib3JkZXIpXG4gICAgICBpZiBhbmltYXRpb24gPT0gZmFsc2VcbiAgICAgICAgQHkgPSBuZXdZXG4gICAgICAgIEB4ID0gbmV3WFxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gQGdhbWUuYWRkLnR3ZWVuKEApLnRvKHt4Om5ld1gsIHk6IG5ld1l9LCAxMDAwLCBQaGFzZXIuRWFzaW5nLlF1YWRyYXRpYy5JbiwgZmFsc2UsIDAsIGZhbHNlKTtcblxuXG4gICAgc2V0UG9zaXRpb25OZWlnaGJvdXI6KHJvdyxjb2wscG9zaXRpb24sYW5jaG9yQm91bmRzLGJvcmRlciA9IFBhbmVsLmdldERlZmF1bHRQYW5lbEJvcmRlcigpKT0+XG4gICAgICBAc2V0UG9zaXRpb24ocm93LGNvbCxib3JkZXIpXG4gICAgICBpZiBub3QgcG9zaXRpb24gb2YgUGFuZWwubW92ZURpcmVjdGlvbnNcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiUGxlYXNlIHBhcnNlIGEgbW92ZURpcmVjdGlvbiBhcyBQb3NpdG9pbiBcIlxuXG4gICAgICBpZiBhbmNob3JCb3VuZHMgPT0gdW5kZWZpbmVkXG4gICAgICAgIGFuY2hvckJvdW5kcyA9IEBwYXJlbnQuZ2V0Qm91bmRzKClcbiAgICAgIGlmIGFuY2hvckJvdW5kcyAhPSBudWxsXG4gICAgICAgIEB4ID0gQHggKyBhbmNob3JCb3VuZHMubGVmdFxuICAgICAgICBAeSA9IEB5ICsgYW5jaG9yQm91bmRzLnRvcFxuXG5cblxuICAgICAgc2VsZkJvdW5kcyA9IEBnZXRCb3VuZHMoKVxuXG4gICAgICBAeCA9IEB4ICsgc2VsZkJvdW5kcy53aWR0aC8yXG4gICAgICBAeSA9IEB5ICsgc2VsZkJvdW5kcy5oZWlnaHQvMlxuICAgICAgI2NvbnNvbGUubG9nKFwiWFlcIixAeCxAeSwgcm93LGNvbCxwb3NpdGlvbixhbmNob3JCb3VuZHMsQHBhcmVudClcbiAgICAgIHN3aXRjaCBwb3NpdGlvblxuICAgICAgICB3aGVuIFBhbmVsLm1vdmVEaXJlY3Rpb25zLkxFRlRcbiAgICAgICAgICBAeCA9IEB4ICAtIHNlbGZCb3VuZHMud2lkdGggLSBib3JkZXJcbiAgICAgICAgd2hlbiBQYW5lbC5tb3ZlRGlyZWN0aW9ucy5SSUdIVFxuICAgICAgICAgIEB4ID0gQHggKyBzZWxmQm91bmRzLndpZHRoICsgYm9yZGVyXG4gICAgICAgIHdoZW4gUGFuZWwubW92ZURpcmVjdGlvbnMuVE9QXG4gICAgICAgICAgQHkgPSBAeSAtIHNlbGZCb3VuZHMuaGVpZ2h0IC0gYm9yZGVyXG5cblxuICAgIHNob3c6ICgpPT5cbiAgICAgIEB0eXBlU3ByaXRlLmFscGhhID0gMVxuICAgICAgQGJhY2tncm91bmRTcHJpdGUuYWxwaGEgPSAxXG4gICAgICAjQGdhbWUuYWRkLnR3ZWVuKEB0eXBlU3ByaXRlKS50byhhbHBoYTogMSwgMjAwLCBQaGFzZXIuRWFzaW5nLlF1YWRyYXRpYy5Jbix0cnVlKTtcbiAgICAgICNAZ2FtZS5hZGQudHdlZW4oQGJhY2tncm91bmRTcHJpdGUpLnRvKGFscGhhOiAxLCAyMDAsIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLkluLHRydWUpO1xuXG5cbiAgICBzbGlkZTogKGRpcmVjdGlvbik9PlxuICAgICAgY29uc29sZS5sb2coXCJTbGlkZT0+XCIsIEBnZXRSb3coKSxAZ2V0Q29sKCkpXG4gICAgICBpZiBub3QgZGlyZWN0aW9uIG9mIFBhbmVsLm1vdmVEaXJlY3Rpb25zXG4gICAgICAgIHRocm93IG5ldyBFcnJvciAoXCJQbGVhc2UgcGFyc2UgYSBQYW5lbC5tb3ZlRGlyZWN0aW9uXCIpXG5cbiAgICAgIHN3aXRjaCAgZGlyZWN0aW9uXG4gICAgICAgIHdoZW4gUGFuZWwubW92ZURpcmVjdGlvbnMuRE9XTiAgdGhlbiBwb3NpdGlvbiA9IFBhbmVsLm1vdmVEaXJlY3Rpb25zLlRPUFxuICAgICAgICB3aGVuIFBhbmVsLm1vdmVEaXJlY3Rpb25zLkxFRlQgIHRoZW4gcG9zaXRpb24gPSBQYW5lbC5tb3ZlRGlyZWN0aW9ucy5MRUZUXG4gICAgICAgIHdoZW4gUGFuZWwubW92ZURpcmVjdGlvbnMuUklHSFQgdGhlbiBwb3NpdGlvbiA9IFBhbmVsLm1vdmVEaXJlY3Rpb25zLlJJR0hUXG4gICAgICAgIHdoZW4gUGFuZWwubW92ZURpcmVjdGlvbnMuVE9QICAgdGhlbiBwb3NpdGlvbiA9IFBhbmVsLm1vdmVEaXJlY3Rpb25zLkRPV05cblxuICAgICAgbmVpZ2hib3VyID0gQGdldE5laWdoYm91cihwb3NpdGlvbilcbiAgICAgIGlmIG5laWdoYm91ciAhPSBudWxsXG4gICAgICAgIG5laWdoYm91clR3ZWVuID0gbmVpZ2hib3VyLnNsaWRlKGRpcmVjdGlvbilcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2coXCJFTkRcIilcblxuXG5cbiAgICAgICNTZXQgUG9zaXRpb25cbiAgICAgIHN3aXRjaCAgZGlyZWN0aW9uXG4gICAgICAgIHdoZW4gUGFuZWwubW92ZURpcmVjdGlvbnMuRE9XTiAgICB0aGVuIHR3ZWVuID0gQHNldFBvc2l0aW9uKEBnZXRSb3coKSsxICAsQGdldENvbCgpICAgLFBhbmVsLmdldERlZmF1bHRQYW5lbEJvcmRlcigpLHRydWUpXG4gICAgICAgIHdoZW4gUGFuZWwubW92ZURpcmVjdGlvbnMuUklHSFQgICB0aGVuIHR3ZWVuID0gQHNldFBvc2l0aW9uKEBnZXRSb3coKSAgICAsQGdldENvbCgpKzEgLFBhbmVsLmdldERlZmF1bHRQYW5lbEJvcmRlcigpLHRydWUpXG4gICAgICAgIHdoZW4gUGFuZWwubW92ZURpcmVjdGlvbnMuTEVGVCAgICB0aGVuIHR3ZWVuID0gQHNldFBvc2l0aW9uKEBnZXRSb3coKSAgICAsQGdldENvbCgpLTEgLFBhbmVsLmdldERlZmF1bHRQYW5lbEJvcmRlcigpLHRydWUpXG4gICAgICAgIHdoZW4gUGFuZWwubW92ZURpcmVjdGlvbnMuVE9QICAgICB0aGVuIHR3ZWVuID0gQHNldFBvc2l0aW9uKEBnZXRSb3coKS0xICAsQGdldENvbCgpICAgLFBhbmVsLmdldERlZmF1bHRQYW5lbEJvcmRlcigpLHRydWUpXG5cblxuICAgICAgbmVpZ2hib3VyRG93biA9IEBnZXROZWlnaGJvdXIoUGFuZWwubW92ZURpcmVjdGlvbnMuRE9XTilcblxuICAgICAgI0lmIGRvd24gaXMgZW1wdHkgZmFsbFxuICAgICAgaWYgbmVpZ2hib3VyRG93biA9PSBudWxsIGFuZCBAZ2V0Um93KCkgIT0gQHBhcmVudC5nZXRTaXplKCktMVxuICAgICAgICBkb3duVHdlZW4gPSBAc2xpZGUoUGFuZWwubW92ZURpcmVjdGlvbnMuRE9XTilcbiAgICAgICAgaWYgZGlyZWN0aW9uICE9IFBhbmVsLm1vdmVEaXJlY3Rpb25zLkRPV05cbiAgICAgICAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoKS0+XG4gICAgICAgICAgICBkb3duVHdlZW4uc3RhcnQoKVxuICAgICAgICAgICxAKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdHdlZW4ub25TdGFydC5hZGQoKCktPlxuICAgICAgICAgICAgZG93blR3ZWVuLnN0YXJ0KClcbiAgICAgICAgICAsQClcblxuICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoKCktPlxuICAgICAgICAjcmlnaHQgb3IgbGVmdFxuICAgICAgICBpZiBAcGFyZW50ICE9IHVuZGVmaW5lZFxuICAgICAgICAgIGlmIEBnZXRDb2woKSA9PSBAcGFyZW50LmdldFNpemUoKSBvciBAZ2V0Q29sKCkgPT0gLTEgb3IgQGdldFJvdygpID09IEBwYXJlbnQuZ2V0U2l6ZSgpXG4gICAgICAgICAgICBraWxsVHdlZW4gPSBAa2lsbCgpXG4gICAgICAgICAgICBraWxsVHdlZW4uc3RhcnQoKVxuXG4gICAgICAsQClcbiAgICAgIGlmIG5laWdoYm91clR3ZWVuICE9IHVuZGVmaW5lZFxuICAgICAgICBpZiBkaXJlY3Rpb24gIT0gUGFuZWwubW92ZURpcmVjdGlvbnMuRE9XTlxuICAgICAgICAgIG5laWdoYm91clR3ZWVuLm9uU3RhcnQuYWRkKCgpLT5cbiAgICAgICAgICAgIHR3ZWVuLnN0YXJ0KClcbiAgICAgICAgICAsQClcbiAgICAgICAgICByZXR1cm4gbmVpZ2hib3VyVHdlZW5cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHR3ZWVuLm9uU3RhcnQuYWRkKCgpLT5cbiAgICAgICAgICAgIG5laWdoYm91clR3ZWVuLnN0YXJ0KClcbiAgICAgICAgICAsQClcbiAgICAgICAgICByZXR1cm4gdHdlZW5cbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHR3ZWVuXG5cblxuXG4gICAga2lsbDogKCk9PlxuICAgICAgdHdlZW4gPSBAZ2FtZS5hZGQudHdlZW4oQC5zY2FsZSkudG8oe3g6IDAuMDAxLHk6MC4wMDF9LCAzMDAsIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLk91dCwgZmFsc2UsIDAsIGZhbHNlKTtcbiAgICAgIG5laWdoYm91ciA9IEBnZXROZWlnaGJvdXIoUGFuZWwubW92ZURpcmVjdGlvbnMuVE9QKVxuICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoKCktPlxuICAgICAgICBAcGFyZW50LnJlbW92ZShALHRydWUpXG4gICAgICAsQClcbiAgICAgIGlmIG5laWdoYm91ciAhPSBudWxsXG4gICAgICAgIG5laWdoYm91clR3ZWVuID0gbmVpZ2hib3VyLnNsaWRlKFBhbmVsLm1vdmVEaXJlY3Rpb25zLkRPV04pXG4gICAgICAgIHR3ZWVuLm9uU3RhcnQuYWRkKCgpLT5cbiAgICAgICAgICBuZWlnaGJvdXJUd2Vlbi5zdGFydCgpXG4gICAgICAgICxAKVxuXG4gICAgICByZXR1cm4gdHdlZW5cblxuXG4gICAgZ2V0TmVpZ2hib3VyOiAocG9zaXRpb24pPT5cbiAgICAgIGlmIG5vdCBwb3NpdGlvbiBvZiBQYW5lbC5tb3ZlRGlyZWN0aW9uc1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgKFwiUGxlYXNlIHBhcnNlIGEgUGFuZWwubW92ZURpcmVjdGlvblwiKVxuICAgICAgZWxzZSBpZiBAcGFyZW50ID09IG51bGwgb3IgQHBhcmVudCA9PSB1bmRlZmluZWRcbiAgICAgICAgY29uc29sZS5sb2coXCJHZXQgZ2V0TmVpZ2hib3VyIGZyb20gcGFuZWwgd2l0aG91dCBwYXJlbnQgXCIsIEBnZXRSb3coKSwgQGdldENvbCgpKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIHJlc3VsdCA9IG51bGxcblxuICAgICAgc3dpdGNoICBwb3NpdGlvblxuICAgICAgICB3aGVuIFBhbmVsLm1vdmVEaXJlY3Rpb25zLkRPV04gICAgdGhlbiByZXN1bHQgPSBAcGFyZW50LmdldFBhbmVsKEBnZXRSb3coKSsxICAsQGdldENvbCgpKVxuICAgICAgICB3aGVuIFBhbmVsLm1vdmVEaXJlY3Rpb25zLlJJR0hUICAgdGhlbiByZXN1bHQgPSBAcGFyZW50LmdldFBhbmVsKEBnZXRSb3coKSAgICAsQGdldENvbCgpKzEpXG4gICAgICAgIHdoZW4gUGFuZWwubW92ZURpcmVjdGlvbnMuTEVGVCAgICB0aGVuIHJlc3VsdCA9IEBwYXJlbnQuZ2V0UGFuZWwoQGdldFJvdygpICAgICxAZ2V0Q29sKCktMSlcbiAgICAgICAgd2hlbiBQYW5lbC5tb3ZlRGlyZWN0aW9ucy5UT1AgICAgIHRoZW4gcmVzdWx0ID0gQHBhcmVudC5nZXRQYW5lbChAZ2V0Um93KCktMSAgLEBnZXRDb2woKSlcblxuICAgICAgcmV0dXJuIHJlc3VsdFxuXG5cblxuICAgIHNldFJvdzogKHJvdyk9PlxuICAgICAgQF9TQVNfcm93ID0gcm93XG5cbiAgICBzZXRDb2w6IChjb2wpPT5cbiAgICAgIEBfU0FTX2NvbCA9IGNvbFxuXG4gICAgZ2V0Um93OigpPT4gQF9TQVNfcm93XG4gICAgZ2V0Q29sOiAoKT0+IEBfU0FTX2NvbFxuXG4gICAgc2V0VHlwZToodHlwZSk9PlxuICAgICAgQF9TQVNfdHlwZSA9IHR5cGVcblxuXG4gICAgZ2V0VHlwZTogKCk9PiBAX1NBU190eXBlXG5cblxuXG4iXX0=
