import type { Child } from '@/models/child'
import type { Media } from '@/models/media'
import type { Album } from '@/models/album'

export const mockChild: Child = {
  id: 'c1',
  name: '宝宝',
  birthday: '2023-06-01'
}

export const mockMedia: Media[] = [
  {
    id: 'm1',
    childId: 'c1',
    type: 'photo',
    fileUrl: 'https://picsum.photos/600/600?random=1',
    shootAt: '2023-09-01 08:30:00',
    note: '第一次翻身'
  },
  {
    id: 'm2',
    childId: 'c1',
    type: 'photo',
    fileUrl: 'https://picsum.photos/600/600?random=2',
    shootAt: '2023-10-12 18:20:00',
    note: '第一次叫爸爸'
  }
]

export const mockAlbums: Album[] = [
  {
    id: 'a1',
    childId: 'c1',
    title: '1 岁成长册（雏形）',
    description: '从时间轴自动生成的册子雏形',
    startDate: '2024-06-01',
    endDate: '2025-06-01',
    theme: 'minimal'
  }
]
