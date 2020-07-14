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