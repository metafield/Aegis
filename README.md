svg -> didn't work -> issues like React keys
figure out basics first:

- basic loop
- most performant time system date vs now() vs using what was provided
- add vectors
- draw basic shapes
- get basic types
- work on architecture to draw and update objects
- basic user input and vectors
- better interfaces with the generic gameObject type
- using mutation correctly to get render times down
- providing draw, update and destroy a consistent Context that includes tools to interact with the game outside of itself (a better solution to DI than svelte's in this case)

export interface Context {
// ctx shadows but it's such a common way to write canvas
ctx: CanvasRenderingContext2D
objects: GameObject[]
deltaTime: number
}

emphasize why mutation is used so much

// TO DONE: performance: can change this to switch and pop for more speed
gameObjects = gameObjects.filter((m) => !m.dead)

function swapPop(arr: any[]) {
let swapTemp;
// backwards better for popping
for (let i = arr.length - 1; i >= 0; i--) {
if (arr[i].dead) {
if (i == arr.length - 1) {
arr.pop();
continue;
}

    swapTemp = arr[arr.length - 1];
    arr[arr.length - 1] = arr[i];
    arr[i] = swapTemp;
    arr.pop();

}
}
}

vector type is becoming annoying - refactor to merge vector and abstract
to make typings look way nice. It does not matter if a vector is using the abstract or not

GameObjects need some base functionality this is one of the rare good use cases for inheritance.
