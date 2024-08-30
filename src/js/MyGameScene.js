import Phaser from 'phaser';
import Score from './Score'; // Score 클래스를 임포트

class MyGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MyGameScene' });
    }

    create() {
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;

        const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS;

        // 모바일과 데스크탑에 따라 다른 폰트 크기와 패딩 설정
        const fontSize = isMobile ? 30 : 50;
        const padding = {
            left: isMobile ? 20 : 40,
            right: isMobile ? 20 : 40,
            top: isMobile ? 5 : 10,
            bottom: isMobile ? 5 : 10
        };

        // Score 객체를 생성하면서 모바일 기기인지에 따라 위치와 크기를 다르게 설정
        this.score = new Score(
            this,
            isMobile ? width * 0.15 : width * 0.1,
            isMobile ? height * 0.2 : height * 0.1,
            isMobile ? width * 0.3 : width * 0.2,
            isMobile ? height * 0.3 : height * 0.2,
            fontSize,
            padding
        );
    }

    // 게임 로직에서 점수를 증가시킬 때 사용하는 예시
    someEventThatIncreasesScore() {
        this.score.increaseScore1(10); // 첫 번째 점수판의 점수를 10만큼 증가
        this.score.increaseScore2(5);  // 두 번째 점수판의 점수를 5만큼 증가
    }

    // 게임 리셋 시 점수도 초기화
    resetGame() {
        this.score.resetScores();
    }
}

export default MyGameScene;
