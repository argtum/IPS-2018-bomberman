import {Vec2, Direction, createBomber} from "./canvas_part/bomber.canvas.js";
import {ARENA_CELL, createArena} from "./canvas_part/arena.canvas.js";
import {createBarriers} from "./canvas_part/barrier.canvas.js";
import {BOMB_TIMEOUT, EXPLOSION_TIME, createBomb} from "./canvas_part/bomb.canvas.js";
import {KeyCode, KeymapCanvas} from "./canvas_part/keymap.canvas.js";
import {redraw} from "./canvas_part/draw.canvas.js";
import {collisionsProcessing} from "./canvas_part/collisions.canvas.js";

function update(dt, bomber, barriers, arena, explosions, keyMap) {
    const directionForce = processKeyMapForBomber(bomber, keyMap);
    const moveDistance = bomber.speed.multiplyScalar(dt).multiply(directionForce);

    bomber.position = bomber.position.add(collisionsProcessing(bomber, barriers, arena, moveDistance));
}

function processKeyMapForBomber(bomber, keyMap) {
    let directionForce = Vec2.ZERO;
    if (keyMap.isPressed(KeyCode.LEFT_ARROW)) {
        directionForce = directionForce.add(Direction.LEFT);
    }
    if (keyMap.isPressed(KeyCode.RIGHT_ARROW)) {
        directionForce = directionForce.add(Direction.RIGHT);
    }
    if (keyMap.isPressed(KeyCode.UP_ARROW)) {
        directionForce = directionForce.add(Direction.UP);
    }
    if (keyMap.isPressed(KeyCode.DOWN_ARROW)) {
        directionForce = directionForce.add(Direction.DOWN);
    }
    return directionForce;
}

function main() {
    const canvas = document.getElementById('canvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');

    const bomberStartPositionX = 25;
    const bomberStartPositionY = 25;

    const position = new Vec2(bomberStartPositionX, bomberStartPositionY);
    const bomber = createBomber(position);

    const arena = createArena();

    const indestructibleBarriers = [];
    for(let y = ARENA_CELL; y < arena.arenaHeight; y+= ARENA_CELL * 2) {
        for(let x = ARENA_CELL; x < arena.arenaWidth; x += ARENA_CELL * 2) {
            indestructibleBarriers.push(createBarriers(x, y));
        }
    }

    const keyMap = new KeymapCanvas();

    document.addEventListener("keydown", (event) => {
        keyMap.onKeyDown(event.keyCode);
    });

    document.addEventListener("keyup", (event) => {
        keyMap.onKeyUp(event.keyCode);
    });

    const bombs = [];
    const explosions = [];
    if (keyMap.isPressed(KeyCode.SPACE)) {
        bombs.push(createBomb(bomber.x, bomber.y));
        setTimeout(() => {
            if (bombs) {
                explosions.push(bombs.shift());
                setTimeout(() => {
                    if (explosions) {
                        explosions.shift();
                    }
                }, EXPLOSION_TIME);
            }
        }, BOMB_TIMEOUT);
    }

    redraw(ctx, arena, bomber, indestructibleBarriers, bombs);

    let lastTimestamp = Date.now();
    const animateFn = () => {
        const currentTimeStamp = Date.now();
        const deltaTime = (currentTimeStamp - lastTimestamp) * 0.001; //сколько секунд прошло с прошлого кадра
        lastTimestamp = currentTimeStamp;

        update(deltaTime, bomber, indestructibleBarriers, arena, explosions, keyMap);
        redraw(ctx, arena, bomber, indestructibleBarriers, bombs, explosions);
        requestAnimationFrame(animateFn);
    };
    animateFn();
}

main();