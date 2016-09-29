Online Simon Game
===

Synopsis
---
This is one of a series of projects for the front-end program of **[freeCodeCamp](http://www.freecodecamp.com/)**. The goal is to build an app that replicates the classic game Simon. The project rubric is as follows:

+ Objective: Build a CodePen.io app that is functionally similar to this: http://codepen.io/FreeCodeCamp/full/obYBjE.
+ Rule #1: Don't look at the example project's code. Figure it out for yourself.
+ Rule #2: Fulfill the below user stories. Use whichever libraries or APIs you need. Give it your own personal style.
+ User Story: I am presented with a random series of button presses.
+ User Story: Each time I input a series of button presses correctly, I see the same series of button presses but with an additional step.
+ User Story: I hear a sound that corresponds to each button both when the series of button presses plays, and when I personally press a button.
+ User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.
+ User Story: I can see how many steps are in the current series of button presses.
+ User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.
+ User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.
+ User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.


App Link
---
Access the page **[here](http://genkibit.github.io/fcc-simon/)**.


License
---
+ Simon is a trademark of Hasbro.
+ Unless otherwise noted, game source files is available under an  **[MIT license](https://github.com/genkibit/fcc-simon/blob/gh-pages/LICENSE.md)**.


Attribution
---
+ Teko font via **[Google Fonts](https://www.google.com/fonts)**.


Notes / Issues
---
+ Game runs best on current versions of Chrome, Firefox and Safari. It does not support Internet Explorer.
+ HTML5 audio is too laggy, so the game use the **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)**.
+ Audio does not load at times. Resolve this by toggling the power.


Changelog
---
+  20160917 -- v1.0.0
  - Initial release.