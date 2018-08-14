(function() {
  
  'use strict';

  // For light pads and controls
  var $padNodes = $('.pad');
  var $lightNodes = $('.effect');
  var $panelNodes = $('.panel');
  var $count = $('#count');
  var pattern = ['0', '1', '2', '3', '0', '1', '2', '3', '0', '1', '2', '3', '0', '1', '2', '3', '0', '1', '2', '3'];
  var index = 0;
  var turn = 1;
  var rate = 1000;

  // For game states
  var loop;
  var iterate = false;
  var btnOn = false;
  var pwrOn = false;
  var strictOn = false;
  var gameOver = true;

  // For sound effects
  var sf = document.getElementById('sound-effects');
  var blueUrl = 'assets/sound/blue';
  var greenUrl = 'assets/sound/green';
  var yellowUrl = 'assets/sound/yellow';
  var redUrl = 'assets/sound/red';
  var xUrl = 'assets/sound/wrong';
  var sfObj = {};
  var audioCtx;
  var bufferLoader;

  // Lights up a panel
  function light_effect(padNum, dur) {
    $lightNodes[padNum].classList.toggle('effect-01');
    window.setTimeout(function() {
      $lightNodes[padNum].classList.toggle('effect-01');
    }, dur);
  }

  // Constructor for Web Audio (source: http://www.html5rocks.com/en/tutorials/webaudio/intro/)
  function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = [];
    this.loadCount = 0;
  }
  BufferLoader.prototype = {
    loadBuffer: function(url, index) {
      var loader = this;
      
      // Load buffer asynchronously
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      
      request.onload = function() {
        
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
          request.response,
          function(buffer) {
            if (!buffer) {
              alert('error decoding file data: ' + url);
              return;
            }
            loader.bufferList[index] = buffer;
            if (++loader.loadCount == loader.urlList.length)
              loader.onload(loader.bufferList);
          },
          function(error) {
            console.error('decodeAudioData error', error);
          }
        );
      };
      request.onerror = function() {
        alert('BufferLoader: XHR error');
      };
      request.send();
    },
    
    load: function() {
      for (var i = 0; i < this.urlList.length; ++i)
      this.loadBuffer(this.urlList[i], i);
    }
  };

  // Selects appropriate audio format
  function get_fmt_extension(sf) {
    var extension;
    
    if (sf.canPlayType('audio/mp3') !== '') {
      extension = '.mp3';
    } else if (sf.canPlayType('audio/ogg') !== '') {
      extension = '.ogg';
    }
    return extension;
  }

  // Callback for BufferLoader()
  function finishedLoading(bufferList) {
    sfObj['0'] = bufferList[0];
    sfObj['1'] = bufferList[3];
    sfObj['2'] = bufferList[2];
    sfObj['3'] = bufferList[1];
    sfObj['x'] = bufferList[4];
  }

  // Initializes Web Audio API
  function init_audio() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    var sfArray = [
      greenUrl + get_fmt_extension(sf),
      redUrl + get_fmt_extension(sf),
      yellowUrl + get_fmt_extension(sf),
      blueUrl + get_fmt_extension(sf),
      xUrl + get_fmt_extension(sf)
    ];
    
    bufferLoader = new BufferLoader(audioCtx, sfArray, finishedLoading);
    bufferLoader.load();
  }

  // Plays the sound effect
  function play_sound(colorNum) {
    var gainNode = audioCtx.createGain();
    var sound = audioCtx.createBufferSource();
    
    sound.buffer = sfObj[colorNum];
    sound.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0.05;
    sound.start(0);
  }

  // Randomizes the pad pattern using Fisher-Yates algorithm
  function randomize(array) {
    var i, j, temp;
    
    for (i = array.length - 1; i > 0; i--){
      j = Math.floor(Math.random() * (i+1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  // Runs the current pad sequence each round
  function run_sequence() {
    
    // If user clicks power button while a sequence is running
    if (pwrOn === false) {
      pwrOn = true;
      toggle_power();
      return false;
    }
    
    btnOn = false;
    iterate = true;
    $count.val(turn);
    play_sound(pattern[index]);
    light_effect(pattern[index], 300);
    
    if (index + 1 === turn) {
      index = 0;
      btnOn = true;
      iterate = false;
    }
    else {
      index++;
    }
    
    if (iterate === true && pwrOn === true) {
      loop = window.setTimeout(run_sequence, rate);
    }
  }

  // Soft resets game parameters
  function reset() {
    pattern = randomize(pattern);
    index = 0;
    btnOn = false;
    strictOn = strictOn || false;
    $count.val('- -');
  }

  // Starts the game
  function start () {
    reset();
    gameOver = false;
    turn = 1;
    run_sequence();
  }

  // Hard resets game parameters
  function toggle_power() {
    pwrOn = !pwrOn;

    if (pwrOn === true) {
      init_audio();
      strictOn = false;
      gameOver = true;
      $count.val('- -');
    }
    else {
      window.clearTimeout(loop);
      iterate = false;
      gameOver = true;
      $count.val('');
    }
  }

  // Checks matching of pad presses with current pattern sequence
  function compare(input) {

    if (pattern[index] === input && gameOver === false) {
      play_sound(input);
      light_effect(input, 300);
      index++;
      
      if (turn === 20 && index === turn) {
        $count.val('You Win!');
        gameOver = true;
        btnOn = false;
      }
      else if (index === turn) {
        index = 0;
        btnOn = false;
        turn++;
        
        switch (turn) {
          case 5:
            rate = 800;
            break;
          case 9:
            rate = 600;
            break;
          case 13:
            rate = 400;
            break;
        }
        window.setTimeout(run_sequence, 1500);
      }
    }
    else {
      play_sound('x');
      light_effect(input, 2000);
      btnOn = false;
      
      if (strictOn === true) {
        $count.val('!!');
        gameOver = true;
      }
      else {
        $count.val('Try Again');
        index = 0;
        window.setTimeout(run_sequence, 2500);
      }
    }
  }
  
  // Event listeners for pads
  $padNodes.each(function() {
    $(this).on('click', function() {
      if (btnOn === true && pwrOn === true) {
        compare($(this).val());
      }
    });
  });

  // Event listeners for control panel buttons
  $panelNodes.each(function() {
    $(this).on('click', function() {
      var btnVal = $(this).val();
      
      if (btnVal === 'power') {
        toggle_power();
      }
      
      if (pwrOn === true && gameOver === true) {
        if (btnVal === 'start') {
          start();
        }
        else if (btnVal === 'mode') {
          strictOn = !strictOn;
          
          if (strictOn) {
            $count.val('strict');
          }
          else {
            $count.val('easy');
          }
          
        }
        else {
          return;
        }
      }
    });
  });


  $count.val('');

  // Quick and dirty way to avoid FOUC
  $(document).ready($('body').animate({ opacity: 1 }, 1500));

})();
