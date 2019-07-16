### Connect Four

This is the classic two-player game of Connect Four, or Four-in-a-row.

Only one package was used (socket.io) in order to connect the front end to the node backend. Otherwise, this was created entirely with vanilla javascript.

The client and server both have been containerised using Docker.

You can visit `http://connect-four.live` to try the game out. You will need an opponent to join you online, or you can open another browser window (preferably with a different browser so that you can use different usernames without having to clear the local storage).

Or, you can copy the `docker-compose.yml` and, provided you have Docker installed on your computer, run `docker-compose up` from the location where you placed the `docker-compose.yml` file. The game will be then be available on `http://localhost`.