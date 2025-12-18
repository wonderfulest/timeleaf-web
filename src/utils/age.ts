import dayjs from 'dayjs'

export function formatAge(birthday: string, shootAt: string): string {
  const birth = dayjs(birthday)
  const shoot = dayjs(shootAt)

  const days = shoot.diff(birth, 'day')
  if (days < 30) {
    return `${days} 天`
  }

  const months = shoot.diff(birth, 'month')
  if (months < 24) {
    const restDays = shoot.diff(birth.add(months, 'month'), 'day')
    return `${months} 个月 ${restDays} 天`
  }

  const years = shoot.diff(birth, 'year')
  const restMonths = shoot.diff(birth.add(years, 'year'), 'month')
  if (restMonths > 0) {
    return `${years} 岁 ${restMonths} 个月`
  }
  return `${years} 岁`
}
