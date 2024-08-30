import Phaser from 'phaser';

export default class Score {
    constructor(scene, x1, y1, x2, y2) {
        this.scene = scene;

        // 첫 번째 점수판(노란색)
        this.score1 = 0;
        this.scoreText1 = this.scene.add.text(x1, y1, '0000', {
            fontFamily: 'VT323',
            fontSize: '50px',
            color: '#ffff00',
            backgroundColor: '#000000',
            padding: { left: 40, right: 40, top: 10, bottom: 10 },
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // 두 번째 점수판(빨간색)
        this.score2 = 0;
        this.scoreText2 = this.scene.add.text(x2, y2, '0000', {
            fontFamily: 'VT323',
            fontSize: '50px',
            color: '#ff0000',
            backgroundColor: '#000000',
            padding: { left: 40, right: 40, top: 13, bottom: 13 },
            align: 'center'
        }).setOrigin(0.5, 0.5);
    }

    // 첫 번째 점수판의 점수를 증가시키는 메서드
    increaseScore1(points) {
        this.score1 += points;
        this.scoreText1.setText(this.score1.toString().padStart(4, '0'));
    }

    // 두 번째 점수판의 점수를 증가시키는 메서드
    increaseScore2(points) {
        this.score2 += points;
        this.scoreText2.setText(this.score2.toString().padStart(4, '0'));
    }

    // 점수 초기화
    resetScores() {
        this.score1 = 0;
        this.score2 = 0;
        this.updateScores();
    }

    // 점수를 갱신하여 표시
    updateScores() {
        this.scoreText1.setText(this.score1.toString().padStart(4, '0'));
        this.scoreText2.setText(this.score2.toString().padStart(4, '0'));
    }
}
