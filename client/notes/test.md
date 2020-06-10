I remember one of the fist things I learned in this crazy web world of interactivity and animation many years ago, was that whatever I was working on, it would almost always look or feel better whenever I applied this simple awesome little trick to some interactive parts of my project. Usually in the render/update loops:

```
// instad of just doing this
value += newValue
// we can do this
value += (newValue - value) / easingFactor
```

When I found out about this I was a little stoked to say the least. It's really simple, but it can make the animation and feel of things much more smooth and elegant. I guess you could remove the word "magic" from the headline, beacause it turns out it's wasn't anything magic going on afterall. It sure *felt* a bit magic to me least.

### To elaborate a little

The calculation is pretty simple. We also get a good look at what's happening if we output some numbers. Let's run it 30 times (or 30 frames if you like):

```
// set an initial value of 0
let value = 0
// the new value should be 100
let newValue = 100
// we set our "easingFactor" variable to 5
let easingFactor = 5

for (let i = 0; i < 30; i++) {
  value += (newValue - value) / easingFactor
  console.log(value)
}
```

The numbers we get looks somewhat like this:
```
20
36
48.8
59.04
67.232
73.7856
79.02848
83.222784
86.5782272
89.26258176
91.41006540800001
93.12805232640001
94.50244186112
95.601953488896
96.4815627911168
97.18525023289344
97.74820018631475
98.1985601490518
98.55884811924145
98.84707849539316
99.07766279631453
99.26213023705162
99.4097041896413
99.52776335171305
99.62221068137043
99.69776854509635
99.75821483607709
99.80657186886167
99.84525749508933
99.87620599607146
```

As you can see, the number reaches 90 pretty fast. If we continue to run in forever, it will actually never get to 100, which was our target goal. But it will get so close that you wouldn't notice if you used it it some animation.

### Let's see some examples

* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact

```
this.iso = new Isotope(msnryContainer, {
  // options
  percentPosition: true,
  itemSelector: '.item',
  columnWidth: '.grid-sizer',
  stagger: 50,
});
this.createGridItems(msnryContainer, this.iso);
```