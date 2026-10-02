/* بوكيه — صفحات المحتوى البسيطة (السياسات)  |  Bouquet — simple content pages */
(function () {
  'use strict';
  const wa = document.getElementById('polWa');
  if (wa) wa.href = `https://wa.me/${(window.BQ_CONFIG || {}).whatsapp}`;
  BQ.motion.init();
})();
