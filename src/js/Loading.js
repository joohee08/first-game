import Phaser from "phaser";

import Background from "@/images/grass.png";
import Dudugis from "@/images/dudugi-title.png";
import titlebgm from "@/audio/titlebgm.mp3";
import gamebgm from "@/audio/gamebgm.mp3";

export default class Loading extends Phaser.Scene {

    constructor() {
        super('loading');
    }
    
    preload() { 
        // 게임에 필요한 이미지나 리소스를 로드
        this.load.image('background', Background);
        this.load.image('dudugis', Dudugis); 
        this.load.audio('titlebgm', titlebgm); // 타이틀 BGM 로드
        this.load.audio('gamebgm', gamebgm);  // 게임 BGM 로드
    }
    
    create() { 
         // 타이틀 BGM 자동 재생 시도
         this.titlebgm = this.sound.add('titlebgm', { loop: true });
         this.titlebgm.play({ volume: 0.5 });

        const { x, y, width, height } = this.cameras.main;

        // 흰색 배경 추가
        this.add.rectangle(x + width / 2, y + height / 2, width, height, 0xffffff)
            .setOrigin(0.5);

        // 배경 위치와 크기 조정
        const backgroundYOffset = -40;
        const backgroundHeight = height - 100;
        this.background = this.add.tileSprite(
            x, 
            y + backgroundYOffset, 
            width, 
            backgroundHeight, 
            'background'
        ).setOrigin(0)
         .setScrollFactor(0, 1);

        // 글꼴 크기 계산
        const titleFontSize = Math.max(50, 130 * width / 1920);
        const GameStartFontSize = Math.max(35, 75 * width / 1920);

        const center = {
            x: x + width / 2,
            y: y + height / 2
        };

        // 제목
        this.title = this.add.text(
            center.x + 20,
            height * 1.5 / 5, 
            '두더지\n 잡기'
        )
        .setFontFamily('Poor Story')
        .setFill('#fff')
        .setFontSize(titleFontSize)
        .setOrigin(0.5)
        .setDepth(999)
        .setAlign('center');

        // 두더지 이미지
        this.dudugi = this.add.image(center.x + 40, center.y + 100, 'dudugis')
                             .setOrigin(0.5)
                             .setScale(2.0);

        // 클릭메세지 위치 조정
        const gamestartXPosition = center.x + 30;
        const gamestartYPosition = center.y + 230;

        // "GAME START" 텍스트
        this.GameStart = this.add.text(
            gamestartXPosition,
            gamestartYPosition,
            'GAME START'
        )
        .setFontFamily('Poor Story')
        .setFill('#fff')
        .setFontSize(GameStartFontSize)
        .setOrigin(0.5)
        .setDepth(999)
        .setAlign('center')
        .setInteractive();  // 상호작용 가능하게 설정

        // Tween 애니메이션(깜빡임) 추가
        this.tweens.add({
            targets: this.GameStart,
            alpha: 0,
            duration: 1000,
            repeat: -1,
            yoyo: true,
            ease: 'EaseInOut',
        });

        // "GAME START" 클릭 이벤트
        this.GameStart.on('pointerdown', () => {
            // 타이틀 BGM 멈추기
            this.titlebgm.stop();

            // 다음 씬으로 전환
            this.scene.transition({ target: 'round', duration: 500 });
        });
    }
    
    update() { 
        // 게임 루프를 통해 계속 실행되는 로직을 작성
    }
}
