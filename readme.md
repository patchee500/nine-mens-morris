Nine Men's Morris in JS
=================

See the Demo at:

http://patchee500.github.io/nine-mens-morris/

Please make sure that your browser supports WebGL.
If you are not sure if your browser supports WebGL you can check here:
http://www.doesmybrowsersupportwebgl.com/

Also consider, that some browsers may block the texture of the game board
when you open your application via "localhost/..." or "file:///".
(Chrome was once such a candidate)

In order to get all browsers to show the texture, you will have to put
the application on a webserver and access it via "http://..."

The following list includes things I always wanted to add but never had the time to:

* rework performance (make the whole thing OOP, including proper events/listeners)
* add some nice background image
* beautify dialogs and throw away those ugly jquery-ui components
* prettify mill stones
* use trackball controls for camera movement
* add a warning in case somebody uses a browser that doesn't support WebGL
* don't clip drawable stones into positions too far away
* translate code into English

Have fun playing!
