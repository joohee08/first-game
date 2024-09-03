import Phaser from 'phaser';

import Background from "../images/grass.png";
import Dog from '../images/dog-lose.png';
import Cat from '../images/cat-win.png';
import Win from "../audio/victorywin.mp3";
import Lose from "../audio/lose.mp3";

export default class Ending extends Phaser.Scene {
    constructor() {
        super('ending');
    }

    preload() { // 사전설정
        this.load.image('background', Background);
        this.load.image('Dog', Dog);
        this.load.image('Cat', Cat);

        // BGM 로드
        this.load.audio('Win', Win); // 승리 BGM
        this.load.audio('Lose', Lose); // 패배 BGM
    }

    init(data) {
        this.won = data.won; // 승리했는지 패배했는지 여부
        this.finalScore = data.score !== undefined ? data.score : 0; // 최종 점수, undefined이면 0으로 설정
        this.currentLevel = data.currentLevel || 1; // 현재 레벨
    }

    create() {
        const { width, height } = this.cameras.main;

        // BGM 재생
        if (this.won) {
            this.winBGM = this.sound.add('Win', { loop: true });
            this.winBGM.play();
        } else {
            this.loseBGM = this.sound.add('Lose', { loop: true });
            this.loseBGM.play();
        }

        // 씬이 종료될 때 BGM을 정지하는 이벤트 설정
        this.events.on('shutdown', this.shutdown, this);

        // 마우스 커서 보이도록 설정
        this.input.setDefaultCursor('auto');

        // 배경 이미지 추가
        this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

         // 승리 또는 패배에 따른 이미지 추가
    let characterImage;
    if (this.won) {
        characterImage = this.add.image(width * 0.5, height * 0.45, 'Cat').setScale(0.9).setOrigin(0.5);
    } else {
        characterImage = this.add.image(width * 0.5, height * 0.45, 'Dog').setScale(0.9).setOrigin(0.5);
    }

    // 이미지에 움직임 애니메이션 추가
    this.tweens.add({
        targets: characterImage,
        x: width * 0.7, // 이미지가 오른쪽으로 이동
        y: height * 0.6, // 이미지가 아래로 이동
        duration: 2000, // 2초 동안 이동
        ease: 'Power1', // 애니메이션 이징 함수
        yoyo: true, // 이동 후 원래 위치로 돌아옴
        repeat: -1 // 무한 반복
    });

        // 텍스트 설정
        const resultText = this.won ? 'WIN' : 'LOSE';
        const resultFontSize = Math.max(50, 150 * width / 1920);

        this.add.text(width / 2, height * 0.3, resultText, {
            fontFamily: 'VT323',
            fontSize: `${resultFontSize}px`,
            color: '#ffffff',
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.55, 'YOUR SCORE', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // 최종 점수 표시
        this.add.text(width / 2, height * 0.65, this.finalScore.toString().padStart(4, '0'), {
            fontFamily: 'VT323',
            fontSize: '64px',
            color: '#ffff00',
            backgroundColor: '#000000',
            padding: { left: 80, right: 80, top: 13, bottom: 13 },
            align: 'center'
        }).setOrigin(0.5);

        // 버튼들 설정
        const buttonFontSize = Math.max(25, 50 * width / 1920);
        const buttonPadding = { left: 40, right: 40, top: 15, bottom: 15 };

        if (this.won) {
            const continueButton = this.add.text(width * 0.35, height * 0.8, 'CONTINUE', {
                fontFamily: 'VT323',
                fontSize: `${buttonFontSize}px`,
                color: '#ffffff',
                backgroundColor: '#00bfff',
                padding: buttonPadding,
                align: 'center'
            }).setOrigin(0.5).setInteractive();

            continueButton.on('pointerdown', () => {
                // Round 씬을 다시 시작하며 레벨 증가
                this.scene.start('round', {
                    currentLevel: this.currentLevel + 1,  // 다음 레벨로 이동
                    baseScore: 500 + this.currentLevel * 150,  // 기본 점수 500점 + 레벨당 150점 추가
                    dudugiSpeed: 1000 * Math.pow(0.9, this.currentLevel)  // 두더지 속도 증가
                });
            });
        } else {
            // 패배 시 "RETRY" 버튼
            const retryButton = this.add.text(width * 0.35, height * 0.8, 'RETRY', {
                fontFamily: 'VT323',
                fontSize: `${buttonFontSize}px`,
                color: '#ffffff',
                backgroundColor: '#00bfff',
                padding: buttonPadding,
                align: 'center'
            }).setOrigin(0.5).setInteractive();

            retryButton.on('pointerdown', () => {
                // 게임을 다시 시작
                this.scene.start('round');
            });
        }

        // "TITLE" 버튼 (공통)
        const titleButton = this.add.text(width * 0.65, height * 0.8, 'TITLE', {
            fontFamily: 'VT323',
            fontSize: `${buttonFontSize}px`,
            color: '#ffffff',
            backgroundColor: '#00bfff',
            padding: buttonPadding,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        titleButton.on('pointerdown', () => {
            // 타이틀 화면으로 돌아가기
            this.scene.start('loading');
        });
    }

    shutdown() {
        if (this.winBGM) {
            this.winBGM.stop();
        }
        if (this.loseBGM) {
            this.loseBGM.stop();
        }
    }
}
