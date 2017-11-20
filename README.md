### s03x00: The Story

Wyzard is my proudest and favorite personal project. It started many years ago as the final step in obtaining my ***Certificate of Higher Education*** in ***Software Development***. Wyzard 1.0 was [PHP](http://www.php.net/) and [MySQL](https://www.mysql.com/) (long before [Oracle](https://www.oracle.com) and [MariaDB](https://mariadb.org/) showed up), plain and simple. Big, old, unsplitted code. Back then, I didn't even know what an ORM, MVC, i18n or SPA was! I was happy with my monolithic monstruosity up and running. Years later, after finishing my ***Degree*** in ***Software Engineering***, I decided to rework it and using the most modern technologies at the time: frameworks and MVC pattern. So I did it, using PHP [Symfony2](http://symfony.es/) framework and MySQL [Doctrine](http://www.doctrine-project.org/) ORM. That was Wyzard 2.0, and it lasted almost a year in production inside my humble RaspberryPI home server. Then, after my ***Master's Degree*** in ***Intelligent Systems*** and as my skills as a web developer were increasing, my interests in other technologies did too, so the last rework was finally clear. Here it is, Wyzard 3.0 with [JavaScript](https://www.javascript.com/), MVVM and [MongoDB](https://www.mongodb.com). The app a full-stack developer finally deserve. And this article describes it. ***The Third Season*** is here.

![VueJS 2.5.3](https://img.shields.io/badge/VueJS-2.5.3-brightgreen.svg) ![MuseUI 2.10.0](https://img.shields.io/badge/MuseUI-2.10.0-brightgreen.svg) ![Firebase 4.6.2](https://img.shields.io/badge/Firebase-4.6.2-brightgreen.svg)

### s03x01: The Idea

A long long time ago, even before finishing school, I used to play an old web browser game called ***Archmage*** with my friends. It has no graphics, no images, only text and numbers. A whole server of registered users tried to kill each other and survive enought time to win being the top1 ranked when the ***apochalypse*** finally arrived. With resource management and a turn based mechanism, spending resources must be done wisely in order to take advantage over other players. I always liked the ***simple-to-learn-but-hard-to-master*** idea of oldschool games. And wanted to do it on my own.

### s03x02: The Technology

* [Pug](https://pugjs.org) (formerly known as Jade) as ***HTML5*** preprocessor
* [Stylus](http://stylus-lang.com/) as ***CSS3*** preprocessor
* [VueJS](https://vuejs.org/) as [MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) ***JS*** framework
* [MuseUI](http://www.muse-ui.org) as [Material Design](https://material.io) ***UI*** framework
* [RPGAwesome](https://nagoshiashumari.github.io/Rpg-Awesome/) as ***icon*** library
* [Raleway](https://fonts.google.com/specimen/Raleway) as text ***font***
* [Pixel Art](https://en.wikipedia.org/wiki/Pixel_art) as ***image*** source
* [Firebase](https://firebase.google.com) as [MongoDB](https://www.mongodb.com) NoSQL ***database***
* [Karma](https://karma-runner.github.iohttps://mochajs.org/) and [Mocha](https://mochajs.org/) as ***testing*** framework
* [Visual Studio Code](https://code.visualstudio.com/) as ***IDE***

### 03x03: The Backend

Actually, I don't have one. For real. Seriously. Stop laughing! When I first discovered ***Firebase*** and its ***Cloud Functions***, I said: "*Wait, what? I don't need to setup a server for my code, not even NodeJS? Or my database? My auth provider? My production deploys? My CI building process? My stored media? My realtime engine? My SSL certificates? My SMPT services?*" Seems I don't. I formatted my old RPI, switched to MongoDB, embraced real time databases, and never looked back. If I really need backend code, I can rely on Firebase Cloud Functions.

I created my collections and filled them with data, uploaded my resources to the storage and created some extra database rules and permissions. Even the user registration and management was handled entirely by Firebase. I was up to go! Easy. As. Hell.

### 03x04: The Frontend

Years of working as a developer has tought me one thing: this is what a user sees, touch and feels. They don't give a damn about your backend code. Why should I? The frontend is the core of all your love. And headaches, too. Give it some respect! Make it ***clean***, ***fast*** and ***beautyful***.

I started with creating some basic views to list the database items I stored previously. Added cool functionality like css ***animations***, list ***filtering***, ***responsiveness***, ***lazy loading*** images, css ***prefixing***, custom colors ***theme*** overrides, etc. All with none or bit actual code.

After that, security issues. ***Route*** guarding, app ***status*** cycle management, ***redirections***, ***securization***, account ***registration***, credentials ***authentication***, logical ***assertions***, form ***validations***, google ***reCaptcha*** behaviour and so on.

And finally, the logic. ***Services***, ***APIs***, ***messaging***, real time ***notifications***, ***i18n***, all the funny stuff.

### 03x05: The Internationalization

This deserves its own chapter. I wanted to make this game as much internationalized as possible. I18n, as you'll know already, can be a really pain in the ass, so I decided to solve it my way.

I created a lang ***json*** file with all my translations on it, and binded it dynamically with translation mixins functions spreaded all over my app, ready to be used following the user's personal language settings. Instant changes, no reload required, and scalable. At this point, I had very reasonable ***English*** knowledge, started to learn ***French*** as a hobby, and my first language was ***Spanish***, so I translated myself all the labels.

After dealing with some minor perks, like third party libraries i18n support, this was done. Piece of cake, if you know how to deal with it and you work on it since the start. I could even upload it to Firebase to make use of real time bindings in case of updating, but since that would consume more user data, I'd rather redeploy the whole app and make sure every user gets the latest version generating new cache-hashed timestamped files.

### 03x06: The Development

ES6, of course! Who are we, neanderthals? Reactivity! HTML and CSS preprocessing! Database realtime binding! Arrow functions! Spread operator! Promises! Async/Await! Webpack! Imports! NPM plugins! Hot reload! ***All the good stuff***. Simply thinking about how I used to develop code years ago versus now makes me sad.

### 03x07: The Testing

I have one thing to be ashamed of. Until this project, I ***never*** did tests. Shame. On. Me. But not anymore! It's true I'm not as much in testing as to use TDD yet, but man I wanted to learn as much as possible about testing to be a better person and use any of the cool framework suits that are out there.

***Karma*** and ***Mocha*** suited me very well, even with Async/Await support, so I did very basic unit and e2e testing in order to learn a bit about this fascinating world. I surely do not cover the 100% of my code, but feels really great to know I could if I would to.

### 03x08: The Performance

Something we should always worry about, the user experience and the final performance our app will have. At first I was playing with the Cordova and Electron ideas, packaging my app into a Chrome webview for better cross-device compatibility and so on.

Nah, ***too much work***. Embraced the web and never looked back. I don't give a damn about other platforms. Nowadays, evereyone has got a smartphone/tablet at home, so making my app responsive (which I already did using a responsive CSS framework) and adding some edge cased media queries is just as 90% good as a native app. Even with ***PWA*** and ***Service Workers*** I can camouflage webs as native apps, and let the video game developers worry about cross-platform support. I won't.

But that meant I should deal with performance myself. Smart data request management. Analyzing the resulting dist package to see which files are consuming the most, and trying to get rid of them (I'm looking at you, ***MomentJS*** locales folder!). Reducing the file resources and built app vendor chunks sizes to the minimum. Minifying, uglifying and obfuscating CSS and JS code. Caching resources, fonts, images, jsons and network requests to the maximum. Fighting against ***Google's PageSpeed Insights*** and ***Google's Lighthouse Plugin*** hight expectations. Improving speed on the first load. Dynamic resource importing. Image lazy loading. Removing duplicated imports. Deferring, preloading and asyncing everything I could. Asyncing/Awaiting only for really needed data, and asyncronizying everything else.

***Webpack mastering*** to the limit, actually. Painful at the start. Funny at the end.

### 03x09: The Deployment

As I said, I have no backend. ***Firebase*** does, and gaves me a CLI all I need to make production delivery a single-lined ***NPM*** or ***YARN*** command. I just need to start it, and all my other micro tasks chains up one after the other. Unit and e2e testing, production package building, code minifying and obfuscating, database cleaning and finally, if everything goes on well, uploading all to the server. Again, I don't need to worry about the infrastructure. What a relief...

### 03x10: The Game

You are the ruler of your own kingdom in a world full of magic. Try to compete with thousands of players for the absolute domination in a race of territorty exploration, infrastructure construction, magical knowledge, epic battles, hero reputation, resource management, artifact hunting and proud survival until the apocalypse is summoned, holding the first ranking position enought time to ultimately become the best ***Archmage*** of them all. During the current game ***season***, at least.

I usually play with my friends, but you are free to register and play if you want to. I'm always collecting information, rebalancing statistics, fixing bugs, attending to suggestions and thinking of future game ***expansions***, too.

Thanks for reading!