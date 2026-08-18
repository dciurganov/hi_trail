import { useState, useMemo, useRef } from "react";

/* ============================================================
   HI-TRAIL 2.0 — презентационный прототип v4
   Реальные данные hi-trail.ru: «Весенний полумарафон 2026»,
   «Дубоссарский заплыв 2026», календарь сезона, рекорды.
   ============================================================ */

const TODAY = new Date("2026-08-17");

const SPORTS = {
  run:   { label: "Бег и трейл",   color: "#FF4D00" },
  bike:  { label: "Вело / XCM",    color: "#1B7F8E" },
  swim:  { label: "Открытая вода", color: "#2456C8" },
  multi: { label: "Мультиспорт",   color: "#5B3FA8" },
};
const LEAGUES = {
  cup:   { label: "Кубковый этап", cls: "lg-cup" },
  night: { label: "Ночная лига",   cls: "lg-night" },
  water: { label: "Водная лига",   cls: "lg-water" },
  bike:  { label: "Вело лига",     cls: "lg-bike" },
  ultra: { label: "Ультра",        cls: "lg-ultra" },
  final: { label: "Финал Кубка",   cls: "lg-final" },
  new:   { label: "Новинка",       cls: "lg-new" },
};

const EVENTS_SEED = [
  {
    id: "vesna", title: "Весенний полумарафон", slogan: "Классика шоссе на открытие бегового сезона",
    date: "2026-03-21", place: "с. Новокотовск, Слободзейский район", sport: "run", leagues: ["cup"],
    geo: "46.770692, 29.935562", regClose: "15 марта", startTime: "12:00", tg: "https://t.me/+5T5s69R0TNVlZDBi",
    cover: null, gallery: [], slots: { total: 150, taken: 150 },
    blurb: "Спортивное мероприятие для любителей бега по шоссе. Общее руководство осуществляет НП «Лига спорта и туризма „Хай-Треил“». Первые места каждой дистанции идут в зачёт бегового Кубка Хай-Трейл 2026.",
    dists: [
      { n: "21 км", fee: 400, map: "https://nakarte.me/#m=12/46.79207/29.91714&l=G&n2=_&nktl=dlgBRVEtYRXO5R-9KBaCIw",
        story: "Ровное шоссе вдоль полей Слободзейского района. Быстрая трасса — здесь стоит рекорд лиги 1:16:16. Два пункта питания, разворот на 10,5 км." },
      { n: "10 км", fee: 400, map: "https://nakarte.me/#m=12/46.78901/29.88916&l=G&nktl=yH6XeRmjSix0FdGzprfugA",
        story: "Половина полумарафонского круга — идеально для первого серьёзного старта сезона." },
      { n: "3 км", fee: 300, map: "https://nakarte.me/#m=17/46.77228/29.95176&l=O&nktl=FF_c3a1w5uPw7KNGa_tcAw",
        story: "Короткий быстрый круг по селу — детские и юношеские категории, разминка для взрослых." },
      { n: "500 м фан", fee: 0, map: "https://nakarte.me/#m=16/46.76953/29.94313&l=O&nktl=6PlO9U8rpGxOpf5iSgs1dA",
        story: "Бесплатный забег для всех: дети, родители, коляски и собаки приветствуются." },
    ],
    schedule: [
      { t: "10:00 – 11:50", l: "Регистрация участников, выдача номеров, подпись деклараций" },
      { t: "11:50", l: "Брифинг" },
      { t: "12:00", l: "Старт на 21 км, 10 км, 3 км и фан-забег 500 м" },
      { t: "15:00", l: "Награждение победителей и призёров" },
      { t: "15:10", l: "Общая фотография" },
    ],
    feeTable: [
      { grp: "500 м фан", early: "бесплатно", late: "—", day: "—" },
      { grp: "Детская", early: "200 руб", late: "225 руб", day: "250 руб" },
      { grp: "Юноши/Девушки", early: "300 руб", late: "325 руб", day: "350 руб" },
      { grp: "Юниоры", early: "300 руб", late: "325 руб", day: "350 руб" },
      { grp: "Любители", early: "400 руб", late: "425 руб", day: "450 руб" },
    ],
    records: [
      { d: "21 км", sex: "М", who: "Вячеслав Швец, Рыбница", res: "1:16:16", y: "2021" },
      { d: "21 км", sex: "Ж", who: "Светлана Шепелева, Ближний Хутор", res: "1:30:32", y: "2025" },
      { d: "10 км", sex: "М", who: "Вениямин Ианов, Дрокия", res: "33:51", y: "2025" },
      { d: "10 км", sex: "Ж", who: "Олеся Чекан, Тирасполь", res: "43:57", y: "2023" },
      { d: "3 км", sex: "М", who: "Андрей Присекин, Бельцы", res: "10:27", y: "2026" },
      { d: "3 км", sex: "Ж", who: "Екатерина Капсамун, Кишинёв", res: "12:37", y: "2025" },
    ],
    docs: [
      { name: "Положение о мероприятии", url: "https://docs.google.com/document/d/1I-zLIbufR-GX7WbNbCjyx_Akw4jeo8At30dW2CRvDXg/edit" },
      { name: "Согласие родителей (до 18 лет)", url: "https://docs.google.com/document/d/1NqLSzILNJ2IcgJJ1DT3Cp7epv3h7vUA2rfMYxfirKHQ/edit" },
      { name: "Декларация об ответственности (18+)", url: "https://docs.google.com/document/d/1Y4Y6H-xRiXVVAaRfahBkKJqOk5M_nq3TMiDZRU2is_4/edit" },
    ],
    stay: { label: "Где остановиться в Тирасполе", url: "https://pridnestrovie-tourism.com/city/tiraspol/gde-ostanovitsja-v-tiraspole/" },
    review: { who: "Участник 21 км, сезон 2025", text: "Трасса быстрая и честная: ни горки лишней, разметка каждые сто метров, на пунктах питания — вода и изюм. Финишировал с личником и остался на плов. Вернусь за 1:35!" },
  },
  {
    id: "dubossary-zaplyv", title: "Дубоссарский заплыв", slogan: "3000 метров большой воды Днестра",
    date: "2026-08-23", place: "Городской пляж, г. Дубоссары", sport: "swim", leagues: ["cup", "water"],
    geo: "47.280359, 29.127360", regClose: "15 августа", startTime: "09:00", tg: "https://t.me/+5T5s69R0TNVlZDBi",
    cover: null, gallery: [], slots: { total: 80, taken: 67 },
    blurb: "Заплыв на открытой воде Дубоссарского водохранилища — самой большой воды Приднестровья. Три дистанции, зачёт плавательного Кубка Хай-Трейл 2026. Сопровождение спасателей ГУПЧС МВД на всей акватории.",
    dists: [
      { n: "3000 м", fee: 400, map: "https://nakarte.me/#m=18/47.28383/29.12466&l=O&nktl=5wjnT-_cGGIfXGX3L0wILw",
        story: "Два круга по 1500 м вдоль буйковой линии. Открытая вода без течения, но с ветровой волной во второй половине дня — потому и старт в 9 утра. Рекорд — 35:51." },
      { n: "1500 м", fee: 350, map: "https://nakarte.me/#m=18/47.28383/29.12466&l=O&nktl=5wjnT-_cGGIfXGX3L0wILw",
        story: "Один круг. Классическая «миля» для тех, кто уверенно держится на воде 25–40 минут." },
      { n: "500 м", fee: 300, map: "https://nakarte.me/#m=17/47.28171/29.12707&l=O&nktl=zrqKCOAzwCI__eHx2uzIUQ",
        story: "Короткая дистанция вдоль пляжа: первый старт на открытой воде, юношеские категории и параспортсмены." },
    ],
    schedule: [
      { t: "08:00 – 08:50", l: "Регистрация участников, маркировка, выдача чипов" },
      { t: "08:50", l: "Брифинг" },
      { t: "09:00", l: "Старт на 500 м, 1500 м и 3000 м" },
      { t: "12:00", l: "Награждение и общее фото" },
    ],
    feeTable: [
      { grp: "Юноши/Девушки", early: "300 руб", late: "350 руб", day: "400–450 руб" },
      { grp: "Юниоры", early: "300 руб", late: "350 руб", day: "400–450 руб" },
      { grp: "Любители", early: "400 руб", late: "450 руб", day: "500–550 руб" },
    ],
    records: [
      { d: "3000 м", sex: "М", who: "Иван Торопицин, Бендеры", res: "35:51", y: "2023" },
      { d: "3000 м", sex: "Ж", who: "Наталья Зайцева, Тирасполь", res: "44:45", y: "2023" },
      { d: "1500 м", sex: "М", who: "Матвей Васалатый, Тирасполь", res: "20:45", y: "2023" },
      { d: "1500 м", sex: "Ж", who: "Елена Букалова, Тирасполь", res: "33:50", y: "2023" },
      { d: "500 м", sex: "Ж", who: "Арина Васалатая, Тирасполь", res: "09:57", y: "2023" },
      { d: "500 м", sex: "М", who: "Сергей Смирнов, Кишинёв", res: "11:23", y: "2023" },
    ],
    docs: [
      { name: "Положение о мероприятии", url: "https://docs.google.com/document/d/1hPSCERnAEvXcZf628QZYsaE1XA3dFRtX3WgY4UMMZbI/edit" },
      { name: "Согласие родителей (до 18 лет)", url: "https://docs.google.com/document/d/1HkueWjPKhj1Hlgo0Ei6z9VHFefmmFjsMSRZ7lnJ4c5A/edit" },
      { name: "Декларация об ответственности (18+)", url: "https://docs.google.com/document/d/1JMLmjm425x_heuLnYwfufS4Ij7jtctJ3nZxDWUxpJx0/edit" },
    ],
    stay: { label: "Где остановиться в Дубоссарах", url: "https://pridnestrovie-tourism.com/city/dubossary/gde-ostanovitsja-v-dubossarah/" },
    review: { who: "Финишёр 3000 м, сезон 2024", text: "Вода 24 градуса, буйки видно отлично, на каждом круге каякер рядом. После финиша — арбузы от организаторов. Лучшая открытая вода сезона, однозначно." },
  },
  { id: "night-dubossary", title: "Ночные Дубоссары Trail", slogan: "11 км в свете налобных фонарей",
    date: "2026-08-23", place: "Дубоссары", sport: "run", leagues: ["night", "new"],
    slots: { total: 100, taken: 91 }, startTime: "21:00",
    blurb: "Новинка сезона: вечерний трейл по дубоссарским тропам сразу после дневного заплыва. Налобный фонарь обязателен.",
    dists: [{ n: "11 км", fee: 350, story: "Грунтовые тропы над водохранилищем, световая разметка, финиш под музыку." }] },
  { id: "night-trail", title: "Ночной трейл", slogan: "Красногорка после заката",
    date: "2026-09-19", place: "Красногорка, Григориопольский район", sport: "run", leagues: ["night"],
    slots: { total: 60, taken: 60 }, startTime: "20:30",
    blurb: "Классический ночной трейл лиги — 8,5 км по лесным тропам Красногорки.",
    dists: [{ n: "8.5 км", fee: 350, story: "Один круг по лесу: корни, овраги и абсолютная темнота между контрольными точками." }] },
  { id: "gorka-xcm", title: "Gorka XCM", slogan: "Осенние грунты Красногорки и Бычка",
    date: "2026-09-20", place: "Красногорка — Бычок", sport: "bike", leagues: ["cup", "bike"],
    slots: { total: 90, taken: 34 }, startTime: "11:00",
    blurb: "Осенний вело-марафон: гравий, полевые дороги и подъёмы григориопольских холмов.",
    dists: [
      { n: "60 км", fee: 500, story: "Три больших круга. Набор высоты ~700 м, техничные спуски к Днестру." },
      { n: "40 км", fee: 450, story: "Два круга — марафонская дистанция для уверенных любителей." },
      { n: "20 км", fee: 400, story: "Один круг: первый старт в кросс-кантри." },
    ] },
  { id: "valya-trail", title: "Валя Адынка трейл", slogan: "Каменские каньоны — самый живописный трейл календаря",
    date: "2026-10-04", place: "Валя Адынка, Каменский район", sport: "run", leagues: ["cup"],
    slots: { total: 120, taken: 48 }, startTime: "12:00",
    blurb: "Скальные выходы, каньоны и осенний лес Каменского района.",
    dists: [
      { n: "21 км", fee: 400, story: "Полный круг каньона с набором ~450 м. Самые красивые километры сезона." },
      { n: "8 км", fee: 350, story: "Малый круг по гребню с видами на долину." },
      { n: "500 м фан", fee: 0, story: "Детский и семейный забег на поляне старта." },
    ] },
  { id: "chobruchi", title: "Чобручский полумарафон", slogan: "Финал Кубка. Всё решится здесь",
    date: "2026-11-01", place: "Чобручи, Слободзейский район", sport: "run", leagues: ["cup", "final"],
    slots: { total: 150, taken: 52 }, startTime: "12:00",
    blurb: "Закрытие бегового сезона и финальный этап Кубка Hi-Trail 2026 — последние очки сезона разыгрываются в Чобручах.",
    dists: [
      { n: "21 км", fee: 400, story: "Финальный полумарафон сезона по шоссе вдоль Днестра." },
      { n: "10 км", fee: 400, story: "Десятка для тех, кто закрывает сезон в удовольствие." },
      { n: "3 км", fee: 300, story: "Детские и юношеские категории." },
      { n: "500 м фан", fee: 0, story: "Фан-финиш сезона для всех." },
    ] },
  { id: "dnestrovsk-tri", title: "Днестровск триатлон", slogan: "Главный мультистарт на Кучурганском лимане",
    date: "2026-08-02", place: "Днестровск", sport: "multi", leagues: ["cup"],
    slots: { total: 100, taken: 100 }, startTime: "09:00",
    legs: [{ k: "swim", v: "1,5 км" }, { k: "bike", v: "40 км" }, { k: "run", v: "10 км" }],
    blurb: "Олимпийская дистанция, спринты и эстафеты на тёплой воде Кучурганского лимана.",
    dists: [
      { n: "Олимпийская", fee: 600, story: "1,5 км плавание + 40 км вело + 10 км бег. Полный формат." },
      { n: "Спринт", fee: 500, story: "750 м + 20 км + 5 км — половина олимпийки." },
      { n: "Супер спринт", fee: 400, story: "375 м + 10 км + 2,5 км — попробовать триатлон впервые." },
      { n: "Эстафета", fee: 700, story: "Команда из трёх: пловец, велосипедист, бегун." },
    ] },
  { id: "goyany-zaplyv", title: "Гоянский заплыв", slogan: "Открытая вода Гоянского залива",
    date: "2026-07-05", place: "Гояны, Дубоссарский район", sport: "swim", leagues: ["cup", "water"],
    slots: { total: 80, taken: 80 }, startTime: "09:00",
    blurb: "Летний этап плавательного Кубка в Гоянском заливе Дубоссарского водохранилища.",
    dists: [
      { n: "3000 м", fee: 400, story: "Два круга по заливу." },
      { n: "1500 м", fee: 350, story: "Один круг." },
      { n: "500 м", fee: 300, story: "Вдоль берега." },
    ] },
  { id: "frunze-trail", title: "Фрунзе трейл", slogan: "Балки и полевые тропы Слободзейщины",
    date: "2026-04-18", place: "Фрунзе, Слободзейский район", sport: "run", leagues: ["cup"],
    slots: { total: 120, taken: 120 }, startTime: "12:00",
    blurb: "Весенний трейл по балкам вокруг села Фрунзе.",
    dists: [
      { n: "21 км", fee: 400, story: "Большой круг по балкам, набор ~350 м." },
      { n: "10 км", fee: 400, story: "Средний круг." },
      { n: "3 км", fee: 300, story: "Детские категории." },
      { n: "500 м фан", fee: 0, story: "Фан-забег." },
    ] },
  { id: "ultra70", title: "Хай-Трейл Ультра 70", slogan: "70 км. 10 этапов. Один февраль",
    date: "2026-02-28", place: "Слободзейский район", sport: "run", leagues: ["ultra"],
    slots: { total: 40, taken: 40 }, startTime: "08:00",
    blurb: "Флагман лиги: этапный зимний ультрамарафон — десять этапов февральского круга общей длиной 70 км.",
    dists: [{ n: "70 км · 10 этапов", fee: 700, story: "Десять этапов по 5–9 км с общим зачётом времени. Зимняя выносливость в чистом виде." }] },
  { id: "swimrun", title: "Гояны SwimRun", slogan: "Плыви. Беги. Повтори",
    date: "2026-07-03", place: "Гояны, Дубоссарский район", sport: "multi", leagues: ["water"],
    slots: { total: 60, taken: 60 }, startTime: "10:00",
    legs: [{ k: "swim", v: "2,8 км" }, { k: "run", v: "6,5 км" }],
    blurb: "Чередование плавания и бега по берегам Гоянского залива — в кроссовках в воду и обратно.",
    dists: [
      { n: "9.3 км", fee: 500, story: "Полный формат: 6 водных и 7 беговых отрезков." },
      { n: "4.6 км", fee: 450, story: "Половина формата." },
      { n: "2.3 км", fee: 400, story: "Знакомство со свимраном." },
    ] },
];

const RESULTS_DB = [
  { eventId: "vesna", rows: [
    { p: 1, name: "Вячеслав Швец", city: "Рыбница", club: "СК Днестр", dist: "21 км", time: "1:18:40" },
    { p: 2, name: "Вениямин Ианов", city: "Дрокия", club: "—", dist: "21 км", time: "1:21:05" },
    { p: 3, name: "Светлана Шепелева", city: "Ближний Хутор", club: "Фитнес Мафия", dist: "21 км", time: "1:31:58" },
    { p: 12, name: "Денис Демо", city: "Тирасполь", club: "Импульс", dist: "21 км", time: "1:38:42" },
    { p: 1, name: "Андрей Присекин", city: "Бельцы", club: "СК Днестр", dist: "3 км", time: "10:27" },
    { p: 2, name: "Екатерина Капсамун", city: "Кишинёв", club: "—", dist: "3 км", time: "12:41" },
  ] },
  { eventId: "goyany-zaplyv", rows: [
    { p: 1, name: "Иван Торопицин", city: "Бендеры", club: "Aquatir", dist: "3000 м", time: "36:40" },
    { p: 2, name: "Матвей Васалатый", city: "Тирасполь", club: "Aquatir", dist: "3000 м", time: "37:55" },
    { p: 3, name: "Наталья Зайцева", city: "Тирасполь", club: "Aquatir", dist: "3000 м", time: "45:30" },
    { p: 1, name: "Сергей Смирнов", city: "Кишинёв", club: "—", dist: "1500 м", time: "21:10" },
    { p: 6, name: "Денис Демо", city: "Тирасполь", club: "Импульс", dist: "1500 м", time: "27:54" },
    { p: 8, name: "Елена Букалова", city: "Тирасполь", club: "Aquatir", dist: "1500 м", time: "34:05" },
    { p: 1, name: "Арина Васалатая", city: "Тирасполь", club: "Aquatir", dist: "500 м", time: "10:12" },
  ] },
  { eventId: "dnestrovsk-tri", rows: [
    { p: 1, name: "Андрей Присекин", city: "Бельцы", club: "СК Днестр", dist: "Олимпийская", time: "2:04:11" },
    { p: 2, name: "Игорь Мунтян", city: "Тирасполь", club: "Импульс", dist: "Олимпийская", time: "2:15:40" },
    { p: 3, name: "Олеся Чекан", city: "Тирасполь", club: "Фитнес Мафия", dist: "Олимпийская", time: "2:22:03" },
  ] },
];

const toSec = (t) => t.split(":").map(Number).reduce((a, b) => a * 60 + b, 0);
const distBonus = (d) => (/21|30|70|Олимп/i.test(d) ? 50 : /10|11|3000|9\.3/i.test(d) ? 25 : 0);
function computeCup() {
  const athletes = {};
  RESULTS_DB.forEach(({ eventId, rows }) => {
    const ev = EVENTS_ALL.find((e) => e.id === eventId);
    const bestByDist = {};
    rows.forEach((r) => {
      const s = toSec(r.time);
      if (!bestByDist[r.dist] || s < bestByDist[r.dist]) bestByDist[r.dist] = s;
    });
    rows.forEach((r) => {
      const pts = Math.round((1000 * bestByDist[r.dist]) / toSec(r.time)) + distBonus(r.dist);
      const a = (athletes[r.name] = athletes[r.name] || { name: r.name, city: r.city, club: r.club, results: [] });
      a.results.push({ eventId, ev, dist: r.dist, time: r.time, p: r.p, pts, leagues: ev ? ev.leagues : [] });
    });
  });
  return Object.values(athletes).map((a) => {
    const best5 = a.results.slice().sort((x, y) => y.pts - x.pts).slice(0, 5);
    return { ...a, total: best5.reduce((s, r) => s + r.pts, 0), starts: a.results.length };
  }).sort((x, y) => y.total - x.total);
}

const TIERS = ["Генеральный партнёр", "Технический партнёр", "Партнёр", "Инфоподдержка"];
const PARTNERS_SEED = [
  { id: 1, name: "Клевер", tier: "Генеральный партнёр" },
  { id: 2, name: "Маркиза", tier: "Технический партнёр" },
  { id: 3, name: "Фитнес Мафия", tier: "Партнёр" },
  { id: 4, name: "Импульс", tier: "Партнёр" },
  { id: 5, name: "Casa Caraman", tier: "Партнёр" },
  { id: 6, name: "Музей «Бутылка»", tier: "Партнёр" },
  { id: 7, name: "Агентство по туризму ПМР", tier: "Инфоподдержка" },
  { id: 8, name: "Первый Приднестровский", tier: "Инфоподдержка" },
];

const CATEGORIES = [
  { min: 7, max: 10, name: "Дети 7–10" }, { min: 11, max: 14, name: "Юноши/Девушки 11–14" },
  { min: 15, max: 19, name: "Юниоры 15–19" }, { min: 20, max: 29, name: "Любители 20–29" },
  { min: 30, max: 39, name: "Любители 30–39" }, { min: 40, max: 49, name: "Любители 40–49" },
  { min: 50, max: 59, name: "Любители 50–59" }, { min: 60, max: 69, name: "Любители 60–69" },
  { min: 70, max: 120, name: "70+" },
];

const REGS_SEED = [
  { id: 101, user: "Денис Демо", eventId: "dubossary-zaplyv", dist: "3000 м", cat: "Любители 40–49", fee: 400, bib: "DENIS", paid: true, mine: true },
  { id: 103, user: "Олеся Чекан", eventId: "dubossary-zaplyv", dist: "3000 м", cat: "Любители 30–39", fee: 400, bib: "OLESYA", paid: false },
  { id: 104, user: "Игорь Мунтян", eventId: "night-dubossary", dist: "11 км", cat: "Любители 20–29", fee: 350, bib: null, paid: false },
];

const DEMO_USER = { name: "Денис", city: "Тирасполь" };

/* сборы — реальные акции hi-trail.ru («Безопасная трасса», «Хай-Трейл Мобиль») */
const FUNDS_SEED = [
  { id: "trassa", title: "Безопасная трасса",
    pitch: "Оборудование для разметки дистанций: сигнальные конусы и панели направления — чтобы трасса читалась без единой ошибки.",
    goal: 13620, cur: "лей", raised: 8140, backers: 31, deadline: "2026-09-20",
    why: ["Безопасность участников на трассе", "Чёткое понимание маршрута", "Меньше ошибок и сходов с дистанции", "Разгрузка судей и волонтёров", "Уровень современных стандартов организации"],
    items: [
      { n: "Сигнальные конусы MFK 3252E (светоотражающая полоса)", q: "50 шт × 189", s: 9450 },
      { n: "Напольные панели направления MFK 4204", q: "30 шт × 139", s: 4170 },
    ],
    crew: ["Денис Д.", "Олеся Ч.", "Игорь М.", "Клуб «Импульс»", "аноним × 9"] },
  { id: "mobil", title: "Хай-Трейл Мобиль",
    pitch: "Грузопассажирский автобус — мобильный центр каждого старта: оборудование, арки, питание и команда в одной машине.",
    goal: 250000, cur: "руб", raised: 47300, backers: 52, deadline: null, demoGoal: true,
    why: ["Перевозка всего оборудования и разметки трасс", "Стартовые арки, стойки, питание, наградная атрибутика", "Доставка волонтёров, судей и оргкоманды", "Логистика тренировок и благотворительных мероприятий"],
    crew: ["Денис Д.", "Вячеслав Ш.", "Фитнес Мафия", "Casa Caraman", "аноним × 17"] },
];

/* допродажи при регистрации: печать под заказ, выдача на старте */
const ADDONS = [
  { id: "bib", n: "Именной стартовый номер", fee: 50, bib: true },
  { id: "tee", n: "Футболка финишёра этапа", fee: 250, size: true },
  { id: "buff", n: "Бафф лиги", fee: 150 },
  { id: "cap", n: "Шапочка для плавания с лого", fee: 200, swimOnly: true },
];

/* витрина магазина: без склада, под заказ */
const SHOP_ITEMS = [
  { id: "tee-l", n: "Футболка лиги Hi-Trail", fee: 250, d: "Хлопок, фирменная «лента» на рукаве. Размеры XS–XXL." },
  { id: "hoodie", n: "Худи Hi-Trail", fee: 520, d: "Плотное, шеврон-логотип на груди, лента на капюшоне." },
  { id: "buff-l", n: "Бафф лиги", fee: 150, d: "Бег, вело, под шлем — универсальный." },
  { id: "cap-l", n: "Шапочка для плавания", fee: 200, d: "Силикон с логотипом — пригодится на каждом заплыве сезона." },
  { id: "stick", n: "Стикерпак «Сезон 2026»", fee: 50, d: "12 наклеек с локациями сезона: от Ультры до Чобруч." },
  { id: "cert", n: "Сертификат на старт в подарок", fee: 400, d: "Слот на любой старт сезона — получатель выберет сам.", cert: true },
];

const MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const fmt = (iso) => { const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
const isPast = (iso) => new Date(iso) < TODAY;
const daysTo = (iso) => Math.ceil((new Date(iso) - TODAY) / 86400000);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Russo+One&family=Oswald:wght@500;600;700&family=Tektur:wght@600;700;900&family=Manrope:wght@400;500;600;700;800&display=swap');
:root{--ink:#0F2A1D;--deep:#0F2A1D;--deep2:#16382A;--field:#F4F6F0;--card:#FFF;--tape:#FF4D00;--river:#1B7F8E;--line:#DCE2D4;--mut:#5C6B5E;--lite:#E7ECE0;--fd:'Unbounded';--navh:60px}
*{box-sizing:border-box;margin:0;padding:0}
.ht{min-height:100vh;background:var(--field);color:var(--ink);font-family:'Manrope',sans-serif;font-size:15px;line-height:1.55}
.ht h1,.ht h2,.ht h3{font-family:var(--fd),sans-serif;letter-spacing:-.01em}
.wrap{max-width:1100px;margin:0 auto;padding:0 20px}
.tape{height:10px;background:repeating-linear-gradient(-55deg,var(--tape) 0 22px,var(--deep) 22px 44px)}
.nav{background:var(--deep);color:#fff;position:sticky;top:0;z-index:40}
.nav .wrap{display:flex;align-items:center;gap:4px;height:var(--navh);flex-wrap:nowrap}
.logo{font-family:var(--fd);font-weight:900;font-size:17px;cursor:pointer;margin-right:8px;white-space:nowrap;display:flex;align-items:center;gap:8px}
.logo em{color:var(--tape);font-style:normal}
.nbtn{background:none;border:none;color:#CBD8CC;font:600 13.5px 'Manrope';padding:8px 10px;border-radius:8px;cursor:pointer}
.nbtn:hover{color:#fff;background:rgba(255,255,255,.08)}
.nbtn.on{color:#fff;background:rgba(255,255,255,.14)}
.nbtn.adm{color:#FFB38A}
.nspace{flex:1}
.acct{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.1);border:none;color:#fff;padding:7px 13px;border-radius:999px;font:700 13px 'Manrope';cursor:pointer}
.dot{width:8px;height:8px;border-radius:50%;background:var(--tape)}
.btn{border:none;border-radius:10px;padding:12px 20px;font:800 14px 'Manrope';cursor:pointer;transition:transform .12s}
.btn:hover{transform:translateY(-1px)}
.btn.pri{background:var(--tape);color:#fff}
.btn.gho{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.35)}
.btn.pine{background:var(--deep);color:#fff}
.btn.lite{background:var(--lite);color:var(--ink)}
.btn.sm{padding:8px 14px;font-size:13px}
.btn:disabled{opacity:.45;cursor:default;transform:none}
.hero{background:var(--deep);color:#fff;padding:54px 0 60px;position:relative;overflow:hidden}
.hero::after{content:"";position:absolute;right:-70px;top:-50px;width:440px;height:440px;border-radius:50%;background:radial-gradient(circle,rgba(27,127,142,.35),transparent 65%)}
.eyebrow{font:700 12px 'Manrope';letter-spacing:.22em;text-transform:uppercase;color:var(--tape);margin-bottom:14px}
.hero h1{font-size:clamp(30px,5.2vw,52px);font-weight:900;line-height:1.06;max-width:740px}
.hero h1 span{color:#8FD3C7}
.hero p{margin-top:16px;max-width:580px;color:#B9C9BC;font-size:16px}
.hbtns{margin-top:26px;display:flex;gap:12px;flex-wrap:wrap}
.next{position:relative;z-index:1;margin-top:34px;display:inline-flex;gap:18px;align-items:center;background:var(--deep2);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:14px 20px;cursor:pointer}
.next:hover{border-color:rgba(255,255,255,.3)}
.next .cd{font-family:var(--fd);font-weight:900;font-size:28px;color:var(--tape)}
.next .cl{font-size:12px;color:#9DB3A2}
.next .ct{font-weight:800}
.counter{font:700 13px 'Manrope';color:#9DB3A2;margin-top:22px}
.counter b{color:#fff;font-family:var(--fd);font-size:16px}
.sec{padding:42px 0}
.sec.tint{background:#ECEFE6}
.sec.dark{background:var(--deep);color:#fff}
.sechead{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:20px;gap:12px;flex-wrap:wrap}
.sechead h2{font-size:22px;font-weight:700}
.link{background:none;border:none;color:var(--river);font:700 14px 'Manrope';cursor:pointer;text-decoration:none;padding:0}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
.chip{border:1.5px solid var(--line);background:var(--card);border-radius:999px;padding:8px 15px;font:700 13px 'Manrope';color:var(--mut);cursor:pointer}
.chip.on{border-color:var(--deep);background:var(--deep);color:#fff}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px}
.bib{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;cursor:pointer;transition:transform .12s,box-shadow .12s;display:flex;flex-direction:column}
.bib:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(15,42,29,.12)}
.bib .art{height:84px;position:relative;overflow:hidden}
.bib .art svg{display:block;width:100%;height:100%}
.hero .heroart{position:absolute;left:0;right:0;bottom:0;height:200px;opacity:.3;pointer-events:none}
.hero .wrap{position:relative;z-index:1}
.bib .top{display:flex;justify-content:space-between;align-items:center;padding:7px 14px;border-bottom:2px dashed var(--line)}
.bib .sport{font:800 11px 'Manrope';letter-spacing:.12em;text-transform:uppercase}
.bib .num{font-family:var(--fd);font-weight:900;font-size:21px;line-height:1;text-align:right}
.bib .num small{display:block;font:700 10px 'Manrope';letter-spacing:.14em;color:var(--mut);text-transform:uppercase}
.bib .body{padding:11px 14px 13px;flex:1;display:flex;flex-direction:column;gap:6px}
.bib h3{font-size:16px;font-weight:700;line-height:1.25}
.slogan{font-size:13px;color:var(--mut);font-style:italic}
.bib .plc{font-size:13px;color:var(--mut)}
.tags{display:flex;gap:6px;flex-wrap:wrap}
.lg{font:800 10.5px 'Manrope';letter-spacing:.08em;text-transform:uppercase;border-radius:6px;padding:3.5px 8px}
.lg-cup{background:#FFF0E8;color:var(--tape)}
.lg-night{background:#101510;color:#C8F231}
.lg-water{background:#E4F0FA;color:#1D5FA0}
.lg-bike{background:#E2F1F2;color:#136A77}
.lg-ultra{background:#F0E8FA;color:#5B3FA8}
.lg-final{background:var(--deep);color:#FFB38A}
.lg-new{background:#E7F5EC;color:#177245}
.legs{display:flex;gap:10px;align-items:center;flex-wrap:wrap;font:700 12.5px 'Manrope';color:var(--ink)}
.legs svg{vertical-align:-3px;margin-right:3px}
.legs .plus{color:var(--mut);font-weight:400}
.dchips{display:flex;gap:6px;flex-wrap:wrap}
.dchip{font:700 12px 'Manrope';background:var(--field);border:1px solid var(--line);border-radius:6px;padding:3px 8px}
.slotline{margin-top:auto;padding-top:9px}
.slotbar{height:5px;border-radius:3px;background:var(--field);overflow:hidden;margin-top:5px}
.slotbar i{display:block;height:100%;background:var(--tape)}
.badge{font:800 11px 'Manrope';border-radius:6px;padding:4px 8px;letter-spacing:.06em;text-transform:uppercase}
.badge.open{background:#E7F5EC;color:#177245}
.badge.low{background:#FFF6DC;color:#9A7200}
.badge.sold{background:#F6E3E3;color:#A33}
.badge.done{background:#EEEEEA;color:#8A8A80}
.badge.reg{background:#FFF0E8;color:var(--tape)}
.badge.wait{background:#FFF6DC;color:#9A7200}
.badge.res{background:#E4F0FA;color:#1D5FA0}
.leaguegrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
.leaguecard{border-radius:14px;padding:20px;cursor:pointer;transition:transform .12s;border:1px solid transparent}
.leaguecard:hover{transform:translateY(-3px)}
.leaguecard h3{font-size:16px;margin-bottom:6px}
.leaguecard p{font-size:13px;opacity:.85}
.lc-run{background:var(--deep);color:#fff}
.lc-night{background:#0B0F0B;color:#C8F231;border-color:#26312A}
.lc-water{background:#0A2233;color:#8FD3E8}
.lc-bike{background:#0F3B42;color:#9FE0DA}
.ehero{background:var(--deep);color:#fff;padding:42px 0;position:relative;overflow:hidden}
.ehero .bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.28}
.ehero .wrap{position:relative}
.ehero h1{font-size:clamp(26px,4.2vw,42px);font-weight:900;margin:6px 0 4px;max-width:780px}
.esub{font-size:17px;color:#8FD3C7;font-weight:700;margin-bottom:8px}
.meta{color:#B9C9BC;font-size:15px}
.facts{display:flex;gap:26px;flex-wrap:wrap;margin-top:22px}
.fact .fv{font-family:var(--fd);font-weight:900;font-size:19px}
.fact .fl{font:700 11px 'Manrope';letter-spacing:.12em;text-transform:uppercase;color:#9DB3A2}
.subnav{position:sticky;top:var(--navh);z-index:30;background:var(--card);border-bottom:1px solid var(--line)}
.subnav .wrap{display:flex;gap:2px;overflow-x:auto;padding-top:6px;padding-bottom:6px;align-items:center}
.snbtn{background:none;border:none;white-space:nowrap;font:700 13px 'Manrope';color:var(--mut);padding:8px 12px;border-radius:8px;cursor:pointer}
.snbtn:hover{color:var(--ink);background:var(--field)}
.cols{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:26px;align-items:start}
@media(max-width:860px){.cols{grid-template-columns:minmax(0,1fr)}}
.panel{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px 22px;margin-bottom:16px;scroll-margin-top:calc(var(--navh) + 60px)}
.panel h3{font-size:16px;margin-bottom:13px}
.row{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--field);font-size:14px}
.row:last-child{border-bottom:none}
.row b{font-weight:800}
.fee{font-family:var(--fd);font-weight:700;white-space:nowrap}
.sticky{position:sticky;top:calc(var(--navh) + 62px)}
.note{font-size:13px;color:var(--mut);margin-top:10px}
.hint{font-size:13px;color:var(--mut)}
.dcard{border:1.5px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:10px}
.dcard .dh{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.dcard .dn{font-family:var(--fd);font-weight:900;font-size:20px}
.dcard .story{font-size:13.5px;color:var(--mut);margin-top:7px;line-height:1.5}
.dcard .rec{font-size:12.5px;color:var(--ink);margin-top:6px;font-weight:700}
.tbl{width:100%;border-collapse:collapse;font-size:14px}
.tbl th{font:800 11.5px 'Manrope';letter-spacing:.08em;text-transform:uppercase;color:var(--mut);text-align:left;padding:8px 10px;border-bottom:2px solid var(--line)}
.tbl td{padding:9px 10px;border-bottom:1px solid var(--field)}
.tbl tr:last-child td{border-bottom:none}
.tbl .r{text-align:right}
.tbl .c{text-align:center}
.tbl b{font-weight:800}
.tblwrap{overflow-x:auto}
.disc{display:flex;gap:12px;align-items:baseline;padding:8px 0;border-bottom:1px solid var(--field);font-size:14px}
.disc:last-child{border-bottom:none}
.disc .pct{font-family:var(--fd);font-weight:900;color:var(--tape);min-width:52px}
.doc{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--field);font-size:14px;color:var(--ink);text-decoration:none;font-weight:700}
.doc:last-child{border-bottom:none}
.doc:hover{color:var(--river)}
.doc .ic{width:34px;height:34px;border-radius:8px;background:var(--field);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}
.gal img{width:100%;height:110px;object-fit:cover;border-radius:10px;border:1px solid var(--line)}
.quote{border-left:4px solid var(--tape);padding:4px 0 4px 16px;font-size:14.5px;line-height:1.6}
.quote .qwho{display:block;margin-top:8px;font:700 12.5px 'Manrope';color:var(--mut)}
.foldh{width:100%;background:none;border:none;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;cursor:pointer;text-align:left;padding:0;font-family:inherit;color:inherit}
.foldh h3{margin:0}
.fsum{display:block;font:600 13px 'Manrope';color:var(--mut);margin-top:5px;line-height:1.4}
.chev{color:var(--mut);font-size:17px;transition:transform .15s;flex-shrink:0;margin-top:2px}
.chev.up{transform:rotate(180deg)}
.foldb{margin-top:14px}
.field{margin-bottom:15px}
.field label{display:block;font:800 12px 'Manrope';letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-bottom:6px}
.field input,.field select,.field textarea{width:100%;border:1.5px solid var(--line);border-radius:10px;padding:10px 13px;font:600 16px 'Manrope';color:var(--ink);background:var(--card);outline:none}
.minifield{margin-left:10px;border:1.5px solid var(--line);border-radius:8px;padding:5px 9px;font:700 16px 'Manrope';color:var(--ink);background:var(--card);outline:none;max-width:130px}
.minifield:focus{border-color:var(--river)}
.bibname{width:110px;font-weight:800;letter-spacing:.06em}
.numfield{width:110px;margin-left:0;font-weight:600}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--river)}
.frow{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}
@media(max-width:640px){.frow{grid-template-columns:minmax(0,1fr)}}
.radio{display:flex;align-items:center;justify-content:space-between;border:1.5px solid var(--line);border-radius:10px;padding:11px 14px;margin-bottom:8px;cursor:pointer;font-weight:700}
.radio.on{border-color:var(--tape);background:#FFF7F2}
.calc{background:var(--deep);color:#fff;border-radius:12px;padding:15px 18px;margin:16px 0}
.calc .sum{font-family:var(--fd);font-weight:900;font-size:24px;color:var(--tape)}
.acgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:22px}
.stat{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:15px}
.stat .v{font-family:var(--fd);font-weight:900;font-size:25px}
.stat .l{font-size:12px;color:var(--mut);font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.trow{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:14px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:13px 16px;margin-bottom:10px;cursor:pointer}
.trow:hover{border-color:var(--river)}
.trow .d{font-family:var(--fd);font-weight:900;font-size:15px;text-align:center;line-height:1.15}
.trow .d small{display:block;font:700 10px 'Manrope';color:var(--mut);text-transform:uppercase}
.res-r{text-align:right}
.res-r .t{font-family:var(--fd);font-weight:700;font-size:16px}
.res-r .p{font-size:12px;color:var(--mut)}
.search{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px}
.search input{flex:1;min-width:240px;border:1.5px solid var(--line);border-radius:12px;padding:13px 16px;font:600 16px 'Manrope';background:var(--card);color:var(--ink);outline:none}
.search input:focus{border-color:var(--tape)}
.medal{display:inline-flex;width:26px;height:26px;border-radius:50%;align-items:center;justify-content:center;font:900 12px var(--fd);color:#fff}
.m1{background:#D4A017}.m2{background:#9AA2A8}.m3{background:#A9765C}.mN{background:var(--lite);color:var(--ink)}
.cuprow{display:grid;grid-template-columns:44px minmax(0,1fr) auto auto;gap:12px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px;margin-bottom:8px}
.cuprow.me{border-color:var(--tape);background:#FFF9F5}
.cuprow .nm{font-weight:800}
.cuprow .sub{font-size:12.5px;color:var(--mut)}
.cuprow .pts{font-family:var(--fd);font-weight:900;font-size:20px;color:var(--tape)}
.cuprow .st{font-size:12px;color:var(--mut);text-align:right}
.formula{font-family:var(--fd);font-weight:700;font-size:17px;background:var(--field);border:1px solid var(--line);border-radius:10px;padding:14px 16px;text-align:center;margin-bottom:12px}
.plogos{display:flex;gap:10px;flex-wrap:wrap}
.plogo{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:11px 16px;font:800 13.5px 'Manrope';display:flex;align-items:center;gap:10px}
.plogo .mono{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font:900 12px var(--fd);flex-shrink:0}
.ptier{font:800 11px 'Manrope';letter-spacing:.16em;text-transform:uppercase;color:var(--mut);margin:16px 0 10px}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--deep);color:#fff;border-radius:12px;padding:13px 22px;font-weight:700;box-shadow:0 12px 30px rgba(0,0,0,.25);z-index:60;display:flex;gap:10px;align-items:center;max-width:90vw}
.toast .dot{background:#4CC38A;flex-shrink:0}
.foot{background:var(--deep);color:#9DB3A2;padding:32px 0;margin-top:40px;font-size:13px}
.foot b{color:#fff}
.empty{border:2px dashed var(--line);border-radius:14px;padding:30px;text-align:center;color:var(--mut)}
.themes{position:fixed;left:18px;bottom:18px;z-index:70;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px 12px;box-shadow:0 10px 30px rgba(0,0,0,.18)}
.themes .tt{font:800 10.5px 'Manrope';letter-spacing:.14em;text-transform:uppercase;color:var(--mut);margin-bottom:8px}
.trowt{display:flex;gap:8px;align-items:center}
.sw{width:34px;height:34px;border-radius:50%;border:2.5px solid transparent;cursor:pointer;padding:0;position:relative;overflow:hidden}
.sw.on{border-color:var(--ink)}
.sw .h1c{position:absolute;inset:0}
.sw .h2c{position:absolute;left:0;right:0;bottom:0;height:40%}
.tname{font:800 12.5px 'Manrope';margin-left:4px;max-width:120px}
.atabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px}
.atab{border:1.5px solid var(--line);background:var(--card);border-radius:10px;padding:9px 16px;font:800 13px 'Manrope';color:var(--mut);cursor:pointer}
.atab.on{background:var(--tape);border-color:var(--tape);color:#fff}
.atab .cnt{background:rgba(0,0,0,.12);border-radius:999px;padding:1px 7px;margin-left:6px;font-size:11px}
.arow{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px;margin-bottom:8px}
.arow .sub{font-size:13px;color:var(--mut)}
.admbar{background:#3B1F0E;color:#FFD9C2;font:700 13px 'Manrope';padding:9px 0}
.upl{border:2px dashed var(--line);border-radius:12px;padding:22px;text-align:center;color:var(--mut);cursor:pointer;font-weight:700}
.upl:hover{border-color:var(--tape);color:var(--tape)}
.thumbs{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin-top:12px}
.thumb{position:relative}
.thumb img{width:100%;height:90px;object-fit:cover;border-radius:10px;border:1px solid var(--line)}
.thumb .del{position:absolute;top:6px;right:6px;background:rgba(15,42,29,.85);color:#fff;border:none;border-radius:6px;width:24px;height:24px;cursor:pointer;font-weight:900}
.erow{display:grid;grid-template-columns:minmax(0,1fr) 90px minmax(0,1fr) 34px;gap:8px;margin-bottom:8px}
.erow2{display:grid;grid-template-columns:130px minmax(0,1fr) 34px;gap:8px;margin-bottom:8px}
.erow input,.erow2 input{border:1.5px solid var(--line);border-radius:8px;padding:8px 10px;font:600 16px 'Manrope';width:100%}
.xdel{border:none;background:#F3E3DB;color:#8A3A1B;border-radius:8px;cursor:pointer;font-weight:900}
.pinhead{font:800 11px 'Manrope';letter-spacing:.16em;text-transform:uppercase;color:var(--tape);margin-bottom:10px;display:flex;align-items:center;gap:10px}
.pinhead::after{content:"";flex:1;height:2px;background:repeating-linear-gradient(90deg,var(--tape) 0 8px,transparent 8px 16px);opacity:.5}
.fundstrip{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;margin-bottom:26px}
.fundcard{background:var(--card);border:1.5px solid var(--tape);border-radius:14px;overflow:hidden;cursor:pointer;transition:transform .12s,box-shadow .12s;display:flex;flex-direction:column}
.fundcard:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(255,77,0,.2)}
.fundcard .fart{height:84px;position:relative;overflow:hidden}
.fundcard .fbody{padding:12px 14px 14px;display:flex;flex-direction:column;gap:6px}
.fundcard h3{font-size:16px}
.badge.fund{background:var(--tape);color:#fff}
.fbar{height:8px;border-radius:4px;background:var(--field);border:1px solid var(--line);overflow:hidden}
.fbar i{display:block;height:100%;background:repeating-linear-gradient(-55deg,var(--tape) 0 10px,color-mix(in srgb,var(--tape) 65%,#fff) 10px 20px)}
.fmeta{display:flex;gap:10px;align-items:baseline;font-size:13px;color:var(--mut);flex-wrap:wrap}
.fmeta b{font-family:var(--fd);font-size:15px;color:var(--ink)}
.presets{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
.preset{border:1.5px solid var(--line);background:var(--card);border-radius:10px;padding:9px 14px;font:800 13px 'Manrope';cursor:pointer;color:var(--ink)}
.preset.on{border-color:var(--tape);background:#FFF7F2;color:var(--tape)}
.crew{display:flex;gap:8px;flex-wrap:wrap}
.crewp{background:var(--field);border:1px solid var(--line);border-radius:999px;padding:5px 12px;font:700 12.5px 'Manrope'}
.shopgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.shopcard{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:8px}
.shopcard .tile{width:52px;height:52px;border-radius:12px;background:var(--deep);color:var(--tape);display:flex;align-items:center;justify-content:center;font:900 20px var(--fd)}
.shopcard h3{font-size:15px}
.shopcard .d{font-size:13px;color:var(--mut);flex:1}

/* ============================================================
   МОБИЛЬНЫЙ СЛОЙ v5.1 — идёт последним, поэтому переопределяет
   только то, что нужно. Десктоп (>900px) не меняется.
   ============================================================ */

/* --- гигиена, безопасная на всех ширинах --- */
html{-webkit-text-size-adjust:100%}
.ht{min-height:100dvh;overflow-x:clip;overflow-wrap:break-word}
.ht img,.ht svg{max-width:100%}
.ht button,.ht a{touch-action:manipulation;-webkit-tap-highlight-color:rgba(255,77,0,.14)}
.tblwrap,.subnav .wrap{-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}
.subnav .wrap{scrollbar-width:none}
.subnav .wrap::-webkit-scrollbar{display:none}
/* min() — чтобы карточки не выпирали за экран уже 320px */
.grid{grid-template-columns:repeat(auto-fill,minmax(min(290px,100%),1fr))}
.fundstrip{grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))}
.leaguegrid{grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr))}
.shopgrid{grid-template-columns:repeat(auto-fill,minmax(min(240px,100%),1fr))}
.acgrid{grid-template-columns:repeat(auto-fit,minmax(min(160px,100%),1fr))}
.gal{grid-template-columns:repeat(auto-fill,minmax(min(140px,100%),1fr))}
.thumbs{grid-template-columns:repeat(auto-fill,minmax(min(120px,100%),1fr))}
/* fixed-элементы уважают вырез и домашнюю полоску iPhone */
.toast{bottom:calc(24px + env(safe-area-inset-bottom))}
.themes{left:calc(18px + env(safe-area-inset-left));bottom:calc(18px + env(safe-area-inset-bottom))}
/* на тач-экранах hover залипает после тапа — гасим */
@media(hover:none){
  .bib:hover,.fundcard:hover,.leaguecard:hover,.btn:hover{transform:none;box-shadow:none}
  .nbtn:hover{background:none;color:#CBD8CC}
  .nbtn.on:hover{color:#fff;background:rgba(255,255,255,.14)}
  .snbtn:hover{background:none;color:var(--mut)}
}
/* элементы, которые появляются только на мобильном */
.burger{display:none}
.navscrim{display:none}
.navlinks{display:contents}
.thtog{display:none}

/* --- ПЛАНШЕТ И ТЕЛЕФОН: шапка становится бургер-меню --- */
@media(max-width:900px){
  :root{--navh:56px}
  .nav .wrap{gap:2px;padding-left:max(14px,env(safe-area-inset-left));padding-right:max(14px,env(safe-area-inset-right))}
  .logo{font-size:15px;margin-right:0;gap:7px}
  .navlinks{display:none}
  .navlinks.open{display:flex;flex-direction:column;gap:2px;position:absolute;left:0;right:0;top:var(--navh);
    background:var(--deep);border-top:1px solid rgba(255,255,255,.12);
    padding:8px 10px calc(12px + env(safe-area-inset-bottom));
    box-shadow:0 18px 34px rgba(0,0,0,.34);max-height:calc(100dvh - var(--navh));overflow-y:auto}
  .navlinks.open .nbtn{width:100%;text-align:left;font-size:15px;padding:13px 14px;min-height:48px;border-radius:10px}
  .burger{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;flex-shrink:0;
    background:none;border:none;border-radius:10px;cursor:pointer;padding:0;margin-left:2px}
  .burger i{display:block;position:relative;width:20px;height:2px;background:#fff;border-radius:2px}
  .burger i::before,.burger i::after{content:"";position:absolute;left:0;width:20px;height:2px;background:#fff;border-radius:2px;transition:transform .18s}
  .burger i::before{top:-6px}
  .burger i::after{top:6px}
  .burger.on i{background:transparent}
  .burger.on i::before{transform:translateY(6px) rotate(45deg)}
  .burger.on i::after{transform:translateY(-6px) rotate(-45deg)}
  .acct{padding:8px 12px;min-height:40px;flex-shrink:0}
  .nbtn.adm{min-height:40px;padding:8px 10px;flex-shrink:0}
  .navscrim{display:block;position:fixed;inset:var(--navh) 0 0;background:rgba(8,14,10,.45);z-index:35;border:none;padding:0;cursor:default}
}

/* --- одна колонка: блок «Участие» поднимается наверх --- */
@media(max-width:860px){
  .cols>.sticky:not(.panel){display:contents}
  .cols>.sticky:not(.panel)>.panel{order:2}
  .cols>.sticky:not(.panel)>.panel:first-child{order:-1}
  .panel.sticky{position:static}
}

/* --- ТЕЛЕФОН --- */
@media(max-width:640px){
  .wrap{padding-left:max(16px,env(safe-area-inset-left));padding-right:max(16px,env(safe-area-inset-right))}
  .sec{padding:28px 0}
  .sechead h2{font-size:19px}
  .sechead>div,.sechead>span{flex-wrap:wrap}
  .panel{padding:16px 15px;border-radius:12px}
  .foot{padding:26px 0;margin-top:28px}

  .hero{padding:34px 0 38px}
  .hero::after{width:280px;height:280px;right:-90px;top:-70px}
  .hero h1{line-height:1.1}
  .hero p{font-size:15px;margin-top:12px}
  .hbtns{gap:10px;margin-top:22px}
  .hbtns .btn{flex:1 1 100%}
  .next{display:flex;width:100%;flex-wrap:wrap;gap:6px 16px;padding:13px 15px;margin-top:24px}
  .counter{font-size:12.5px}
  .ehero{padding:30px 0}
  .ehero h1{line-height:1.14}
  .esub{font-size:15px}
  .meta{font-size:14px}
  .facts{gap:12px 18px;margin-top:16px}

  /* тач-таргеты не меньше 44px (Apple HIG / WCAG 2.5.8) */
  .btn{min-height:48px;padding:13px 18px}
  .btn.sm{min-height:40px;padding:9px 14px}
  .chip,.atab,.preset,.snbtn{min-height:44px;display:inline-flex;align-items:center;justify-content:center}
  .link{min-height:44px;display:inline-flex;align-items:center}
  .radio{min-height:52px;padding:13px 14px}
  .doc{padding:13px 0;min-height:48px}
  .foldh{min-height:44px;align-items:center}
  .xdel{min-height:44px;min-width:44px}
  .thumb .del{width:32px;height:32px;border-radius:8px}
  .sw{width:38px;height:38px}
  /* iOS Safari зумит поле при фокусе, если шрифт < 16px — размер задан в базовых правилах */
  .field input,.field select,.field textarea{padding:12px 13px}
  .search input{min-width:0}

  /* широкие «строки-гриды» перестраиваются в две колонки */
  .trow{grid-template-columns:46px minmax(0,1fr);gap:8px 12px;padding:12px 13px}
  .trow .res-r{grid-column:2;text-align:left}
  .cuprow{grid-template-columns:34px minmax(0,1fr);gap:5px 10px;align-items:start;padding:12px 13px}
  .cuprow>.medal{grid-column:1;grid-row:1}
  .cuprow>:nth-child(2){grid-column:2;grid-row:1}
  .cuprow>span:empty{display:none}
  .cuprow>.hint{grid-column:2}
  .cuprow>:last-child{grid-column:2;display:flex;align-items:baseline;gap:7px}
  .cuprow .st{text-align:left}
  .arow{grid-template-columns:minmax(0,1fr);gap:10px}
  .erow{grid-template-columns:minmax(0,1fr) 88px 44px}
  .erow>input:nth-child(3){grid-column:1/-1}
  .erow>.xdel{grid-column:3;grid-row:1}
  .erow2{grid-template-columns:minmax(0,1fr) 44px}
  .erow2>input:nth-child(2){grid-column:1/-1}
  .erow2>.xdel{grid-column:2;grid-row:1}

  .acgrid{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
  .stat{padding:13px}
  .stat .v{font-size:22px}
  .gal img{height:96px}
  .tbl th,.tbl td{padding:8px}

  /* панель тем сворачивается, чтобы не закрывать контент */
  .themes{left:calc(10px + env(safe-area-inset-left));bottom:calc(10px + env(safe-area-inset-bottom));padding:7px 8px;border-radius:12px}
  .themes .tt,.themes .tname{display:none}
  .themes:not(.open) .sw:not(.on){display:none}
  .thtog{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;padding:0;
    border:1px solid var(--line);background:var(--card);color:var(--mut);border-radius:10px;
    font:900 15px 'Manrope';cursor:pointer}

  /* тост — во всю ширину и выше панели тем */
  .toast{left:16px;right:16px;transform:none;max-width:none;justify-content:center;text-align:center;
    bottom:calc(70px + env(safe-area-inset-bottom))}
}
`;

/* ---------------- логотип и пиктограммы ---------------- */
const LogoMark = ({ s = 34 }) => (
  <svg width={s} height={s} viewBox="0 0 64 64" aria-hidden="true">
    <rect x="2" y="2" width="60" height="60" rx="16" fill="var(--deep2)" stroke="rgba(255,255,255,.16)" strokeWidth="1.5" />
    <path d="M14 40 L32 16.5 L50 40" fill="none" stroke="var(--tape)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 49.5 q6.5 -7 13 0 t13 0 t12 0" fill="none" stroke="rgba(255,255,255,.92)" strokeWidth="4.6" strokeLinecap="round" />
  </svg>
);
const Ico = ({ k }) => {
  if (k === "swim") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M2 17q2.5-3 5 0t5 0 5 0 5 0" /><circle cx="16" cy="7" r="2.4" fill="currentColor" stroke="none" /><path d="M4 12 l7 -3 4 2" /></svg>);
  if (k === "bike") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="6" cy="16" r="3.6" /><circle cx="18" cy="16" r="3.6" /><path d="M6 16 L10 8 h5 l3 8 M10 8 L14 16" /></svg>);
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="14" cy="4.6" r="2.2" fill="currentColor" stroke="none" /><path d="M7 21 l4-6 -1-4 4 2 3-2 M10 11 l-4 1 M14 15 l3 6" /></svg>);
};

const SCENES = {
  vesna: "field", frunze: "field", chobruchi: "field",
  "valya-trail": "canyon", "gorka-xcm": "forest", "night-trail": "forest",
  "night-dubossary": "shore", "dubossary-zaplyv": "water", "goyany-zaplyv": "water",
  swimrun: "water", "dnestrovsk-tri": "liman", ultra70: "winter",
};
const hashN = (str, m) => { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 997; return h % m; };

function Cover({ ev, full = false }) {
  const night = ev.leagues && ev.leagues.includes("night");
  const scene = SCENES[ev.id] || (ev.sport === "swim" ? "water" : "field");
  const c = SPORTS[ev.sport].color;
  const seed = hashN(ev.id, 30);
  const W = 420, H = full ? 250 : 100;
  const g = `g-${ev.id}-${full ? "f" : "c"}`;
  const sky1 = night ? "#070B08" : scene === "winter" ? "#28323A" : "var(--deep)";
  const sky2 = night ? "#121B12" : scene === "winter" ? "#3A4650" : "var(--deep2)";
  const line = night ? "#C8F231" : c;
  const Y = (f) => H - Math.round(H * f); // доля высоты от низа
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }} aria-hidden="true">
      <defs><linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={sky1} /><stop offset="1" stopColor={sky2} />
      </linearGradient></defs>
      <rect width={W} height={H} fill={`url(#${g})`} />

      {night ? (
        <g>
          {[...Array(18)].map((_, i) => (
            <circle key={i} cx={(i * 83 + seed * 11) % W} cy={(i * 41 + seed * 5) % Math.round(H * 0.6)} r={i % 4 ? 1 : 1.8} fill="#C8F231" opacity=".8" />
          ))}
          <circle cx={W - 58 - seed} cy={Y(0.72)} r={13} fill="#EAF2E8" opacity=".92" />
          <circle cx={W - 64 - seed} cy={Y(0.74)} r={13} fill={sky1} />
        </g>
      ) : scene === "winter" ? (
        <g>
          {[...Array(22)].map((_, i) => (
            <circle key={i} cx={(i * 71 + seed * 9) % W} cy={(i * 37 + seed * 7) % H} r={i % 3 ? 1.3 : 2.2} fill="#fff" opacity=".7" />
          ))}
          <circle cx={W - 70 - seed} cy={Y(0.7)} r={17} fill="#E8EEF4" opacity=".55" />
        </g>
      ) : (
        <circle cx={W - 66 - seed} cy={Y(0.68)} r={full ? 26 : 18} fill={c} opacity=".9" />
      )}

      {scene === "field" && (
        <g>
          <path d={`M0 ${Y(0.34)} H${W}`} stroke="rgba(255,255,255,.25)" strokeWidth="2" />
          {[0.06, 0.22, 0.4, 0.58, 0.76, 0.92].map((x, i) => (
            <path key={i} d={`M${W * x} ${H} L${W * 0.5 + (x - 0.5) * W * 0.22} ${Y(0.34)}`} stroke="rgba(255,255,255,.14)" strokeWidth="2" />
          ))}
          <path d={`M${W * 0.46} ${H} L${W * 0.5} ${Y(0.34)} L${W * 0.54} ${H}`} fill="rgba(0,0,0,.3)" />
          <path d={`M${W * 0.5} ${H - 4} L${W * 0.5} ${Y(0.36)}`} stroke={line} strokeWidth="3.5" strokeDasharray="9 9" strokeLinecap="round" />
        </g>
      )}
      {scene === "canyon" && (
        <g>
          <path d={`M0 ${Y(0.62)} L54 ${Y(0.62)} L86 ${Y(0.18)} L120 ${Y(0.18)} L120 ${H} L0 ${H} Z`} fill="#8A5A3B" opacity=".85" />
          <path d={`M${W} ${Y(0.7)} L${W - 70} ${Y(0.7)} L${W - 104} ${Y(0.2)} L${W - 150} ${Y(0.2)} L${W - 150} ${H} L${W} ${H} Z`} fill="#A9765C" opacity=".8" />
          <path d={`M120 ${H} L120 ${Y(0.3)} L168 ${Y(0.44)} L216 ${Y(0.24)} L262 ${Y(0.42)} L${W - 150} ${Y(0.26)} L${W - 150} ${H} Z`} fill="rgba(0,0,0,.35)" />
          <path d={`M132 ${H - 6} q60 -18 150 -8 t120 -14`} fill="none" stroke={line} strokeWidth="3.5" strokeDasharray="8 8" strokeLinecap="round" />
        </g>
      )}
      {scene === "forest" && (
        <g>
          {[...Array(9)].map((_, i) => {
            const x = 20 + i * 46 + (i % 2) * 8 + seed;
            const h2 = 26 + ((i * 13 + seed) % 18);
            return <path key={i} d={`M${x} ${Y(0.16)} L${x + 13} ${Y(0.16) - h2} L${x + 26} ${Y(0.16)} Z`} fill={i % 2 ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.35)"} />;
          })}
          <path d={`M0 ${Y(0.12)} H${W}`} stroke="rgba(0,0,0,.3)" strokeWidth={H * 0.14} />
          <path d={`M6 ${Y(0.05)} q70 -10 140 0 t140 0 t140 0`} fill="none" stroke={line} strokeWidth="3.5" strokeDasharray="8 8" strokeLinecap="round" />
        </g>
      )}
      {(scene === "water" || scene === "shore" || scene === "liman") && (
        <g>
          {!night && <path d={`M${W - 66 - seed} ${Y(0.6)} v${H * 0.5}`} stroke={c} strokeWidth="6" strokeDasharray="3 7" opacity=".5" strokeLinecap="round" />}
          <path d={`M0 ${Y(0.42)} q30 -13 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0`} fill="none" stroke="#8FD3E8" strokeWidth="3" opacity=".5" />
          <path d={`M0 ${Y(0.26)} q30 -11 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0`} fill="none" stroke="#fff" strokeWidth="3" opacity=".3" />
          <path d={`M0 ${Y(0.1)} q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0`} fill="none" stroke={line} strokeWidth="4.5" opacity=".9" />
          {[...Array(4)].map((_, i) => <circle key={i} cx={54 + i * 100 + seed} cy={Y(0.36) - (i % 2) * 8} r="4.5" fill={i % 2 ? "#FFD23F" : c} />)}
        </g>
      )}
      {scene === "shore" && (
        <path d={`M0 ${H} L0 ${Y(0.52)} L90 ${Y(0.78)} L200 ${Y(0.56)} L${W * 0.62} ${Y(0.84)} L${W * 0.62} ${H} Z`} fill="rgba(0,0,0,.4)" />
      )}
      {scene === "liman" && (
        <g stroke={night ? "#C8F231" : "#fff"} strokeWidth="3" fill="none" opacity=".9">
          <circle cx="46" cy={Y(0.62)} r="11" /><circle cx="84" cy={Y(0.62)} r="11" />
          <path d={`M46 ${Y(0.62)} L60 ${Y(0.62) - 18} h17 l7 18 M60 ${Y(0.62) - 18} L70 ${Y(0.62)}`} />
          <path d={`M120 ${Y(0.56)} l14 -20 l12 8 l12 -10`} strokeLinecap="round" />
        </g>
      )}
      {scene === "winter" && (
        <g>
          <path d={`M0 ${H} L0 ${Y(0.3)} L110 ${Y(0.56)} L230 ${Y(0.26)} L330 ${Y(0.5)} L${W} ${Y(0.3)} L${W} ${H} Z`} fill="rgba(255,255,255,.18)" />
          <path d={`M14 ${Y(0.08)} L112 ${Y(0.44)} L226 ${Y(0.18)} L332 ${Y(0.4)} L${W - 12} ${Y(0.22)}`} fill="none" stroke={line} strokeWidth="3.5" strokeDasharray="8 8" strokeLinecap="round" />
        </g>
      )}
      {scene === "water" && ev.sport === "multi" && (
        <path d={`M240 ${Y(0.55)} l16 -22 l13 9 l13 -12`} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".9" />
      )}
    </svg>
  );
}

const readFile = (e, cb) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => cb(r.result);
  r.readAsDataURL(f);
  e.target.value = "";
};
const PCOLORS = { "Генеральный партнёр": "#FF4D00", "Технический партнёр": "#1B7F8E", "Партнёр": "#0F2A1D", "Инфоподдержка": "#5C6B5E" };
const PartnerLogo = ({ p }) => (
  <div className="plogo"><span className="mono" style={{ background: PCOLORS[p.tier] }}>{p.name.replace(/[«»]/g, "").slice(0, 1)}</span>{p.name}</div>
);

function FundArt({ kind, full = false }) {
  const W = 420, H = full ? 230 : 96;
  const g = `fg-${kind}-${full ? "f" : "c"}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }} aria-hidden="true">
      <defs><linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--deep)" /><stop offset="1" stopColor="var(--deep2)" />
      </linearGradient></defs>
      <rect width={W} height={H} fill={`url(#${g})`} />
      <path d={`M0 ${H - 12} H${W}`} stroke="rgba(255,255,255,.22)" strokeWidth="3" />
      {kind === "trassa" ? (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => { const x = 34 + i * 62; return (
            <g key={i}>
              <path d={`M${x} ${H - 14} l11 -28 l11 28 Z`} fill="var(--tape)" />
              <path d={`M${x + 5} ${H - 25} h12`} stroke="#fff" strokeWidth="4" />
            </g> ); })}
          <path d={`M18 ${H - 54} h70 M110 ${H - 54} h70 M202 ${H - 54} h70`} stroke="#fff" strokeWidth="3" strokeDasharray="10 8" opacity=".45" />
          <path d={`M${W - 104} ${H - 46} h32 m0 0 l-11 -12 m11 12 l-11 12`} stroke="var(--tape)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : (
        <g>
          <rect x="56" y={H - 76} width="188" height="54" rx="13" fill="var(--tape)" />
          <rect x="70" y={H - 66} width="32" height="20" rx="4" fill="var(--deep)" opacity=".85" />
          <rect x="110" y={H - 66} width="32" height="20" rx="4" fill="var(--deep)" opacity=".85" />
          <rect x="150" y={H - 66} width="32" height="20" rx="4" fill="var(--deep)" opacity=".85" />
          <rect x="192" y={H - 66} width="38" height="32" rx="4" fill="var(--deep)" opacity=".6" />
          <circle cx="98" cy={H - 16} r="12" fill="#10150F" stroke="#fff" strokeWidth="3" />
          <circle cx="206" cy={H - 16} r="12" fill="#10150F" stroke="#fff" strokeWidth="3" />
          <path d={`M258 ${H - 40} q22 -16 46 -6`} stroke="#fff" strokeWidth="3" fill="none" opacity=".5" />
          <path d={`M266 ${H - 58} q22 -16 46 -6`} stroke="#fff" strokeWidth="3" fill="none" opacity=".32" />
        </g>
      )}
    </svg>
  );
}

function FundCard({ f, onOpen }) {
  const pct = Math.min(100, Math.round((f.raised / f.goal) * 100));
  return (
    <div className="fundcard" onClick={onOpen}>
      <div className="fart"><FundArt kind={f.id} /></div>
      <div className="fbody">
        <div className="tags"><span className="badge fund">Сбор</span>{f.deadline && <span className="hint">до {fmt(f.deadline)}</span>}</div>
        <h3>{f.title}</h3>
        <div className="slogan">{f.pitch}</div>
        <div className="fbar"><i style={{ width: pct + "%" }} /></div>
        <div className="fmeta"><b>{f.raised.toLocaleString("ru")} {f.cur}</b><span>из {f.goal.toLocaleString("ru")} · {pct}%</span><span className="hint">{f.backers} чел.</span></div>
      </div>
    </div>
  );
}

const SlotState = (ev) => {
  if (isPast(ev.date)) return null;
  const free = ev.slots.total - ev.slots.taken;
  if (free <= 0) return { cls: "sold", label: "Продано" };
  if (free / ev.slots.total <= 0.25) return { cls: "low", label: `Осталось ${free} слотов` };
  return { cls: "open", label: "Регистрация открыта" };
};

const BibCard = ({ ev, registered, hasResults, onOpen }) => {
  const d = new Date(ev.date);
  const slot = SlotState(ev);
  const pct = Math.min(100, Math.round((ev.slots.taken / ev.slots.total) * 100));
  return (
    <div className="bib" onClick={onOpen}>
      <div className="art"><Cover ev={ev} /></div>
      <div className="top">
        <span className="sport" style={{ color: SPORTS[ev.sport].color }}>{SPORTS[ev.sport].label}</span>
        <span className="num">{String(d.getDate()).padStart(2, "0")}<small>{MONTHS[d.getMonth()].slice(0, 3)}</small></span>
      </div>
      <div className="body">
        <div className="tags">
          {registered && !isPast(ev.date) && <span className="badge reg">Вы участвуете</span>}
          {ev.leagues.map((l) => <span key={l} className={`lg ${LEAGUES[l].cls}`}>{LEAGUES[l].label}</span>)}
          {isPast(ev.date) && (hasResults ? <span className="badge res">Результаты</span> : <span className="badge done">Завершено</span>)}
        </div>
        <h3>{ev.title}</h3>
        <div className="slogan">{ev.slogan}</div>
        <div className="plc">{ev.place}</div>
        {ev.legs ? (
          <div className="legs">
            {ev.legs.map((l, i) => (
              <span key={i}>{i > 0 && <span className="plus">+ </span>}<Ico k={l.k} /> {l.v}</span>
            ))}
          </div>
        ) : (
          <div className="dchips">{ev.dists.map((x) => <span key={x.n} className="dchip">{x.n}</span>)}</div>
        )}
        <div className="slotline">
          {slot ? (
            <>
              <span className={`badge ${slot.cls}`}>{slot.label}</span>
              <div className="slotbar"><i style={{ width: pct + "%" }} /></div>
            </>
          ) : <span className="hint">{fmt(ev.date)} 2026</span>}
        </div>
      </div>
    </div>
  );
};

/* ================= ГЛАВНАЯ ================= */
function Home({ go, myRegs, partners, results, funds }) {
  const upcoming = EVENTS_ALL.filter((e) => !isPast(e.date)).sort((a, b) => a.date.localeCompare(b.date));
  const next = upcoming[0];
  return (
    <>
      <div className="hero">
        {next && <div className="heroart"><Cover ev={next} full /></div>}
        <div className="wrap">
          <div className="eyebrow">Лига спорта и туризма · Приднестровье</div>
          <h1>Трейлы, вело и открытая вода <span>по берегам Днестра</span></h1>
          <p>25 стартов в сезоне: бег, XCM-марафоны, заплывы, триатлон. Онлайн-регистрация, живые протоколы и очки Кубка Hi-Trail за каждый финиш.</p>
          <div className="hbtns">
            <button className="btn pri" onClick={() => go("calendar")}>Календарь 2026</button>
            <button className="btn gho" onClick={() => go("cup")}>Кубок Hi-Trail</button>
          </div>
          {next && (
            <div className="next" onClick={() => go("event", next.id)}>
              <div><div className="cd">{daysTo(next.date)}</div><div className="cl">дней до старта</div></div>
              <div><div className="ct">{next.title}</div><div className="cl">{fmt(next.date)} · {next.place}</div></div>
            </div>
          )}
          <div className="counter">С 2019 года провели <b>100+</b> стартов · <b>6</b> дисциплин · <b>20+</b> локаций Приднестровья</div>
        </div>
      </div>
      <div className="tape" />
      <div className="wrap sec">
        <div className="sechead">
          <h2>Ближайшие старты</h2>
          <button className="link" onClick={() => go("calendar")}>Весь календарь →</button>
        </div>
        <div className="grid">
          {upcoming.slice(0, 6).map((ev) => (
            <BibCard key={ev.id} ev={ev} registered={myRegs.some((r) => r.eventId === ev.id)}
              hasResults={results.some((r) => r.eventId === ev.id)} onOpen={() => go("event", ev.id)} />
          ))}
        </div>
      </div>
      <div className="sec tint">
        <div className="wrap">
          <div className="sechead"><h2>Лиги сезона</h2><span className="hint">Отдельные зачёты внутри Кубка Hi-Trail</span></div>
          <div className="leaguegrid">
            <div className="leaguecard lc-run" onClick={() => go("cup", "cup")}>
              <h3>Кубок Hi-Trail</h3><p>Главный зачёт сезона: очки за каждый финиш на любой дистанции.</p>
            </div>
            <div className="leaguecard lc-night" onClick={() => go("cup", "night")}>
              <h3>Ночная лига</h3><p>Старты после заката: налобные фонари, темнота и свои чемпионы.</p>
            </div>
            <div className="leaguecard lc-water" onClick={() => go("cup", "water")}>
              <h3>Водная лига</h3><p>Заплывы и свимран на открытой воде Днестра.</p>
            </div>
            <div className="leaguecard lc-bike" onClick={() => go("cup", "bike")}>
              <h3>Вело лига</h3><p>XCM-марафоны по грунтам и холмам республики.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="wrap sec" style={{ paddingBottom: 0 }}>
        <div className="pinhead">Лига собирает</div>
        <div className="fundstrip">{funds.map((f) => <FundCard key={f.id} f={f} onOpen={() => go("fund", f.id)} />)}</div>
      </div>
      <div className="wrap sec">
        <div className="sechead"><h2>Партнёры лиги</h2><button className="link" onClick={() => go("partners")}>Стать партнёром →</button></div>
        {TIERS.map((t) => {
          const list = partners.filter((p) => p.tier === t);
          if (!list.length) return null;
          return (
            <div key={t}>
              <div className="ptier">{t}</div>
              <div className="plogos">{list.map((p) => <PartnerLogo key={p.id} p={p} />)}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ================= КАЛЕНДАРЬ ================= */
function Calendar({ go, myRegs, results, funds }) {
  const [sport, setSport] = useState("all");
  const [show, setShow] = useState("upcoming");
  const [openOnly, setOpenOnly] = useState(false);
  const list = useMemo(() => EVENTS_ALL
    .filter((e) => (sport === "all" || e.sport === sport))
    .filter((e) => (show === "all" ? true : show === "upcoming" ? !isPast(e.date) : isPast(e.date)))
    .filter((e) => (!openOnly || (!isPast(e.date) && e.slots.taken < e.slots.total)))
    .sort((a, b) => a.date.localeCompare(b.date)), [sport, show, openOnly]);
  return (
    <div className="wrap sec">
      <div className="sechead"><h2>Календарь 2026</h2></div>
      {funds && funds.length > 0 && (
        <>
          <div className="pinhead">Лига собирает</div>
          <div className="fundstrip">{funds.map((f) => <FundCard key={f.id} f={f} onOpen={() => go("fund", f.id)} />)}</div>
        </>
      )}
      <div className="chips">
        <button className={`chip ${sport === "all" ? "on" : ""}`} onClick={() => setSport("all")}>Все виды</button>
        {Object.entries(SPORTS).map(([k, s]) => (
          <button key={k} className={`chip ${sport === k ? "on" : ""}`} onClick={() => setSport(k)}>{s.label}</button>
        ))}
      </div>
      <div className="chips">
        {[["upcoming", "Предстоящие"], ["past", "Прошедшие"], ["all", "Все"]].map(([k, l]) => (
          <button key={k} className={`chip ${show === k ? "on" : ""}`} onClick={() => setShow(k)}>{l}</button>
        ))}
        <button className={`chip ${openOnly ? "on" : ""}`} onClick={() => setOpenOnly(!openOnly)}>Есть свободные слоты</button>
      </div>
      {list.length === 0 ? <div className="empty">По выбранным фильтрам стартов нет.</div> : (
        <div className="grid">
          {list.map((ev) => (
            <BibCard key={ev.id} ev={ev} registered={myRegs.some((r) => r.eventId === ev.id)}
              hasResults={results.some((r) => r.eventId === ev.id)} onOpen={() => go("event", ev.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= СТРАНИЦА СОБЫТИЯ ================= */
function Fold({ title, summary, open, onToggle, refFn, children }) {
  return (
    <div className="panel" ref={refFn}>
      <button className="foldh" onClick={onToggle} aria-expanded={open}>
        <span><h3 style={{ margin: 0 }}>{title}</h3>{!open && summary && <span className="fsum">{summary}</span>}</span>
        <span className={`chev ${open ? "up" : ""}`}>▾</span>
      </button>
      {open && <div className="foldb">{children}</div>}
    </div>
  );
}

function EventPage({ ev, go, myRegs, partners, results }) {
  const myReg = myRegs.find((r) => r.eventId === ev.id);
  const past = isPast(ev.date);
  const [open, setOpen] = useState({});
  const refs = useRef({});
  const R = (k) => (el) => { refs.current[k] = el; };
  const rich = !!ev.schedule;
  const slot = SlotState(ev);
  const evResults = results.find((r) => r.eventId === ev.id);

  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const jump = (k) => {
    setOpen((o) => ({ ...o, [k]: true }));
    setTimeout(() => refs.current[k] && refs.current[k].scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };
  const FOLDS = ["plan", "fees", "rec", "docs", "where"];
  const allOpen = FOLDS.every((k) => open[k]);
  const toggleAll = () => setOpen(allOpen ? {} : Object.fromEntries(FOLDS.map((k) => [k, true])));

  const SECTIONS = rich
    ? [["about", "О старте"], ["dists", "Дистанции"], ["plan", "Программа"], ["fees", "Взносы"], ["rec", "Рекорды"], ["docs", "Документы"], ["where", "Как добраться"]]
    : [["about", "О старте"], ["dists", "Дистанции"]];

  return (
    <>
      <div className="ehero">
        <div className="bg">{ev.cover
          ? <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${ev.cover})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          : <Cover ev={ev} full />}</div>
        <div className="wrap">
          <div className="eyebrow">{SPORTS[ev.sport].label} · {ev.leagues.map((l) => LEAGUES[l].label).join(" · ")}</div>
          <h1>{ev.title} 2026</h1>
          <div className="esub">{ev.slogan}</div>
          <div className="meta">{ev.place}</div>
          <div className="facts">
            <div className="fact"><div className="fv">{fmt(ev.date)}</div><div className="fl">дата старта</div></div>
            {ev.startTime && <div className="fact"><div className="fv">{ev.startTime}</div><div className="fl">общий старт</div></div>}
            <div className="fact"><div className="fv">{ev.dists.length}</div><div className="fl">дистанции</div></div>
            {ev.regClose && <div className="fact"><div className="fv">{ev.regClose}</div><div className="fl">закрытие регистрации</div></div>}
            {!past && <div className="fact"><div className="fv" style={{ color: "#FF7A3D" }}>{daysTo(ev.date)} дн.</div><div className="fl">до старта</div></div>}
          </div>
        </div>
      </div>
      <div className="tape" />
      <div className="subnav"><div className="wrap">
        {SECTIONS.map(([k, l]) => <button key={k} className="snbtn" onClick={() => jump(k)}>{l}</button>)}
        {rich && <span style={{ flex: 1 }} />}
        {rich && <button className="snbtn" style={{ color: "var(--tape)" }} onClick={toggleAll}>{allOpen ? "Свернуть всё" : "Развернуть всё"}</button>}
      </div></div>

      <div className="wrap sec">
        <div className="cols">
          <div>
            <div className="panel" ref={R("about")}>
              <h3>О старте</h3>
              <p>{ev.blurb}</p>
              {ev.gallery && ev.gallery.length > 0 && (
                <div className="gal" style={{ marginTop: 14 }}>{ev.gallery.map((g, i) => <img key={i} src={g} alt="" />)}</div>
              )}
              {ev.review && (
                <div className="quote" style={{ marginTop: 16 }}>
                  «{ev.review.text}»<span className="qwho">— {ev.review.who}</span>
                </div>
              )}
            </div>

            <div className="panel" ref={R("dists")}>
              <h3>Дистанции и маршруты</h3>
              {ev.dists.map((d) => (
                <div className="dcard" key={d.n}>
                  <div className="dh">
                    <span className="dn">{d.n}</span>
                    <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span className="fee">{d.fee === 0 ? "бесплатно" : `от ${d.fee} руб`}</span>
                      {d.map && <a className="btn pine sm" style={{ textDecoration: "none" }} href={d.map} target="_blank" rel="noreferrer">Карта ↗</a>}
                    </span>
                  </div>
                  {d.story && <div className="story">{d.story}</div>}
                  {ev.records && (() => {
                    const rr = ev.records.filter((r) => r.d === d.n);
                    return rr.length ? <div className="rec">Рекорды: {rr.map((r) => `${r.sex} — ${r.res} (${r.who.split(",")[0]})`).join(" · ")}</div> : null;
                  })()}
                </div>
              ))}
            </div>

            {evResults && (
              <div className="panel">
                <h3>Результаты · протокол</h3>
                <div className="tblwrap">
                  <table className="tbl">
                    <thead><tr><th>Место</th><th>Участник</th><th>Дистанция</th><th className="r">Время</th></tr></thead>
                    <tbody>
                      {evResults.rows.map((r, i) => (
                        <tr key={i}><td className="c"><span className={`medal ${r.p <= 3 ? "m" + r.p : "mN"}`}>{r.p}</span></td>
                          <td><b>{r.name}</b><div className="hint">{r.city} · {r.club}</div></td>
                          <td>{r.dist}</td><td className="r"><b className="fee">{r.time}</b></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="note">Демо-протокол прототипа. <button className="link" onClick={() => go("results")}>Все результаты и поиск по фамилии →</button></p>
              </div>
            )}

            {rich && (
              <Fold title="Программа дня" refFn={R("plan")} open={open.plan} onToggle={() => toggle("plan")}
                summary={`${ev.schedule.length} пунктов · регистрация с ${ev.schedule[0].t.split(" ")[0]} · общий старт в ${ev.startTime}`}>
                {ev.schedule.map((s) => (
                  <div className="row" key={s.t}><span style={{ minWidth: 100, fontWeight: 800 }}>{s.t}</span><span style={{ textAlign: "right" }}>{s.l}</span></div>
                ))}
              </Fold>
            )}

            {rich && (
              <Fold title="Стартовые взносы и скидки" refFn={R("fees")} open={open.fees} onToggle={() => toggle("fees")}
                summary={`закрытие регистрации ${ev.regClose} · скидки до 100%`}>
                <div className="tblwrap">
                  <table className="tbl">
                    <thead><tr><th>Группа</th><th className="r">до закрытия</th><th className="r">после закрытия*</th><th className="r">в день старта*</th></tr></thead>
                    <tbody>
                      {ev.feeTable.map((f) => (
                        <tr key={f.grp}><td><b>{f.grp}</b></td><td className="r">{f.early}</td><td className="r">{f.late}</td><td className="r">{f.day}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="note">* при наличии свободных слотов. Значение имеет дата оплаты. Возврат взноса невозможен.</p>
                <h3 style={{ marginTop: 20 }}>Скидки и освобождения</h3>
                <div className="disc"><span className="pct">−10%</span><span>Клубам от 3 участников · именинникам (±2 дня от даты старта)</span></div>
                <div className="disc"><span className="pct">−50%</span><span>Участникам 60+ · участникам с инвалидностью I–III группы</span></div>
                <div className="disc"><span className="pct">−50 руб</span><span>За каждый старт при оплате трёх и более мероприятий сезона сразу</span></div>
                <div className="disc"><span className="pct">−100%</span><span>Участникам-сиротам</span></div>
              </Fold>
            )}

            {rich && ev.records && (
              <Fold title="Рекорды трассы" refFn={R("rec")} open={open.rec} onToggle={() => toggle("rec")}
                summary={`${ev.records.length} рекордов дистанций`}>
                <div className="tblwrap">
                  <table className="tbl">
                    <thead><tr><th>Дистанция</th><th>Рекордсмен</th><th className="r">Результат</th><th className="r">Год</th></tr></thead>
                    <tbody>
                      {ev.records.map((r, i) => (
                        <tr key={i}><td><b>{r.d} · {r.sex}</b></td><td>{r.who}</td><td className="r"><b className="fee">{r.res}</b></td><td className="r">{r.y}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Fold>
            )}

            {rich && (
              <Fold title="Документы" refFn={R("docs")} open={open.docs} onToggle={() => toggle("docs")}
                summary="положение · согласие родителей · декларация об ответственности">
                {ev.docs.map((d) => (
                  <a className="doc" key={d.name} href={d.url} target="_blank" rel="noreferrer"><span className="ic">📄</span>{d.name}</a>
                ))}
                <p className="note">Подписываются в день старта в палатке регистрации, при себе — документ, удостоверяющий личность.</p>
              </Fold>
            )}

            {rich && (
              <Fold title="Как добраться и где жить" refFn={R("where")} open={open.where} onToggle={() => toggle("where")}
                summary={`${ev.place.split(",")[0]} · автобусы из Тирасполя, Бендер, Рыбницы`}>
                <div className="row"><span>Старт/финиш</span><b>{ev.place}</b></div>
                <div className="row"><span>Геолокация</span>
                  <a className="link" href={`https://maps.google.com/?q=${ev.geo}`} target="_blank" rel="noreferrer">{ev.geo} ↗</a></div>
                {ev.stay && <div className="row"><span>Проживание</span>
                  <a className="link" href={ev.stay.url} target="_blank" rel="noreferrer">{ev.stay.label} ↗</a></div>}
              </Fold>
            )}
          </div>

          <div className="sticky">
            <div className="panel">
              <h3>{past ? "Мероприятие завершено" : "Участие"}</h3>
              {!past && slot && (
                <>
                  <span className={`badge ${slot.cls}`}>{slot.label}</span>
                  <div className="slotbar" style={{ margin: "10px 0 4px" }}><i style={{ width: Math.round((ev.slots.taken / ev.slots.total) * 100) + "%" }} /></div>
                  <div className="hint">{ev.slots.taken} из {ev.slots.total} слотов занято</div>
                </>
              )}
              {myReg ? (
                <>
                  <div className="row" style={{ marginTop: 12 }}><span>Ваша дистанция</span><b>{myReg.dist}</b></div>
                  <div className="row"><span>Статус</span><b>{myReg.paid ? "в стартовом листе" : "ожидает оплаты"}</b></div>
                  <button className="btn pine" style={{ width: "100%", marginTop: 14 }} onClick={() => go("account")}>Открыть кабинет</button>
                </>
              ) : past ? (
                <button className="btn pine" style={{ width: "100%", marginTop: 14 }} onClick={() => go("results")}>Смотреть результаты</button>
              ) : (
                <button className="btn pri" style={{ width: "100%", marginTop: 14 }} disabled={slot && slot.cls === "sold"}
                  onClick={() => go("register", ev.id)}>{slot && slot.cls === "sold" ? "Слоты закончились" : "Зарегистрироваться"}</button>
              )}
              {ev.tg && <a className="btn lite" style={{ width: "100%", marginTop: 10, display: "block", textAlign: "center", textDecoration: "none" }}
                href={ev.tg} target="_blank" rel="noreferrer">Чат участников в Telegram</a>}
            </div>
            <div className="panel">
              <h3>Коротко</h3>
              <div className="row"><span>Организатор</span><b>НП «Лига „Хай-Треил“»</b></div>
              <div className="row"><span>Возраст участия</span><b>с 7 лет</b></div>
              <div className="row"><span>Кубок Hi-Trail</span><b>очки каждому финишёру</b></div>
              <div className="row"><span>Связь</span><b>Viber +373 777 27 035</b></div>
            </div>
            <div className="panel">
              <h3>Партнёры этапа</h3>
              <div className="plogos">{partners.slice(0, 4).map((p) => <PartnerLogo key={p.id} p={p} />)}</div>
            </div>
          </div>
        </div>

        <div className="sechead" style={{ marginTop: 26 }}><h2 style={{ fontSize: 18 }}>Другие старты сезона</h2></div>
        <div className="grid">
          {EVENTS_ALL.filter((e) => e.id !== ev.id && !isPast(e.date)).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3).map((e) => (
            <BibCard key={e.id} ev={e} registered={myRegs.some((r) => r.eventId === e.id)}
              hasResults={results.some((r) => r.eventId === e.id)} onOpen={() => go("event", e.id)} />
          ))}
        </div>
      </div>
    </>
  );
}

/* ================= РЕГИСТРАЦИЯ ================= */
function Register({ ev, go, onDone }) {
  const [name, setName] = useState(DEMO_USER.name + " Демо");
  const [year, setYear] = useState(1984);
  const [dist, setDist] = useState(ev.dists[0].n);
  const [bibName, setBibName] = useState("");
  const [picked, setPicked] = useState({});
  const [teeSize, setTeeSize] = useState("L");
  const [don, setDon] = useState(0);
  const age = 2026 - year;
  const catObj = CATEGORIES.find((c) => age >= c.min && age <= c.max);
  const cat = catObj ? catObj.name : "—";
  const distObj = ev.dists.find((d) => d.n === dist);
  const base = distObj ? distObj.fee : 0;
  const discount = age >= 60 ? 0.5 : 0;
  const fee = Math.round(base * (1 - discount));
  const isWater = ev.sport === "swim" || ev.sport === "multi";
  const list = ADDONS.filter((a) => !a.swimOnly || isWater);
  const addonsSum = list.reduce((sum, a) => sum + (picked[a.id] ? a.fee : 0), 0);
  const total = fee + addonsSum + don;
  const submit = () => {
    const bib = picked.bib ? (bibName || name.trim().split(" ")[0].toUpperCase().slice(0, 8)) : null;
    const chosen = list.filter((a) => picked[a.id]).map((a) => ({
      id: a.id, fee: a.fee,
      n: a.bib ? `${a.n} «${bib}»` : a.n,
      size: a.size ? teeSize : undefined,
    }));
    onDone({ eventId: ev.id, user: name, dist, cat, fee: total, bib, addons: chosen, donation: don });
    go("account");
  };
  return (
    <div className="wrap sec" style={{ maxWidth: 640 }}>
      <div className="sechead"><h2>Регистрация · {ev.title}</h2></div>
      <div className="panel">
        <div className="field"><label>Фамилия и имя</label>
          <input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="field"><label>Год рождения</label>
          <input type="number" value={year} min={1930} max={2019} onChange={(e) => setYear(Number(e.target.value) || 1984)} />
          <p className="hint" style={{ marginTop: 6 }}>Категория определяется автоматически: <b>{cat}</b></p></div>
        <div className="field"><label>Дистанция</label>
          {ev.dists.map((d) => (
            <div key={d.n} className={`radio ${dist === d.n ? "on" : ""}`} onClick={() => setDist(d.n)}>
              <span>{d.n}</span><span className="fee">{d.fee === 0 ? "0" : d.fee} руб</span>
            </div>
          ))}</div>
        <div className="field"><label>Добавить к участию · выдача на старте</label>
          {list.map((a) => (
            <div key={a.id} className={`radio ${picked[a.id] ? "on" : ""}`} onClick={() => setPicked((o) => ({ ...o, [a.id]: !o[a.id] }))}>
              <span>{a.n}{a.size && picked[a.id] && (
                <select className="minifield" value={teeSize} onClick={(e) => e.stopPropagation()} onChange={(e) => setTeeSize(e.target.value)}>
                  {["XS", "S", "M", "L", "XL", "XXL"].map((z) => <option key={z}>{z}</option>)}
                </select>
              )}{a.bib && picked[a.id] && (
                <input placeholder="DENIS" value={bibName} onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setBibName(e.target.value.toUpperCase().slice(0, 8))}
                  className="minifield bibname" />
              )}</span>
              <span className="fee">+{a.fee} руб</span>
            </div>
          ))}
          <p className="hint">Печать под заказ — получите вместе со стартовым номером.</p></div>

        <div className="field"><label>Поддержать сбор «Хай-Трейл Мобиль»</label>
          <div className="presets" style={{ margin: 0 }}>
            {[0, 25, 50, 100].map((v) => (
              <button key={v} type="button" className={`preset ${don === v ? "on" : ""}`} onClick={() => setDon(v)}>{v === 0 ? "Не сейчас" : `+${v} руб`}</button>
            ))}
          </div></div>

        <div className="calc">
          <div style={{ fontSize: 13, color: "#9DB3A2", fontWeight: 700 }}>
            Взнос {fee}{discount ? " (−50%, 60+)" : ""}{addonsSum > 0 ? ` · экипировка ${addonsSum}` : ""}{don > 0 ? ` · сбор ${don}` : ""}
          </div>
          <div className="sum">{total} руб</div>
        </div>
        <button className="btn pri" style={{ width: "100%" }} disabled={!name.trim()} onClick={submit}>
          Отправить заявку
        </button>
      </div>
    </div>
  );
}

/* ================= РЕЗУЛЬТАТЫ ================= */
function Proto({ rows }) {
  const byDist = {};
  rows.forEach((r) => { (byDist[r.dist] = byDist[r.dist] || []).push(r); });
  return (
    <div className="panel" style={{ marginTop: -4 }}>
      {Object.entries(byDist).map(([d, rs]) => (
        <div key={d} style={{ marginBottom: 14 }}>
          <h3>{d}</h3>
          <div className="tblwrap"><table className="tbl">
            <thead><tr><th style={{ width: 70 }}>Место</th><th>Участник</th><th className="r">Время</th></tr></thead>
            <tbody>{rs.slice().sort((a, b) => a.p - b.p).map((r, i) => (
              <tr key={i}>
                <td className="c"><span className={`medal ${r.p <= 3 ? "m" + r.p : "mN"}`}>{r.p}</span></td>
                <td><b>{r.name}</b><div className="hint">{r.city}{r.club && r.club !== "—" ? ` · ${r.club}` : ""}</div></td>
                <td className="r"><b className="fee">{r.time}</b></td>
              </tr>
            ))}</tbody>
          </table></div>
        </div>
      ))}
    </div>
  );
}

function Results({ go, results }) {
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(null);
  const found = useMemo(() => {
    if (q.trim().length < 2) return null;
    const needle = q.trim().toLowerCase();
    const rows = [];
    results.forEach(({ eventId, rows: rs }) => {
      const ev = EVENTS_ALL.find((e) => e.id === eventId);
      rs.forEach((r) => { if (r.name.toLowerCase().includes(needle)) rows.push({ ...r, ev }); });
    });
    return rows;
  }, [q, results]);

  return (
    <div className="wrap sec">
      <div className="sechead"><h2>Результаты</h2><span className="hint">протоколы сезона 2026</span></div>
      <div className="search">
        <input placeholder="Поиск по фамилии — например, «Швец» или «Демо»" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {found && (
        <div className="panel">
          <h3>Найдено: {found.length}</h3>
          {found.length === 0 ? <p className="hint">Никого не нашли — проверьте написание фамилии.</p> : (
            <div className="tblwrap"><table className="tbl">
              <thead><tr><th>Участник</th><th>Старт</th><th>Дистанция</th><th className="c">Место</th><th className="r">Время</th></tr></thead>
              <tbody>{found.map((r, i) => (
                <tr key={i} style={{ cursor: "pointer" }} onClick={() => setOpenId(r.ev.id)}>
                  <td><b>{r.name}</b><div className="hint">{r.city}</div></td>
                  <td>{r.ev.title}<div className="hint">{fmt(r.ev.date)} 2026</div></td>
                  <td>{r.dist}</td>
                  <td className="c"><span className={`medal ${r.p <= 3 ? "m" + r.p : "mN"}`}>{r.p}</span></td>
                  <td className="r"><b className="fee">{r.time}</b></td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </div>
      )}
      {results.map(({ eventId, rows }) => {
        const ev = EVENTS_ALL.find((e) => e.id === eventId);
        const d = new Date(ev.date);
        const open = openId === eventId;
        return (
          <div key={eventId}>
            <div className="trow" onClick={() => setOpenId(open ? null : eventId)}>
              <div className="d">{String(d.getDate()).padStart(2, "0")}<small>{MONTHS[d.getMonth()].slice(0, 3)}</small></div>
              <div><b>{ev.title} 2026</b><div className="hint">{ev.place}</div></div>
              <div className="res-r"><span className="badge res">{open ? "Скрыть" : "Протокол"}</span></div>
            </div>
            {open && <Proto rows={rows} />}
          </div>
        );
      })}
      <p className="note">Демо-протоколы прототипа. В продакшене — полный архив 2019–2026.</p>
    </div>
  );
}

/* ================= КУБОК ================= */
function Cup({ go, initialTab }) {
  const [tab, setTab] = useState(initialTab && initialTab !== "cup" ? initialTab : "all");
  const [showFormula, setShowFormula] = useState(false);
  const standings = useMemo(() => computeCup(), []);
  const filtered = tab === "all" ? standings
    : tab === "clubs" ? null
    : standings.map((a) => {
        const rs = a.results.filter((r) => r.leagues.includes(tab));
        return { ...a, total: rs.reduce((s, r) => s + r.pts, 0), starts: rs.length };
      }).filter((a) => a.starts > 0).sort((x, y) => y.total - x.total);

  const clubs = useMemo(() => {
    const map = {};
    standings.forEach((a) => {
      if (!a.club || a.club === "—") return;
      const c = (map[a.club] = map[a.club] || { name: a.club, total: 0, athletes: 0, finishes: 0 });
      c.total += a.total; c.athletes += 1; c.finishes += a.starts;
    });
    return Object.values(map).sort((x, y) => y.total - x.total);
  }, [standings]);

  return (
    <>
      <div className="ehero">
        <div className="wrap">
          <div className="eyebrow">Сезон 2026 · очки за каждый финиш</div>
          <h1>Кубок Hi-Trail</h1>
          <div className="esub">Участвует каждый финишёр. Побеждает самый стабильный</div>
          <div className="facts">
            <div className="fact"><div className="fv">{standings.length}</div><div className="fl">атлетов в зачёте</div></div>
            <div className="fact"><div className="fv">{RESULTS_DB.length}</div><div className="fl">этапов проведено</div></div>
            <div className="fact"><div className="fv">5</div><div className="fl">лучших стартов в зачёте</div></div>
          </div>
        </div>
      </div>
      <div className="tape" />
      <div className="wrap sec">
        <div className="panel">
          <button className="foldh" onClick={() => setShowFormula(!showFormula)}>
            <span><h3 style={{ margin: 0 }}>Как считаются очки</h3>
              {!showFormula && <span className="fsum">1000 очков лидеру дистанции, остальным — пропорционально времени + бонусы за длину</span>}</span>
            <span className={`chev ${showFormula ? "up" : ""}`}>▾</span>
          </button>
          {showFormula && (
            <div className="foldb">
              <div className="formula">R = 1000 × T лидера / T участника + бонус дистанции</div>
              <div className="row"><span>Лидер дистанции</span><b>1000 очков</b></div>
              <div className="row"><span>Финишёр в 2 раза медленнее лидера</span><b>500 очков</b></div>
              <div className="row"><span>Бонус за 21 км+ / 3000 м / Олимпийскую</span><b>+50</b></div>
              <div className="row"><span>Бонус за 10–20 км / свимран</span><b>+25</b></div>
              <div className="row"><span>В итоговый зачёт</span><b>5 лучших результатов сезона</b></div>
              <p className="note">Очки получает каждый финишёр — не только призёры. Итоговое награждение (1–5 места) — на первом старте следующего сезона.</p>
            </div>
          )}
        </div>

        <div className="atabs">
          {[["all", "Общий зачёт"], ["night", "Ночная лига"], ["water", "Водная лига"], ["bike", "Вело лига"], ["clubs", "Клубный зачёт"]].map(([k, l]) => (
            <button key={k} className={`atab ${tab === k ? "on" : ""}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>

        {tab === "clubs" ? (
          clubs.map((c, i) => (
            <div className="cuprow" key={c.name}>
              <span className={`medal ${i < 3 ? "m" + (i + 1) : "mN"}`}>{i + 1}</span>
              <div><div className="nm">{c.name}</div><div className="sub">{c.athletes} атл. · {c.finishes} финишей</div></div>
              <span />
              <div><div className="pts">{c.total}</div><div className="st">очков</div></div>
            </div>
          ))
        ) : filtered && filtered.length === 0 ? (
          <div className="empty">В этой лиге пока не было этапов — очки появятся после первого старта.</div>
        ) : (
          filtered.map((a, i) => (
            <div className={`cuprow ${a.name.includes("Демо") ? "me" : ""}`} key={a.name}>
              <span className={`medal ${i < 3 ? "m" + (i + 1) : "mN"}`}>{i + 1}</span>
              <div>
                <div className="nm">{a.name}{a.name.includes("Демо") && <span className="badge reg" style={{ marginLeft: 8 }}>это вы</span>}</div>
                <div className="sub">{a.city} · {a.club} · {a.results.map((r) => `${r.ev.title.split(" ")[0]} ${r.pts}`).join(" · ")}</div>
              </div>
              <span className="hint">{a.starts} ст.</span>
              <div><div className="pts">{a.total}</div><div className="st">очков</div></div>
            </div>
          ))
        )}
        <p className="note">Демо-таблица: очки посчитаны формулой по опубликованным протоколам прототипа. Галерея славы прошлых сезонов появится после миграции архива 2019–2025.</p>
      </div>
    </>
  );
}

/* ================= КАБИНЕТ ================= */
function Account({ go, myRegs, results, orders, donated }) {
  const standings = useMemo(() => computeCup(), []);
  const meIdx = standings.findIndex((a) => a.name.includes("Демо"));
  const me = standings[meIdx];
  const myResults = [];
  results.forEach(({ eventId, rows }) => {
    const ev = EVENTS_ALL.find((e) => e.id === eventId);
    rows.forEach((r) => { if (r.name.includes("Демо")) myResults.push({ ...r, ev }); });
  });
  const upcoming = myRegs.map((r) => ({ ...r, ev: EVENTS_ALL.find((e) => e.id === r.eventId) })).filter((r) => r.ev)
    .sort((a, b) => a.ev.date.localeCompare(b.ev.date));
  const pickup = [];
  myRegs.forEach((r) => (r.addons || []).forEach((a) => {
    const ev = EVENTS_ALL.find((e) => e.id === r.eventId);
    pickup.push({ n: a.n + (a.size ? ` (${a.size})` : ""), fee: a.fee, at: ev ? ev.title : "старт" });
  }));
  orders.forEach((o) => pickup.push({ n: o.n, fee: o.fee, at: o.pick }));
  return (
    <div className="wrap sec">
      <div className="sechead">
        <h2>Личный кабинет · {DEMO_USER.name}</h2>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {donated && <span className="badge fund">Меценат лиги</span>}
          <span className="hint">{DEMO_USER.city} · сезон 2026</span>
        </span>
      </div>
      <div className="acgrid">
        <div className="stat"><div className="v">{myResults.length}</div><div className="l">финишей</div></div>
        <div className="stat"><div className="v">{upcoming.length}</div><div className="l">предстоящих</div></div>
        <div className="stat"><div className="v" style={{ color: "var(--tape)" }}>{me ? me.total : 0}</div><div className="l">очков Кубка</div></div>
        <div className="stat"><div className="v">{meIdx >= 0 ? "#" + (meIdx + 1) : "—"}</div><div className="l">место в общем зачёте</div></div>
      </div>
      {pickup.length > 0 && (
        <div className="panel">
          <h3>К выдаче на старте</h3>
          {pickup.map((x, i) => (
            <div className="row" key={i}><span>{x.n} <span className="hint">· {x.at}</span></span><b className="fee">{x.fee} руб</b></div>
          ))}
          <p className="note">Получение — в палатке регистрации вместе со стартовым номером.</p>
        </div>
      )}
      <div className="sechead"><h2 style={{ fontSize: 18 }}>Предстоящие старты</h2></div>
      {upcoming.length === 0 ? (
        <div className="empty">Пока ни одной регистрации. <button className="link" onClick={() => go("calendar")}>Выбрать старт →</button></div>
      ) : upcoming.map((r) => {
        const d = new Date(r.ev.date);
        return (
          <div className="trow" key={r.eventId} onClick={() => go("event", r.eventId)}>
            <div className="d">{String(d.getDate()).padStart(2, "0")}<small>{MONTHS[d.getMonth()].slice(0, 3)}</small></div>
            <div><b>{r.ev.title}</b><div className="hint">{r.dist} · {r.cat}{r.bib ? ` · номер ${r.bib}` : ""}</div></div>
            <div className="res-r"><span className={`badge ${r.paid ? "reg" : "wait"}`}>{r.paid ? `через ${daysTo(r.ev.date)} дн.` : "ожидает оплаты"}</span></div>
          </div>
        );
      })}
      <div className="sechead" style={{ marginTop: 28 }}><h2 style={{ fontSize: 18 }}>История участий</h2></div>
      {myResults.map((h, i) => {
        const d = new Date(h.ev.date);
        return (
          <div className="trow" key={i} onClick={() => go("event", h.ev.id)}>
            <div className="d">{String(d.getDate()).padStart(2, "0")}<small>{MONTHS[d.getMonth()].slice(0, 3)}</small></div>
            <div><b>{h.ev.title} 2026</b><div className="hint">{h.dist} · {h.p} место в абсолюте</div></div>
            <div className="res-r"><div className="t">{h.time}</div><div className="p">протокол</div></div>
          </div>
        );
      })}
      <button className="btn lite" style={{ marginTop: 10 }} onClick={() => go("cup")}>Моя позиция в Кубке →</button>
    </div>
  );
}

/* ================= СТРАНИЦА СБОРА ================= */
function FundPage({ f, onDonate }) {
  const [amt, setAmt] = useState(50);
  const [custom, setCustom] = useState("");
  const pct = Math.min(100, Math.round((f.raised / f.goal) * 100));
  const val = custom !== "" ? (Number(custom) || 0) : amt;
  return (
    <>
      <div className="ehero">
        <div className="bg"><FundArt kind={f.id} full /></div>
        <div className="wrap">
          <div className="eyebrow">Благотворительная акция · НП «Лига „Хай-Треил“»</div>
          <h1>{f.title}</h1>
          <div className="esub">{f.pitch}</div>
          <div className="facts">
            <div className="fact"><div className="fv" style={{ color: "#FF7A3D" }}>{f.raised.toLocaleString("ru")} {f.cur}</div><div className="fl">собрано</div></div>
            <div className="fact"><div className="fv">{f.goal.toLocaleString("ru")} {f.cur}</div><div className="fl">цель{f.demoGoal ? " (демо)" : ""}</div></div>
            <div className="fact"><div className="fv">{f.backers}</div><div className="fl">в экипаже сбора</div></div>
            {f.deadline && <div className="fact"><div className="fv">{fmt(f.deadline)}</div><div className="fl">дедлайн</div></div>}
          </div>
        </div>
      </div>
      <div className="tape" />
      <div className="wrap sec">
        <div className="cols">
          <div>
            <div className="panel"><h3>Зачем это лиге</h3>
              {f.why.map((w) => <div className="row" key={w}><span>{w}</span><b>✓</b></div>)}
            </div>
            {f.items && (
              <div className="panel"><h3>Смета · что покупаем</h3>
                <div className="tblwrap"><table className="tbl">
                  <thead><tr><th>Позиция</th><th className="r">Кол-во</th><th className="r">Сумма</th></tr></thead>
                  <tbody>
                    {f.items.map((it) => (
                      <tr key={it.n}><td><b>{it.n}</b></td><td className="r">{it.q}</td><td className="r"><b className="fee">{it.s.toLocaleString("ru")}</b></td></tr>
                    ))}
                    <tr><td><b>Итого</b></td><td /><td className="r"><b className="fee">{f.goal.toLocaleString("ru")} {f.cur}</b></td></tr>
                  </tbody>
                </table></div>
              </div>
            )}
            <div className="panel"><h3>Гарантия прозрачности</h3>
              <p>Все средства идут исключительно на цель сбора. После закрытия здесь публикуется открытый финансовый отчёт: чеки, фото оборудования, кто и как им пользуется на стартах.</p>
            </div>
            <div className="panel"><h3>Экипаж сбора</h3>
              <div className="crew">{f.crew.map((c, i) => <span className="crewp" key={i}>{c}</span>)}</div>
              <p className="note">Участники сбора получают бейдж «Меценат лиги» в личном кабинете. Скинуться можно анонимно.</p>
            </div>
          </div>
          <div className="sticky">
            <div className="panel">
              <h3>Скинуться</h3>
              <div className="fbar" style={{ height: 10 }}><i style={{ width: pct + "%" }} /></div>
              <div className="fmeta" style={{ margin: "8px 0 4px" }}><b>{f.raised.toLocaleString("ru")} {f.cur}</b><span>из {f.goal.toLocaleString("ru")} · {pct}%</span></div>
              <div className="presets">
                {[25, 50, 100, 200].map((v) => (
                  <button key={v} className={`preset ${custom === "" && amt === v ? "on" : ""}`} onClick={() => { setAmt(v); setCustom(""); }}>{v} {f.cur}</button>
                ))}
              </div>
              <div className="field"><label>Или своя сумма</label>
                <input type="number" placeholder="Сумма" value={custom} onChange={(e) => setCustom(e.target.value)} /></div>
              <button className="btn pri" style={{ width: "100%" }} disabled={val <= 0} onClick={() => onDonate(f.id, val)}>Поддержать · {val} {f.cur}</button>
              <p className="note">В прототипе платёж имитируется. Контакт организатора: Игорь, +373 777 27035 (Viber/Telegram/WhatsApp).</p>
            </div>
            <div className="panel"><h3>Поделиться</h3>
              <p className="hint">Киньте ссылку в чат клуба или рабочей команды — сборы закрываются сообществом, а не одним меценатом.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= МАГАЗИН ================= */
function Shop({ onOrder }) {
  return (
    <div className="wrap sec">
      <div className="sechead"><h2>Магазин лиги</h2><span className="hint">под заказ · без склада · выдача на ближайшем старте</span></div>
      <div className="shopgrid">
        {SHOP_ITEMS.map((it) => (
          <div className="shopcard" key={it.id}>
            <div className="tile">{it.n.slice(0, 1)}</div>
            <h3>{it.n}</h3>
            <div className="d">{it.d}</div>
            <div className="fmeta"><b>{it.fee} руб</b><span className="hint">{it.cert ? "электронный сертификат" : "выдача на старте"}</span></div>
            <button className="btn pri sm" onClick={() => onOrder(it)}>{it.cert ? "Подарить" : "Заказать"}</button>
          </div>
        ))}
      </div>
      <p className="note">Печать под заказ по собранным заявкам к ближайшему старту — деньги не замораживаются в складе. Оплата тем же способом, что стартовый взнос; заказ появится в личном кабинете в блоке «К выдаче на старте».</p>
    </div>
  );
}

/* ================= ПАРТНЁРАМ ================= */
const PACKAGES = [
  { name: "Генеральный партнёр сезона", price: "по запросу", feats: ["Логотип на всех 25 стартах и номерах участников", "Арка и баннеры стартового городка", "Упоминание во всех анонсах и протоколах", "Именная номинация Кубка Hi-Trail"] },
  { name: "Партнёр этапа", price: "от 3 000 руб", feats: ["Логотип на странице и афише этапа", "Флаг в стартовом городке", "Вручение призов на награждении", "Публикации в Telegram и Facebook лиги"] },
  { name: "Флаг партнёра", price: "от 800 руб", feats: ["Флаг компании вдоль трассы", "Логотип в разделе «Партнёры»", "Фотоотчёт с флагом бренда"] },
];
function PartnersPage({ partners, notify }) {
  return (
    <>
      <div className="ehero"><div className="wrap">
        <div className="eyebrow">Партнёрство · сезон 2026</div>
        <h1>Ваш бренд на 25 стартах сезона</h1>
        <div className="meta">Тысячи участников и зрителей, фотоотчёты, Telegram и Facebook лиги.</div>
      </div></div>
      <div className="tape" />
      <div className="sec dark"><div className="wrap">
        <div className="sechead"><h2 style={{ color: "#fff" }}>Партнёрские пакеты</h2></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
          {PACKAGES.map((p) => (
            <div key={p.name} style={{ background: "var(--deep2)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: 22, display: "flex", flexDirection: "column" }}>
              <h3 style={{ color: "#fff", fontSize: 16 }}>{p.name}</h3>
              <div style={{ fontFamily: "var(--fd)", fontWeight: 900, fontSize: 20, color: "var(--tape)", margin: "8px 0 14px" }}>{p.price}</div>
              <div style={{ flex: 1 }}>{p.feats.map((f) => <div key={f} style={{ padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,.08)", color: "#C6D4C8", fontSize: 13.5 }}>— {f}</div>)}</div>
              <button className="btn pri" style={{ marginTop: 16 }} onClick={() => notify(`Заявка на пакет «${p.name}» отправлена`)}>Выбрать пакет</button>
            </div>
          ))}
        </div>
      </div></div>
      <div className="wrap sec">
        <div className="sechead"><h2>С нами уже работают</h2></div>
        {TIERS.map((t) => {
          const list = partners.filter((p) => p.tier === t);
          if (!list.length) return null;
          return (<div key={t}><div className="ptier">{t}</div><div className="plogos">{list.map((p) => <PartnerLogo key={p.id} p={p} />)}</div></div>);
        })}
      </div>
    </>
  );
}

/* ================= АДМИНКА ================= */
function Admin({ events, regs, setRegs, partners, setPartners, funds, setFunds, notify, go }) {
  const [tab, setTab] = useState("events");
  const pendingCount = regs.filter((r) => !r.paid).length;
  const [np, setNp] = useState({ name: "", tier: "Партнёр", logo: null });
  return (
    <div className="wrap sec">
      <div className="sechead"><h2>Админка организатора</h2><span className="hint">демо-режим</span></div>
      <div className="atabs">
        <button className={`atab ${tab === "events" ? "on" : ""}`} onClick={() => setTab("events")}>События</button>
        <button className={`atab ${tab === "regs" ? "on" : ""}`} onClick={() => setTab("regs")}>Заявки{pendingCount > 0 && <span className="cnt">{pendingCount}</span>}</button>
        <button className={`atab ${tab === "partners" ? "on" : ""}`} onClick={() => setTab("partners")}>Партнёры</button>
        <button className={`atab ${tab === "funds" ? "on" : ""}`} onClick={() => setTab("funds")}>Сборы</button>
      </div>
      {tab === "events" && events.slice().sort((a, b) => a.date.localeCompare(b.date)).map((e) => (
        <div className="arow" key={e.id}>
          <div><b>{e.title}</b> {e.schedule && <span className="badge open" style={{ marginLeft: 6 }}>полные данные</span>}
            <div className="sub">{fmt(e.date)} · {e.place} · слоты {e.slots.taken}/{e.slots.total}</div></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn lite sm" onClick={() => go("event", e.id)}>Смотреть</button>
            <button className="btn pri sm" onClick={() => go("editor", e.id)}>Редактировать</button>
          </div>
        </div>
      ))}
      {tab === "regs" && regs.slice().sort((a, b) => Number(a.paid) - Number(b.paid)).map((r) => {
        const ev = events.find((e) => e.id === r.eventId);
        return (
          <div className="arow" key={r.id}>
            <div><b>{r.user}</b> <span className={`badge ${r.paid ? "reg" : "wait"}`} style={{ marginLeft: 8 }}>{r.paid ? "в стартовом листе" : "ожидает оплаты"}</span>
              <div className="sub">{ev ? ev.title : "—"} · {r.dist} · {r.cat} · взнос {r.fee} руб</div></div>
            <div style={{ display: "flex", gap: 8 }}>
              {!r.paid && <button className="btn pri sm" onClick={() => { setRegs((rs) => rs.map((x) => x.id === r.id ? { ...x, paid: true } : x)); notify(`Оплата подтверждена: ${r.user}`); }}>Подтвердить оплату</button>}
              <button className="xdel" style={{ padding: "8px 12px" }} onClick={() => setRegs((rs) => rs.filter((x) => x.id !== r.id))}>✕</button>
            </div>
          </div>
        );
      })}
      {tab === "partners" && (
        <div className="cols">
          <div>{partners.map((p) => (
            <div className="arow" key={p.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {p.logo ? <img src={p.logo} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8, border: "1px solid var(--line)" }} />
                  : <span style={{ background: PCOLORS[p.tier], width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--fd)", fontWeight: 900 }}>{p.name.replace(/[«»]/g, "").slice(0, 1)}</span>}
                <div><b>{p.name}</b><div className="sub">{p.tier}</div></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <label className="btn lite sm" style={{ cursor: "pointer" }}>Логотип
                  <input type="file" accept="image/*" hidden onChange={(e) => readFile(e, (url) => { setPartners((ps) => ps.map((x) => x.id === p.id ? { ...x, logo: url } : x)); notify("Логотип обновлён"); })} /></label>
                <button className="xdel" style={{ padding: "8px 12px" }} onClick={() => setPartners((ps) => ps.filter((x) => x.id !== p.id))}>✕</button>
              </div>
            </div>
          ))}</div>
          <div className="panel sticky">
            <h3>Добавить партнёра</h3>
            <div className="field"><label>Название</label><input value={np.name} onChange={(e) => setNp({ ...np, name: e.target.value })} /></div>
            <div className="field"><label>Уровень</label>
              <select value={np.tier} onChange={(e) => setNp({ ...np, tier: e.target.value })}>{TIERS.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div className="field"><label>Логотип</label>
              <label className="upl" style={{ display: "block" }}>{np.logo ? <img src={np.logo} alt="" style={{ maxHeight: 60 }} /> : "Загрузить PNG/JPG"}
                <input type="file" accept="image/*" hidden onChange={(e) => readFile(e, (url) => setNp({ ...np, logo: url }))} /></label></div>
            <button className="btn pri" style={{ width: "100%" }} disabled={!np.name.trim()}
              onClick={() => { setPartners((ps) => [...ps, { id: Date.now(), ...np }]); setNp({ name: "", tier: "Партнёр", logo: null }); notify("Партнёр добавлен"); }}>Добавить</button>
          </div>
        </div>
      )}
      {tab === "funds" && funds.map((f) => (
        <div className="arow" key={f.id}>
          <div><b>{f.title}</b><div className="sub">цель {f.goal.toLocaleString("ru")} {f.cur} · в экипаже {f.backers} чел.</div></div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="hint">собрано:</span>
            <input type="number" value={f.raised}
              className="minifield numfield"
              onChange={(e) => setFunds((fs) => fs.map((x) => x.id === f.id ? { ...x, raised: Number(e.target.value) || 0 } : x))} />
            <span className="hint">{f.cur}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= РЕДАКТОР СОБЫТИЯ ================= */
function Editor({ ev, save, go, notify }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(ev)));
  const [tab, setTab] = useState("main");
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const setDist = (i, patch) => set({ dists: draft.dists.map((d, j) => j === i ? { ...d, ...patch } : d) });
  const setSch = (i, patch) => set({ schedule: (draft.schedule || []).map((s, j) => j === i ? { ...s, ...patch } : s) });
  return (
    <div className="wrap sec">
      <div className="sechead">
        <h2>Редактор · {draft.title}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn lite sm" onClick={() => go("admin")}>← Без сохранения</button>
          <button className="btn pri sm" onClick={() => { save(draft); notify("Сохранено"); go("event", draft.id); }}>Сохранить и посмотреть</button>
        </div>
      </div>
      <div className="atabs">
        {[["main", "Основное"], ["media", "Обложка и фото"], ["dists", "Дистанции"], ["plan", "Программа"]].map(([k, l]) => (
          <button key={k} className={`atab ${tab === k ? "on" : ""}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      {tab === "main" && (
        <div className="panel" style={{ maxWidth: 720 }}>
          <div className="field"><label>Название</label><input value={draft.title} onChange={(e) => set({ title: e.target.value })} /></div>
          <div className="field"><label>Слоган</label><input value={draft.slogan || ""} onChange={(e) => set({ slogan: e.target.value })} /></div>
          <div className="frow">
            <div className="field"><label>Дата</label><input type="date" value={draft.date} onChange={(e) => set({ date: e.target.value })} /></div>
            <div className="field"><label>Время старта</label><input value={draft.startTime || ""} onChange={(e) => set({ startTime: e.target.value })} /></div>
          </div>
          <div className="frow">
            <div className="field"><label>Слотов всего</label><input type="number" value={draft.slots.total} onChange={(e) => set({ slots: { ...draft.slots, total: Number(e.target.value) || 0 } })} /></div>
            <div className="field"><label>Слотов занято</label><input type="number" value={draft.slots.taken} onChange={(e) => set({ slots: { ...draft.slots, taken: Number(e.target.value) || 0 } })} /></div>
          </div>
          <div className="field"><label>Локация</label><input value={draft.place} onChange={(e) => set({ place: e.target.value })} /></div>
          <div className="field"><label>Описание</label><textarea rows={4} value={draft.blurb} onChange={(e) => set({ blurb: e.target.value })} /></div>
        </div>
      )}
      {tab === "media" && (
        <div className="panel" style={{ maxWidth: 720 }}>
          <div className="field"><label>Обложка (фон шапки)</label>
            <label className="upl" style={{ display: "block" }}>{draft.cover ? <img src={draft.cover} alt="" style={{ maxHeight: 140, borderRadius: 10 }} /> : "Загрузить обложку (JPG/PNG)"}
              <input type="file" accept="image/*" hidden onChange={(e) => readFile(e, (url) => set({ cover: url }))} /></label>
            {draft.cover && <button className="btn lite sm" style={{ marginTop: 8 }} onClick={() => set({ cover: null })}>Убрать</button>}
          </div>
          <div className="field"><label>Галерея</label>
            <label className="upl" style={{ display: "block" }}>Добавить фото
              <input type="file" accept="image/*" hidden onChange={(e) => readFile(e, (url) => set({ gallery: [...(draft.gallery || []), url] }))} /></label>
            {(draft.gallery || []).length > 0 && (
              <div className="thumbs">{draft.gallery.map((g, i) => (
                <div className="thumb" key={i}><img src={g} alt="" />
                  <button className="del" onClick={() => set({ gallery: draft.gallery.filter((_, j) => j !== i) })}>✕</button></div>
              ))}</div>
            )}
          </div>
        </div>
      )}
      {tab === "dists" && (
        <div className="panel" style={{ maxWidth: 860 }}>
          {draft.dists.map((d, i) => (
            <div className="erow" key={i}>
              <input value={d.n} onChange={(e) => setDist(i, { n: e.target.value })} />
              <input type="number" value={d.fee} onChange={(e) => setDist(i, { fee: Number(e.target.value) || 0 })} />
              <input value={d.map || ""} placeholder="Ссылка на карту" onChange={(e) => setDist(i, { map: e.target.value })} />
              <button className="xdel" onClick={() => set({ dists: draft.dists.filter((_, j) => j !== i) })}>✕</button>
            </div>
          ))}
          <button className="btn lite sm" onClick={() => set({ dists: [...draft.dists, { n: "Новая", fee: 0 }] })}>+ Дистанция</button>
        </div>
      )}
      {tab === "plan" && (
        <div className="panel" style={{ maxWidth: 720 }}>
          {(draft.schedule || []).map((s, i) => (
            <div className="erow2" key={i}>
              <input value={s.t} onChange={(e) => setSch(i, { t: e.target.value })} />
              <input value={s.l} onChange={(e) => setSch(i, { l: e.target.value })} />
              <button className="xdel" onClick={() => set({ schedule: draft.schedule.filter((_, j) => j !== i) })}>✕</button>
            </div>
          ))}
          <button className="btn lite sm" onClick={() => set({ schedule: [...(draft.schedule || []), { t: "", l: "" }] })}>+ Пункт</button>
        </div>
      )}
    </div>
  );
}

/* ================= ТЕМЫ ================= */
const THEMES = [
  { key: "tape", name: "Сигнальная лента",
    vars: { "--ink": "#0F2A1D", "--deep": "#0F2A1D", "--deep2": "#16382A", "--field": "#F4F6F0", "--card": "#FFFFFF",
      "--tape": "#FF4D00", "--river": "#1B7F8E", "--line": "#DCE2D4", "--mut": "#5C6B5E", "--lite": "#E7ECE0", "--fd": "'Unbounded'" } },
  { key: "dniester", name: "Днестр",
    vars: { "--ink": "#0A2233", "--deep": "#0A2233", "--deep2": "#123249", "--field": "#F0F5F6", "--card": "#FFFFFF",
      "--tape": "#00A896", "--river": "#FF6A4D", "--line": "#D5E1E4", "--mut": "#54707C", "--lite": "#E1EBED", "--fd": "'Russo One'" } },
  { key: "night", name: "Ночной старт",
    vars: { "--ink": "#EAF2E8", "--deep": "#080C09", "--deep2": "#121A13", "--field": "#0C110D", "--card": "#151C16",
      "--tape": "#C8F231", "--river": "#6FD3C7", "--line": "#26312A", "--mut": "#8FA091", "--lite": "#20291F", "--fd": "'Tektur'" } },
  { key: "steppe", name: "Степной грунт",
    vars: { "--ink": "#241A12", "--deep": "#241A12", "--deep2": "#33261A", "--field": "#F5EFE4", "--card": "#FFFDF8",
      "--tape": "#E8871E", "--river": "#4C7A3F", "--line": "#E0D6C4", "--mut": "#77685A", "--lite": "#ECE3D2", "--fd": "'Oswald'" } },
];
function ThemeBar({ theme, setTheme }) {
  const cur = THEMES.find((t) => t.key === theme);
  const [open, setOpen] = useState(false);
  return (
    <div className={`themes ${open ? "open" : ""}`}>
      <div className="tt">Фирменный стиль</div>
      <div className="trowt">
        {THEMES.map((t) => (
          <button key={t.key} className={`sw ${theme === t.key ? "on" : ""}`} title={t.name}
            onClick={() => { setTheme(t.key); setOpen(false); }}>
            <span className="h1c" style={{ background: t.vars["--deep"] }} />
            <span className="h2c" style={{ background: t.vars["--tape"] }} />
          </button>
        ))}
        <button className="thtog" aria-label="Сменить фирменный стиль" onClick={() => setOpen((o) => !o)}>{open ? "✕" : "▸"}</button>
        <span className="tname">{cur.name}</span>
      </div>
    </div>
  );
}

/* ================= APP ================= */
let EVENTS_ALL = EVENTS_SEED;

export default function App() {
  const [route, setRoute] = useState({ page: "home", id: null });
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState("tape");
  const [role, setRole] = useState("user");
  const [events, setEvents] = useState(EVENTS_SEED);
  const [partners, setPartners] = useState(PARTNERS_SEED);
  const [regs, setRegs] = useState(REGS_SEED);
  const [results] = useState(RESULTS_DB);
  const [funds, setFunds] = useState(FUNDS_SEED);
  const [orders, setOrders] = useState([]);
  const [donated, setDonated] = useState(false);
  const [toast, setToast] = useState(null);
  EVENTS_ALL = events;

  const go = (page, id = null) => { setRoute({ page, id }); setMenu(false); window.scrollTo(0, 0); };
  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  const myRegs = regs.filter((r) => r.mine);
  const donate = (id, amount, silent) => {
    const f = funds.find((x) => x.id === id);
    setFunds((fs) => fs.map((x) => x.id === id ? { ...x, raised: x.raised + amount, backers: x.backers + 1 } : x));
    setDonated(true);
    if (!silent) notify(`Спасибо! +${amount} ${f ? f.cur : "руб"} в «${f ? f.title : "сбор"}»`);
  };
  const onOrder = (item) => {
    const nx = events.filter((e) => !isPast(e.date)).sort((a, b) => a.date.localeCompare(b.date))[0];
    const pick = nx ? nx.title : "ближайший старт";
    setOrders((os) => [...os, { ...item, pick }]);
    notify(item.cert ? "Сертификат оформлен — придёт на email получателя." : `«${item.n}» добавлен. Выдача: ${pick}.`);
  };
  const onRegister = (reg) => {
    setRegs((rs) => [...rs.filter((x) => !(x.mine && x.eventId === reg.eventId)), { ...reg, id: Date.now(), paid: false, mine: true }]);
    setEvents((es) => es.map((e) => e.id === reg.eventId ? { ...e, slots: { ...e.slots, taken: e.slots.taken + 1 } } : e));
    if (reg.donation > 0) donate("mobil", reg.donation, true);
    notify("Заявка отправлена. Ждём подтверждения оплаты.");
  };
  const ev = route.id ? events.find((e) => e.id === route.id) : null;
  const fundSel = route.id ? funds.find((f) => f.id === route.id) : null;
  const themeVars = THEMES.find((t) => t.key === theme).vars;

  return (
    <div className="ht" style={themeVars}>
      <style>{CSS}</style>
      <nav className="nav">
        <div className="wrap">
          <span className="logo" onClick={() => go("home")}><LogoMark s={32} /><span>HI-<em>TRAIL</em></span></span>
          <div className={`navlinks ${menu ? "open" : ""}`}>
            <button className={`nbtn ${route.page === "home" ? "on" : ""}`} onClick={() => go("home")}>Главная</button>
            <button className={`nbtn ${route.page === "calendar" ? "on" : ""}`} onClick={() => go("calendar")}>Календарь</button>
            <button className={`nbtn ${route.page === "results" ? "on" : ""}`} onClick={() => go("results")}>Результаты</button>
            <button className={`nbtn ${route.page === "cup" ? "on" : ""}`} onClick={() => go("cup")}>Кубок</button>
            <button className={`nbtn ${route.page === "shop" ? "on" : ""}`} onClick={() => go("shop")}>Магазин</button>
            <button className={`nbtn ${route.page === "partners" ? "on" : ""}`} onClick={() => go("partners")}>Партнёрам</button>
          </div>
          <span className="nspace" />
          <button className="nbtn adm" onClick={() => { const toAdmin = role !== "admin"; setRole(toAdmin ? "admin" : "user"); go(toAdmin ? "admin" : "home"); }}>
            {role === "admin" ? "← Участник" : "⚙"}
          </button>
          <button className="acct" onClick={() => go("account")}><span className="dot" />{DEMO_USER.name}</button>
          <button className={`burger ${menu ? "on" : ""}`} aria-label="Меню" aria-expanded={menu} onClick={() => setMenu((m) => !m)}><i /></button>
        </div>
      </nav>
      {menu && <button className="navscrim" aria-label="Закрыть меню" onClick={() => setMenu(false)} />}
      {role === "admin" && <div className="admbar"><div className="wrap">Режим организатора: правки сразу видны на публичном сайте (демо).</div></div>}

      {route.page === "home" && <Home go={go} myRegs={myRegs} partners={partners} results={results} funds={funds} />}
      {route.page === "calendar" && <Calendar go={go} myRegs={myRegs} results={results} funds={funds} />}
      {route.page === "event" && ev && <EventPage ev={ev} go={go} myRegs={myRegs} partners={partners} results={results} />}
      {route.page === "register" && ev && <Register ev={ev} go={go} onDone={onRegister} />}
      {route.page === "results" && <Results go={go} results={results} />}
      {route.page === "cup" && <Cup go={go} initialTab={route.id} />}
      {route.page === "account" && <Account go={go} myRegs={myRegs} results={results} orders={orders} donated={donated} />}
      {route.page === "fund" && fundSel && <FundPage f={fundSel} onDonate={donate} />}
      {route.page === "shop" && <Shop onOrder={onOrder} />}
      {route.page === "partners" && <PartnersPage partners={partners} notify={notify} />}
      {route.page === "admin" && <Admin events={events} regs={regs} setRegs={setRegs} partners={partners} setPartners={setPartners} funds={funds} setFunds={setFunds} notify={notify} go={go} />}
      {route.page === "editor" && ev && <Editor ev={ev} go={go} notify={notify}
        save={(draft) => setEvents((es) => es.map((x) => x.id === draft.id ? draft : x))} />}

      {toast && <div className="toast"><span className="dot" />{toast}</div>}
      <ThemeBar theme={theme} setTheme={setTheme} />
      <footer className="foot">
        <div className="wrap" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <LogoMark s={40} />
          <div><b>Hi-Trail</b> · НП «Лига спорта и туризма „Хай-Треил“» · © 2026
            <div style={{ marginTop: 6 }}>Прототип v5: реальные данные сезона · Результаты · Кубок · сборы «Безопасная трасса» и «Хай-Трейл Мобиль» · магазин.</div></div>
        </div>
      </footer>
    </div>
  );
}
