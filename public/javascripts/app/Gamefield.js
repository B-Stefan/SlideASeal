var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

define(['Phaser', '_', './Panel', 'network', './Player', './Banner'], function(Phaser, _, Panel, network, Player, Banner) {
  var Gamefield;
  return Gamefield = (function(_super) {
    __extends(Gamefield, _super);

    Gamefield.preload = function(game) {
      return game.load.image('Gamefield_bg', game.normalizeUrl('/Images/Gamefield_bg.png'));
    };

    function Gamefield(game, player, x, y) {
      if (x == null) {
        x = 225;
      }
      if (y == null) {
        y = 150;
      }
      this.getDefaultPanelBounds = __bind(this.getDefaultPanelBounds, this);
      this.translateFromNetworkRowCol = __bind(this.translateFromNetworkRowCol, this);
      this.translateToNetworkRowCol = __bind(this.translateToNetworkRowCol, this);
      this.repaintGamefield = __bind(this.repaintGamefield, this);
      this.handleNetworkSlideNewPanelPosition = __bind(this.handleNetworkSlideNewPanelPosition, this);
      this.handleNetworkActions = __bind(this.handleNetworkActions, this);
      this.handleNetworkNotification = __bind(this.handleNetworkNotification, this);
      this.handleNetworkGameState = __bind(this.handleNetworkGameState, this);
      this.handleNetworkAction = __bind(this.handleNetworkAction, this);
      this.updatePanelToPlaceFollowMouse = __bind(this.updatePanelToPlaceFollowMouse, this);
      this.update = __bind(this.update, this);
      this.yourTurn = __bind(this.yourTurn, this);
      this.killPanel = __bind(this.killPanel, this);
      this.slidePanel = __bind(this.slidePanel, this);
      this.slideNewPanelIn = __bind(this.slideNewPanelIn, this);
      this.getNeighborBounds = __bind(this.getNeighborBounds, this);
      this.getPanelToPlace = __bind(this.getPanelToPlace, this);
      this.setPanelToPlace = __bind(this.setPanelToPlace, this);
      this.getPanel = __bind(this.getPanel, this);
      this.getPanelBorder = __bind(this.getPanelBorder, this);
      this.getCol = __bind(this.getCol, this);
      this.getRow = __bind(this.getRow, this);
      this.add = __bind(this.add, this);
      this.updateBackgroundSize = __bind(this.updateBackgroundSize, this);
      this.createGamefield = __bind(this.createGamefield, this);
      this.getSize = __bind(this.getSize, this);
      this.getPlayer = __bind(this.getPlayer, this);
      this.getBackgroundPanel = __bind(this.getBackgroundPanel, this);
      this.show = __bind(this.show, this);
      if (!player instanceof Player) {
        throw new Error("param player must a instance of Player class");
      }
      Gamefield.__super__.constructor.call(this, game, null, 'GAMEFIELD', false, false);
      this.x = x;
      this.y = y;
      this._SAS_background = new Phaser.Sprite(game, this.x - (this.getPanelBorder() + 68), this.y - (this.getPanelBorder() + 68), 'Gamefield_bg');
      this._SAS_background.width = this.getBounds().width;
      this._SAS_background.height = this.getBounds().height;
      this._SAS_player = player;
      this._SAS_panelToPlace = null;
      this._SAS_size = 0;
      this._SAS_siVisible = false;
    }

    Gamefield.prototype.show = function() {
      var panelToPlace;
      this._SAS_siVisible = true;
      this.game.add.existing(this);
      this.getBackgroundPanel().alpha = 0.1;
      panelToPlace = this.getPanelToPlace();
      if (panelToPlace !== null && panelToPlace !== void 0) {
        panelToPlace.visible = 1;
      }
      return this.game.add.existing(this.getBackgroundPanel());
    };

    Gamefield.prototype.getBackgroundPanel = function() {
      return this._SAS_background;
    };

    Gamefield.prototype.getPlayer = function() {
      return this._SAS_player;
    };

    Gamefield.prototype.getSize = function() {
      return this._SAS_size;
    };

    Gamefield.prototype.createGamefield = function(field) {
      var colIndex, newPanel, panelType, panelTypeId, row, rowIndex, _i, _j, _len, _len1;
      rowIndex = 0;
      for (_i = 0, _len = field.length; _i < _len; _i++) {
        row = field[_i];
        colIndex = 0;
        for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
          panelTypeId = row[_j];
          panelType = Panel.getTypeById(panelTypeId);
          if (panelTypeId !== 0) {
            newPanel = new Panel(this.game, this, panelType);
            if (this._SAS_siVisible === false) {
              newPanel.alpha = 1;
            }
            this.add(newPanel, rowIndex, colIndex);
          }
          colIndex = colIndex + 1;
        }
        rowIndex = rowIndex + 1;
      }
      this._SAS_size = rowIndex;
      return this.updateBackgroundSize(rowIndex, colIndex);
    };

    Gamefield.prototype.updateBackgroundSize = function(rowCount, colCount) {
      var bg;
      bg = this.getBackgroundPanel();
      bg.x = this.x - this.getDefaultPanelBounds().width / 2;
      bg.y = this.y - this.getDefaultPanelBounds().height / 2;
      bg.width = (this.getDefaultPanelBounds().width + this.getPanelBorder()) * colCount;
      return bg.height = (this.getDefaultPanelBounds().height + this.getPanelBorder()) * rowCount;
    };

    Gamefield.prototype.add = function(panel, row, col) {
      if (!(panel instanceof Panel)) {
        throw new Error("Please set as argument an panel object");
      }
      panel.setPosition(row, col, this.getPanelBorder());
      return Gamefield.__super__.add.call(this, panel);
    };

    Gamefield.prototype.getRow = function(rowIndex) {
      var panel, row, _i, _len, _ref;
      row = [];
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        panel = _ref[_i];
        if (panel.getRow() === rowIndex) {
          row.push(panel);
        }
      }
      return row;
    };

    Gamefield.prototype.getCol = function(colIndex) {
      var col, panel, _i, _len, _ref;
      col = [];
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        panel = _ref[_i];
        if (panel.getCol() === colIndex) {
          col.push(panel);
        }
      }
      return col;
    };

    Gamefield.prototype.getPanelBorder = function() {
      return Panel.getDefaultPanelBorder();
    };

    Gamefield.prototype.getPanel = function(row, col) {
      var panel, _i, _len;
      row = this.getRow(row);
      for (_i = 0, _len = row.length; _i < _len; _i++) {
        panel = row[_i];
        if (panel.getCol() === col) {
          return panel;
        }
      }
      return null;
    };

    Gamefield.prototype.setPanelToPlace = function(newPanel) {
      if (!newPanel instanceof Panel) {
        throw new Error("setPanelToPlace=> newPanel is not a instance of Panel");
      }
      newPanel.x = 100;
      newPanel.y = 100;
      this.game.add.existing(newPanel);
      this._SAS_panelToPlace = newPanel;
      if (this._SAS_siVisible === false) {
        return newPanel.visible = false;
      }
    };

    Gamefield.prototype.getPanelToPlace = function() {
      return this._SAS_panelToPlace;
    };

    Gamefield.prototype.getNeighborBounds = function(panelToCheckRelation) {
      var bounds, col, colLength, colWidth, groupBounds, panelBounds, position, relativeX, relativeY, row, rowLength, rowWidth;
      groupBounds = this.getBackgroundPanel().getBounds();
      panelBounds = panelToCheckRelation.getBounds();
      relativeX = groupBounds.left - panelToCheckRelation.x - panelBounds.width / 2;
      relativeY = groupBounds.top - panelToCheckRelation.y - panelBounds.height / 2;
      position = null;
      if (panelToCheckRelation.x > groupBounds.right) {
        position = Panel.moveDirections.RIGHT;
      } else if (panelToCheckRelation.x < groupBounds.left) {
        position = Panel.moveDirections.LEFT;
      } else if (panelToCheckRelation.y < groupBounds.top) {
        position = Panel.moveDirections.TOP;
      }
      rowLength = parseInt(Math.abs(Math.round(groupBounds.height / (this.getDefaultPanelBounds().height + this.getPanelBorder()))));
      relativeX = Math.abs(relativeX);
      colWidth = groupBounds.width / rowLength;
      col = Math.abs(Math.round(relativeX / colWidth));
      colLength = Math.abs(Math.round(groupBounds.width / (this.getDefaultPanelBounds().width + this.getPanelBorder())));
      relativeY = Math.abs(relativeY);
      rowWidth = groupBounds.width / colLength;
      row = Math.abs(Math.round(relativeY / rowWidth));
      if (row > 0) {
        row = row - 1;
      } else {
        row = 0;
      }
      if (col > 0) {
        col = col - 1;
      } else {
        col = 0;
      }
      if (row >= colLength) {
        row = colLength - 1;
      }
      if (col >= rowLength) {
        col = rowLength - 1;
      }
      bounds = {
        localLeft: col * (panelBounds.width + this.getPanelBorder()),
        localTop: row * (panelBounds.height + this.getPanelBorder()),
        width: panelBounds.width,
        height: panelBounds.height,
        col: col,
        row: row,
        position: position
      };
      bounds.left = this.x + bounds.localLeft;
      bounds.top = this.y + bounds.localTop;
      return bounds;
    };

    Gamefield.prototype.slideNewPanelIn = function(newPanel, rowIndex, colIndex, position) {
      var col, direction, lastPanelInCol, tween;
      if (position === Panel.moveDirections.LEFT) {
        newPanel.setCol(colIndex - 1);
        newPanel.setRow(rowIndex);
      } else if (position === Panel.moveDirections.RIGHT) {
        newPanel.setCol(colIndex + 1);
        newPanel.setRow(rowIndex);
      } else if (position === Panel.moveDirections.TOP) {
        newPanel.setCol(colIndex);
        newPanel.setRow(rowIndex - 1);
      }
      this.add(newPanel, newPanel.getRow(), newPanel.getCol());
      switch (position) {
        case Panel.moveDirections.DOWN:
          direction = Panel.moveDirections.TOP;
          break;
        case Panel.moveDirections.RIGHT:
          direction = Panel.moveDirections.LEFT;
          break;
        case Panel.moveDirections.LEFT:
          direction = Panel.moveDirections.RIGHT;
          break;
        case Panel.moveDirections.TOP:
          direction = Panel.moveDirections.DOWN;
      }
      if (direction === Panel.moveDirections.DOWN && newPanel.getRow() === -1) {
        col = this.getCol(newPanel.getCol());
        if (col.length === this.getSize() + 1) {
          lastPanelInCol = this.getPanel(this.getSize() - 1, newPanel.getCol());
          tween = lastPanelInCol.kill();
          tween.start();
          return tween;
        }
      }
      return this.slidePanel(newPanel, direction);
    };

    Gamefield.prototype.slidePanel = function(panel, direction) {
      var tween;
      tween = panel.slide(direction);
      tween.start();
      return tween;
    };

    Gamefield.prototype.killPanel = function(panelToKIll) {
      var tween;
      tween = panelToKIll.kill();
      tween.start();
      return tween;
    };

    Gamefield.prototype.yourTurn = function() {
      if (this.game.getCurrentPlayer() !== null) {
        if (this.game.getCurrentPlayer().getSessionId() === this.getPlayer().getSessionId()) {
          return true;
        }
      }
      return false;
    };

    Gamefield.prototype.update = function() {
      if (this.yourTurn()) {
        this.updatePanelToPlaceFollowMouse();
      } else {
        if (this.game.input.mousePointer.isDown) {
          Banner.play('not-your-turn');
          this.game.input.mousePointer.isDown = false;
        }
      }
      return Gamefield.__super__.update.call(this);
    };

    Gamefield.prototype.updatePanelToPlaceFollowMouse = function() {
      var boundsGroup, mN, neighborBounds, panelToUpdatePosition, x, y;
      panelToUpdatePosition = this.getPanelToPlace();
      if (panelToUpdatePosition !== null) {
        boundsGroup = this.getBackgroundPanel().getBounds();
        x = this.game.input.mousePointer.x;
        y = this.game.input.mousePointer.y;
        if (boundsGroup.bottom > y) {
          if ((boundsGroup.top - 100 < y && boundsGroup.top > y) || ((boundsGroup.left - 100 < x && boundsGroup.left > x) || (boundsGroup.right + 100 > x && boundsGroup.right < x))) {
            panelToUpdatePosition.x = this.game.input.mousePointer.x;
            panelToUpdatePosition.y = this.game.input.mousePointer.y;
            neighborBounds = this.getNeighborBounds(panelToUpdatePosition);
            if (panelToUpdatePosition.getRow() !== neighborBounds.row || panelToUpdatePosition.getCol() !== neighborBounds.col) {
              mN = this.translateToNetworkRowCol(neighborBounds.row, neighborBounds.col, neighborBounds.position);
              network.sendSlidePostion(mN.m, mN.n);
            }
            panelToUpdatePosition.setPositionNeighbour(neighborBounds.row, neighborBounds.col, neighborBounds.position, this.getBackgroundPanel().getBounds());
          }
          if (this.game.input.mousePointer.isDown) {
            if (this.SAS_TEMP_CLICK_DOWN === false || this.SAS_TEMP_CLICK_DOWN === void 0) {
              this.SAS_TEMP_CLICK_DOWN = true;
            }
          }
          if (this.game.input.mousePointer.isUp) {
            if (this.SAS_TEMP_CLICK_DOWN) {
              this.SAS_TEMP_CLICK_DOWN = false;
              neighborBounds = this.getNeighborBounds(panelToUpdatePosition);
              mN = this.translateToNetworkRowCol(neighborBounds.row, neighborBounds.col, neighborBounds.position);
              return network.slide(mN.m, mN.n);
            }
          }
        }
      }
    };

    Gamefield.prototype.handleNetworkAction = function(action) {
      var i, numberOfPanels, panel, trans, tween;
      if (action.type === "Slide") {
        if (action.data.SlideIn) {
          trans = this.translateFromNetworkRowCol(action.data.SlideIn.m, action.data.SlideIn.n, action.data.SlideIn.orientation);
          tween = this.slideNewPanelIn(this.getPanelToPlace(), trans.row, trans.col, trans.position);
          console.log("SlideAction", trans);
          return tween;
        } else {
          throw new Error("SlideAction must contain the SlideIn property");
        }
      } else if (action.type === "Score") {
        if (action.data.Score.count === 3) {
          Banner.play('three-of-a-kind');
        }
        if (action.data.Score.count === 4) {
          Banner.play('four-of-a-kind');
        }
        if (action.data.Score.count === 5) {
          Banner.play('five-of-a-kind');
        }
        numberOfPanels = action.data.Score.count;
        trans = this.translateFromNetworkRowCol(action.data.Score.m, action.data.Score.n, action.data.Score.orientation);
        i = 0;
        while (i !== numberOfPanels) {
          if (trans.position === Panel.moveDirections.LEFT || trans.position === Panel.moveDirections.RIGHT) {
            panel = this.getPanel(trans.row, trans.col + i);
          } else if (trans.position === Panel.moveDirections.TOP) {
            panel = this.getPanel(trans.row + i, trans.col);
          }
          i = i + 1;
          tween = this.killPanel(panel);
        }
        return tween;
      } else {
        console.log("HandleNetworkAction=> Action", action);
        throw new Error("HandleNetworkAction=> Unhandled Action: " + action.type);
      }
    };

    Gamefield.prototype.handleNetworkGameState = function(gameState) {
      var lastTween;
      this.game.setCurrentPlayer(new Player(gameState.currentPlayer, gameState.currentPlayer));
      gameState = gameState;
      if (gameState.actions.length > 0) {
        lastTween = this.handleNetworkActions(gameState.actions);
        if (lastTween !== null && lastTween !== void 0) {
          return lastTween.onComplete.add(function() {
            var self;
            self = this;
            return window.setTimeout(function() {
              console.log("Repaint");
              return self.repaintGamefield(gameState.field);
            }, 1200);
          }, this);
        } else {
          throw new Error("handleNetworkGameState=> @handleNetworkActions must return a Phaser.Tween ");
        }
      }
    };

    Gamefield.prototype.handleNetworkNotification = function(message) {
      var panelToPlace;
      if (message.msg === "a player leave the game") {
        panelToPlace = this.getPanelToPlace();
        panelToPlace.destroy();
        return this.setPanelToPlace(null);
      }
    };

    Gamefield.prototype.handleNetworkActions = function(actions) {
      var actionToCall, nextAction, self, tween;
      self = this;
      if (actions.length === 0) {
        return;
      }
      tween = null;
      actionToCall = actions[0];
      nextAction = function() {
        actions.removeByValue(actionToCall);
        console.log("ACTION START");
        tween = self.handleNetworkAction(actionToCall);
        if (actions.length > 0) {
          actionToCall = actions[0];
          if (tween !== null) {
            return tween.onComplete.add(function() {
              console.log("ACTION FINSCHED ");
              return nextAction();
            }, this);
          } else {
            return console.log("handleNetworkActions=> Action return no tween ! ");
          }
        } else {
          return console.log("ACTION FINCHED(ALL)");
        }
      };
      nextAction();
      return tween;
    };

    Gamefield.prototype.handleNetworkSlideNewPanelPosition = function(slidePositionUpdate) {
      var panelToPlace, trans;
      if (this.yourTurn()) {
        return;
      }
      trans = this.translateFromNetworkRowCol(slidePositionUpdate.m, slidePositionUpdate.n);
      panelToPlace = this.getPanelToPlace();
      if (panelToPlace === null || panelToPlace === void 0) {
        throw new Error("Panel to place cant be null or undefined");
      }
      return panelToPlace.setPositionNeighbour(trans.row, trans.col, trans.position, this.getBackgroundPanel().getBounds());
    };

    Gamefield.prototype.repaintGamefield = function(field) {
      this.removeAll(true);
      return this.createGamefield(field);
    };

    Gamefield.prototype.translateToNetworkRowCol = function(row, col, position) {
      var m, n;
      if (position === Panel.moveDirections.LEFT) {
        m = row + 1;
        n = 0;
      } else if (position === Panel.moveDirections.RIGHT) {
        m = row + 1;
        n = this.getSize() + 1;
      } else if (position === Panel.moveDirections.TOP) {
        m = 0;
        n = col + 1;
      }
      console.log(m, n);
      return {
        m: m,
        n: n
      };
    };

    Gamefield.prototype.translateFromNetworkRowCol = function(m, n, orientation) {
      var col, position, row;
      if (orientation == null) {
        orientation = null;
      }
      if (n === 0) {
        position = Panel.moveDirections.LEFT;
        col = 0;
        row = m - 1;
      } else if (n === this.getSize() + 1) {
        position = Panel.moveDirections.RIGHT;
        col = n - 2;
        row = m - 1;
      } else if (m === 0) {
        position = Panel.moveDirections.TOP;
        row = 0;
        col = n - 1;
      } else {
        row = m - 1;
        col = n - 1;
      }
      if (orientation !== null && position === void 0) {
        if (orientation === 'vertical') {
          position = Panel.moveDirections.TOP;
        } else if (orientation === 'horizontal') {
          if (col === 0) {
            position = Panel.moveDirections.LEFT;
          } else if (col === this.getSize() - 1) {
            position = Panel.moveDirections.RIGHT;
          } else {
            position = Panel.moveDirections.RIGHT;
          }
        }
      }
      if (row === void 0 || col === void 0 || position === void 0) {
        throw new Error("Unknown input");
      }
      return {
        row: row,
        col: col,
        position: position
      };
    };

    Gamefield.prototype.getDefaultPanelBounds = function() {
      if (this.children.length > 0) {
        return this.children[0].getBounds();
      } else {
        return {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        };
      }
    };

    return Gamefield;

  })(Phaser.Group);
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL1N0ZWZhbi9Eb3dubG9hZHMvU2xpZGVBU2VhbC9wdWJsaWMvamF2YXNjcmlwdHMvYXBwL0dhbWVmaWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9TdGVmYW4vRG93bmxvYWRzL1NsaWRlQVNlYWwvYXNzZXRzL2phdmFzY3JpcHRzL2FwcC9HYW1lZmllbGQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7OytCQUFBOztBQUFBLE1BQUEsQ0FBTyxDQUFFLFFBQUYsRUFDRSxHQURGLEVBRUUsU0FGRixFQUdFLFNBSEYsRUFJRSxVQUpGLEVBS0UsVUFMRixDQUFQLEVBTUEsU0FBQyxNQUFELEVBQVMsQ0FBVCxFQUFZLEtBQVosRUFBbUIsT0FBbkIsRUFBMkIsTUFBM0IsRUFBbUMsTUFBbkMsR0FBQTtBQVFFLE1BQUEsU0FBQTtTQUFNO0FBTUosZ0NBQUEsQ0FBQTs7QUFBQSxJQUFBLFNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxJQUFELEdBQUE7YUFDUixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQVYsQ0FBaUIsY0FBakIsRUFBK0IsSUFBSSxDQUFDLFlBQUwsQ0FBbUIsMEJBQW5CLENBQS9CLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBT2EsSUFBQSxtQkFBQyxJQUFELEVBQU8sTUFBUCxFQUFlLENBQWYsRUFBeUIsQ0FBekIsR0FBQTs7UUFBZSxJQUFJO09BQzlCOztRQURvQyxJQUFJO09BQ3hDO0FBQUEsMkVBQUEsQ0FBQTtBQUFBLHFGQUFBLENBQUE7QUFBQSxpRkFBQSxDQUFBO0FBQUEsaUVBQUEsQ0FBQTtBQUFBLHFHQUFBLENBQUE7QUFBQSx5RUFBQSxDQUFBO0FBQUEsbUZBQUEsQ0FBQTtBQUFBLDZFQUFBLENBQUE7QUFBQSx1RUFBQSxDQUFBO0FBQUEsMkZBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSxpREFBQSxDQUFBO0FBQUEsbURBQUEsQ0FBQTtBQUFBLHFEQUFBLENBQUE7QUFB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QUE4QkEsYUFBTztBQUFBLFFBQ0wsR0FBQSxFQUFLLEdBREE7QUFBQSxRQUVMLEdBQUEsRUFBSyxHQUZBO0FBQUEsUUFHTCxRQUFBLEVBQVUsUUFITDtPQUFQLENBL0IwQjtJQUFBLENBeGY1QixDQUFBOztBQUFBLHdCQWdpQkEscUJBQUEsR0FBc0IsU0FBQSxHQUFBO0FBQ3BCLE1BQUEsSUFBRyxJQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsR0FBbUIsQ0FBdEI7QUFDRSxlQUFPLElBQUMsQ0FBQSxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBYixDQUFBLENBQVAsQ0FERjtPQUFBLE1BQUE7QUFHRSxlQUFPO0FBQUEsVUFDTCxJQUFBLEVBQU0sQ0FERDtBQUFBLFVBRUwsR0FBQSxFQUFLLENBRkE7QUFBQSxVQUdMLEtBQUEsRUFBTyxDQUhGO0FBQUEsVUFJTCxNQUFBLEVBQVEsQ0FKSDtTQUFQLENBSEY7T0FEb0I7SUFBQSxDQWhpQnRCLENBQUE7O3FCQUFBOztLQU5zQixNQUFNLENBQUMsT0FSakM7QUFBQSxDQU5BLENBQUEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSBbJ1BoYXNlcicsXG4gICAgICAgICdfJyxcbiAgICAgICAgJy4vUGFuZWwnLFxuICAgICAgICAnbmV0d29yaycsXG4gICAgICAgICcuL1BsYXllcicsXG4gICAgICAgICcuL0Jhbm5lciddLFxuKFBoYXNlciwgXyAsUGFuZWwsIG5ldHdvcmssUGxheWVyLCBCYW5uZXIpLT5cblxuXG5cblxuICAjIFRoZSBjbGFzcyBmb3IgdGhlIGZpZWxkIG9mIHBhbmVscyAvIGNhcmRzXG4gICMgQGNsYXNzIEdhbWVmaWVsZFxuICAjIEBleHRlbmQgUGhhc2VyLkdyb3VwXG4gIGNsYXNzIEdhbWVmaWVsZCBleHRlbmRzIFBoYXNlci5Hcm91cFxuXG5cbiAgICAjIExvYWQgYWxsIGZpbGVzIHJlcXVpcmVkIGZvciB0aGUgZ2FtZWZpZWxkXG4gICAgIyBAc3RhdGljXG4gICAgIyBAcGFyYW0ge1BoYXNlci5HYW1lfSBnYW1lIHRoZSBnYW1lIHdpdGggdGhlIGxvYWRlciwgY2FsbGVkIGZyb20gdGhlIHByZWxhb2QgZnVuY3Rpb24gb2YgdGhlIGdhbWVcbiAgICBAcHJlbG9hZDogKGdhbWUpLT5cbiAgICAgIGdhbWUubG9hZC5pbWFnZSgnR2FtZWZpZWxkX2JnJyxnYW1lLm5vcm1hbGl6ZVVybCgnL0ltYWdlcy9HYW1lZmllbGRfYmcucG5nJykpO1xuXG4gICAgI0NyZWF0ZSBhbiBuZXcgR2FtZWZpZWxkXG4gICAgI0BwYXJhbSB7UGhhc2VyLkdhbWV9IGdhbWVcbiAgICAjQHBhcmFtIHtpbnR9IFt4PTIwMF0gVGhlIHggcG9zaXRpb25cbiAgICAjQHBhcmFtIHtpbnR9IFt5PTEwMF0gVGhlIHkgcG9zaXRpb25cbiAgICBjb25zdHJ1Y3RvcjogKGdhbWUsIHBsYXllciwgeCA9IDIyNSAsIHkgPSAxNTAgKS0+XG4gICAgICBpZiBub3QgcGxheWVyIGluc3RhbmNlb2YgUGxheWVyXG4gICAgICAgIHRocm93ICBuZXcgRXJyb3IgKFwicGFyYW0gcGxheWVyIG11c3QgYSBpbnN0YW5jZSBvZiBQbGF5ZXIgY2xhc3NcIilcblxuICAgICAgc3VwZXIoZ2FtZSxudWxsLCAnR0FNRUZJRUxEJyxmYWxzZSxmYWxzZSlcblxuICAgICAgQHggPSB4XG4gICAgICBAeSA9IHlcblxuICAgICAgQF9TQVNfYmFja2dyb3VuZCA9IG5ldyBQaGFzZXIuU3ByaXRlKGdhbWUsQHgtKEBnZXRQYW5lbEJvcmRlcigpKzY4KSxAeS0oQGdldFBhbmVsQm9yZGVyKCkrNjgpLCdHYW1lZmllbGRfYmcnKVxuICAgICAgQF9TQVNfYmFja2dyb3VuZC53aWR0aCA9IEBnZXRCb3VuZHMoKS53aWR0aFxuICAgICAgQF9TQVNfYmFja2dyb3VuZC5oZWlnaHQgPSBAZ2V0Qm91bmRzKCkuaGVpZ2h0XG4gICAgICBAX1NBU19wbGF5ZXIgPSBwbGF5ZXJcbiAgICAgIEBfU0FTX3BhbmVsVG9QbGFjZSA9IG51bGw7XG4gICAgICBAX1NBU19zaXplID0gMFxuICAgICAgQF9TQVNfc2lWaXNpYmxlID0gZmFsc2VcblxuXG4gICAgc2hvdzogKCk9PlxuICAgICAgQF9TQVNfc2lWaXNpYmxlID0gdHJ1ZVxuICAgICAgQGdhbWUuYWRkLmV4aXN0aW5nKHRoaXMpXG4gICAgICBAZ2V0QmFja2dyb3VuZFBhbmVsKCkuYWxwaGEgPSAwLjFcbiAgICAgIHBhbmVsVG9QbGFjZSA9IEBnZXRQYW5lbFRvUGxhY2UoKVxuICAgICAgaWYgcGFuZWxUb1BsYWNlICE9IG51bGwgYW5kIHBhbmVsVG9QbGFjZSAhPSB1bmRlZmluZWRcbiAgICAgICAgcGFuZWxUb1BsYWNlLnZpc2libGUgPSAxXG4gICAgICBAZ2FtZS5hZGQuZXhpc3RpbmcoQGdldEJhY2tncm91bmRQYW5lbCgpKTtcblxuXG5cbiAgICAjUmV0dXJucyB0aGUgYmFja2dyb3VuZCBQYW5lbFxuICAgIGdldEJhY2tncm91bmRQYW5lbDooKT0+IEBfU0FTX2JhY2tncm91bmRcblxuICAgICNSZXR1cm5zIHRoZSBwbGF5ZXIgdGhhdCBzaXQgaW4gZnJvbnQgb2YgdGhlIGdhbWVmaWVsZFxuICAgIGdldFBsYXllcjooKT0+IEBfU0FTX3BsYXllclxuXG4gICAgI0dldCB0aGUgc2l6ZSBvZiB0aGUgZ2FtZWZpZWxkXG4gICAgZ2V0U2l6ZTogKCk9PiBAX1NBU19zaXplXG5cbiAgICAjQ3JlYXRlIGEgZGVmYXVsdCBHYW1lZmllbGRcbiAgICAjQHBhcmFtIHtOZXR3b3JrLkZpZWxkfSBmaWVsZCAtIFRoZSBzaXplIG9mIHRoZSBnYW1lZmllbGRcbiAgICBjcmVhdGVHYW1lZmllbGQ6IChmaWVsZCk9PlxuICAgICAgI0NyZWF0ZSBmaWVsZFxuICAgICAgcm93SW5kZXggPSAwXG4gICAgICBmb3Igcm93IGluICBmaWVsZFxuICAgICAgICBjb2xJbmRleCA9IDBcbiAgICAgICAgZm9yIHBhbmVsVHlwZUlkIGluICByb3dcbiAgICAgICAgICBwYW5lbFR5cGUgPSBQYW5lbC5nZXRUeXBlQnlJZChwYW5lbFR5cGVJZClcbiAgICAgICAgICBpZiBwYW5lbFR5cGVJZCAhPTBcbiAgICAgICAgICAgIG5ld1BhbmVsID0gbmV3IFBhbmVsKEBnYW1lLEAscGFuZWxUeXBlKVxuICAgICAgICAgICAgaWYgQF9TQVNfc2lWaXNpYmxlID09IGZhbHNlXG4gICAgICAgICAgICAgIG5ld1BhbmVsLmFscGhhID0gMVxuICAgICAgICAgICAgQGFkZChuZXdQYW5lbCxyb3dJbmRleCxjb2xJbmRleClcbiAgICAgICAgICBjb2xJbmRleCA9IGNvbEluZGV4KzFcbiAgICAgICAgcm93SW5kZXg9cm93SW5kZXgrMVxuICAgICAgQF9TQVNfc2l6ZSA9IHJvd0luZGV4XG5cbiAgICAgIEB1cGRhdGVCYWNrZ3JvdW5kU2l6ZShyb3dJbmRleCxjb2xJbmRleClcblxuXG5cbiAgICB1cGRhdGVCYWNrZ3JvdW5kU2l6ZTogKHJvd0NvdW50LGNvbENvdW50KT0+XG4gICAgICAjU2V0IGJnIHRvIHNpemUgb2YgdGhlIEdhbWVmaWVsZCAoYmVjYXVzZSByZXNpemUpXG4gICAgICBiZyA9IEBnZXRCYWNrZ3JvdW5kUGFuZWwoKVxuXG4gICAgICBiZy54ID0gQHggLSBAZ2V0RGVmYXVsdFBhbmVsQm91bmRzKCkud2lkdGgvMlxuICAgICAgYmcueSA9IEB5IC0gQGdldERlZmF1bHRQYW5lbEJvdW5kcygpLmhlaWdodC8yXG5cblxuICAgICAgYmcud2lkdGggID0gKEBnZXREZWZhdWx0UGFuZWxCb3VuZHMoKS53aWR0aCtAZ2V0UGFuZWxCb3JkZXIoKSkqIGNvbENvdW50XG4gICAgICBiZy5oZWlnaHQgPSAoQGdldERlZmF1bHRQYW5lbEJvdW5kcygpLmhlaWdodCtAZ2V0UGFuZWxCb3JkZXIoKSkgKiByb3dDb3VudFxuXG4gICAgI0FkZCB0aGUgcGFubmVsIHRvIHRoZSBncm91cFxuICAgICNAb3ZlcnJpZGVcbiAgICAjQHBhcmFtIHtQYW5lbH0gcGFuZWwgLSBUaGUgUGFuZWwgdG8gYWRkXG4gICAgI0BwYXJhbSB7aW50fSByb3cgdGhlIHJvdyB0byBwbGFjZSB0aGUgbmV3IHBhbmVsXG4gICAgI0BwYXJhbSB7aW50fSBjb2wgZm9yIHRoZSBuZXcgUGFuZWxcbiAgICAjQHBhcmFtIHtib29sZWFufSBbYW5pbWF0aW9uPWZhbHNlXSAtIGlmIHRydWUgYSBhbmltYXRpb24gd2VyZSBwbGF5ZWRcbiAgICAjQHBhcmFtIHtQYW5lbC5tb3ZlRGlyZWN0aW9uc30gW3Bvc2l0aW9uPW51bGxdIC0gaWYgYW5pbWF0aW9uIHRydWUgd2UgbmV0IHRoZSBjdXJyZW50IHBvc2l0aW9uIHRvIGNhbGN1bGF0ZSB0aGUgZGlyZWN0aW9uXG4gICAgYWRkOiAocGFuZWwsIHJvdywgY29sKT0+XG4gICAgICBpZiBwYW5lbCBub3QgaW5zdGFuY2VvZiBQYW5lbFxuICAgICAgICB0aHJvdyAgbmV3IEVycm9yIFwiUGxlYXNlIHNldCBhcyBhcmd1bWVudCBhbiBwYW5lbCBvYmplY3RcIlxuXG4gICAgICBwYW5lbC5zZXRQb3NpdGlvbihyb3csY29sLCBAZ2V0UGFuZWxCb3JkZXIoKSlcbiAgICAgIHN1cGVyKHBhbmVsKVxuXG5cbiAgICAjUmV0dXJuIHRoZSByb3dcbiAgICAjQHBhcmFtIHtpbnR9IHJvd0luZGV4IC0gVGhlIGluZGV4IHRvIGdldFxuICAgICNAcmV0dXJucyB7QXJyYXk8UGFuZWw+fSAgVGhlIHJvdyBBcnJheVxuICAgIGdldFJvdzogKHJvd0luZGV4KSA9PlxuICAgICAgcm93ID0gW11cbiAgICAgIGZvciBwYW5lbCBpbiBAY2hpbGRyZW5cbiAgICAgICAgaWYgcGFuZWwuZ2V0Um93KCkgPT0gcm93SW5kZXhcbiAgICAgICAgICByb3cucHVzaChwYW5lbClcbiAgICAgIHJldHVybiByb3dcblxuICAgICNSZXR1cm5zIHRoZSBjb2xcbiAgICAjQHBhcmFtIHtpbnR9IGNvbEluZGV4IC0gVGhlIGNvbCB0byBnZXRcbiAgICAjQHJldHVybiB7QXJyYXk8UGFuZWw+fSAtIFRoZSBjb2wgYXMgQXJyYXlcbiAgICBnZXRDb2w6IChjb2xJbmRleCkgPT5cbiAgICAgIGNvbCA9IFtdXG4gICAgICBmb3IgcGFuZWwgaW4gQGNoaWxkcmVuXG4gICAgICAgIGlmIHBhbmVsLmdldENvbCgpID09IGNvbEluZGV4XG4gICAgICAgICAgY29sLnB1c2gocGFuZWwpXG4gICAgICByZXR1cm4gY29sXG5cbiAgICAjUmVydW5zIHRoZSBwbGFjZSBiZXR3ZWVuIDIgUGFuZWxzXG4gICAgI0ByZXR1cm5zIHtpbnR9IHBsYWNlIGJldHdlZW4gMiBQYW5lbHNcbiAgICBnZXRQYW5lbEJvcmRlcjooKT0+IFBhbmVsLmdldERlZmF1bHRQYW5lbEJvcmRlcigpXG5cbiAgICAjUmV0dXJucyB0aGUgUGFuZWxcbiAgICAjQHBhcmFtIHtpbnR9IHJvd1xuICAgICNAcGFyYW0ge2ludH0gY29sXG4gICAgI0ByZXR1cm4ge1BhbmVsfSAtIFRoZSBwYW5lbCBvbiB0aGUgcG9zaXRpb24gKHJvdyxjb2wpXG4gICAgZ2V0UGFuZWw6KHJvdywgY29sKT0+XG4gICAgICByb3cgPSBAZ2V0Um93KHJvdylcbiAgICAgIGZvciBwYW5lbCBpbiByb3dcbiAgICAgICAgaWYgcGFuZWwuZ2V0Q29sKCkgPT0gY29sXG4gICAgICAgICAgcmV0dXJuIHBhbmVsXG4gICAgICByZXR1cm4gbnVsbFxuXG4gICAgI1NldCB0aGUgJ1BhbmVsIHRvIHBsYWNlJyB0aGlzIGlzIHRoZSBuZXcgUGFuZWwgdGhhdCB0aGUgdXNlciBjYW4gcGxhY2VcbiAgICAjQHBhcmFtIHtQYW5lbH0gbmV3UGFuZWwgLSBUaGUgbmV3IFBhbmVsIHRvIHBsYWNlXG4gICAgc2V0UGFuZWxUb1BsYWNlOiAobmV3UGFuZWwpPT5cbiAgICAgIGlmIG5vdCBuZXdQYW5lbCBpbnN0YW5jZW9mIFBhbmVsXG4gICAgICAgIHRocm93IG5ldyBFcnJvciAoXCJzZXRQYW5lbFRvUGxhY2U9PiBuZXdQYW5lbCBpcyBub3QgYSBpbnN0YW5jZSBvZiBQYW5lbFwiKVxuXG4gICAgICAjaWYgQF9TQVNfcGFuZWxUb1BsYWNlICE9IG51bGxcbiAgICAgICAgI0BfU0FTX3BhbmVsVG9QbGFjZS5kZXN0cm95KClcbiAgICAgIG5ld1BhbmVsLnggPSAxMDBcbiAgICAgIG5ld1BhbmVsLnkgPSAxMDBcbiAgICAgIEBnYW1lLmFkZC5leGlzdGluZyhuZXdQYW5lbClcbiAgICAgIEBfU0FTX3BhbmVsVG9QbGFjZSA9IG5ld1BhbmVsXG5cbiAgICAgIGlmIEBfU0FTX3NpVmlzaWJsZSA9PSBmYWxzZVxuICAgICAgICBuZXdQYW5lbC52aXNpYmxlID0gZmFsc2VcblxuICAgICNHZXQgdGhlIGN1cnJlbnQgcGFuZWwgdG8gcGxhY2VcbiAgICAjQHJldHVybiB7UGFuZWx8bnVsbH0gUGFuZWwgb3IgbnVsbCBpZiB1bmRlZmluZWRcbiAgICBnZXRQYW5lbFRvUGxhY2U6ICgpPT4gQF9TQVNfcGFuZWxUb1BsYWNlXG5cblxuICAgICNHZXQgdGhlIG5leHQgcG9zaXRpb24gdG8gdGhlIGdhbWVmaWVsZFxuICAgICNAcGFyYW0ge1BhbmVsfSBwYW5lbFRvQ2hlY2tSZWxhdGlvbiAgLSBUaGUgUGFuZWwgdG8gY2hlY2tcbiAgICAjQHJldHVybiB7b2JqZWN0fSBCb3VuZHNcbiAgICAjQGV4YW1wbGU6IHJldHVybnMge1xuICAgICMgIGxvY2FsTGVmdDogMTBcbiAgICAjICBsb2NhbFRvcDogMTBcbiAgICAjICB3aWR0aDogNzBcbiAgICAjICBoZWlnaHQ6IDcwXG4gICAgIyAgY29sOiAxXG4gICAgIyAgcm93OiAxXG4gICAgIyAgcG9zaXRpb246IDEwXG4gICAgIyAgbGVmdDogMTAwXG4gICAgIyAgcmlnaHQ6MjAwXG4gICAgI31cbiAgICBnZXROZWlnaGJvckJvdW5kczogKHBhbmVsVG9DaGVja1JlbGF0aW9uKT0+XG5cbiAgICAgIGdyb3VwQm91bmRzID0gQGdldEJhY2tncm91bmRQYW5lbCgpLmdldEJvdW5kcygpO1xuICAgICAgcGFuZWxCb3VuZHMgPSBwYW5lbFRvQ2hlY2tSZWxhdGlvbi5nZXRCb3VuZHMoKTtcbiAgICAgIHJlbGF0aXZlWCA9IGdyb3VwQm91bmRzLmxlZnQgLSBwYW5lbFRvQ2hlY2tSZWxhdGlvbi54IC0gcGFuZWxCb3VuZHMud2lkdGgvMlxuICAgICAgcmVsYXRpdmVZID0gZ3JvdXBCb3VuZHMudG9wIC0gcGFuZWxUb0NoZWNrUmVsYXRpb24ueSAtIHBhbmVsQm91bmRzLmhlaWdodC8yXG4gICAgICBwb3NpdGlvbiA9IG51bGxcblxuICAgICAgaWYgcGFuZWxUb0NoZWNrUmVsYXRpb24ueCAgPiBncm91cEJvdW5kcy5yaWdodFxuICAgICAgICBwb3NpdGlvbiA9IFBhbmVsLm1vdmVEaXJlY3Rpb25zLlJJR0hUXG4gICAgICBlbHNlIGlmIHBhbmVsVG9DaGVja1JlbGF0aW9uLnggPCBncm91cEJvdW5kcy5sZWZ0XG4gICAgICAgIHBvc2l0aW9uID0gUGFuZWwubW92ZURpcmVjdGlvbnMuTEVGVFxuICAgICAgZWxzZSBpZiBwYW5lbFRvQ2hlY2tSZWxhdGlvbi55IDwgZ3JvdXBCb3VuZHMudG9wXG4gICAgICAgIHBvc2l0aW9uID0gUGFuZWwubW92ZURpcmVjdGlvbnMuVE9QXG5cbiAgICAgICNEZWZpbmUgY29sXG4gICAgICByb3dMZW5ndGggPSBwYXJzZUludChNYXRoLmFicyhNYXRoLnJvdW5kKGdyb3VwQm91bmRzLmhlaWdodCAvIChAZ2V0RGVmYXVsdFBhbmVsQm91bmRzKCkuaGVpZ2h0ICArIEBnZXRQYW5lbEJvcmRlcigpKSkpKVxuICAgICAgcmVsYXRpdmVYID0gTWF0aC5hYnMocmVsYXRpdmVYKVxuICAgICAgY29sV2lkdGggPSAgZ3JvdXBCb3VuZHMud2lkdGgvcm93TGVuZ3RoXG4gICAgICBjb2wgPSBNYXRoLmFicyhNYXRoLnJvdW5kKHJlbGF0aXZlWC9jb2xXaWR0aCkpXG5cbiAgICAgICNEZWZpbmUgcm93XG4gICAgICBjb2xMZW5ndGggPSBNYXRoLmFicyhNYXRoLnJvdW5kKGdyb3VwQm91bmRzLndpZHRoIC8gKEBnZXREZWZhdWx0UGFuZWxCb3VuZHMoKS53aWR0aCAgKyBAZ2V0UGFuZWxCb3JkZXIoKSkpKVxuICAgICAgcmVsYXRpdmVZID0gTWF0aC5hYnMocmVsYXRpdmVZKVxuICAgICAgcm93V2lkdGggPSAgZ3JvdXBCb3VuZHMud2lkdGgvY29sTGVuZ3RoXG4gICAgICByb3cgPSBNYXRoLmFicyhNYXRoLnJvdW5kKHJlbGF0aXZlWS9yb3dXaWR0aCkpXG5cbiAgICAgICNLb3JyZWt0dXIgZGVyIEluZGV4aWVzIChrbGVpbmVyIGFscyAwID0+IDAgYWxsZSBhbmRlcmVuIC0xIClcbiAgICAgIGlmIHJvdyA+IDBcbiAgICAgICAgcm93ID0gcm93LTFcbiAgICAgIGVsc2VcbiAgICAgICAgcm93ID0gMFxuICAgICAgaWYgY29sID4gMFxuICAgICAgICBjb2wgPSBjb2wtMVxuICAgICAgZWxzZVxuICAgICAgICBjb2wgPSAwXG5cbiAgICAgICNLb3JyZWt0dXIgYmVpID4gYWxzIGxlbmdodFxuICAgICAgaWYgcm93ID49IGNvbExlbmd0aFxuICAgICAgICByb3cgPSBjb2xMZW5ndGgtMVxuXG4gICAgICBpZiBjb2wgPj0gcm93TGVuZ3RoXG4gICAgICAgIGNvbCA9IHJvd0xlbmd0aC0xXG5cblxuICAgICAgI2NvbnNvbGUubG9nKFwiU0laRVwiLCByb3dMZW5ndGgsY29sTGVuZ3RoKVxuICAgICAgI2NvbnNvbGUubG9nKCdBVVM6Jyxncm91cEJvdW5kcyxwYW5lbEJvdW5kcyxyZWxhdGl2ZVgscmVsYXRpdmVZKVxuICAgICAgI2NvbnNvbGUubG9nKCdDT0w6Jyxjb2wsIE1hdGguYWJzKE1hdGgucm91bmQocmVsYXRpdmVYL2NvbFdpZHRoKSkscmVsYXRpdmVYLHBvc2l0aW9uLGdyb3VwQm91bmRzLndpZHRoKVxuICAgICAgI2NvbnNvbGUubG9nKCdST1cnLHJvdywgTWF0aC5hYnMoTWF0aC5yb3VuZChyZWxhdGl2ZVkvcm93V2lkdGgpKSxwb3NpdGlvbixncm91cEJvdW5kcy5oZWlnaHQpXG5cbiAgICAgIGJvdW5kcyA9IHtcbiAgICAgICAgbG9jYWxMZWZ0OiBjb2wqKHBhbmVsQm91bmRzLndpZHRoICsgQGdldFBhbmVsQm9yZGVyKCkpXG4gICAgICAgIGxvY2FsVG9wOiByb3cqKHBhbmVsQm91bmRzLmhlaWdodCArIEBnZXRQYW5lbEJvcmRlcigpKVxuICAgICAgICB3aWR0aDogcGFuZWxCb3VuZHMud2lkdGhcbiAgICAgICAgaGVpZ2h0OiBwYW5lbEJvdW5kcy5oZWlnaHRcbiAgICAgICAgY29sOiBjb2xcbiAgICAgICAgcm93OiByb3dcbiAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICB9XG4gICAgICBib3VuZHMubGVmdCA9IEB4ICsgYm91bmRzLmxvY2FsTGVmdFxuICAgICAgYm91bmRzLnRvcCA9IEB5ICsgYm91bmRzLmxvY2FsVG9wXG5cbiAgICAgIHJldHVybiBib3VuZHNcblxuICAgICNTbGlkZSB0aGUgbmV3IFBhbmVsIGluIGFuZCB0byB0aGUgcG9zaXRpb24gcm93SW5kZXgsIGNvbEluZGV4XG4gICAgI0BwYXJhbSB7UGFuZWx9IG5ld1BhbmVsIC0gVGhlIFBhbmVsIHRvIHNsaWRlIGluXG4gICAgI0BwYXJhbSB7aW50fSByb3dJbmRleCAtIFRoZSBuZXcgUG9zaXRpb24gaW5kZXhcbiAgICAjQHBhcmFtIHtpbnR9IGNvbEluZGV4IC0gVGhlIG5ldyBQb3NpdGlvbiBpbmRleFxuICAgICNAcGFyYW0ge1BhbmVsLm1vdmVEaXJlY3Rpb25zfSAtIHBvc2l0aW9uIC0gVGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIG5ld1BhbmVsXG5cbiAgICBzbGlkZU5ld1BhbmVsSW46IChuZXdQYW5lbCxyb3dJbmRleCwgY29sSW5kZXgsIHBvc2l0aW9uKT0+XG5cblxuICAgICAgaWYgcG9zaXRpb24gPT0gUGFuZWwubW92ZURpcmVjdGlvbnMuTEVGVFxuICAgICAgICBuZXdQYW5lbC5zZXRDb2woY29sSW5kZXgtMSlcbiAgICAgICAgbmV3UGFuZWwuc2V0Um93KHJvd0luZGV4KVxuXG4gICAgICBlbHNlIGlmIHBvc2l0aW9uID09IFBhbmVsLm1vdmVEaXJlY3Rpb25zLlJJR0hUXG4gICAgICAgIG5ld1BhbmVsLnNldENvbChjb2xJbmRleCsxKVxuICAgICAgICBuZXdQYW5lbC5zZXRSb3cocm93SW5kZXgpXG4gICAgICBlbHNlIGlmIHBvc2l0aW9uID09IFBhbmVsLm1vdmVEaXJlY3Rpb25zLlRPUFxuICAgICAgICBuZXdQYW5lbC5zZXRDb2woY29sSW5kZXgpXG4gICAgICAgIG5ld1BhbmVsLnNldFJvdyhyb3dJbmRleC0xKVxuXG5cbiAgICAgIEBhZGQobmV3UGFuZWwsbmV3UGFuZWwuZ2V0Um93KCksbmV3UGFuZWwuZ2V0Q29sKCkpXG4gICAgICBzd2l0Y2ggIHBvc2l0aW9uXG4gICAgICAgIHdoZW4gUGFuZWwubW92ZURpcmVjdGlvbnMuRE9XTiAgICB0aGVuIGRpcmVjdGlvbiA9IFBhbmVsLm1vdmVEaXJlY3Rpb25zLlRPUFxuICAgICAgICB3aGVuIFBhbmVsLm1vdmVEaXJlY3Rpb25zLlJJR0hUICAgdGhlbiBkaXJlY3Rpb24gPSBQYW5lbC5tb3ZlRGlyZWN0aW9ucy5MRUZUXG4gICAgICAgIHdoZW4gUGFuZWwubW92ZURpcmVjdGlvbnMuTEVGVCAgICB0aGVuIGRpcmVjdGlvbiA9IFBhbmVsLm1vdmVEaXJlY3Rpb25zLlJJR0hUXG4gICAgICAgIHdoZW4gUGFuZWwubW92ZURpcmVjdGlvbnMuVE9QICAgICB0aGVuIGRpcmVjdGlvbiA9IFBhbmVsLm1vdmVEaXJlY3Rpb25zLkRPV05cblxuXG4gICAgICBpZiBkaXJlY3Rpb24gPT0gUGFuZWwubW92ZURpcmVjdGlvbnMuRE9XTiBhbmQgbmV3UGFuZWwuZ2V0Um93KCkgID09IC0xXG4gICAgICAgIGNvbCA9IEBnZXRDb2wobmV3UGFuZWwuZ2V0Q29sKCkpXG4gICAgICAgICNPbmx5IGtpbGwgcGFuZWwgaWYgdGhlIGNvbCBpcyBmdWxsXG4gICAgICAgIGlmIGNvbC5sZW5ndGggPT0gQGdldFNpemUoKSsxXG4gICAgICAgICAgbGFzdFBhbmVsSW5Db2wgPSBAZ2V0UGFuZWwoQGdldFNpemUoKS0xLG5ld1BhbmVsLmdldENvbCgpKVxuICAgICAgICAgIHR3ZWVuID0gbGFzdFBhbmVsSW5Db2wua2lsbCgpXG4gICAgICAgICAgdHdlZW4uc3RhcnQoKVxuICAgICAgICAgIHJldHVybiB0d2VlblxuXG4gICAgICByZXR1cm4gQHNsaWRlUGFuZWwobmV3UGFuZWwsZGlyZWN0aW9uKVxuXG5cblxuICAgICNTbGlkZSBhIHNpbmdlbCBQYW5lbFxuICAgICNAcGFyYW0ge1BhbmVsfSBwYW5lbCAtIHRoZSBuZXcgUGFuZWxcbiAgICAjQHBhcmFtIHtQYW5lbC5tb3ZlRGlyZWN0aW9uc30gZGlyZWN0aW9uIC0gVGhlIGRpcmVjdGlvbiB0byBzbGlkZSB0aGUgUGFuZWxcbiAgICBzbGlkZVBhbmVsOiAocGFuZWwsZGlyZWN0aW9uKSA9PlxuICAgICB0d2VlbiA9IHBhbmVsLnNsaWRlKGRpcmVjdGlvbilcblxuICAgICB0d2Vlbi5zdGFydCgpXG4gICAgIHJldHVybiB0d2VlblxuXG5cblxuICAgICNLaWxsIGEgc2luZ2VsIHBhbmVsIGFuZCBhbmltYXRlIHRoZSBtb3ZlIGFib3ZlXG4gICAgI0BwYXJhbSB7UGFuZWx9IHBhbmVsVG9LaWxsIC0gVGhlIFBhbmVsIHRvIGtpbGxcbiAgICAjQHJldHVybiB7UGhhc2VyLlR3ZWVufSB0aGUgbGFzdCBUd2VlbiBvZiB0aGUgc2xpZGVQYW5lbHMgYWN0aW9uXG4gICAga2lsbFBhbmVsOiAocGFuZWxUb0tJbGwpPT5cbiAgICAgIHR3ZWVuID0gcGFuZWxUb0tJbGwua2lsbCgpXG4gICAgICB0d2Vlbi5zdGFydCgpXG4gICAgICByZXR1cm4gdHdlZW5cblxuICAgICNDaGVjayBpZiBpdCBpcyB5b3VyIHR1cm5cbiAgICAjQHJldHVybiB7Ym9vbGVhbn1cbiAgICB5b3VyVHVybjogKCk9PlxuICAgICAgaWYgQGdhbWUuZ2V0Q3VycmVudFBsYXllcigpICE9IG51bGxcbiAgICAgICAgaWYgQGdhbWUuZ2V0Q3VycmVudFBsYXllcigpLmdldFNlc3Npb25JZCgpID09IEBnZXRQbGF5ZXIoKS5nZXRTZXNzaW9uSWQoKVxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICByZXR1cm4gZmFsc2VcblxuXG4gICAgI1VwZGF0ZSBmdW5jdGlvbiBvZiB0aGUgR2FtZWZpZWxkXG4gICAgI0BvdmVycmlkZVxuICAgIHVwZGF0ZTogKCk9PlxuXG4gICAgICAjVXBkYXRlIHRoZSBwc290aW9uIG9mIHRoZSBuZXdQYW5lbCB0aGF0IHRoZSB1c2VyIGNhbiBtb3ZlIGFyb3VuZCB0aGUgZ2FtZWZpZWxkXG4gICAgICAjT25seSBpZiB0aGUgeW91IG9uIHRoZSB0dXJuXG5cbiAgICAgIGlmIEB5b3VyVHVybigpXG4gICAgICAgIEB1cGRhdGVQYW5lbFRvUGxhY2VGb2xsb3dNb3VzZSgpXG4gICAgICBlbHNlXG4gICAgICAgIGlmIEBnYW1lLmlucHV0Lm1vdXNlUG9pbnRlci5pc0Rvd25cbiAgICAgICAgICBCYW5uZXIucGxheSgnbm90LXlvdXItdHVybicpXG4gICAgICAgICAgQGdhbWUuaW5wdXQubW91c2VQb2ludGVyLmlzRG93biA9IGZhbHNlO1xuXG4gICAgICBzdXBlcigpO1xuXG4gICAgI1VwZGF0ZSB0aGUgcG9zaXRpb24gb2YgdGhlIG5ldyBwYW5lbCB0aGF0IHRoZSB1c2VyIGNhbiBwbGFjZSBpbiB0aGUgZmllbGRcbiAgICAjY2FsbGVkIGZyb20gdGhlIHVwZGF0ZSBmdW5jdGlvblxuICAgICNAcmV0dXJuIHZvaWRcbiAgICB1cGRhdGVQYW5lbFRvUGxhY2VGb2xsb3dNb3VzZTogKCk9PlxuICAgICAgcGFuZWxUb1VwZGF0ZVBvc2l0aW9uID0gQGdldFBhbmVsVG9QbGFjZSgpXG4gICAgICBpZiBwYW5lbFRvVXBkYXRlUG9zaXRpb24gIT0gbnVsbFxuXG4gICAgICAgIGJvdW5kc0dyb3VwID0gQGdldEJhY2tncm91bmRQYW5lbCgpLmdldEJvdW5kcygpXG4gICAgICAgIHggPSBAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIueDtcbiAgICAgICAgeSA9IEBnYW1lLmlucHV0Lm1vdXNlUG9pbnRlci55O1xuICAgICAgICAjY29uc29sZS5sb2coYm91bmRzR29ydXAudG9wLCB5KVxuXG5cbiAgICAgICAgI2lmIHRoZSBtb3VzZSBwb2ludGVyIGlzIGFib3ZlIHRoZSBib3R0b21cbiAgICAgICAgaWYgYm91bmRzR3JvdXAuYm90dG9tID4geVxuICAgICAgICAgICNDaGVjayByaWdodCBvciBsZWZ0IGNvcnJpZG9yXG5cbiAgICAgICAgICBpZiAoYm91bmRzR3JvdXAudG9wLTEwMCA8IHkgYW5kICBib3VuZHNHcm91cC50b3AgPiB5KSBvciAoKGJvdW5kc0dyb3VwLmxlZnQtMTAwIDwgeCBhbmQgYm91bmRzR3JvdXAubGVmdCA+IHggKSBvciAgKGJvdW5kc0dyb3VwLnJpZ2h0KzEwMCA+IHggYW5kIGJvdW5kc0dyb3VwLnJpZ2h0IDwgeCkpXG4gICAgICAgICAgICAjR2FtZWZpZWxkIGhhdCBlaW4gbmV1ZXMgUGFuZWwgenVtIHBsYXppZXJlbiA9PiBNYXVzIGZvbGdlblxuXG5cblxuICAgICAgICAgICAgcGFuZWxUb1VwZGF0ZVBvc2l0aW9uLnggPSBAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIueDtcbiAgICAgICAgICAgIHBhbmVsVG9VcGRhdGVQb3NpdGlvbi55ID0gQGdhbWUuaW5wdXQubW91c2VQb2ludGVyLnk7XG4gICAgICAgICAgICBuZWlnaGJvckJvdW5kcyA9IEBnZXROZWlnaGJvckJvdW5kcyhwYW5lbFRvVXBkYXRlUG9zaXRpb24pXG4gICAgICAgICAgICBpZiBwYW5lbFRvVXBkYXRlUG9zaXRpb24uZ2V0Um93KCkgIT0gbmVpZ2hib3JCb3VuZHMucm93IG9yIHBhbmVsVG9VcGRhdGVQb3NpdGlvbi5nZXRDb2woKSAhPSBuZWlnaGJvckJvdW5kcy5jb2xcbiAgICAgICAgICAgICAgbU4gPSBAdHJhbnNsYXRlVG9OZXR3b3JrUm93Q29sKG5laWdoYm9yQm91bmRzLnJvdyxuZWlnaGJvckJvdW5kcy5jb2wsIG5laWdoYm9yQm91bmRzLnBvc2l0aW9uKVxuICAgICAgICAgICAgICBuZXR3b3JrLnNlbmRTbGlkZVBvc3Rpb24obU4ubSwgbU4ubik7XG5cbiAgICAgICAgICAgIHBhbmVsVG9VcGRhdGVQb3NpdGlvbi5zZXRQb3NpdGlvbk5laWdoYm91cihuZWlnaGJvckJvdW5kcy5yb3csbmVpZ2hib3JCb3VuZHMuY29sLG5laWdoYm9yQm91bmRzLnBvc2l0aW9uLEBnZXRCYWNrZ3JvdW5kUGFuZWwoKS5nZXRCb3VuZHMoKSlcblxuXG5cbiAgICAgICAgICAjc2V0IGNsaWNrIHN0YXRlIHRvIGRvd25cbiAgICAgICAgICBpZiBAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIuaXNEb3duXG4gICAgICAgICAgICBpZiBAU0FTX1RFTVBfQ0xJQ0tfRE9XTiA9PSBmYWxzZSBvciBAU0FTX1RFTVBfQ0xJQ0tfRE9XTiA9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgQFNBU19URU1QX0NMSUNLX0RPV04gPSB0cnVlXG5cbiAgICAgICAgICBpZiBAZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIuaXNVcFxuICAgICAgICAgICAgI0NsaWVjayByZWxlYXNlZFxuICAgICAgICAgICAgaWYgQFNBU19URU1QX0NMSUNLX0RPV05cbiAgICAgICAgICAgICAgQFNBU19URU1QX0NMSUNLX0RPV04gPSBmYWxzZVxuICAgICAgICAgICAgICAjVHJhbnNsYXRlIHRoZSBpbnRvIG1OIGNvcmRzXG4gICAgICAgICAgICAgIG5laWdoYm9yQm91bmRzID0gQGdldE5laWdoYm9yQm91bmRzKHBhbmVsVG9VcGRhdGVQb3NpdGlvbilcbiAgICAgICAgICAgICAgbU4gPSBAdHJhbnNsYXRlVG9OZXR3b3JrUm93Q29sKG5laWdoYm9yQm91bmRzLnJvdyxuZWlnaGJvckJvdW5kcy5jb2wsIG5laWdoYm9yQm91bmRzLnBvc2l0aW9uKVxuICAgICAgICAgICAgICBuZXR3b3JrLnNsaWRlKG1OLm0sIG1OLm4pO1xuXG4gICAgI0hhbmRsZSBhIHNpbmdsZSBuZXR3b3JrayBhY3Rpb25cbiAgICAjQHBhcmFtIHtBY3Rpb259IGFjdGlvbiAtIFRoZSBhY3Rpb24gdG8gaGFuZGxlXG4gICAgI0ByZXR1cm4ge1BoYXNlci5Ud2VlbiB8IG51bGx9IFRoZSB0d2VlbiBvYmplY3Qgb3IgbnVsbCBpZiBubyB0d2VlbiBjcmVhdGVkXG4gICAgaGFuZGxlTmV0d29ya0FjdGlvbjogKGFjdGlvbik9PlxuICAgICBpZiBhY3Rpb24udHlwZSA9PSBcIlNsaWRlXCJcbiAgICAgICAgaWYgYWN0aW9uLmRhdGEuU2xpZGVJblxuICAgICAgICAgIHRyYW5zID1AdHJhbnNsYXRlRnJvbU5ldHdvcmtSb3dDb2woYWN0aW9uLmRhdGEuU2xpZGVJbi5tLGFjdGlvbi5kYXRhLlNsaWRlSW4ubixhY3Rpb24uZGF0YS5TbGlkZUluLm9yaWVudGF0aW9uKVxuICAgICAgICAgIHR3ZWVuID0gQHNsaWRlTmV3UGFuZWxJbihAZ2V0UGFuZWxUb1BsYWNlKCksdHJhbnMucm93LHRyYW5zLmNvbCx0cmFucy5wb3NpdGlvbilcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlNsaWRlQWN0aW9uXCIsdHJhbnMpXG4gICAgICAgICAgcmV0dXJuIHR3ZWVuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJTbGlkZUFjdGlvbiBtdXN0IGNvbnRhaW4gdGhlIFNsaWRlSW4gcHJvcGVydHlcIlxuICAgICAgZWxzZSBpZiBhY3Rpb24udHlwZSA9PSBcIlNjb3JlXCJcblxuICAgICAgICBpZiBhY3Rpb24uZGF0YS5TY29yZS5jb3VudCA9PSAzXG4gICAgICAgICAgQmFubmVyLnBsYXkoJ3RocmVlLW9mLWEta2luZCcpXG5cbiAgICAgICAgaWYgYWN0aW9uLmRhdGEuU2NvcmUuY291bnQgPT0gNFxuICAgICAgICAgIEJhbm5lci5wbGF5KCdmb3VyLW9mLWEta2luZCcpXG5cbiAgICAgICAgaWYgYWN0aW9uLmRhdGEuU2NvcmUuY291bnQgPT0gNVxuICAgICAgICAgIEJhbm5lci5wbGF5KCdmaXZlLW9mLWEta2luZCcpXG5cbiAgICAgICAgbnVtYmVyT2ZQYW5lbHMgPSBhY3Rpb24uZGF0YS5TY29yZS5jb3VudFxuICAgICAgICB0cmFucyA9IEB0cmFuc2xhdGVGcm9tTmV0d29ya1Jvd0NvbChhY3Rpb24uZGF0YS5TY29yZS5tLGFjdGlvbi5kYXRhLlNjb3JlLm4sYWN0aW9uLmRhdGEuU2NvcmUub3JpZW50YXRpb24pXG4gICAgICAgIGkgPSAwXG4gICAgICAgIHdoaWxlIGkgIT0gbnVtYmVyT2ZQYW5lbHNcbiAgICAgICAgICBpZiB0cmFucy5wb3NpdGlvbiA9PSBQYW5lbC5tb3ZlRGlyZWN0aW9ucy5MRUZUIG9yIHRyYW5zLnBvc2l0aW9uID09IFBhbmVsLm1vdmVEaXJlY3Rpb25zLlJJR0hUXG4gICAgICAgICAgICBwYW5lbCA9IEBnZXRQYW5lbCh0cmFucy5yb3csdHJhbnMuY29sK2kpXG4gICAgICAgICAgZWxzZSBpZiB0cmFucy5wb3NpdGlvbiA9PSBQYW5lbC5tb3ZlRGlyZWN0aW9ucy5UT1BcbiAgICAgICAgICAgIHBhbmVsID0gQGdldFBhbmVsKHRyYW5zLnJvdytpLHRyYW5zLmNvbClcbiAgICAgICAgICBpID0gaSsxXG4gICAgICAgICAgdHdlZW4gPSBAa2lsbFBhbmVsKHBhbmVsKVxuXG4gICAgICAgIHJldHVybiB0d2VlblxuXG5cbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2coXCJIYW5kbGVOZXR3b3JrQWN0aW9uPT4gQWN0aW9uXCIsIGFjdGlvbilcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSGFuZGxlTmV0d29ya0FjdGlvbj0+IFVuaGFuZGxlZCBBY3Rpb246IFwiICsgYWN0aW9uLnR5cGUpXG5cblxuICAgIGhhbmRsZU5ldHdvcmtHYW1lU3RhdGU6IChnYW1lU3RhdGUpPT5cbiAgICAgICNzZXRDdXJyZW50IHBsYXllclxuICAgICAgQGdhbWUuc2V0Q3VycmVudFBsYXllcihuZXcgUGxheWVyKGdhbWVTdGF0ZS5jdXJyZW50UGxheWVyLGdhbWVTdGF0ZS5jdXJyZW50UGxheWVyKSlcbiAgICAgIGdhbWVTdGF0ZSA9IGdhbWVTdGF0ZVxuICAgICAgI0lmIGFjdGlvbnMgaW4gdGhlIGdhbWVzdGF0ZVxuICAgICAgaWYgZ2FtZVN0YXRlLmFjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICBsYXN0VHdlZW4gPSBAaGFuZGxlTmV0d29ya0FjdGlvbnMoZ2FtZVN0YXRlLmFjdGlvbnMpXG5cbiAgICAgICAgaWYgbGFzdFR3ZWVuICE9IG51bGwgYW5kIGxhc3RUd2VlbiAhPSB1bmRlZmluZWRcbiAgICAgICAgICBsYXN0VHdlZW4ub25Db21wbGV0ZS5hZGQoKCktPlxuICAgICAgICAgICAgc2VsZiA9QFxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCktPlxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcGFpbnRcIilcbiAgICAgICAgICAgICAgc2VsZi5yZXBhaW50R2FtZWZpZWxkKGdhbWVTdGF0ZS5maWVsZClcbiAgICAgICAgICAgICwxMjAwKVxuICAgICAgICAgICxAKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIChcImhhbmRsZU5ldHdvcmtHYW1lU3RhdGU9PiBAaGFuZGxlTmV0d29ya0FjdGlvbnMgbXVzdCByZXR1cm4gYSBQaGFzZXIuVHdlZW4gXCIpXG5cbiAgICAjSGFuZGxlIGFsbCBtZXNzYWdlcyBmcm9tIHRoZSBTZXJ2ZXJcbiAgICBoYW5kbGVOZXR3b3JrTm90aWZpY2F0aW9uOiAobWVzc2FnZSk9PlxuICAgICAgaWYgbWVzc2FnZS5tc2cgPT0gXCJhIHBsYXllciBsZWF2ZSB0aGUgZ2FtZVwiXG4gICAgICAgIHBhbmVsVG9QbGFjZSA9IEBnZXRQYW5lbFRvUGxhY2UoKVxuICAgICAgICBwYW5lbFRvUGxhY2UuZGVzdHJveSgpXG4gICAgICAgIEBzZXRQYW5lbFRvUGxhY2UobnVsbClcblxuXG4gICAgI0hhbmRsZSB0aGUgcmVzcG9uc2Ugb2YgdGhlIG5ldHdvcmtcbiAgICAjQHBhcmFtIHthcnJheTxBY3Rpb24+fSBhY3Rpb25zICBBIEFycmF5IG9mIGFjdGlvbnNcbiAgICAjQHJldHVybiB7UGhhc2VyLlR3ZWVufG51bGx9IHJldHVybnMgdGhlIGxhc3QgdHdlZW4gb3IgaWYgYWN0aW9ucy5sZW5ndGggPT0gMCBudWxsXG4gICAgaGFuZGxlTmV0d29ya0FjdGlvbnM6IChhY3Rpb25zKT0+XG4gICAgICBzZWxmID0gQFxuICAgICAgaWYgYWN0aW9ucy5sZW5ndGggPT0gMFxuICAgICAgICByZXR1cm5cblxuXG5cbiAgICAgIHR3ZWVuID0gbnVsbFxuICAgICAgYWN0aW9uVG9DYWxsID0gYWN0aW9uc1swXVxuICAgICAgbmV4dEFjdGlvbiA9ICAoKSAtPlxuICAgICAgICBhY3Rpb25zLnJlbW92ZUJ5VmFsdWUoYWN0aW9uVG9DYWxsKVxuICAgICAgICBjb25zb2xlLmxvZyhcIkFDVElPTiBTVEFSVFwiKVxuICAgICAgICB0d2VlbiA9IHNlbGYuaGFuZGxlTmV0d29ya0FjdGlvbihhY3Rpb25Ub0NhbGwpXG4gICAgICAgIGlmIGFjdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICAgIGFjdGlvblRvQ2FsbCA9IGFjdGlvbnNbMF1cbiAgICAgICAgICBpZiB0d2VlbiAhPSBudWxsXG4gICAgICAgICAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoKS0+XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQUNUSU9OIEZJTlNDSEVEIFwiKVxuICAgICAgICAgICAgICBuZXh0QWN0aW9uKClcbiAgICAgICAgICAgICxAKVxuXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJoYW5kbGVOZXR3b3JrQWN0aW9ucz0+IEFjdGlvbiByZXR1cm4gbm8gdHdlZW4gISBcIilcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQUNUSU9OIEZJTkNIRUQoQUxMKVwiKVxuICAgICAgbmV4dEFjdGlvbigpXG5cbiAgICAgIHJldHVybiB0d2VlblxuXG4gICAgI0hhbmRsZSB0aGUgdXBkYXRlIG9mIHRoZSBvdGhlciBwbGF5ZXJzIHNsaWRlIHBvc2l0aW9uXG4gICAgaGFuZGxlTmV0d29ya1NsaWRlTmV3UGFuZWxQb3NpdGlvbjogKHNsaWRlUG9zaXRpb25VcGRhdGUpPT5cbiAgICAgIGlmIEB5b3VyVHVybigpXG4gICAgICAgIHJldHVyblxuXG4gICAgICB0cmFucyA9IEB0cmFuc2xhdGVGcm9tTmV0d29ya1Jvd0NvbChzbGlkZVBvc2l0aW9uVXBkYXRlLm0sc2xpZGVQb3NpdGlvblVwZGF0ZS5uKVxuICAgICAgI2NvbnNvbGUubG9nKFwiaGFuZGxlTmV0d29ya1NsaWRlTmV3UGFuZWxQb3NpdGlvblwiLCBzbGlkZVBvc2l0aW9uVXBkYXRlLHRyYW5zKVxuICAgICAgcGFuZWxUb1BsYWNlID0gQGdldFBhbmVsVG9QbGFjZSgpXG4gICAgICBpZiBwYW5lbFRvUGxhY2UgPT0gbnVsbCBvciBwYW5lbFRvUGxhY2UgPT0gdW5kZWZpbmVkXG4gICAgICAgIHRocm93IG5ldyBFcnJvciAoXCJQYW5lbCB0byBwbGFjZSBjYW50IGJlIG51bGwgb3IgdW5kZWZpbmVkXCIpXG5cbiAgICAgIHBhbmVsVG9QbGFjZS5zZXRQb3NpdGlvbk5laWdoYm91cih0cmFucy5yb3csdHJhbnMuY29sLHRyYW5zLnBvc2l0aW9uLEBnZXRCYWNrZ3JvdW5kUGFuZWwoKS5nZXRCb3VuZHMoKSlcblxuICAgIHJlcGFpbnRHYW1lZmllbGQ6IChmaWVsZCk9PlxuICAgICAgQHJlbW92ZUFsbCh0cnVlKVxuICAgICAgQGNyZWF0ZUdhbWVmaWVsZChmaWVsZClcblxuICAgICNUcmFuc2xhdGUgdGhlIHJvdyBjb2wgaW5kZXggaW50byBhIHNlcnZlciBzaWRlIGluZGV4XG4gICAgI0BwYXJhbSB7aW50fSByb3cgLSBUaGUgbG9jYWwgY29sXG4gICAgI0BwYXJhbSB7aW50fSBjb2wgLSBUaGUgbG9jYWwgcm93XG4gICAgI0BwYXJhbSB7UGFuZWwubW92ZURpcmVjdGlvbnN9IHBvc2l0aW9uIC0gVGhlIFBvc2l0aW9uIHRvIHNsaWRlIGluXG4gICAgI0ByZXR1cm4ge29iamVjdH0gQSBzaW1wbGUgb2JqZWN0IGxpa2U6IHttOiAxLCBuOjh9XG4gICAgdHJhbnNsYXRlVG9OZXR3b3JrUm93Q29sOihyb3csY29sLHBvc2l0aW9uKT0+XG4gICAgICBpZiBwb3NpdGlvbiA9PSBQYW5lbC5tb3ZlRGlyZWN0aW9ucy5MRUZUXG4gICAgICAgIG0gPSByb3crMVxuICAgICAgICBuID0gMFxuICAgICAgZWxzZSBpZiBwb3NpdGlvbiA9PSBQYW5lbC5tb3ZlRGlyZWN0aW9ucy5SSUdIVFxuICAgICAgICBtID0gcm93KzFcbiAgICAgICAgbiA9IEBnZXRTaXplKCkrMVxuICAgICAgZWxzZSBpZiBwb3NpdGlvbiA9PSBQYW5lbC5tb3ZlRGlyZWN0aW9ucy5UT1BcbiAgICAgICAgbSA9IDBcbiAgICAgICAgbiA9IGNvbCsxXG5cbiAgICAgIGNvbnNvbGUubG9nKG0sbilcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG06IG1cbiAgICAgICAgbjogblxuICAgICAgfVxuXG4gICAgI1RyYW5zbGF0ZSB0aGUgbmV0d29yayBtLCBuIGludG8gcm93IGNvbCxkaXJlY3Rpb24gY29tYmluYXRpb25cbiAgICAjQHBhcmFtIHtpbnR9IG0gLSBUaGUgbmV0d29yayBjb2xcbiAgICAjQHBhcmFtIHtpbnR9IG4gLSBUaGUgbmV0d29yayByb3dcbiAgICAjQHJldHVybiB7b2JqZWN0fSBBIHNpbXBsZSBvYmplY3QgbGlrZToge3JvdzogMSwgY29sOjgsIHBvc2l0aW9uOiBQYW5lbC5tb3ZlRGlyZWN0aW9ucy5MRUZ0fVxuICAgIHRyYW5zbGF0ZUZyb21OZXR3b3JrUm93Q29sOiAobSxuLG9yaWVudGF0aW9uID0gbnVsbCk9PlxuICAgICAgaWYgbiA9PSAwXG4gICAgICAgIHBvc2l0aW9uID0gUGFuZWwubW92ZURpcmVjdGlvbnMuTEVGVFxuICAgICAgICBjb2wgPSAwXG4gICAgICAgIHJvdyA9IG0tMVxuICAgICAgZWxzZSBpZiBuID09IEBnZXRTaXplKCkrMVxuICAgICAgICBwb3NpdGlvbiA9IFBhbmVsLm1vdmVEaXJlY3Rpb25zLlJJR0hUXG4gICAgICAgIGNvbCA9IG4tMlxuICAgICAgICByb3cgPSBtLTFcbiAgICAgIGVsc2UgaWYgbSA9PSAwXG4gICAgICAgIHBvc2l0aW9uID0gUGFuZWwubW92ZURpcmVjdGlvbnMuVE9QXG4gICAgICAgIHJvdyA9IDBcbiAgICAgICAgY29sID0gbi0xXG4gICAgICBlbHNlXG4gICAgICAgIHJvdyA9IG0tMVxuICAgICAgICBjb2wgPSBuLTFcblxuICAgICAgaWYgb3JpZW50YXRpb24gIT0gbnVsbCBhbmQgcG9zaXRpb24gPT0gdW5kZWZpbmVkXG4gICAgICAgIGlmIG9yaWVudGF0aW9uID09ICd2ZXJ0aWNhbCdcbiAgICAgICAgICBwb3NpdGlvbiA9IFBhbmVsLm1vdmVEaXJlY3Rpb25zLlRPUFxuICAgICAgICBlbHNlIGlmIG9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJ1xuICAgICAgICAgIGlmIGNvbCA9PSAwXG4gICAgICAgICAgICBwb3NpdGlvbiA9IFBhbmVsLm1vdmVEaXJlY3Rpb25zLkxFRlRcbiAgICAgICAgICBlbHNlIGlmIGNvbCA9PSAgQGdldFNpemUoKS0xXG4gICAgICAgICAgICBwb3NpdGlvbiA9IFBhbmVsLm1vdmVEaXJlY3Rpb25zLlJJR0hUXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcG9zaXRpb24gPSBQYW5lbC5tb3ZlRGlyZWN0aW9ucy5SSUdIVFxuXG4gICAgICBpZiByb3cgPT0gdW5kZWZpbmVkICBvciBjb2wgPT0gdW5kZWZpbmVkICBvciBwb3NpdGlvbiA9PSB1bmRlZmluZWRcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIChcIlVua25vd24gaW5wdXRcIilcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcm93OiByb3dcbiAgICAgICAgY29sOiBjb2xcbiAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICB9XG5cblxuICAgICNSZXR1cm5zIHRoZSBib3VuZHMgb2YgdGhlIGZpcnN0IGNoaWxkcmVuIG9yIGEgMCBib3VuZHMgb2JqZWN0c1xuICAgICNAcmV0dXJucyB7UGhhc2VyLkJvdW5kc30gc1xuICAgIGdldERlZmF1bHRQYW5lbEJvdW5kczooKT0+XG4gICAgICBpZiBAY2hpbGRyZW4ubGVuZ3RoID4gMFxuICAgICAgICByZXR1cm4gQGNoaWxkcmVuWzBdLmdldEJvdW5kcygpXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGVmdDogMFxuICAgICAgICAgIHRvcDogMFxuICAgICAgICAgIHdpZHRoOiAwXG4gICAgICAgICAgaGVpZ2h0OiAwXG4gICAgICAgIH1cblxuIl19
