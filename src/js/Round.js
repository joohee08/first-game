import Phaser from "phaser";

// 이미지
import Grass from '@/images/grass.png';
import Dudugi from '@/images/dudugi-img.png';
import Hole from '@/images/hole.png';
import Mangchi from '@/images/mangchi.png';
import rabbit from '@/images/rabbit.png';
import Timer from '@/images/timer.png';
import gamebgm from "@/audio/gamebgm.mp3";
import Hitdudu from "@/audio/hitdudu.mp3";

// 두더지
import Dudugigam from '@/js/Dudugigam';

// 망치
import Hammer from '@/js/Hammer';

// 점수
import Score from '@/js/Score';

// 타이머
import Time from '@/js/Time';

export default class Round extends Phaser.Scene {

    constructor() {
        super('round'); // 식별자 설정
    }

    preload() { // 사전설정
        this.load.image('background', Grass);
        this.load.image('Dudugi', Dudugi);
        this.load.image('Hole', Hole);
        this.load.image('Mangchi', Mangchi);
        this.load.image('rabbit', rabbit);
        this.load.image('Timer', Timer);
        this.load.audio('gameBGM', gamebgm); // 게임 진행 중 BGM
        this.load.audio('Hitdudu', Hitdudu); // 두더지 때릴 때 효과음
    }

    create(data) {
        // BGM 재생
        this.gameBGM = this.sound.add('gameBGM', { loop: true });
        this.gameBGM.play();

        // 두더지 때릴 때 효과음 설정
        this.hitSound = this.sound.add('Hitdudu');

        // 씬이 종료될 때 BGM을 정지하는 이벤트 설정
        this.events.on('shutdown', this.shutdown, this);

        // 생성 및 초기화
        this.initData(data);
        this.setupScene();
        this.startGame();
    }

    initData(data) {
        // 씬이 재시작될 때 데이터를 초기화
        this.currentLevel = (data && data.currentLevel) || 1;
        this.baseScore = (data && data.baseScore) || 500;
        this.timeLimit = 60; // 타이머 제한 시간 (초)
        this.dudugiSpeed = (data && data.dudugiSpeed) || 1000;
    }

    setupScene() {
        const { x, y, width, height } = this.cameras.main;
    
        // 흰색 배경 추가
        this.add.rectangle(x + width / 2, y + height / 2, width, height, 0xffffff)
            .setOrigin(0.5);
    
        // 배경 이미지 추가
        this.background = this.add.tileSprite(
            x,
            y - 40, // 배경 Y 오프셋
            width,
            height - 100, // 배경 높이 조정
            'background'
        ).setOrigin(0).setScrollFactor(0, 1);
    
        // 레벨 표시
        const levelText = this.add.text(width / 2, height / 2, `Level ${this.currentLevel}`, {
            fontFamily: 'Arial',
            fontSize: '100px',
            color: '#ffffff',
            fontweight: "bold",
        }).setOrigin(0.5);
    
        // 레벨 텍스트가 타이머보다 앞에 오도록 깊이 설정
        levelText.setDepth(10);
    
        // 2초 후 레벨 텍스트를 숨기고 게임 시작
        this.time.delayedCall(2000, () => {
            levelText.setVisible(false);
            this.startGame();
        });
    
        // 두더지 배열 초기화
        this.dudugis = [];
    
        const rows = 3;  // 3x3 배열로 변경
        const cols = 3;
        const spacingX = width / (cols + 3.5);
        const spacingY = height / (rows + 1);
        const offsetX = 500;
        const offsetY = -30;
    
        // 두더지 생성
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const posX = spacingX * (col + 1) + offsetX;
                const posY = spacingY * (row + 1) + offsetY;
    
                // 구멍 이미지 추가
                this.add.image(posX, posY, 'Hole').setScale(1.4);
    
                // 두더지 생성 (this.hitSound를 전달)
                const dudugi = new Dudugigam(this, posX - 20, posY - 57, this.hitSound).setScale(1.3);
                this.dudugis.push(dudugi);
            }
        }    

        // 랜덤으로 두더지 나타내기
        this.time.addEvent({
            delay: this.dudugiSpeed,
            callback: this.showRandomDudugi,
            callbackScope: this,
            loop: true
        });

        // 토끼 그림
        this.rabbit = this.add.image(width * 0.25, height * 0.4, 'rabbit');

        // 점수판과 타이머를 왼쪽으로 이동
        this.score = new Score(this, width * 0.25, height * 0.54, width * 0.25, height * 0.69);
        this.score.increaseScore1(this.baseScore);
        this.score.increaseScore2(0);

        this.timer = new Time(this, width * 0.25, height * 0.2, this.timeLimit);

        // Hammer 인스턴스 생성
        this.hammer = new Hammer(this, width / 2, height / 2);

        // 망치와 두더지의 충돌을 감지하는 콜라이더 추가
        this.physics.add.overlap(this.hammer, this.dudugis, this.hitDudugi, null, this);
    }

    startGame() {
        // 게임 시작 시 필요한 추가 로직이 있다면 여기에 작성
    }

    showRandomDudugi() {
        const activeDudugis = Phaser.Math.Between(1, 2);
        for (let i = 0; i < activeDudugis; i++) {
            const randomIndex = Phaser.Math.Between(0, this.dudugis.length - 1);
            this.dudugis[randomIndex].show();
        }
    }

    hitDudugi(hammer, dudugi) {
        if (dudugi.visible) {
            dudugi.hide();
            this.score.increaseScore2(10);
        }
    }

    timeUp() {
        if (this.score.score2 >= this.baseScore) {
            // 승리했을 때 다음 레벨로 이동
            this.scene.start('ending', { 
                won: true, 
                score: this.score.score2, 
                currentLevel: this.currentLevel // 현재 레벨을 전달
            });
        } else {
            // 실패했을 때 현재 레벨로 종료
            this.scene.start('ending', { 
                won: false, 
                score: this.score.score2, 
                currentLevel: this.currentLevel // 현재 레벨을 전달
            });
        }
    }

    update() {
        if (this.hammer && this.timer) {
            this.hammer.update();
            this.timer.update();
        }
    }

    nextLevel() {
        // 레벨 증가
        this.currentLevel++;
        this.baseScore += 150;
        this.dudugiSpeed *= 0.9;

        // 씬 재시작 시 새로운 레벨 정보 전달
        this.scene.restart({
            currentLevel: this.currentLevel,
            baseScore: this.baseScore,
            dudugiSpeed: this.dudugiSpeed,
        });
    }

    shutdown() {
        if (this.gameBGM) {
            this.gameBGM.stop();
        }
    }
}
