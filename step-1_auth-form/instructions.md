## step 1: auth form

<b>The goal is to create a form to allow us to login.</b> <br> We start with a static view of a form, without of any state, but with all the necessary view elements present.

##### a) allow user to type registration info into text boxes, and save input in state
##### b) enable "register" button when form is valid
##### c) react to "register" button press by submitting registration info (using thinker sdk) and displaying error message (or console-logging success)
##### d) react to second button press by switching to "login" mode, hiding the "repeat password input" and submitting information to the login api instead
##### e) show spinner while waiting for a response.