# BubbleText
## What is it?
BubbleText is one of the first [bits-enabled](https://www.twitch.tv/bits) [Twitch](https://www.twitch.tv) extensions.
<br>
It provides unique interactive experience by allowing viewers to spawn custom animated speech bubbles on the broadcast.
## How does it look like?
Well, nothing would explain that better than the extension itself. However, due to some miscommunication and budget problems with Twitch, we decided to disable the extension.
<br>
But don't worry, we've got something to show you!
<br>
First, here is a [link](https://docs.google.com/presentation/d/1VBK1vg7c7W_qkOp95eZPibhwEC2Tqm8TAlZolsdLeQ8/edit?usp=sharing) to our awesome presentation that neatly showcases all the functionality and design patterns of the extension.
<br>
Secondly, you can run the app locally using instruction from [frontend](#frontend-part) and [backend](#backend-part) sections.

## Why not other tools?
One might ask: there are simillar tools like *streamlabs*, how is **BubbleText** superior to those? Here is the answer:

* It provides **in-platform** experience by being usable directly through Twitch.
* Every interaction is highly **dinamic** and **customizable**.
* BubbleText has direct effect on the stream.
* Isn't it fun to make your favorite streamer "say" something?

## Usage
This repo contains both front- and back-end parts of the extension.
<br>
### Frontend part
BubbleText extension frontend was solely developed by @Ciberusps.<br>
Thanks to him as our extension has an outstanding appearance and truly intuitive UX.
<br>
It was developed with [React](https://reactjs.org/) with Webpack and Babel. <br>
All relevant files/instructions can be found under `frontend_extension` directory.
### Backend part
All the server-side code is located under `backend/server` directory. You can also find `backend/serverenv` directory helpful as it contains python virtualenv to run the server locally.
<br>
Original app was deployed on [AWS EB](https://aws.amazon.com/elasticbeanstalk/).
<br>
To run the app locally:
```
cd backend/server
make run 
```
All the log files are located under `backend/server/logs`.
<br>
To clean log files:
```
cd backend/server
make clean
```
Server provides API JWT-protected endpoints, tutorial website reachable at `localhost:5000/tutorial?streamerId=<id>` and communication with [MongoDB](https://www.mongodb.com/) running locally OR based on remote URI (see `backend/server/settings/mongo_settings.py`).

## Contact information
You can reach me [here](https://www.facebook.com/dkubatko) or by email at dankubatko@gmail.com.
<br>
Pavel's contact information is available in his [portfolio](https://ciberus-site.firebaseapp.com/).
