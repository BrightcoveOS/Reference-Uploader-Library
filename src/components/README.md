Components
==========

Files in this directory represent dumb components which render themselves to DOM, and expose high level event listeners which BCUploader can exploit to coordinate uploads as a whole.


## Overview

Here's a block diagram of the logical hierarchy between the components:

```

 -------------------------------------------------------
 |                    Root                             |
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

### `dispose()`

Causes the component to deregister all event handlers and remove itself from the DOM.
