Components
==========

Files in this directory represent dumb components which render themselves to DOM, and expose high level event listeners which BCUploader can exploit to coordinate uploads as a whole.


## Overview

Here's a block diagram of the logical hierarchy between the components:

```

 -------------------------------------------------------
 |                    Root                             |
 |     ------------------------------------------      |
 |     |              Error                     |      |
 |     ------------------------------------------      |
 |                                                     |
 |     ------------------------------------------      |
 |     |              Preview                   |      |
 |     ------------------------------------------      |
 |                                                     |
 |     ------------------------------------------      |
 |     |                                        |      |
 |     |                                        |      |
 |     |              Landing                   |      |
 |     |                                        |      |
 |     |                                        |      |
 |     |                                        |      |
 |     ------------------------------------------      |
 |                                                     |
 |     ------------------------------------------      |
 |     |              Video                     |      |
 |     ------------------------------------------      |
 |                                                     |
 |     ------------------------------------------      |
 |     |              Video                     |      |
 |     ------------------------------------------      |
 |                                                     |
 -------------------------------------------------------

```

### Root Component

This component is a container for the other components. It
can have child components to added to it, or removed from it.

### Error

Displays errors related to the `createVideoEnpoint` or other problems
not specific to the upload of one video. Initially hidden.

### Preview

Shows the video uploaded (if possible) when clicked on by the user.
By default this is an overlay div that is initially empty and hidden.

### Landing

This component is where the upload process begins. A user drags
n drops or selects a file from the input. Appropriate event handlers
fire (which BCUploader should hook into).

### Video

Once a file is chosen, a new Video component is added to track the
upload progress and perhaps allow a preview to happen.

## Common API

### `render()`

All components have a `render()` method, which causes everything inside
the component to be updated. Calling `render()` on root causes all its
child components to be rendered.

 * returns: DOM node
