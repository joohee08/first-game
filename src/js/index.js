import Phaser from 'phaser';


import Loading from './Loading.js';
import Round from './Round.js';
import Ending from './Ending.js';

// 웹 폰트(Web font) 설정 - Google Web Font Loader 사용
import WebFont from 'webfontloader';

WebFont.load({
    google: {
        families: ['Do Hyeon', 'Hanna', 'Binggrae', 'CookieRun', 'Poor Story', 'orbitron', 'VT323']
    },
    active: function() {
        // 게임 설정 - 웹 폰트 로딩 후 생성
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,  // 현재 창 크기에 맞추기
            height: window.innerHeight,
            physics: { // 물리엔진
                default: 'arcade', // arcade 엔진
                arcade: {
                    // debug: true, // 디버깅 사용
                }
            },
            scale: {
                mode: Phaser.Scale.FIT,// 화면에 맞추기 위해 비율 조정
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 1920,  // 기본 폭 설정
                height: 1080, // 기본 높이 설정
            },
            // 장면 설정
            scene: [Loading, Round, Ending]
        }

        const game = new Phaser.Game(config);

        // 브라우저 창 크기 변경 시 게임 크기 조정
        window.addEventListener('resize', () => {
            game.scale.resize(window.innerWidth, window.innerHeight);
        });
    }
});
