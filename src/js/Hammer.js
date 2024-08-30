import Phaser from 'phaser';

export default class Hammer extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'Mangchi'); // 'Mangchi'는 망치 이미지 키
        this.scene = scene;

        // 망치 초기화
        this.scene.add.existing(this); // 망치를 씬에 추가
        this.setOrigin(0.5, 0.5); // 기준점을 중심으로 설정
        this.setScale(1.5); // 크기 설정
        this.setDepth(1); // 깊이 설정, 필요 시 조정 가능

        // 물리 엔진 추가
        this.scene.physics.add.existing(this);

        // 마우스 커서를 감춤
        this.scene.input.setDefaultCursor('none');

        // 마우스 클릭 시 망치 애니메이션 실행
        this.scene.input.on('pointerdown', (pointer) => {
            this.hammerHit(pointer);
        });
    }

    hammerHit(pointer) {
        console.log('Hammer hit!'); // 로그로 확인

        // 망치의 위치를 클릭한 위치로 이동
        this.setPosition(pointer.x, pointer.y);

        // 망치가 회전하면서 내려가는 애니메이션
        this.scene.tweens.add({
            targets: this,
            y: pointer.y + 50, // 클릭 시 아래로 내려가게
            angle: -30, // 회전 각도
            ease: 'Power1',
            duration: 100,
            yoyo: true, // 원래 위치로 돌아오게
            onComplete: () => {
                this.setRotation(0); // 애니메이션이 끝나면 망치를 원래 위치로 되돌림
            }
        });
    }

    update() {
        // Hammer가 제대로 초기화된 후에만 업데이트 실행
        if (this.scene && this.scene.input) {
            const pointer = this.scene.input.activePointer;
    
            // 망치의 위치를 포인터 위치에 맞추어 설정
            this.setPosition(pointer.x, pointer.y);
        }
    }
}
