pomodorojs
===

Well, I got fed up with all the solutions available publicly.
What I needed was a command line app that does not get in my way.
Also, keeping in mind the fact that there is some actual work to be done, I decided to keep it as lean as possible, without any gold-plating or excess.

Features
---

They are mainly things I actually previously coded up using Bash (:heart:) while using [tomato.es](http://tomato.es/) (:heart::heart::heart: the best one out there) are:
- having access to the current pomdoro/break state (how much time is left),
- playing sounds on starting/finishing a pomodoro,
- displaying simple notifications on starting/finishing a pomodoro (mainly so that I can easily discern whether I deserve an 05:00 or a 15:00),
- changing my availability on Pidgin so that nobody bothers me while I should be very vey busy,
- tagging (this is an absolutely *awesome* feature of [tomato.es](http://tomato.es/) which I fell in love with after some time).

The current time-state of the pomodoro is being written to a `statefile` every second while` pomodorojs` is running.
I'm `cat`ing it to [xmobar](http://projects.haskell.org/xmobar/).

As to tagging and storing pomdoro data, the information is being output to a `statsfile`.
The format is `DATE\tTAG1,TAG2,..,TAGN`.
There can be zero or more tags.
It has to be noted that the comma-separated format is not enforced (You can write whatever as tags) but it is the only one currently supported.

Dependencies
---

Also, I wanted the app to be absolutely hassle free to use (on my Linux and with the packages I had at my disposal at the time).

Consequently, the dependencies are as follows:
- `mpg123` for beeping and booping,
- `purple-remote` for changing your availability on Pidgin,
- `libnotify` for showing notifications,
- `dialog` for asking to enter the tags.

I have not yet tested the app on a system without those dependencies - who knows, maybe it will even WORK!?

Usage and management
---

```bash
git clone git@github.com:elkorn/pomodorojs.git
sudo ln -s /path/to/pomodorojs/index.js /usr/local/bin/pomodorojs

pomodorojs
# GET TO WORK!
```

The second part of hassle-freedom is delegating the app management to Linux:
- `SIGINT` causes the application to revert any relevant state it has introduced (restore Pidgin status, write '--:--' as the current pomodoro time-state).
- `SIGSTOP` pauses the current pomodoro/break. Don't do this, it's against the rules of pomodoro!
- `SIGCONT` starts up a paused pomodoro.

Example process mgmt:

```bash
kill -STOP $(pidof pomodorojs)
kill -CONT $(pidof pomodorojs)
kill -INT $(pidof pomodorojs)
```

Command line arguments
--- 

```
(no args)           Start pomodoroing.
-t, -today          Display pomodoros done today.
--t=N, --time=N     Display pomodoros done N days from now. Sensible values: N<=0 e.g. N=0 - today, N=-1 - yesterday.
--tags=a,b,c...     Only show pomodoros having any of the specified tags.
-n,-numberonly      Only show the number of pomodoros.
```
todo
---

It works and is stable (I'm using it practically everyday), but is totally unpolished.
All the stuff that I'm planning to do to it (sooner or later) is in the [issues](https://github.com/elkorn/pomodorojs/issues).
