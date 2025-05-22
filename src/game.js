// 모듈 임포트 방식 수정
import { Player } from './Player.js';
import { updateGaugeUI } from './GaugeUI.js';
import { Boss } from './Boss.js';

// 게임 초기화 함수
document.addEventListener('DOMContentLoaded', function() {
    // Player 인스턴스 생성
    const player = new Player();
    
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
    const NEW_ROW_INTERVAL_MIN = 15000; // 15초
    const NEW_ROW_INTERVAL_MAX = 25000; // 25초
    const ITEM_FALL_SPEED = 2;
    const MAGNET_DURATION = 5000; // 5초
    const POINTS_PER_LEVEL = 500; // 스테이지 증가에 필요한 점수

    // 초기 게이지 업데이트
    updateGaugeUI(player);

    //보스 인스턴스생성
    const boss = new Boss(CANVAS_WIDTH,10,20);

    // 상태 변수
    let gameStarted = false;
    let gamePaused = false;
    let gameOver = false;
    let score = 0;
    let previousScore = 0;
    let lives = MAX_LIVES;
    let coins = 0;
    let stage = 1;
    let leftPressed = false;
    let rightPressed = false;
    let hasMagnet = false;
    let magnetTimer = null;
    let newRowTimer = null;

    // 캔버스 설정
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");

    // 패들 설정
    const paddle = {
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
        y: CANVAS_HEIGHT - PADDLE_HEIGHT - 10,
        color: "#4CAF50",
        speed: PADDLE_SPEED
    };

    // 공 설정
    const ball = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10,
        radius: BALL_RADIUS,
        dx: 3.5, // 공 속도 감소
        dy: -3.5, // 공 속도 감소
        color: "#FFFFFF",
        power: 1 // 공의 공격력
    };

    // 벽돌 배열 초기화
    let bricks = [];
    function initBricks() {
        bricks = [];
        for (let r = 0; r < BRICK_ROWS; r++) {
            for (let c = 0; c < BRICK_COLUMNS; c++) {
                const health = Math.floor(Math.random() * 5) + 1; // 1~5 랜덤 체력
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

    // 아이템 배열 초기화
    let items = [];
    const itemTypes = ["heart", "coin", "magnet"];

    // 이벤트 리스너
    document.addEventListener("keydown", function (e) {
        if (e.keyCode === 37) {
            leftPressed = true;
        } else if (e.keyCode === 39) {
            rightPressed = true;
        }
    });

    document.addEventListener("keyup", function (e) {
        if (e.keyCode === 37) {
            leftPressed = false;
        }
        else if (e.keyCode === 39) {
            rightPressed = false;
        }
        else if (e.keyCode === 27) { // ESC 키
            togglePause();
        }
        // F 키 (필살기)
        else if (e.keyCode === 70) { 
            if (player.canUseSkill()) {
                const gainedScore = player.useSkill(bricks);
                score += gainedScore; // 획득한 점수 추가
                updateUI(); // 점수, 코인 반영
            }
        }
    });

    // 버튼 이벤트 리스너 (jQuery 대신 표준 DOM API 사용)
    document.getElementById("pause-button").addEventListener("click", function () {
        togglePause();
    });

    document.getElementById("start-button").addEventListener("click", function () {
        startGame();
        // 시작하기와 나가기 버튼 숨기기
        document.getElementById("start-button").style.display = "none";
        document.getElementById("quit-button").style.display = "none";
    });

    document.getElementById("resume-button").addEventListener("click", function () {
        resumeGame();
    });

    document.getElementById("restart-button").addEventListener("click", function () {
        restartGame();
    });

    document.getElementById("quit-button").addEventListener("click", function () {
        quitGame();
    });

    // 게임 메뉴 표시
    showMenu("게임 시작", true);

    let bossAttackTimer = null;

    // 게임 시작 함수
    function startGame() {
        gameStarted = true;
        gameOver = false;
        gamePaused = false;
        score = 0;
        previousScore = 0;
        lives = MAX_LIVES;
        coins = 0;
        stage = 1;
        updateUI();
        initBricks();
        resetBall();
        document.getElementById("game-menu").classList.add("hidden");
        //startNewRowTimer();

        // 3초마다 보스가 투사체 2개 발사
        bossAttackTimer = setInterval(() => {
            if (boss.visible) {
                boss.spawnProjectiles();
            }
        }, 3000); 
        
        requestAnimationFrame(gameLoop);
    }

    // 게임 재시작 함수
    function restartGame() {
        startGame();
    }

    // 게임 일시정지 토글 함수
    function togglePause() {
        if (!gameStarted || gameOver) return;

        gamePaused = !gamePaused;
        if (gamePaused) {
            showMenu("일시정지", false, true);
            if (newRowTimer) {
                clearTimeout(newRowTimer);
            }
        } else {
            resumeGame();
        }
    }

    // 게임 재개 함수
    function resumeGame() {
        if (!gameStarted || gameOver) return;

        gamePaused = false;
        document.getElementById("game-menu").classList.add("hidden");
        //startNewRowTimer();
        requestAnimationFrame(gameLoop);
    }

    // 게임 종료 함수
    function quitGame() {
        gameStarted = false;
        gamePaused = false;
        gameOver = false;
        if (newRowTimer) {
            clearTimeout(newRowTimer);
        }
        showMenu("게임 시작", true);
    }

    // 메뉴 표시 함수
    function showMenu(message, isStart = false, isPaused = false) {
        document.getElementById("menu-message").textContent = message;
        document.getElementById("game-menu").classList.remove("hidden");

        // 버튼 표시/숨김 처리
        document.getElementById("start-button").style.display = isStart ? "block" : "none";
        document.getElementById("resume-button").style.display = isPaused ? "block" : "none";
        document.getElementById("restart-button").style.display = !isStart ? "block" : "none";
        document.getElementById("quit-button").style.display = "block"; // 항상 표시
    }

    // UI 업데이트 함수
    function updateUI() {
        document.getElementById("score").textContent = score;
        document.getElementById("hearts").textContent = lives;
        document.getElementById("coins").textContent = coins;
        document.getElementById("stage").textContent = stage;

        // 필살기 게이지 업데이트
        updateGaugeUI(player);
    }

    // 공 리셋 함수
    function resetBall() {
        ball.x = paddle.x + paddle.width / 2;
        ball.y = CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10;
        // 공 방향 랜덤화(좌우)
        ball.dx = Math.random() > 0.5 ? 3.5 : -3.5;
        ball.dy = -3.5;
    }

    // 난이도 체크 및 업데이트
    function checkLevelProgress() {
        // 일정 점수마다 레벨 업
        if (score >= previousScore + POINTS_PER_LEVEL) {
            previousScore = score;
            increaseLevel();
        }
    }

    // 레벨 증가 함수
    function increaseLevel() {
        stage++;
        updateUI();

        // 속도 증가 (난이도 조절)
        if (ball.dx > 0) ball.dx = Math.min(ball.dx + 0.2, 10);
        else ball.dx = Math.max(ball.dx - 0.2, -10);

        if (ball.dy > 0) ball.dy = Math.min(ball.dy + 0.2, 10);
        else ball.dy = Math.max(ball.dy - 0.2, -10);
    }

    // 새 벽돌 줄 추가 타이머 시작
    function startNewRowTimer() {
        if (newRowTimer) clearTimeout(newRowTimer);
        const interval = Math.floor(Math.random() * (NEW_ROW_INTERVAL_MAX - NEW_ROW_INTERVAL_MIN + 1)) + NEW_ROW_INTERVAL_MIN;
        newRowTimer = setTimeout(addNewBrickRow, interval);
    }

    // 새 벽돌 줄 추가 함수
    function addNewBrickRow() {
        // 모든 벽돌 한 줄 아래로 이동
        console.log("보스 체력 줄었음 → 벽돌 한 줄 추가됨");
        bricks.forEach(brick => {
            if (brick.visible) {
                brick.y += BRICK_HEIGHT + BRICK_PADDING;
            }
        });

        // 새 벽돌 줄 추가
        for (let c = 0; c < BRICK_COLUMNS; c++) {
            const health = Math.floor(Math.random() * 5) + 1; // 1~5 랜덤 체력
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

        // 다음 타이머 설정
        //startNewRowTimer();
    }

    // 아이템 생성 함수
    function createItem(x, y) {
        // 아이템 드롭 확률 30%
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

    // 아이템 획득 함수
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
        checkLevelProgress(); // 아이템 획득 후 레벨 체크
    }

    // 자석 아이템 활성화
    function activateMagnet() {
        hasMagnet = true;
        // 이전 타이머가 있으면 제거
        if (magnetTimer) clearTimeout(magnetTimer);

        // 자석 효과 표시 (패들 색상 변경)
        paddle.color = "#FF00FF";

        // 자석 지속 시간 설정
        magnetTimer = setTimeout(() => {
            hasMagnet = false;
            paddle.color = "#4CAF50";
        }, MAGNET_DURATION);
    }

    // 자석 효과: 모든 아이템 자동 획득
    function magnetEffect() {
        if (!hasMagnet) return;

        const itemsToRemove = [];
        items.forEach((item, index) => {
            // 화면 내의 모든 아이템 획득
            collectItem(item);
            itemsToRemove.push(index);
        });

        // 획득한 아이템 제거
        for (let i = itemsToRemove.length - 1; i >= 0; i--) {
            items.splice(itemsToRemove[i], 1);
        }
    }

    // 게임 오버 체크
    function checkGameOver() {
        // 체력이 0이면 게임 오버
        if (lives <= 0) {
            gameOver = true;
            showMenu("게임 오버", false);
            if (newRowTimer) {
                clearTimeout(newRowTimer);
            }
        }

        // 벽돌이 너무 아래로 내려오면 게임 오버
        for (let i = 0; i < bricks.length; i++) {
            if (bricks[i].visible && bricks[i].y + bricks[i].height >= CANVAS_HEIGHT - PADDLE_HEIGHT - 20) {
                gameOver = true;
                showMenu("게임 오버", false);
                if (newRowTimer) {
                    clearTimeout(newRowTimer);
                }
                break;
            }
        }
    }

    // 충돌 감지 - 공과 벽돌
    function checkBrickCollision() {
        for (let i = 0; i < bricks.length; i++) {
            const brick = bricks[i];
            if (brick.visible) {
                // 간단한 충돌 감지 (AABB)
                if (
                    ball.x + ball.radius > brick.x &&
                    ball.x - ball.radius < brick.x + brick.width &&
                    ball.y + ball.radius > brick.y &&
                    ball.y - ball.radius < brick.y + brick.height
                ) {
                    // 충돌 방향에 따라 공 반사
                    const distX = Math.abs(ball.x - (brick.x + brick.width / 2));
                    const distY = Math.abs(ball.y - (brick.y + brick.height / 2));

                    // 가로/세로 충돌 방향 판단
                    if (distX > distY) {
                        ball.dx = -ball.dx;
                    } else {
                        ball.dy = -ball.dy;
                    }

                    // 벽돌 체력 감소
                    brick.health -= ball.power;

                    // 벽돌 파괴됨
                    if (brick.health <= 0) {
                        brick.visible = false;

                        // 점수 증가
                        score += brick.maxHealth * 10;
                        updateUI();

                        // 레벨 체크
                        checkLevelProgress();

                        // 아이템 생성
                        createItem(brick.x + brick.width / 2, brick.y + brick.height / 2);

                        // 벽돌 파괴 시 필살기 게이지 갱신
                        player.chargeGauge();
                        updateGaugeUI(player);
                    }

                    // 한 번에 하나의 벽돌만 처리
                    break;
                }
            }
        }
    }

    // 충돌 감지 - 공과 패들
    function checkPaddleCollision() {
        if (
            ball.y + ball.radius > paddle.y &&
            ball.y + ball.radius < paddle.y + paddle.height &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
        ) {
            // 패들과 충돌 위치에 따라 반사 각도 조정
            const hitPos = (ball.x - paddle.x) / paddle.width;
            const angle = hitPos * Math.PI - Math.PI / 2; // -90도 ~ 90도

            const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
            ball.dx = speed * Math.cos(angle);
            ball.dy = -Math.abs(speed * Math.sin(angle)); // 항상 위로 반사
        }
    }

    // 충돌 감지 - 패들과 아이템
    function checkItemCollision() {
        const itemsToRemove = [];

        items.forEach((item, index) => {
            // 아이템이 화면 밖으로 나가면 제거
            if (item.y > CANVAS_HEIGHT) {
                itemsToRemove.push(index);
                return;
            }

            // 패들과 아이템 충돌
            if (
                item.x < paddle.x + paddle.width &&
                item.x + item.width > paddle.x &&
                item.y < paddle.y + paddle.height &&
                item.y + item.height > paddle.y
            ) {
                collectItem(item);
                itemsToRemove.push(index);
            }
        });

        // 제거할 아이템 처리
        for (let i = itemsToRemove.length - 1; i >= 0; i--) {
            items.splice(itemsToRemove[i], 1);
        }
    }

    // 그리기 함수들
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = paddle.color;
        ctx.fill();
        ctx.closePath();
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
                // 체력에 따른 벽돌 색상 (체력이 낮을수록 어두워짐)
                const healthPercent = brick.health / brick.maxHealth;
                const r = Math.floor(255 * healthPercent);
                const g = Math.floor(100 * healthPercent + 50);
                const b = Math.floor(50 * healthPercent);

                ctx.beginPath();
                ctx.rect(brick.x, brick.y, brick.width, brick.height);
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fill();
                ctx.strokeStyle = "#333";
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.closePath();

                // 체력 표시
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

            // 아이템 타입에 따른 모양과 색상
            switch (item.type) {
                case "heart":
                    ctx.fillStyle = "#FF5555";
                    // 하트 모양 그리기
                    ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
                    break;
                case "coin":
                    ctx.fillStyle = "#FFD700";
                    // 동전 모양 그리기
                    ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
                    break;
                case "magnet":
                    ctx.fillStyle = "#FF00FF";
                    // 자석 모양 그리기
                    ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
                    break;
            }

            ctx.fill();
            ctx.closePath();

            // 아이템 타입 표시
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

    // 게임 업데이트 함수
    function update() {
        // 게임 오버나 일시정지 상태면 업데이트 하지 않음
        if (gameOver || gamePaused) return;

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
            magnetEffect();
        }

        // 벽 충돌 (좌우)
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > CANVAS_WIDTH) {
            ball.dx = -ball.dx;
        }

        // 천장 충돌
        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
        }

        // 바닥 충돌 (생명 감소)
        if (ball.y + ball.radius > CANVAS_HEIGHT) {
            lives--;
            updateUI();

            if (lives <= 0) {
                gameOver = true;
                showMenu("게임 오버", false);
                if (newRowTimer) {
                    clearTimeout(newRowTimer);
                }
            } else {
                resetBall();
            }
        }

        // 충돌 감지
        checkPaddleCollision();
        checkBrickCollision();
        checkItemCollision();
        boss.checkCollision(ball, addNewBrickRow); //보스 충돌

        //보스 투사체 이동 및 충돌돌
        boss.projectiles.forEach((proj, i) => {
            proj.y += 4;

            if (proj.y > CANVAS_HEIGHT) {
                boss.projectiles.splice(i, 1);
            }

            if (
                proj.y + proj.height >= paddle.y &&
                proj.x < paddle.x + paddle.width &&
                proj.x + proj.width > paddle.x
            ) {
                boss.projectiles.splice(i, 1);
                lives = Math.max(0, lives - 1);
                updateUI();
                if (lives <= 0) {
                    gameOver = true;
                    showMenu("게임 오버", false);
                }
            }
        });

        // 게임 오버 조건 체크
        checkGameOver();
    }

    // 그리기 함수
    function draw() {
        // 캔버스 초기화
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 배경 그리기
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 게임 요소 그리기
        drawBricks();
        drawPaddle();
        drawBall();
        drawItems();

        // 현재 점수 표시
        ctx.font = "20px Arial";
        ctx.fillStyle = "#FFF";
        ctx.textAlign = "left";
        ctx.fillText(`점수: ${score}`, 10, 30);

        // 스테이지 표시
        ctx.textAlign = "center";
        ctx.fillText(`스테이지: ${stage}`, CANVAS_WIDTH / 2, 30);

        // 생명 표시
        ctx.textAlign = "right";
        ctx.fillText(`생명: ${lives}`, CANVAS_WIDTH - 10, 30);

        // 동전 표시
        ctx.fillText(`코인: ${coins}`, CANVAS_WIDTH - 10, 60);

        // 자석 활성화 표시
        if (hasMagnet) {
            ctx.textAlign = "left";
            ctx.fillStyle = "#FF00FF";
            ctx.fillText("자석 활성화!", 10, 60);
        }

        //보스 그리기
        boss.draw(ctx);

        //보스 투사체 그리기
        boss.projectiles.forEach(proj => {
            ctx.fillStyle = "#FFAA00";
            ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
        });

    }

    // 게임 루프
    function gameLoop() {
        if (!gameStarted || gameOver) return;

        if (!gamePaused) {
            update();
            draw();
        }

        requestAnimationFrame(gameLoop);
    }

    // 터치 이벤트 지원 (모바일용)
    canvas.addEventListener("touchmove", function (e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const relativeX = touch.clientX - rect.left;

        if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
            paddle.x = relativeX - paddle.width / 2;
        }
    });

    // 마우스 이벤트 지원
    canvas.addEventListener("mousemove", function (e) {
        const rect = canvas.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;

        if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
            paddle.x = relativeX - paddle.width / 2;
        }
    });
});