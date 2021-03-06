import MessageBox from 'mint-ui/lib/message-box';
import 'mint-ui/lib/message-box/style.css';
import Toast from 'mint-ui/lib/toast';
import 'mint-ui/lib/toast/style.css';
import Indicator from 'mint-ui/lib/indicator';
import 'mint-ui/lib/indicator/style.css';

window.MessageBox = MessageBox;
window.Toast = Toast;
window.Indicator = Indicator;

const { app, store, router } = require('./main.js'); // 使用 require, 确保在 MessageBox 加载完之后

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  app.$mount('#app');
});

// 配置文件定义
// && 'https:' === location.protocol
if (SERVICE_WORKER && process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
