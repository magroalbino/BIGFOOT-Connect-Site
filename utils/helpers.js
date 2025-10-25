/**
 * ========================================
 * FORMATAÇÃO DE NÚMEROS
 * ========================================
 */

/**
 * Formata número para exibição com separadores de milhares
 * @param {number} num - Número para formatar
 * @param {number} decimals - Número de casas decimais (padrão: 2)
 * @returns {string} Número formatado
 */
export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  
  return Number(num).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Formata número como BIG Points
 * @param {number} points - Quantidade de BIG Points
 * @returns {string} Formatado como "1,234.56 BIG"
 */
export function formatBigPoints(points) {
  return `${formatNumber(points, 2)} BIG`;
}

/**
 * Abrevia números grandes (1000 -> 1K, 1000000 -> 1M)
 * @param {number} num - Número para abreviar
 * @returns {string} Número abreviado
 */
export function abbreviateNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (absNum >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (absNum >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
}

/**
 * ========================================
 * FORMATAÇÃO DE DATAS
 * ========================================
 */

/**
 * Formata data para exibição (DD/MM/YYYY)
 * @param {Date|string|number} date - Data para formatar
 * @param {string} locale - Locale (padrão: 'pt-BR')
 * @returns {string} Data formatada
 */
export function formatDate(date, locale = 'pt-BR') {
  if (!date) return '';
  
  try {
    const d = new Date(date);
    return d.toLocaleDateString(locale);
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
}

/**
 * Formata data e hora para exibição
 * @param {Date|string|number} date - Data para formatar
 * @param {string} locale - Locale (padrão: 'pt-BR')
 * @returns {string} Data e hora formatada
 */
export function formatDateTime(date, locale = 'pt-BR') {
  if (!date) return '';
  
  try {
    const d = new Date(date);
    return d.toLocaleString(locale);
  } catch (error) {
    console.error('Erro ao formatar data/hora:', error);
    return '';
  }
}

/**
 * Retorna tempo relativo (ex: "há 2 horas", "há 3 dias")
 * @param {Date|string|number} date - Data para calcular
 * @param {string} locale - Idioma ('pt' ou 'en')
 * @returns {string} Tempo relativo
 */
export function getRelativeTime(date, locale = 'pt') {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  const labels = {
    pt: {
      now: 'agora',
      seconds: 'segundos',
      minute: 'minuto',
      minutes: 'minutos',
      hour: 'hora',
      hours: 'horas',
      day: 'dia',
      days: 'dias',
      ago: 'há'
    },
    en: {
      now: 'now',
      seconds: 'seconds',
      minute: 'minute',
      minutes: 'minutes',
      hour: 'hour',
      hours: 'hours',
      day: 'day',
      days: 'days',
      ago: ''
    }
  };
  
  const t = labels[locale] || labels['pt'];
  
  if (diffSecs < 60) return t.now;
  if (diffMins < 2) return `${t.ago} 1 ${t.minute}`;
  if (diffMins < 60) return `${t.ago} ${diffMins} ${t.minutes}`;
  if (diffHours < 2) return `${t.ago} 1 ${t.hour}`;
  if (diffHours < 24) return `${t.ago} ${diffHours} ${t.hours}`;
  if (diffDays < 2) return `${t.ago} 1 ${t.day}`;
  return `${t.ago} ${diffDays} ${t.days}`;
}

/**
 * ========================================
 * VALIDAÇÕES
 * ========================================
 */

/**
 * Valida email
 * @param {string} email - Email para validar
 * @returns {boolean} True se válido
 */
export function validateEmail(email) {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida endereço Solana
 * @param {string} address - Endereço para validar
 * @returns {boolean} True se válido
 */
export function validateSolanaAddress(address) {
  if (!address) return false;
  // Endereços Solana têm entre 32-44 caracteres
  return address.length >= 32 && address.length <= 44;
}

/**
 * Valida senha (mínimo 6 caracteres)
 * @param {string} password - Senha para validar
 * @returns {boolean} True se válido
 */
export function validatePassword(password) {
  if (!password) return false;
  return password.length >= 6;
}

/**
 * Calcula força da senha (0-4)
 * @param {string} password - Senha para avaliar
 * @returns {number} Força (0=muito fraca, 4=muito forte)
 */
export function calculatePasswordStrength(password) {
  if (!password) return 0;
  
  let strength = 0;
  
  if (password.length >= 6) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/\d/)) strength++;
  if (password.match(/[^a-zA-Z\d]/)) strength++;
  
  return strength;
}

/**
 * ========================================
 * STRINGS
 * ========================================
 */

/**
 * Trunca texto longo
 * @param {string} text - Texto para truncar
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 50) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Trunca endereço blockchain (mostra início e fim)
 * @param {string} address - Endereço para truncar
 * @param {number} startChars - Caracteres do início (padrão: 6)
 * @param {number} endChars - Caracteres do fim (padrão: 4)
 * @returns {string} Endereço truncado
 */
export function truncateAddress(address, startChars = 6, endChars = 4) {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Capitaliza primeira letra
 * @param {string} str - String para capitalizar
 * @returns {string} String capitalizada
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converte para slug (URL-friendly)
 * @param {string} text - Texto para converter
 * @returns {string} Slug
 */
export function slugify(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/--+/g, '-') // Remove hífens duplicados
    .trim();
}

/**
 * ========================================
 * CLIPBOARD
 * ========================================
 */

/**
 * Copia texto para clipboard
 * @param {string} text - Texto para copiar
 * @returns {Promise<boolean>} True se copiado com sucesso
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para navegadores antigos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        return true;
      } finally {
        document.body.removeChild(textArea);
      }
    }
  } catch (error) {
    console.error('Erro ao copiar para clipboard:', error);
    return false;
  }
}

/**
 * ========================================
 * UTILITÁRIOS DE ARRAY
 * ========================================
 */

/**
 * Agrupa array por propriedade
 * @param {Array} array - Array para agrupar
 * @param {string} key - Chave para agrupar
 * @returns {Object} Objeto agrupado
 */
export function groupBy(array, key) {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
}

/**
 * Remove duplicatas de array
 * @param {Array} array - Array com duplicatas
 * @returns {Array} Array sem duplicatas
 */
export function removeDuplicates(array) {
  if (!Array.isArray(array)) return [];
  return [...new Set(array)];
}

/**
 * Embaralha array (Fisher-Yates shuffle)
 * @param {Array} array - Array para embaralhar
 * @returns {Array} Array embaralhado
 */
export function shuffleArray(array) {
  if (!Array.isArray(array)) return [];
  
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * ========================================
 * UTILITÁRIOS DE OBJETO
 * ========================================
 */

/**
 * Deep clone de objeto
 * @param {Object} obj - Objeto para clonar
 * @returns {Object} Clone profundo
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Verifica se objeto está vazio
 * @param {Object} obj - Objeto para verificar
 * @returns {boolean} True se vazio
 */
export function isEmptyObject(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * ========================================
 * DEBOUNCE E THROTTLE
 * ========================================
 */

/**
 * Debounce - Executa função após delay de inatividade
 * @param {Function} func - Função para debounce
 * @param {number} delay - Delay em ms
 * @returns {Function} Função com debounce
 */
export function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Throttle - Limita execução de função
 * @param {Function} func - Função para throttle
 * @param {number} limit - Limite em ms
 * @returns {Function} Função com throttle
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * ========================================
 * SLEEP/DELAY
 * ========================================
 */

/**
 * Aguarda X milissegundos (para async/await)
 * @param {number} ms - Milissegundos para aguardar
 * @returns {Promise} Promise que resolve após delay
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * ========================================
 * RANDOM
 * ========================================
 */

/**
 * Gera número aleatório entre min e max
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Número aleatório
 */
export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Gera ID aleatório
 * @param {number} length - Comprimento do ID
 * @returns {string} ID aleatório
 */
export function generateId(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * ========================================
 * STORAGE
 * ========================================
 */

/**
 * Salva item no localStorage com tratamento de erro
 * @param {string} key - Chave
 * @param {any} value - Valor (será convertido para JSON)
 * @returns {boolean} True se salvou com sucesso
 */
export function setLocalStorage(key, value) {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
    return false;
  }
}

/**
 * Recupera item do localStorage
 * @param {string} key - Chave
 * @param {any} defaultValue - Valor padrão se não encontrar
 * @returns {any} Valor recuperado
 */
export function getLocalStorage(key, defaultValue = null) {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Erro ao recuperar do localStorage:', error);
    return defaultValue;
  }
}

/**
 * Remove item do localStorage
 * @param {string} key - Chave
 * @returns {boolean} True se removeu com sucesso
 */
export function removeLocalStorage(key) {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Erro ao remover do localStorage:', error);
    return false;
  }
}

/**
 * ========================================
 * AMBIENTE
 * ========================================
 */

/**
 * Verifica se está no lado do cliente
 * @returns {boolean} True se cliente
 */
export function isClient() {
  return typeof window !== 'undefined';
}

/**
 * Verifica se está no lado do servidor
 * @returns {boolean} True se servidor
 */
export function isServer() {
  return typeof window === 'undefined';
}

/**
 * Verifica se está em desenvolvimento
 * @returns {boolean} True se dev
 */
export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

/**
 * Verifica se está em produção
 * @returns {boolean} True se prod
 */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * ========================================
 * DEVICE DETECTION
 * ========================================
 */

/**
 * Verifica se é dispositivo móvel
 * @returns {boolean} True se mobile
 */
export function isMobile() {
  if (!isClient()) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Verifica se é iOS
 * @returns {boolean} True se iOS
 */
export function isIOS() {
  if (!isClient()) return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * Verifica se é Android
 * @returns {boolean} True se Android
 */
export function isAndroid() {
  if (!isClient()) return false;
  return /Android/.test(navigator.userAgent);
}
