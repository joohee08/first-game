import Phaser from 'phaser';

export default class Time {
    constructor(scene, x, y, timeLimit = 3) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.timeLimit = timeLimit; // 타이머 제한 시간 (초)
        this.startTime = this.scene.time.now;

        // 타이머 이미지 추가 및 크기 조정
        this.timerImage = this.scene.add.image(x, y, 'Timer').setOrigin(0.5).setScale(1.2); // 이미지 크기를 키움

        // 남은 시간을 표시할 텍스트 추가 (이미지 중앙에 표시)
        this.timerText = this.scene.add.text(x, y, this.timeLimit.toString(), {
            fontFamily: 'VT323',
            fontSize: '50px', // 텍스트 크기를 조정
            color: '#ffffff',
            align: 'center',
        }).setOrigin(0.5, 0.5);

        // 초기 타이머 설정
        this.updateTimer();
    }

    updateTimer() {
        const elapsedTime = (this.scene.time.now - this.startTime) / 1000; // 초 단위 경과 시간
        const remainingTime = Math.max(0, this.timeLimit - elapsedTime);
        this.timerText.setText(Math.ceil(remainingTime).toString());

        // 타이머가 0이 되었을 때 처리할 로직
        if (remainingTime <= 0) {
            this.scene.timeUp();
        }
    }

    update() {
        this.updateTimer();
    }
}
