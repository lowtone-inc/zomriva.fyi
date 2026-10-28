import { SITE } from '@/config';

// 한국 시간 기준으로 표시 (빌드 서버가 UTC여도 날짜가 밀리지 않게 고정)
const TZ = 'Asia/Seoul';
const dateFormatter = new Intl.DateTimeFormat(SITE.locale, {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const yearFormatter = new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric' });
const monthDayFormatter = new Intl.DateTimeFormat('en-US', { timeZone: TZ, month: '2-digit', day: '2-digit' });

export const formatDate = (date: Date) => dateFormatter.format(date);
export const yearOf = (date: Date) => yearFormatter.format(date);
export const monthDayOf = (date: Date) => monthDayFormatter.format(date).replace('/', '.');
export const isoDate = (date: Date) => date.toISOString();

// 한글은 공백 단어 수가 적어 글자 수 기준으로 계산
const CHARS_PER_MINUTE = 500;

export function readingTime(text = ''): string {
  const chars = text.replace(/\s+/g, '').length;
  return `${Math.max(1, Math.round(chars / CHARS_PER_MINUTE))}분`;
}
