<h1>RTC Call Iframe API</h1>

The api is developed on typescript, compiled and package with webpack

Supports Events, Commands and functions

1. Events are broadcasted by the server for calls. Can target a participant too. Integrating application subscribes to the events and provides there handlers as the event callbacks

2. Commands are sent to the server from integrating applications. includes commands to change call title, subtitle, user avatar url, user displayName, join and end/leave a call.

3. Functions are requests for data sent to the server. Includes requests to get call information, participant's information.
