I remember one of the first things I learned when I started out with coding and animation, was this nice little equation/one-liner:

```
// instad of just setting the new value 
// with no animation, like this
value = newValue
// we can increment the value 
// smoothly over time
value += (newValue - value) * easingFactor
```

The principle is pretty simple. Instead of setting the value directly, we make the increments smaller and smaller as we apporach our target value. This can make the movement feel a lot more organic. Whether it's about animating some position property or some user interaction.

I guess there's no need to have the word "magic" in the headline, as there's not really anything magic going on here. It sure *felt* a little magic the first time I discovered it though.

This post is a tribute to this little line of code.

### To elaborate a little

The calculation is pretty simple. We can also get a good look at what's happening if we output some numbers. Let's run it 30 times (or 30 frames if you like):

```
// set an initial value of 0
let value = 0
// the new value should be 100
let newValue = 100
// we set our "easingFactor" variable to a 
// value close to 0 such as 0.2
let easingFactor = 0.2
// run 30 times
for (let i = 0; i < 30; i++) {
  value += (newValue - value) * easingFactor
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

As you can see, it reaches 90 pretty fast. Then it will gradually slow down as it approches our target value. If we continue to run it forever, it will actually never get to 100, which is our target goal. But it will get so close that the difference wouldn't really be noticeable. (Or you will at least run into [*floating point precision*](https://en.wikipedia.org/wiki/Single-precision_floating-point_format)).

### An example

Tap or click somewhere in the example below to move the circle around. Play with the easing value to watch how the animation changes. Values closer to 0 will create a slower animation, while values closer to 1 will create a much more snappy animation.

<iframe width="100%" height="600" data-src="/posts/simple_easing.html"></iframe>

### Different ways to achieve the same goal

There are many ways to achieve this. One way is to use [*linear interpolation*](https://en.wikipedia.org/wiki/Linear_interpolation), also known as *lerping*. Like so:
```
function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t
}
```

Where `v0` is the current value, and `v1` is the value we want to animate to. `t` represents the fraction of the distance you want to end at (between 0 and 1). For instance: `lerp(0, 20, 0.5)` will give you 10. `lerp(50, 100, 0.5)` would give you 75.

If we were to use this function in our example above, it would look something like this:

```
// set an initial value of 0
let value = 0
// the new value should be 100
let newValue = 100
// we set our "easingFactor" variable to 5
let easingFactor = 5

// declare our lerp function
const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t

for (let i = 0; i < 30; i++) {
  //value += (newValue - value) / easingFactor
  value = lerp(value, newValue, 0.25)
  console.log(value)
}
```

Or alternatively, if you have a moving object, you can smoothly slow it down by multiplying it's velocity with a number pretty close to 1, e.g.:
```
// define a position and a velocity
let position = 0
let veloctiy = 100

// on every frame, multiply by an arbitrary
// number close to 1
position += velocity
velocity *= 0.967
```