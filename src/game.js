// 사운드 객체 생성
const sounds = {
    paddleHit: new Audio("sounds/paddle_hit.mp3"),
    brickHit: new Audio("sounds/brick_hit.mp3"),
    bossHit: new Audio("sounds/boss_hit.mp3"),
    skill: new Audio("sounds/skill_activate.mp3"),
    bgm1: new Audio("sounds/bgm1.mp3")
};
sounds.bgm1.loop = true;



class Boss {
    constructor(canvasWidth, health = 10, phasePercent = 20) {
        this.x = 0;
        this.y = 0;
        this.width = canvasWidth;
        this.height = 40;
        this.health = health;
        this.maxHealth = health;
        this.visible = true;
        this.phasePercent = phasePercent;
        this.phaseTriggerCount = 0;
        this.projectiles = [];
        this.attackInterval = 3000;
        this.pattern = "straight";
    }

    draw(ctx) {
        if (!this.visible) return;
        const ratio = this.health / this.maxHealth;

        ctx.fillStyle = "#550000";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = "#FF3333";
        ctx.fillRect(this.x, this.y, this.width * ratio, this.height);

        ctx.strokeStyle = "#FFF";
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        ctx.font = "16px Arial";
        ctx.fillStyle = "#FFF";
        ctx.textAlign = "center";
        ctx.fillText(`BOSS HP: ${this.health}`, this.width / 2, this.height - 10);
    }

    checkCollision(ball, onPhaseDown) {
        if (!this.visible) return false;

        if (ball.y - ball.radius < this.y + this.height &&
            ball.x > this.x &&
            ball.x < this.x + this.width) {
            
            ball.dy = Math.abs(ball.dy);
            this.health -= ball.power;
            sounds.bossHit.play();

            const percentLost = 1 - (this.health / this.maxHealth);
            const expectedTriggers = Math.floor((percentLost + 0.000001) * (100 / this.phasePercent));

            while (this.phaseTriggerCount < expectedTriggers) {
                this.phaseTriggerCount++;
                if (this.health > 0 && typeof onPhaseDown === "function") {
                    onPhaseDown();
                }
            }

            if (this.health <= 0) {
                this.visible = false;
                return true; // 보스 처치됨
            }
        }
        return false;
    }

    spawnProjectiles(stage = 1) {
        if (this.pattern === "straight") {
            for (let i = 0; i < 2; i++) {
                const x = Math.random() * (this.width - 20);
                this.projectiles.push({
                    x: x,
                    y: this.height,
                    width: 20,
                    height: 20,
                    dx: 0,
                    dy: 4,
                    type: "straight"
                });
            }
        } else if (this.pattern === "varied") {
            const patternType = Math.floor(Math.random() * 3);
            
            if (patternType === 0) {
                // 빠른 직선
                this.projectiles.push({
                    x: Math.random() * (this.width - 20),
                    y: this.height,
                    width: 20,
                    height: 20,
                    dx: 0,
                    dy: 7 + Math.random() * 3,
                    type: "fast"
                });
            } else if (patternType === 1) {
                // 포물선
                const dir = Math.random() > 0.5 ? 1 : -1;
                this.projectiles.push({
                    x: Math.random() * (this.width - 20),
                    y: this.height,
                    width: 20,
                    height: 20,
                    dx: dir * (2 + Math.random() * 2),
                    dy: 2 + Math.random() * 2,
                    gravity: 0.25 + Math.random() * 0.15,
                    type: "parabola"
                });
            } else {
                // 가속 투사체
                this.projectiles.push({
                    x: Math.random() * (this.width - 20),
                    y: this.height,
                    width: 20,
                    height: 20,
                    dx: 0,
                    dy: 2,
                    accel: 0.25 + Math.random() * 0.2,
                    type: "accel"
                });
            }
        }
    }
}

class Player {
    constructor(maxGauge = 3) {
        this.skillGauge = 0;
        this.maxGauge = maxGauge;
        this.skillReady = false;
    }

    chargeGauge() {
        if (this.skillGauge < this.maxGauge) {
            this.skillGauge++;
            if (this.skillGauge >= this.maxGauge) {
                this.skillReady = true;
            }
        }
    }

    canUseSkill() {
        return this.skillGauge >= this.maxGauge;
    }

    useSkill(bricks, damage = 3) {
        if (!this.canUseSkill()) return 0;
        let scoreGained = 0;
        bricks.forEach(brick => {
            if (!brick.visible) return;
            brick.health -= damage;
            if (brick.health <= 0) {
                brick.visible = false;
                scoreGained += brick.maxHealth * 10;
            }
        });
        this.skillGauge = 0;
        this.skillReady = false;
        return scoreGained;
    }
}

// === 필살기 이펙트 클래스 ===
class PhoenixEffect {
    constructor(canvasWidth, canvasHeight) {
        this.particles = [];
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.active = false;
        this.duration = 60; // 프레임 수
        this.currentFrame = 0;
    }

    activate() {
        this.active = true;
        this.currentFrame = 0;
        this.particles = [];
        
        // 불사조 형태의 파티클 생성
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: this.canvasWidth / 2 + (Math.random() - 0.5) * 100,
                y: this.canvasHeight + Math.random() * 50,
                dx: (Math.random() - 0.5) * 2,
                dy: -8 - Math.random() * 4,
                size: 3 + Math.random() * 5,
                color: Math.random() > 0.5 ? '#FF4500' : '#FFD700',
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02
            });
        }
    }

    update() {
        if (!this.active) return;

        this.currentFrame++;
        if (this.currentFrame > this.duration) {
            this.active = false;
            return;
        }

        this.particles.forEach(particle => {
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.dy += 0.1; // 중력 효과
            particle.life -= particle.decay;
        });

        // 죽은 파티클 제거
        this.particles = this.particles.filter(p => p.life > 0);
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        this.particles.forEach(particle => {
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // 발광 효과
            ctx.shadowBlur = 10;
            ctx.shadowColor = particle.color;
            ctx.fill();
        });
        ctx.restore();

        // 중앙에서 퍼지는 빛 효과
        const progress = this.currentFrame / this.duration;
        ctx.save();
        ctx.globalAlpha = 0.5 * (1 - progress);
        const gradient = ctx.createRadialGradient(
            this.canvasWidth / 2, this.canvasHeight / 2, 0,
            this.canvasWidth / 2, this.canvasHeight / 2, 200 * progress
        );
        gradient.addColorStop(0, '#FFFF00');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.restore();
    }
}

// === 게임 초기화 ===
document.addEventListener('DOMContentLoaded', function() {
    // 게임 상수
    const CANVAS_WIDTH = 1000;
    const CANVAS_HEIGHT = 700;
    const PADDLE_WIDTH = 120;
    const PADDLE_HEIGHT = 20;
    const PADDLE_SPEED = 12;
    const BALL_RADIUS = 10;
    const BRICK_ROWS = 5;
    const BRICK_COLUMNS = 12;
    const BRICK_WIDTH = 78;
    const BRICK_HEIGHT = 30;
    const BRICK_PADDING = 5;
    const BRICK_OFFSET_TOP = 60;
    const BRICK_OFFSET_LEFT = 15;
    const MAX_LIVES = 3;
    const ITEM_FALL_SPEED = 2;
    const MAGNET_DURATION = 5000;

    // 캔버스 설정
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");

    // 게임 객체들
    const player = new Player();
    const boss = new Boss(CANVAS_WIDTH, 10, 20);
    const phoenixEffect = new PhoenixEffect(CANVAS_WIDTH, CANVAS_HEIGHT);

    // 게임 상태
    let gameStarted = false;
    let gamePaused = false;
    let gameOver = false;
    let score = 0;
    let lives = MAX_LIVES;
    let coins = 0;
    let stage = 1;
    let stageTimer = 60;
    let stageTimerInterval = null;
    let bossAttackTimer = null;

    // 캐릭터 선택
    let selectedCharacter = null;
    let characterAbilities = {
        char1: { name: "공격형", power: 2, speed: 12, description: "공 데미지 +1" },
        char2: { name: "속도형", power: 1, speed: 18, description: "이동속도 증가" },
        char3: { name: "시간형", power: 1, speed: 12, timeStop: true, description: "시간정지 (Q키)" },
        char4: { name: "방어형", power: 1, speed: 12, shield: true, description: "넓은 방어영역" }
    };

    // 시간정지 관련
    let timeStopActive = false;
    let timeStopDuration = 0;
    let timeStopCooldown = 0;

    // 입력 상태
    let leftPressed = false;
    let rightPressed = false;
    let hasMagnet = false;
    let magnetTimer = null;

    // 패들 설정
    const paddle = {
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
        y: CANVAS_HEIGHT - PADDLE_HEIGHT - 10,
        color: "#4CAF50",
        speed: PADDLE_SPEED,
        shieldWidth: PADDLE_WIDTH,
        shieldHeight: PADDLE_HEIGHT
    };

    // 공 설정
    const ball = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10,
        radius: BALL_RADIUS,
        dx: 3.5,
        dy: -3.5,
        color: "#FFFFFF",
        power: 1
    };

    // 벽돌과 아이템 배열
    let bricks = [];
    let items = [];
    const itemTypes = ["heart", "coin", "magnet"];

    // === 캐릭터 선택 이벤트 ===
    document.querySelectorAll('.character-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.character-button').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedCharacter = this.id;
        });
    });

    document.getElementById('character-confirm').addEventListener('click', function() {
        if (!selectedCharacter) {
            alert('캐릭터를 선택해주세요!');
            return;
        }
        
        document.getElementById('character-select-menu').classList.add('hidden');
        document.getElementById('game-menu').classList.remove('hidden');
        
        // 캐릭터 능력 적용
        const char = characterAbilities[selectedCharacter];
        ball.power = char.power;
        paddle.speed = char.speed;
        
        if (char.shield) {
            paddle.shieldWidth = PADDLE_WIDTH + 40;
            paddle.shieldHeight = PADDLE_HEIGHT + 10;
        }
        
        document.getElementById('character-info').textContent = `${char.name}: ${char.description}`;
    });

    // === 키보드 이벤트 ===
    document.addEventListener("keydown", function (e) {
        if (e.keyCode === 37) leftPressed = true;
        else if (e.keyCode === 39) rightPressed = true;
    });

    document.addEventListener("keyup", function (e) {
        if (e.keyCode === 37) leftPressed = false;
        else if (e.keyCode === 39) rightPressed = false;
        else if (e.keyCode === 27) togglePause();
        else if (e.keyCode === 70) useSkill(); // F키
        else if (e.keyCode === 81) useTimeStop(); // Q키
    });

    // === 게임 함수들 ===
    function updateGaugeUI() {
        const percent = (player.skillGauge / player.maxGauge) * 100;
        const gaugeElement = document.getElementById("gauge-fill");
        if (gaugeElement) {
            gaugeElement.style.height = percent + "%";
            gaugeElement.style.backgroundColor = percent >= 100 ? "#ffcc00" : "red";
        }
    }

    function initBricks() {
        bricks = [];
        for (let r = 0; r < BRICK_ROWS; r++) {
            for (let c = 0; c < BRICK_COLUMNS; c++) {
                const health = Math.floor(Math.random() * 5) + 1;
                bricks.push({
                    x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
                    y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
                    width: BRICK_WIDTH,
                    height: BRICK_HEIGHT,
                    health: health,
                    maxHealth: health,
                    visible: true
                });
            }
        }
    }

    function setupBossForStage(stageNum) {
        if (stageNum === 1) {
            boss.maxHealth = 10;
            boss.health = 10;
            boss.attackInterval = 3000;
            boss.pattern = "straight";
        } else if (stageNum === 2) {
            boss.maxHealth = 18;
            boss.health = 18;
            boss.attackInterval = 2200;
            boss.pattern = "straight";
        } else if (stageNum === 3) {
            boss.maxHealth = 28;
            boss.health = 28;
            boss.attackInterval = 1500;
            boss.pattern = "straight";
        } else if (stageNum === 4) {
            boss.maxHealth = 80;
            boss.health = 80;
            boss.attackInterval = 1000;
            boss.pattern = "varied";
        }
        boss.visible = true;
        boss.phaseTriggerCount = 0;
        boss.projectiles = [];
    }

    function startStageTimer() {
        clearInterval(stageTimerInterval);
        stageTimer = 60;
        updateTimerDisplay();
        
        stageTimerInterval = setInterval(() => {
            if (!timeStopActive && !gamePaused) {
                stageTimer--;
                updateTimerDisplay();
                
                if (stageTimer <= 0) {
                    clearInterval(stageTimerInterval);
                    gameOver = true;
                    showMenu("시간 초과! 게임 오버", false);
                }
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(stageTimer / 60);
        const seconds = stageTimer % 60;
        const timerElement = document.getElementById("stage-timer");
        if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            timerElement.style.color = stageTimer < 10 ? '#FF0000' : '#FFD700';
        }
    }

    function useTimeStop() {
        if (selectedCharacter !== 'char3' || timeStopActive || timeStopCooldown > 0) return;
        
        timeStopActive = true;
        timeStopDuration = 600; // 10초 * 60fps
        timeStopCooldown = 1800; // 30초 쿨다운
        
        // 모든 보스 투사체 제거
        boss.projectiles = [];
        
        document.getElementById('time-stop-overlay').classList.remove('hidden');
    }

    function useSkill() {
        if (player.canUseSkill()) {
            sounds.skill.plau();
            phoenixEffect.activate();
            const gainedScore = player.useSkill(bricks);
            score += gainedScore;
            updateUI();
        }
    }

    function startGame() {
        sounds.bgm1.play();
        if (!selectedCharacter) return;
        
        gameStarted = true;
        gameOver = false;
        gamePaused = false;
        score = 0;
        lives = MAX_LIVES;
        coins = 0;
        stage = 1;
        
        setupBossForStage(stage);
        initBricks();
        resetBall();
        updateUI();
        
        document.getElementById("game-menu").classList.add("hidden");
        startStageTimer();
        
        bossAttackTimer = setInterval(() => {
            if (boss.visible && !timeStopActive && !gamePaused) {
                boss.spawnProjectiles(stage);
            }
        }, boss.attackInterval);
        
        requestAnimationFrame(gameLoop);
    }

    function togglePause() {
        if (!gameStarted || gameOver) return;
        
        gamePaused = !gamePaused;
        if (gamePaused) {
            showMenu("일시정지", false, true);
        } else {
            resumeGame();
        }
    }

    function resumeGame() {
        if (!gameStarted || gameOver) return;
        gamePaused = false;
        document.getElementById("game-menu").classList.add("hidden");
        requestAnimationFrame(gameLoop);
    }

    function restartGame() {
        clearInterval(stageTimerInterval);
        clearInterval(bossAttackTimer);
        startGame();
    }

    function quitGame() {
        gameStarted = false;
        gamePaused = false;
        gameOver = false;
        clearInterval(stageTimerInterval);
        clearInterval(bossAttackTimer);
        document.getElementById('character-select-menu').classList.remove('hidden');
        document.getElementById('game-menu').classList.add('hidden');
        document.getElementById('stage-clear-menu').classList.add('hidden');
    }

    function showMenu(message, isStart = false, isPaused = false) {
        document.getElementById("menu-message").textContent = message;
        document.getElementById("game-menu").classList.remove("hidden");

        document.getElementById("start-button").style.display = isStart ? "block" : "none";
        document.getElementById("resume-button").style.display = isPaused ? "block" : "none";
        document.getElementById("restart-button").style.display = !isStart ? "block" : "none";
        document.getElementById("quit-button").style.display = "block";
    }

    function updateUI() {
        document.getElementById("score").textContent = score;
        document.getElementById("hearts").textContent = lives;
        document.getElementById("coins").textContent = coins;
        document.getElementById("stage").textContent = stage;
        updateGaugeUI();
    }

    function resetBall() {
        ball.x = paddle.x + paddle.width / 2;
        ball.y = CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10;
        ball.dx = Math.random() > 0.5 ? 3.5 : -3.5;
        ball.dy = -3.5;
    }

    function createItem(x, y) {
        if (Math.random() < 0.3) {
            const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            items.push({
                x: x,
                y: y,
                type: itemType,
                width: 20,
                height: 20
            });
        }
    }

    function collectItem(item) {
        switch (item.type) {
            case "heart":
                lives = Math.min(lives + 1, MAX_LIVES);
                break;
            case "coin":
                coins++;
                score += 10;
                break;
            case "magnet":
                activateMagnet();
                break;
        }
        updateUI();
    }

    function activateMagnet() {
        hasMagnet = true;
        if (magnetTimer) clearTimeout(magnetTimer);
        paddle.color = "#FF00FF";
        
        magnetTimer = setTimeout(() => {
            hasMagnet = false;
            paddle.color = "#4CAF50";
        }, MAGNET_DURATION);
    }

    function addNewBrickRow() {
        bricks.forEach(brick => {
            if (brick.visible) {
                brick.y += BRICK_HEIGHT + BRICK_PADDING;
            }
        });

        for (let c = 0; c < BRICK_COLUMNS; c++) {
            const health = Math.floor(Math.random() * 5) + 1;
            bricks.push({
                x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
                y: BRICK_OFFSET_TOP,
                width: BRICK_WIDTH,
                height: BRICK_HEIGHT,
                health: health,
                maxHealth: health,
                visible: true
            });
        }
    }

    // === 충돌 감지 함수들 ===
    function checkBrickCollision() {
        for (let i = 0; i < bricks.length; i++) {
            const brick = bricks[i];
            if (brick.visible) {
                if (ball.x + ball.radius > brick.x &&
                    ball.x - ball.radius < brick.x + brick.width &&
                    ball.y + ball.radius > brick.y &&
                    ball.y - ball.radius < brick.y + brick.height) {
                    
                    const distX = Math.abs(ball.x - (brick.x + brick.width / 2));
                    const distY = Math.abs(ball.y - (brick.y + brick.height / 2));

                    if (distX > distY) {
                        ball.dx = -ball.dx;
                    } else {
                        ball.dy = -ball.dy;
                    }

                    brick.health -= ball.power;

                    if (brick.health <= 0) {
                        brick.visible = false;
                        score += brick.maxHealth * 10;
                        updateUI();
                        createItem(brick.x + brick.width / 2, brick.y + brick.height / 2);
                        player.chargeGauge();
                        updateGaugeUI();

                        sounds.brickHit.play();
                    }
                    break;
                }
            }
        }
        
    }

    function checkPaddleCollision() {
        if (ball.y + ball.radius > paddle.y &&
            ball.y + ball.radius < paddle.y + paddle.height &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width) {
            
            const hitPos = (ball.x - paddle.x) / paddle.width;
            const angle = hitPos * Math.PI - Math.PI / 2;
            const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
            
            ball.dx = speed * Math.cos(angle);
            ball.dy = -Math.abs(speed * Math.sin(angle));
        }
        sounds.paddleHit.play();
    }

    function checkItemCollision() {
        const itemsToRemove = [];

        items.forEach((item, index) => {
            if (item.y > CANVAS_HEIGHT) {
                itemsToRemove.push(index);
                return;
            }

            if (item.x < paddle.x + paddle.width &&
                item.x + item.width > paddle.x &&
                item.y < paddle.y + paddle.height &&
                item.y + item.height > paddle.y) {
                collectItem(item);
                itemsToRemove.push(index);
            }
        });

        for (let i = itemsToRemove.length - 1; i >= 0; i--) {
            items.splice(itemsToRemove[i], 1);
        }
    }

    function updateBossProjectiles() {
        const projectilesToRemove = [];
        
        boss.projectiles.forEach((proj, i) => {
            if (proj.type === "straight" || proj.type === "fast") {
                proj.y += proj.dy;
            } else if (proj.type === "parabola") {
                proj.x += proj.dx;
                proj.y += proj.dy;
                proj.dy += proj.gravity;
            } else if (proj.type === "accel") {
                proj.y += proj.dy;
                proj.dy += proj.accel;
            }

            // 화면 밖으로 나간 투사체 제거
            if (proj.y > CANVAS_HEIGHT || proj.x < 0 || proj.x > CANVAS_WIDTH) {
                projectilesToRemove.push(i);
                return;
            }

            // 패들과 충돌 체크
            if (selectedCharacter === 'char4') {
                // 방어형 캐릭터: 방어 영역과 데미지 영역 구분
                const shieldLeft = paddle.x - (paddle.shieldWidth - paddle.width) / 2;
                const shieldRight = shieldLeft + paddle.shieldWidth;
                const damageLeft = paddle.x;
                const damageRight = paddle.x + paddle.width;
                
                if (proj.y + proj.height >= paddle.y &&
                    proj.x < shieldRight &&
                    proj.x + proj.width > shieldLeft) {
                    
                    // 데미지 영역에 맞으면 생명 감소
                    if (proj.x < damageRight && proj.x + proj.width > damageLeft) {
                        lives = Math.max(0, lives - 1);
                        updateUI();
                        if (lives <= 0) {
                            gameOver = true;
                            showMenu("게임 오버", false);
                        }
                    }
                    // 어느 영역이든 투사체는 제거
                    projectilesToRemove.push(i);
                }
            } else {
                // 일반 충돌
                if (proj.y + proj.height >= paddle.y &&
                    proj.x < paddle.x + paddle.width &&
                    proj.x + proj.width > paddle.x) {
                    
                    projectilesToRemove.push(i);
                    lives = Math.max(0, lives - 1);
                    updateUI();
                    if (lives <= 0) {
                        gameOver = true;
                        showMenu("게임 오버", false);
                    }
                }
            }
        });

        // 제거할 투사체들 처리
        for (let i = projectilesToRemove.length - 1; i >= 0; i--) {
            boss.projectiles.splice(projectilesToRemove[i], 1);
        }
    }

    // === 그리기 함수들 ===
    function drawPaddle() {
        // 방어형 캐릭터의 경우 방어 영역 표시
        if (selectedCharacter === 'char4') {
            const shieldX = paddle.x - (paddle.shieldWidth - paddle.width) / 2;
            const shieldY = paddle.y - (paddle.shieldHeight - paddle.height) / 2;
            
            // 방어 영역 (투명한 파란색)
            ctx.fillStyle = "rgba(0, 100, 255, 0.3)";
            ctx.fillRect(shieldX, shieldY, paddle.shieldWidth, paddle.shieldHeight);
            
            // 방어 영역 테두리
            ctx.strokeStyle = "#0066FF";
            ctx.lineWidth = 2;
            ctx.strokeRect(shieldX, shieldY, paddle.shieldWidth, paddle.shieldHeight);
        }
        
        // 실제 패들
        ctx.fillStyle = paddle.color;
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        bricks.forEach(brick => {
            if (brick.visible) {
                const healthPercent = brick.health / brick.maxHealth;
                const r = Math.floor(255 * healthPercent);
                const g = Math.floor(100 * healthPercent + 50);
                const b = Math.floor(50 * healthPercent);

                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                
                ctx.strokeStyle = "#333";
                ctx.lineWidth = 2;
                ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);

                ctx.font = "12px Arial";
                ctx.fillStyle = "#FFF";
                ctx.textAlign = "center";
                ctx.fillText(
                    brick.health.toString(),
                    brick.x + brick.width / 2,
                    brick.y + brick.height / 2 + 4
                );
            }
        });
    }

    function drawItems() {
        items.forEach(item => {
            ctx.beginPath();

            switch (item.type) {
                case "heart":
                    ctx.fillStyle = "#FF5555";
                    break;
                case "coin":
                    ctx.fillStyle = "#FFD700";
                    break;
                case "magnet":
                    ctx.fillStyle = "#FF00FF";
                    break;
            }

            ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = "10px Arial";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            
            let symbol = "";
            switch (item.type) {
                case "heart": symbol = "♥"; break;
                case "coin": symbol = "$"; break;
                case "magnet": symbol = "M"; break;
            }

            ctx.fillText(symbol, item.x, item.y + 3);
        });
    }

    function drawBossProjectiles() {
        boss.projectiles.forEach(proj => {
            let color = "#FFAA00";
            if (proj.type === "fast") color = "#FF0000";
            else if (proj.type === "parabola") color = "#00FF00";
            else if (proj.type === "accel") color = "#FF00FF";
            
            ctx.fillStyle = color;
            ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
            
            // 투사체 종류별 추가 표시
            ctx.fillStyle = "#FFF";
            ctx.font = "8px Arial";
            ctx.textAlign = "center";
            if (proj.type === "fast") ctx.fillText("!", proj.x + proj.width/2, proj.y + proj.height/2);
            else if (proj.type === "parabola") ctx.fillText("~", proj.x + proj.width/2, proj.y + proj.height/2);
            else if (proj.type === "accel") ctx.fillText("↓", proj.x + proj.width/2, proj.y + proj.height/2);
        });
    }

    // === 게임 업데이트 ===
    function update() {
        if (gameOver || gamePaused) return;

        // 시간정지 처리
        if (timeStopActive) {
            timeStopDuration--;
            if (timeStopDuration <= 0) {
                timeStopActive = false;
                document.getElementById('time-stop-overlay').classList.add('hidden');
            } else {
                return; // 시간정지 중에는 다른 업데이트 안함
            }
        }

        // 시간정지 쿨다운
        if (timeStopCooldown > 0) {
            timeStopCooldown--;
        }

        // 필살기 이펙트 업데이트
        phoenixEffect.update();

        // 패들 이동
        if (leftPressed && paddle.x > 0) {
            paddle.x -= paddle.speed;
        } else if (rightPressed && paddle.x + paddle.width < CANVAS_WIDTH) {
            paddle.x += paddle.speed;
        }

        // 공 이동
        ball.x += ball.dx;
        ball.y += ball.dy;

        // 아이템 이동
        items.forEach(item => {
            item.y += ITEM_FALL_SPEED;
        });

        // 자석 효과
        if (hasMagnet) {
            const itemsToRemove = [];
            items.forEach((item, index) => {
                collectItem(item);
                itemsToRemove.push(index);
            });
            for (let i = itemsToRemove.length - 1; i >= 0; i--) {
                items.splice(itemsToRemove[i], 1);
            }
        }

        // 벽 충돌
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > CANVAS_WIDTH) {
            ball.dx = -ball.dx;
        }

        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
        }

        // 바닥 충돌
        if (ball.y + ball.radius > CANVAS_HEIGHT) {
            lives--;
            updateUI();

            if (lives <= 0) {
                gameOver = true;
                showMenu("게임 오버", false);
            } else {
                resetBall();
            }
        }

        // 충돌 감지
        checkPaddleCollision();
        checkBrickCollision();
        checkItemCollision();
        updateBossProjectiles();

        // 보스 충돌 체크
        if (boss.checkCollision(ball, addNewBrickRow)) {
            // 보스 처치됨
            clearInterval(stageTimerInterval);
            clearInterval(bossAttackTimer);
            gamePaused = true;
            
            if (stage >= 4) {
                document.getElementById('stage-clear-message').textContent = '모든 스테이지 클리어!';
                document.getElementById('stage-clear-info').textContent = `최종 점수: ${score}점`;
                document.getElementById('next-stage-button').style.display = 'none';
            } else {
                document.getElementById('stage-clear-message').textContent = `스테이지 ${stage} 클리어!`;
                document.getElementById('stage-clear-info').textContent = `점수: ${score}점 | 남은 시간: ${stageTimer}초`;
                document.getElementById('next-stage-button').style.display = 'block';
            }
            
            document.getElementById('stage-clear-menu').classList.remove('hidden');
        }

        // 벽돌이 너무 아래로 내려오면 게임 오버
        for (let i = 0; i < bricks.length; i++) {
            if (bricks[i].visible && bricks[i].y + bricks[i].height >= CANVAS_HEIGHT - PADDLE_HEIGHT - 20) {
                gameOver = true;
                showMenu("게임 오버", false);
                break;
            }
        }
    }

    // === 그리기 ===
    function draw() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 배경
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 게임 요소들
        drawBricks();
        drawPaddle();
        drawBall();
        drawItems();
        boss.draw(ctx);
        drawBossProjectiles();

        // 필살기 이펙트
        phoenixEffect.draw(ctx);

        // UI 정보
        ctx.font = "20px Arial";
        ctx.fillStyle = "#FFF";
        ctx.textAlign = "left";
        ctx.fillText(`점수: ${score}`, 10, 30);

        ctx.textAlign = "center";
        ctx.fillText(`스테이지: ${stage}`, CANVAS_WIDTH / 2, 30);

        ctx.textAlign = "right";
        ctx.fillText(`생명: ${lives}`, CANVAS_WIDTH - 10, 30);
        ctx.fillText(`코인: ${coins}`, CANVAS_WIDTH - 10, 60);

        // 자석 활성화 표시
        if (hasMagnet) {
            ctx.textAlign = "left";
            ctx.fillStyle = "#FF00FF";
            ctx.fillText("자석 활성화!", 10, 60);
        }

        // 시간정지 쿨다운 표시
        if (selectedCharacter === 'char3' && timeStopCooldown > 0) {
            ctx.textAlign = "left";
            ctx.fillStyle = "#00FFFF";
            ctx.fillText(`시간정지 쿨다운: ${Math.ceil(timeStopCooldown / 60)}초`, 10, 90);
        }
    }

    // === 게임 루프 ===
    function gameLoop() {
        if (!gameStarted || gameOver) return;

        if (!gamePaused) {
            update();
            draw();
        }

        requestAnimationFrame(gameLoop);
    }

    // === 이벤트 리스너들 ===
    document.getElementById("pause-button").addEventListener("click", togglePause);
    document.getElementById("start-button").addEventListener("click", startGame);
    document.getElementById("resume-button").addEventListener("click", resumeGame);
    document.getElementById("restart-button").addEventListener("click", restartGame);
    document.getElementById("quit-button").addEventListener("click", quitGame);

    // 스테이지 클리어 메뉴
    document.getElementById("next-stage-button").addEventListener("click", function() {
        document.getElementById("stage-clear-menu").classList.add("hidden");
        stage++;
        setupBossForStage(stage);
        resetBall();
        initBricks();
        updateUI();
        startStageTimer();
        gamePaused = false;
        
        bossAttackTimer = setInterval(() => {
            if (boss.visible && !timeStopActive && !gamePaused) {
                boss.spawnProjectiles(stage);
            }
        }, boss.attackInterval);
        
        requestAnimationFrame(gameLoop);
    });

    document.getElementById("quit-stage-button").addEventListener("click", quitGame);

    // 마우스/터치 이벤트
    canvas.addEventListener("mousemove", function (e) {
        const rect = canvas.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;

        if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
            paddle.x = relativeX - paddle.width / 2;
            paddle.x = Math.max(0, Math.min(paddle.x, CANVAS_WIDTH - paddle.width));
        }
    });

    canvas.addEventListener("touchmove", function (e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const relativeX = touch.clientX - rect.left;

        if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
            paddle.x = relativeX - paddle.width / 2;
            paddle.x = Math.max(0, Math.min(paddle.x, CANVAS_WIDTH - paddle.width));
        }
    });

    // 초기화
    updateGaugeUI();
});