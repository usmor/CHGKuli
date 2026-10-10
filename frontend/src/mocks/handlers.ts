import { http, HttpResponse } from 'msw';

export const mockAuthors = [
  { id: 1, name: 'Юлия Дидбаридзе' },
  { id: 2, name: 'Григорий Зырянов' },
  { id: 3, name: 'Фёдор Журавлёв' },
  { id: 4, name: 'Михаил Калашников' },
  { id: 5, name: 'Алексей Рабин' },
];

export const mockTournaments = [
  { id: 1, name: 'Синхронный турнир «Что-то вроде»', year: 2023 },
  { id: 2, name: 'Кубок Москвы по ЧГК', year: 2009 },
  { id: 3, name: 'Открытый кубок Мордовии', year: 2004 },
  { id: 4, name: 'Чемпионат Канады', year: 2009 },
];

export const handlers = [
  http.get('*/authors/autocomplete', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase() ?? '';
    const ids = url.searchParams.getAll('ids').map(Number);

    let result = mockAuthors;

    if (ids.length > 0) {
      result = mockAuthors.filter((a) => ids.includes(a.id));
    } else if (q.length >= 2) {
      result = mockAuthors.filter((a) => a.name.toLowerCase().includes(q));
    }

    return HttpResponse.json(result);
  }),

  http.get('*/tournaments/autocomplete', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase() ?? '';
    const ids = url.searchParams.getAll('ids').map(Number);

    let result = mockTournaments;

    if (ids.length > 0) {
      result = mockTournaments.filter((t) => ids.includes(t.id));
    } else if (q.length >= 2) {
      result = mockTournaments.filter((t) => t.name.toLowerCase().includes(q));
    }

    return HttpResponse.json(result);
  }),
];
