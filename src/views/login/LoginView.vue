<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, shallowRef, useTemplateRef } from 'vue';
import { gsap } from 'gsap';
import { useRouter } from 'vue-router';
import { loginApi } from '@/api/login';
import { useUserStore } from '@/stores';
import CyberBorderFrame from './components/CyberBorderFrame.vue';

type Metric = {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
};

const router = useRouter();
const userStore = useUserStore();

const account = shallowRef('');
const password = shallowRef('');
const accessCode = shallowRef('');
const signalStrength = shallowRef(86);
const packetCount = shallowRef(2048);
const loginLoading = shallowRef(false);
const loginError = shallowRef('');

const metrics = reactive<Metric[]>([
  { label: 'CPU', value: 41, unit: '%', min: 18, max: 96 },
  { label: '内存', value: 63, unit: '%', min: 32, max: 91 },
  { label: '网络', value: 128, unit: 'MB/s', min: 42, max: 420 },
  { label: '延迟', value: 18, unit: 'ms', min: 6, max: 76 },
]);

const logs = reactive([
  '建立加密信道...',
  '同步节点密钥...',
  '监听本地入侵检测...',
  '等待身份校验...',
]);

const currentTime = shallowRef('');
const cardRef = useTemplateRef<HTMLFormElement>('cardRef');
const buttonRef = useTemplateRef<HTMLButtonElement>('buttonRef');
const buttonLightRef = useTemplateRef<HTMLSpanElement>('buttonLightRef');
let timer: number | undefined;
let gsapContext: gsap.Context | undefined;

const identityText = computed(() => account.value.toUpperCase());

const randomBetween = (min: number, max: number) => {
  return Math.round(min + Math.random() * (max - min));
};

const updateMockData = () => {
  metrics.forEach((item) => {
    item.value = randomBetween(item.min, item.max);
  });

  signalStrength.value = randomBetween(68, 99);
  packetCount.value += randomBetween(16, 96);
  currentTime.value = new Date().toLocaleTimeString('zh-CN', { hour12: false });
};

const handleLogin = async () => {
  if (loginLoading.value) {
    return;
  }

  loginLoading.value = true;
  loginError.value = '';

  try {
    const result = await loginApi({
      username: account.value,
      password: password.value,
      code: accessCode.value,
    });
    const token = result.token || result.accessToken;

    if (!token) {
      throw new Error('登录接口未返回 token');
    }

    localStorage.setItem('token', token);
    userStore.setToken(token);
    router.push({ name: 'home' });
  } catch (error) {
    loginError.value = error instanceof Error ? error.message : '登录失败，请稍后重试';
  } finally {
    loginLoading.value = false;
  }
};

const playButtonEffect = () => {
  if (!buttonRef.value) {
    return;
  }

  gsap.to(buttonRef.value, {
    scale: 1.02,
    boxShadow: '0 0 38.4px rgba(38, 255, 225, 0.62)',
    duration: 0.18,
    ease: 'power2.out',
  });
};

const resetButtonEffect = () => {
  if (!buttonRef.value) {
    return;
  }

  gsap.to(buttonRef.value, {
    x: 0,
    scale: 1,
    boxShadow: '0 0 27.2px rgba(38, 255, 225, 0.35)',
    duration: 0.22,
    ease: 'power2.out',
  });
};

onMounted(() => {
  updateMockData();
  timer = window.setInterval(updateMockData, 1200);

  gsapContext = gsap.context(() => {
    if (buttonLightRef.value) {
      gsap.to(buttonLightRef.value, {
        xPercent: 230,
        duration: 1.4,
        ease: 'power2.inOut',
        repeat: -1,
        repeatDelay: 0.35,
      });
    }
  }, cardRef.value ?? undefined);
});

onUnmounted(() => {
  if (timer) {
    window.clearInterval(timer);
  }

  gsapContext?.revert();
});
</script>

<template>
  <main class="login-page">
    <div class="cyber-grid" />
    <div class="scan-line" />
    <section class="login-shell">
      <div class="system-panel">
        <p class="panel-kicker">
          SECURE ACCESS GATEWAY
        </p>
        <h1 class="panel-title">
          NEXUS GATE
        </h1>
        <p class="panel-desc">
          认证目标 {{ identityText }}，接入本地安全沙箱。
        </p>

        <div class="status-row">
          <span>信号强度</span>
          <strong>{{ signalStrength }}%</strong>
        </div>
        <div class="signal-bar">
          <span :style="{ width: `${signalStrength}%` }" />
        </div>

        <div class="metric-grid">
          <div
            v-for="item in metrics"
            :key="item.label"
            class="metric-card"
          >
            <span class="metric-label">{{ item.label }}</span>
            <strong>{{ item.value }}{{ item.unit }}</strong>
            <i :style="{ width: `${Math.min(item.value, 100)}%` }" />
          </div>
        </div>

        <div class="terminal-box">
          <div class="terminal-head">
            <span />
            <span />
            <span />
            <b>{{ currentTime }}</b>
          </div>
          <p
            v-for="log in logs"
            :key="log"
          >
            <span>&gt;</span>
            {{ log }}
          </p>
          <p>
            <span>&gt;</span>
            packets received: {{ packetCount }}
          </p>
        </div>
      </div>

      <form
        ref="cardRef"
        class="login-card"
        @submit.prevent="handleLogin"
      >
        <CyberBorderFrame />
        <div class="card-glow" />
        <div class="brand-mark">
          HX
        </div>
        <h2>Operator Access</h2>
        <p class="form-tip">
          Verify credentials to initiate encrypted session handoff
        </p>

        <label class="field-item">
          <span>账号</span>
          <input
            v-model="account"
            type="text"
            autocomplete="username"
          >
        </label>
        <label class="field-item">
          <span>密钥</span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
          >
        </label>
        <label class="field-item">
          <span>访问码</span>
          <input
            v-model="accessCode"
            type="text"
          >
        </label>

        <button
          ref="buttonRef"
          class="login-button"
          type="submit"
          :disabled="loginLoading"
          @mouseenter="playButtonEffect"
          @mouseleave="resetButtonEffect"
        >
          <span
            ref="buttonLightRef"
            class="button-light"
          />
          <span
            class="button-text"
          >
            启动登录协议
          </span>
          <span
            v-if="loginLoading"
            class="button-loader"
          />
        </button>
        <p
          class="login-error"
          :class="{ 'is-visible': loginError }"
        >
          {{ loginError }}
        </p>

        <div class="security-strip">
          <span>ZERO TRUST</span>
          <span>ENCRYPTED</span>
          <span>MOCK DATA</span>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #d9fff6;
  background:
    radial-gradient(circle at 18% 20%, rgba(0, 255, 198, 0.2), transparent 384px),
    radial-gradient(circle at 84% 72%, rgba(255, 41, 117, 0.18), transparent 352px),
    linear-gradient(135deg, #03070a 0%, #071217 52%, #020409 100%);
}

.login-page::before {
  position: absolute;
  inset: 0;
  content: '';
  background-image:
    linear-gradient(rgba(57, 255, 220, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(57, 255, 220, 0.08) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.95), transparent 92%);
}

.cyber-grid {
  position: absolute;
  inset: auto -20% -38% -20%;
  height: 55vh;
  border-top: 1px solid rgba(41, 255, 220, 0.35);
  background:
    linear-gradient(rgba(35, 255, 220, 0.18) 1px, transparent 1px),
    linear-gradient(90deg, rgba(35, 255, 220, 0.18) 1px, transparent 1px);
  background-size: 64px 64px;
  transform: perspective(544px) rotateX(62deg);
  transform-origin: top;
  animation: gridMove 6s linear infinite;
}

.scan-line {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(88, 255, 225, 0.1),
    transparent
  );
  height: 288px;
  animation: scan 4.8s linear infinite;
}

.login-shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(384px, 0.85fr);
  gap: 32px;
  align-items: center;
  width: min(1216px, calc(100% - 48px));
  min-height: 100vh;
  margin: 0 auto;
  padding: 48px 0;
}

.system-panel {
  min-width: 0;
}

.panel-kicker,
.form-tip,
.metric-label,
.security-strip,
.field-item span {
  color: rgba(169, 255, 241, 0.68);
  letter-spacing: 0.08em;
}

.panel-kicker {
  margin-bottom: 16px;
  font-size: 13.6px;
}

.panel-title {
  margin-bottom: 16px;
  font-size: clamp(44px, 6vw, 92.8px);
  line-height: 0.95;
  text-shadow:
    0.08em 0 rgba(255, 42, 117, 0.42),
    -0.06em 0 rgba(38, 255, 222, 0.38);
  animation: titleGlitch 3s infinite steps(2, end);
}

.panel-desc {
  max-width: 544px;
  margin-bottom: 32px;
  color: rgba(217, 255, 246, 0.76);
  font-size: 16px;
  line-height: 1.8;
}

.status-row {
  display: flex;
  justify-content: space-between;
  width: min(448px, 100%);
  margin-bottom: 11.2px;
  color: rgba(217, 255, 246, 0.86);
}

.signal-bar {
  width: min(448px, 100%);
  height: 8.8px;
  overflow: hidden;
  border: 1px solid rgba(47, 255, 220, 0.38);
  background: rgba(0, 0, 0, 0.38);
}

.signal-bar span,
.metric-card i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #26ffe1, #fff25c, #ff2f78);
  box-shadow: 0 0 16px rgba(38, 255, 225, 0.7);
  transition: width 0.45s ease;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12.8px;
  width: min(672px, 100%);
  margin: 32px 0;
}

.metric-card {
  position: relative;
  min-height: 96px;
  padding: 14.4px;
  overflow: hidden;
  border: 1px solid rgba(40, 255, 220, 0.28);
  background: rgba(2, 13, 16, 0.62);
  box-shadow: inset 0 0 24px rgba(38, 255, 225, 0.08);
}

.metric-card::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.18), transparent);
  transform: translateX(-120%);
  animation: sweep 3.4s infinite;
}

.metric-card strong {
  display: block;
  margin: 13.6px 0;
  font-size: 21.6px;
}

.metric-card i {
  width: 40%;
  height: 3.52px;
}

.terminal-box {
  width: min(592px, 100%);
  padding: 16px;
  border: 1px solid rgba(40, 255, 220, 0.32);
  background: rgba(0, 0, 0, 0.46);
  box-shadow: 0 0 32px rgba(0, 255, 198, 0.1);
}

.terminal-head {
  display: flex;
  align-items: center;
  gap: 6.72px;
  margin-bottom: 16px;
}

.terminal-head span {
  width: 8.8px;
  height: 8.8px;
  border-radius: 50%;
  background: #ff2f78;
}

.terminal-head span:nth-child(2) {
  background: #fff25c;
}

.terminal-head span:nth-child(3) {
  background: #26ffe1;
}

.terminal-head b {
  margin-left: auto;
  color: rgba(169, 255, 241, 0.7);
  font-weight: 500;
}

.terminal-box p {
  margin-top: 7.2px;
  color: rgba(217, 255, 246, 0.82);
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
}

.terminal-box p span {
  color: #26ffe1;
}

.login-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 32px;
  border: 1px solid rgba(69, 255, 226, 0.35);
  background: rgba(3, 11, 15, 0.74);
  box-shadow:
    0 0 48px rgba(38, 255, 225, 0.14),
    inset 0 0 48px rgba(255, 47, 120, 0.08);
  backdrop-filter: blur(16px);
}

.card-glow {
  position: absolute;
  inset: 2px;
  z-index: 0;
  background: rgba(3, 11, 15, 0.92);
}

.login-card > :not(.card-glow, .cyber-border-frame) {
  position: relative;
  z-index: 1;
}

.brand-mark {
  display: grid;
  width: 64px;
  height: 64px;
  margin-bottom: 22.4px;
  place-items: center;
  border: 1px solid rgba(38, 255, 225, 0.6);
  color: #021011;
  background: #26ffe1;
  font-size: 20px;
  font-weight: 900;
  box-shadow: 0 0 24px rgba(38, 255, 225, 0.55);
  clip-path: polygon(12% 0, 100% 0, 100% 76%, 82% 100%, 0 100%, 0 18%);
}

.login-card h2 {
  margin-bottom: 8px;
  font-size: 32px;
}

.form-tip {
  margin-bottom: 28.8px;
  font-size: 13.12px;
}

.field-item {
  display: grid;
  gap: 8.8px;
  margin-bottom: 16px;
}

.field-item input {
  width: 100%;
  height: 49.6px;
  padding: 0 16px;
  border: 1px solid rgba(38, 255, 225, 0.32);
  outline: none;
  color: #d9fff6;
  background: rgba(0, 0, 0, 0.35);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.field-item input:focus {
  border-color: #26ffe1;
  box-shadow: 0 0 19.2px rgba(38, 255, 225, 0.26);
  transform: translateY(-1px);
}

.login-button {
  position: relative;
  width: 100%;
  height: 52.8px;
  margin-top: 8px;
  overflow: hidden;
  border: 0;
  color: #031011;
  background: linear-gradient(90deg, #26ffe1, #fff25c);
  cursor: pointer;
  font-weight: 800;
  letter-spacing: 0.08em;
  box-shadow: 0 0 27.2px rgba(38, 255, 225, 0.35);
}

.login-button:disabled {
  cursor: wait;
}

.login-button::before {
  position: absolute;
  inset: 1px;
  content: '';
  border: 1px solid rgba(255, 255, 255, 0.28);
  opacity: 0.8;
}

.button-light {
  position: absolute;
  top: -40%;
  left: -65%;
  width: 45%;
  height: 180%;
  background: linear-gradient(115deg, transparent, rgba(255, 255, 255, 0.82), transparent);
  transform: skewX(-18deg);
  pointer-events: none;
}

.login-button span {
  position: relative;
  z-index: 1;
}

.button-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button-loader {
  position: absolute !important;
  top: 50%;
  right: 20px;
  width: 18px;
  height: 18px;
  margin-top: -9px;
  border: 2px solid rgba(3, 16, 17, 0.26);
  border-top-color: #031011;
  border-radius: 50%;
  animation: buttonLoading 0.72s linear infinite;
}

.login-error {
  min-height: 28px;
  margin-top: 12px;
  color: #ff5d8f;
  font-size: 13px;
  letter-spacing: 0.04em;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.login-error.is-visible {
  opacity: 1;
}

.security-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 9.6px;
  margin-top: 19.2px;
  font-size: 11.2px;
}

.security-strip span {
  padding: 5.6px 8.8px;
  border: 1px solid rgba(38, 255, 225, 0.25);
  background: rgba(38, 255, 225, 0.08);
}

@keyframes gridMove {
  to {
    background-position: 0 64px, 64px 0;
  }
}

@keyframes scan {
  from {
    transform: translateY(-352px);
  }

  to {
    transform: translateY(100vh);
  }
}

@keyframes buttonLoading {
  to {
    transform: rotate(1turn);
  }
}

@keyframes sweep {
  60%,
  100% {
    transform: translateX(120%);
  }
}

@keyframes titleGlitch {
  0%,
  82%,
  100% {
    transform: translate(0);
  }

  86% {
    transform: translate(-2px, 1px);
  }

  90% {
    transform: translate(2px, -1px);
  }
}

@media (max-width: 920px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .login-shell {
    width: min(100% - 19.2px, 544px);
    padding: 16px 0;
  }

  .login-card {
    padding: 20px;
  }

  .metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>
