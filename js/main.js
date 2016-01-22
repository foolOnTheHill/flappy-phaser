"use strict";

var height = window.innerHeight - 30;
var width = window.innerWidth;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game');

var main = {
  preload: function() {
    this.game.load.image('font_0', 'assets/font_big_0.png');
    this.game.load.image('font_1', 'assets/font_big_1.png');
    this.game.load.image('font_2', 'assets/font_big_2.png');
    this.game.load.image('font_3', 'assets/font_big_3.png');
    this.game.load.image('font_4', 'assets/font_big_4.png');
    this.game.load.image('font_5', 'assets/font_big_5.png');
    this.game.load.image('font_6', 'assets/font_big_6.png');
    this.game.load.image('font_7', 'assets/font_big_7.png');
    this.game.load.image('font_8', 'assets/font_big_8.png');
    this.game.load.image('font_9', 'assets/font_big_9.png');

    this.game.load.image('font_small_0', 'assets/font_small_0.png');
    this.game.load.image('font_small_1', 'assets/font_small_1.png');
    this.game.load.image('font_small_2', 'assets/font_small_2.png');
    this.game.load.image('font_small_3', 'assets/font_small_3.png');
    this.game.load.image('font_small_4', 'assets/font_small_4.png');
    this.game.load.image('font_small_5', 'assets/font_small_5.png');
    this.game.load.image('font_small_6', 'assets/font_small_6.png');
    this.game.load.image('font_small_7', 'assets/font_small_7.png');
    this.game.load.image('font_small_8', 'assets/font_small_8.png');
    this.game.load.image('font_small_9', 'assets/font_small_9.png');

    this.game.load.image('medal_bronze', 'assets/medal_bronze.png');
    this.game.load.image('medal_silver', 'assets/medal_silver.png');
    this.game.load.image('medal_gold', 'assets/medal_gold.png');
    this.game.load.image('medal_platinum', 'assets/medal_platinum.png');

    this.game.load.image('sky', 'assets/sky.png');

    this.game.load.image('land', 'assets/land.png');
    this.game.load.image('pipe-up', 'assets/pipe-up.png');
    this.game.load.image('pipe-down', 'assets/pipe-down.png');
    this.game.load.image('pipe', 'assets/pipe.png');

    this.game.load.image('scoreboard', 'assets/scoreboard.png');
    this.game.load.image('replay', 'assets/replay.png');

    this.game.load.image('splash', 'assets/splash.png');

    this.game.load.spritesheet('bird', 'assets/bird.png', 34, 24);

    this.game.load.audio('die', 'assets/sounds/sfx_die.ogg');
    this.game.load.audio('hit', 'assets/sounds/sfx_hit.ogg');
    this.game.load.audio('point', 'assets/sounds/sfx_point.ogg');
    this.game.load.audio('fly', 'assets/sounds/sfx_wing.ogg');
  },
  create: function() {
    this.scale = height/500;

    this.dieSound = this.game.add.sound('die');
    this.pointSound = this.game.add.sound('point');
    this.hitSound = this.game.add.sound('hit');
    this.flySound = this.game.add.sound('fly');

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 750*this.scale;

    this.game.stage.backgroundColor = 0x4ec0ca;

    this.game.world.setBounds(0, 0, 1.5*width, height);

    this.setBackground();

    this.player = this.game.add.sprite(80*this.scale, this.game.world.height/2, 'bird');

    this.player.anchor.setTo(-0.2, 0.5);
    this.player.scale.setTo(this.scale, this.scale);

    this.player.alive = true;

    this.player.animations.add('flap', [0, 1, 2, 3], 8, true);
    this.player.animations.play('flap');

    this.game.physics.arcade.enable(this.player);
    this.player.body.allowGravity = false;

    this.tutorialImage = this.game.add.image(width/2, this.game.world.height/2 - 35*this.scale, 'splash');
    this.tutorialImage.scale.setTo(this.scale, this.scale);
    this.tutorialImage.anchor.setTo(0.5, 0.5);

    this.tutorial = true;

    this.pipes = this.game.add.group();
    this.pipes.createMultiple(20, 'pipe');

    this.pipes_up = this.game.add.group();
    this.pipes_up.createMultiple(10, 'pipe-down');

    this.pipes_down = this.game.add.group();
    this.pipes_down.createMultiple(10, 'pipe-up');

    this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.previous_y = null;
    this.score = 0;

    if (typeof(Storage) !== "undefined") {
      this.highscore = window.localStorage.getItem('flappyjs');
    } else {
      this.highscore = 0;
    }

    this.digits = [];
  },
  setBackground:function() {
    var x = 0;
    while (x < width) {
      var b = this.game.add.image(x, this.game.world.height - 109*this.scale, 'sky');
      b.scale.setTo(this.scale, this.scale);
      x += 276*this.scale;
    }
  },
  addPipes: function() {
    var rand = Math.random()*height/2 + 200*this.scale;

    var y = this.previous_y ? Math.min(rand, 1.7*this.previous_y) : rand;
    this.previous_y = y;

    var distance = 120;
    var vx = -200*this.scale;

    var p1 = this.pipes.getFirstDead();
    if (p1) {
      p1.reset(width, 0);
      p1.scale.setTo(this.scale, this.scale);
      p1.height = y - distance*this.scale;

      this.game.physics.arcade.enable(p1);
      p1.body.allowGravity = false;
      p1.body.velocity.x = vx;
    }

    var pu = this.pipes_up.getFirstDead();
    if (pu) {
      pu.reset(width, y - distance*this.scale);
      pu.scale.setTo(this.scale, this.scale);

      this.game.physics.arcade.enable(pu);
      pu.body.allowGravity = false;
      pu.body.velocity.x = vx;

      pu.count = false;
    }

    var pd = this.pipes_down.getFirstDead();
    if (pd) {
      pd.reset(width, y);
      pd.scale.setTo(this.scale, this.scale);

      this.game.physics.arcade.enable(pd);
      pd.body.allowGravity = false;
      pd.body.velocity.x = vx;
    }

    var p2 = this.pipes.getFirstDead();
    if (p2) {
      p2.reset(width, y + 25*this.scale);
      p2.scale.setTo(this.scale, this.scale);
      p2.height = height - 100;

      this.game.physics.arcade.enable(p2);
      p2.body.allowGravity = false;
      p2.body.velocity.x = vx;
    }
  },
  updateScore: function() {
    this.pointSound.play();

    this.score += 1;
    this.updateScoreText();
  },
  updateScoreText: function() {
    this.setScoreText();
  },
  setScoreText: function() {
    var text = String(this.score);
    var totalWidth = this.scale * 24 * text.length;
    var posX = width/2 - totalWidth/2;

    if (text.length === this.digits.length) {
      for (var i = 0; i < text.length; i++) {
        if (this.digits[i].key[5] != text[i]) {
          this.digits[i].loadTexture('font_'+text[i]);
        }
      }
    } else {
      for (var i = 0; i < this.digits.length; i++) {
        this.digits[i].destroy();
      }

      this.digits = [];
      for(var i = 0; i < text.length; i++) {
        var d = this.game.add.image(posX, 50 * this.scale, 'font_'+text[i]);
        d.scale.setTo(this.scale, this.scale);
        this.digits.push(d);
        posX += 24 * this.scale;
      }
    }
  },
  jump: function() {
    if (!this.flySound.isPlaying) this.flySound.play();

    this.player.body.velocity.y = -220*this.scale;
    this.game.add.tween(this.player).to({angle: -25}, 150).to({angle: 0}, 350).start();
  },
  update: function() {

    if (this.tutorial) {
      if (this.space.isDown || this.game.input.mousePointer.isDown || this.game.input.pointer1.isDown) {
        this.tutorial = false;
        this.tutorialImage.destroy();

        this.setScoreText();

        this.player.body.allowGravity = true;
        this.jump();

        this.timer = this.game.time.events.loop(1100, this.addPipes, this);
      } else {
        return;
      }
    }

    if (!this.player.alive) return;

    if (!this.player.inWorld) this.gameOver();

    if (this.space.isDown || this.game.input.mousePointer.isDown || this.game.input.pointer1.isDown) {
      this.jump();
    } else if (this.player.angle === 0){
      this.game.add.tween(this.player).to({angle: 50}, 350).start();
    }

    this.game.physics.arcade.overlap(this.pipes, this.player, this.gameOver, null, this);
    this.game.physics.arcade.overlap(this.pipes_up, this.player, this.gameOver, null, this);
    this.game.physics.arcade.overlap(this.pipes_down, this.player, this.gameOver, null, this);

    this.pipes_up.forEachAlive(function(p) {
      if (p.x < this.player.x && !p.count) {
        this.updateScore();
        p.count = true;
      } else if (p.x < -p.width) {
        p.kill();
      }
    }, this);

    this.pipes.forEachAlive(function(p) {
      if (p.x < -p.width) p.kill();
    }, this);

    this.pipes_down.forEachAlive(function(p) {
      if (p.x < -p.width) p.kill();
    }, this);
  },
  gameOver: function() {
    if (!this.player.alive) return;

    this.hitSound.play();

    this.player.alive = false;

    this.game.time.events.remove(this.timer);

    this.pipes.forEachAlive(function(p) {
      p.body.velocity.x = 0;
    });
    this.pipes_up.forEachAlive(function(p) {
      p.body.velocity.x = 0;
    });
    this.pipes_down.forEachAlive(function(p) {
      p.body.velocity.x = 0;
    });

    this.dieSound.play();

    this.player.body.velocity.y = -250*this.scale;
    this.game.add.tween(this.player).to({angle: 0}, 100).to({angle: -25}, 100).to({angle:50}, 300).start();

    this.startGameOverScreen();
  },
  saveHighScore: function() {
    this.highscore = Math.max(this.highscore, this.score);
    if (typeof(Storage) !== "undefined") {
      window.localStorage.setItem('flappyjs', this.highscore);
    }
  },
  startGameOverScreen: function() {

    for (var i = 0; i < this.digits.length; i++) {
      this.digits[i].destroy();
    }

    this.scoreBoard = this.game.add.sprite(width/2, this.game.world.height/2 + 20*this.scale, 'scoreboard');
    this.scoreBoard.scale.setTo(this.scale, this.scale);
    this.scoreBoard.anchor.setTo(0.5, 0.5);

    var medalType;
    if (this.score >= 2*this.highscore) {
      medalType = 'medal_platinum';
    } else if (this.score > this.highscore) {
      medalType = 'medal_gold';
    } else if (this.score == this.highscore) {
      medalType = 'medal_silver';
    } else {
      medalType = 'medal_bronze';
    }

    this.medal = this.game.add.image(width/2 - 65*this.scale, this.game.world.height/2 + 14*this.scale, medalType);
    this.medal.anchor.setTo(0.5, 0.5);
    this.medal.scale.setTo(this.scale, this.scale);

    this.replay = this.game.add.sprite(width/2, this.game.world.height/2 + 118*this.scale, 'replay');
    this.replay.scale.setTo(this.scale, this.scale);
    this.replay.anchor.setTo(0.5, 0.5);

    this.replay.inputEnabled = true;
    this.replay.events.onInputDown.add(this.restartLevel, this);

    this.saveHighScore();

    var scoreText = String(this.score);
    var posX = width/2 + 87*this.scale;

    for (var i = scoreText.length-1; i >= 0; i--) {
      var d = this.game.add.sprite(posX, this.game.world.height/2 - 5*this.scale, 'font_small_'+scoreText[i]);
      d.anchor.setTo(0.5, 0.5);
      d.scale.setTo(this.scale, this.scale);
      posX -= 12*this.scale;
    }

    scoreText = String(this.highscore);
    posX = width/2 + 87*this.scale;
    for (var i = scoreText.length-1; i >= 0; i--) {
      var d = this.game.add.sprite(posX, this.game.world.height/2 + 35*this.scale, 'font_small_'+scoreText[i]);
      d.anchor.setTo(0.5, 0.5);
      d.scale.setTo(this.scale, this.scale);
      posX -= 12*this.scale;
    }
  },
  restartLevel: function() {
    this.game.state.restart();
  }
};
game.state.add('main', main);
game.state.start('main');
