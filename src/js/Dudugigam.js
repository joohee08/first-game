import Phaser from 'phaser';

export default class Dudugigam extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, hitSound) { // hitSound 인자를 추가
        super(scene, x, y, 'Dudugi'); // 'Dudugi'는 두더지 이미지 키
        this.scene = scene;
        this.hitSound = hitSound;  // 전달받은 사운드 객체를 저장

        this.scene.add.existing(this);
        this.setInteractive(); // 클릭 가능하도록 설정

        // 초기 위치 설정
        this.defaultY = y; // 두더지가 나타날 위치
        this.hiddenY = y + 100; // 두더지가 숨겨진 위치
        this.setY(this.hiddenY); // 초기 위치를 숨겨진 위치로 설정
        this.visible = false; // 처음에는 보이지 않도록 설정

        // 두더지를 클릭했을 때 이벤트 처리
        this.on('pointerdown', this.hit, this);
    }

    show() {
        // 두더지가 튀어나오는 로직
        this.alive = true;
        this.visible = true;
        this.setY(this.hiddenY); // 처음에 숨겨진 위치에서 시작

        // 부드러운 올라오기 애니메이션
        this.scene.tweens.add({
            targets: this,
            y: this.defaultY, // 두더지를 위로 이동 (튀어나옴)
            duration: 500, // 올라오는 시간
            ease: 'Back.easeOut', // 부드럽게 빠르게 올라오는 이징
        });

        // 일정 시간 후에 자동으로 내려가도록 설정 (두더지가 타격되지 않았을 경우)
        this.scene.time.delayedCall(1000, this.hide, [], this); // 1초 후 내려가기
    }

    hide() {
        // 두더지가 내려가는 로직
        this.alive = false;
        this.scene.tweens.add({
            targets: this,
            y: this.hiddenY, // 두더지를 아래로 이동 (내려감)
            duration: 500, // 내려가는 시간
            ease: 'Cubic.easeIn', // 부드럽게 천천히 내려가는 이징
            onComplete: () => {
                this.visible = false; // 내려간 후에 보이지 않도록 설정
            }
        });
    }

    hit() {
        // 두더지가 맞았을 때의 처리 로직
        if (this.alive) {
            this.alive = false;
            this.setTint(0xff0000); // 색상을 변경 (타격 표시)

            // 효과음 재생
            if (this.hitSound) {
                this.hitSound.play();
            }

            // 타격 후 바로 내려가기
            this.scene.time.delayedCall(100, () => {
                this.clearTint();
                this.hide();  // 맞은 후 바로 내려가기
            }, [], this);

            // 점수 증가 로직을 여기서 호출
            this.scene.score.increaseScore2(10);
        }
    }
}
