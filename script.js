const game = new Game();

let ball = new game.Thing({
    shape: 'circle',
    radius: 15,
    background: 'lightblue',
});
let p1 = new game.Thing({
    width: 30,
    height: 125,
    left: game.left + 20
});
let p2 = new game.Thing({
    width: 30,
    height: 125,
    right: game.right - 20
});
p1.score = 0;
p2.score = 0;
let score1 = new game.Text({
    text: 'SCORE: 0',
    size: 20,
    left: game.left + 20,
    top: game.top + 20,
});
let score2 = new game.Text({
    text: 'SCORE: 0',
    size: 20,
    right: game.right - 20,
    top: game.top + 20,
});
ball.vel.x = 250;
ball.vel.y = 250;

KEYS.bindKeyHold('ArrowUp', e => p2.y += -0.235 * e);
KEYS.bindKeyHold('ArrowDown', e => p2.y += 0.235 * e);
KEYS.bindKeyHold('w', e => {
    if (!AI)
        p1.y += -0.235 * e
});
KEYS.bindKeyHold('s', e => {
    if (!AI)
        p1.y += 0.235 * e
});
var AI = false;
KEYS.bindKeyPressed('1', e => {
    if (!AI)
        AI = true;
});
KEYS.bindKeyPressed('2', e => {
    if (AI) 
        AI = false;
})
function Boundary(axis, pos, effect='relfect{axis}') {
    effect = effect.replaceAll('{axis}', axis);
    return {
        axis,
        position:pos,
        effect:effect
    }
}
let Predictions = [];
function predictStatic(thing, ms, bounds, end) {
    for (let i of Predictions) {
        i.delete();
    }
    let x, y;
    let velx, vely;
    y = thing.y;
    x = thing.x;
    vely = thing.vel.y;
    velx = thing.vel.x;
    while (ms > 0) {
        y = y + vely/1000;
        x = x + velx/1000;
        for (let b of bounds) {
            if (b.axis == 'x' && ((x >= b.position && thing.x < b.position) || (x <= b.position && thing.x > b.position))) {
                let dist = game.numberDistance(x, b.position);
                console.log('bounceX')
                if (x > b.position) {
                    x = x - dist*2;
                    velx = -Math.abs(velx);
                }
                else if (x < b.position) {
                    x = x + dist*2;
                    velx = Math.abs(velx);
                }
            }
            else if (b.axis == 'y' && ((y >= b.position && thing.y < b.position) || (y <= b.position && thing.y > b.position))) {
                let dist = game.numberDistance(y, b.position);
                if (y > b.position) {
                    y = y - dist*2
                    vely = -Math.abs(vely);
                }
                else if (y < b.position) {
                    y = y + dist*2
                    vely = Math.abs(vely);
                }
                
            }
        }
        if (!(end[0] && (x > thing.x && x <= end[0]) || (x < thing.x && x >= end[0]) && end[1] && (y > thing.y && y <= end[1]) || (y < thing.y && y >= end[1]))) {
            ms -= 1;
        } else break;
        if (ms%250 === 0) {
            Predictions.push(new game.Thing({
                x: x,
                y: y,
                shape: 'circle',
                background: `red`,
                radius: 4
            }));
        }
    }
    return {
        x, y
    }
}
for (let i = 0; i <= 10000; i += 250) {
    let w = predictStatic({
        x: 0,
        y: 0,
        vel: {
            x: 250,
            y: 250
        }
    }, i, [Boundary('y', game.top), Boundary('y', game.bottom), Boundary('x', p2.left)], [p1.right, null]);
    /*new game.Thing({
        x: w.x,
        y: w.y,
        shape: 'circle',
        background: `red`,
        radius: 2
    });*/
}
game.hook('gameloop', function(elapsed) {
    if (AI) {
        let w = predictStatic(ball, 5000, [Boundary('y', game.top), Boundary('y', game.bottom), Boundary('x', p2.left)], [p1.right, null]);
        Predictions.push(new game.Thing({
            x: w.x,
            y: w.y,
            shape: 'circle',
            background: `green`,
            radius: 4
        }));
        p1.to(null, w.y, 0, 235);
    }
    ball.vel.x *= 1 + (elapsed/109900);
    ball.vel.y *= 1 + (elapsed/109900);
    if (ball.left <= game.left) {
        p2.score++;
        ball.vel.x = 250;
        ball.vel.y = 250;
        ball.vel.x = Math.abs(ball.vel.x)
        ball.teleport(0, 0);
    } else if (ball.right >= game.right) {
        p1.score++;
        ball.vel.x = 250;
        ball.vel.y = 250;
        ball.vel.x = -Math.abs(ball.vel.x)
        ball.teleport(0, 0);
    } 
    if (ball.top <= game.top) {
        ball.vel.y = Math.abs(ball.vel.y);
    } else if (ball.bottom >= game.bottom) {
        ball.vel.y = -Math.abs(ball.vel.y);
    }
    for (let p of [p1, p2]) {
        if (p.top < game.top) {
            p.top = game.top;
            p.vel.y = 0;
        } if (p.bottom > game.bottom) {
            p.bottom = game.bottom;
            p.vel.y = 0;
        } 
        /*if (Math.abs(Math.round(p.vel.y)) > 0) {
            if (p.vel.y > 0) p.vel.y -= elapsed;
            if (p.vel.y < 0) p.vel.y += elapsed;
        }*/
    }
    score1.text = `SCORE: ${p1.score}`;
    score2.text = `SCORE: ${p2.score}`;
});
ball.collided([p1, p2], function(e) {
    if (e.side == 'left') {
        ball.vel.x = Math.abs(ball.vel.x);
    } if (e.side == 'right') {
        ball.vel.x = -Math.abs(ball.vel.x);
    } if (e.side == 'top') {
        ball.vel.y = Math.abs(ball.vel.y);
    } if (e.side == 'bottom') {
        ball.vel.y = -Math.abs(ball.vel.y);
    }
})
game.start();