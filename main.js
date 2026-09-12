// 农历数据 (1900-2100)
const LUNAR_YEARS = [9804,9628,42080,8328,9620,32848,9384,9304,82068,9548,50248,9396,8264,42436,9316,9512,25928,9380,57472,8764,9444,41440,8264,9368,32928,8528,9380,8364,8484,58372,9288,8528,41024,9384,9552,25936,9388,65584,8820,9384,41380,9556,9384,32928,8532,8376,8504,8660,50184,8360,9556,41024,8360,9288,24728,8464,73812,9364,8488,50308,9300,8488,34080,9372,8432,9576,9620,49288,8904,8340,41088,8524,9352,24640,8648,66596,82088,9520,49476,8340,8516,34128,9256,8656,9556,8360,58516,8528,8356,41124,8508,9448,24616,8532,66600,90280,8528,50500,8348,8560,33824,9640,8276,8276,9512,57488,9556,8376,42276,8676,9640,24872,9300,58504,8232,9300,49288,8480,9700,33040,8488,9364,8340,8484,58512,9284,8432,42116,9620,8520,25928,9364,65580,8748,9336,49216,8656,9636,32928,9548,9364,24736,8520,58388,8264,8656,42048,8360,9548,32848,9380,73820,8772,8424,50628,8532,9384,34080,9296,9388,8364,8564,65544,9896,8276,42048,9512,9296,32848,8356,73844,9252,8648,49412,8276,8488,42276,9296,8380,8424,8676,57480,8776,9364,41088,8488,9372,24720,8432,9512,90276,8264,49476,9364,8488,42308,9352,8564,9300,9640,0];
const LUNAR_M1 = [2415434,2415789,2416143,2416527,2416881,2417236,2417620,2417974,2418357,2418712,2419066,2419450,2419805,2420159,2420543,2420898,2421252,2421635,2421990,2422374,2422728,2423083,2423467,2423821,2424176,2424559,2424913,2425268,2425652,2426006,2426390,2426744,2427099,2427483,2427837,2428191,2428575,2428930,2429314,2429668,2430022,2430406,2430761,2431115,2431498,2431853,2432208,2432592,2432946,2433330,2433684,2434039,2434422,2434776,2435131,2435515,2435869,2436253,2436608,2436962,2437346,2437700,2438054,2438438,2438793,2439147,2439531,2439886,2440270,2440624,2440977,2441362,2441716,2442071,2442455,2442809,2443193,2443548,2443901,2444285,2444640,2444994,2445378,2445733,2446087,2446471,2446825,2447209,2447563,2447918,2448302,2448656,2449011,2449395,2449749,2450133,2450486,2450841,2451225,2451579,2451934,2452318,2452673,2453027,2453411,2453764,2454148,2454503,2454857,2455241,2455596,2455950,2456334,2456689,2457072,2457426,2457781,2458165,2458519,2458874,2459258,2459613,2459967,2460349,2460704,2461088,2461443,2461797,2462181,2462536,2462891,2463274,2463627,2464011,2464366,2464721,2465105,2465459,2465814,2466198,2466552,2466906,2467289,2467644,2468028,2468383,2468737,2469121,2469476,2469829,2470213,2470568,2470951,2471306,2471661,2472045,2472399,2472753,2473137,2473491,2473845,2474229,2474584,2474968,2475323,2475677,2476061,2476414,2476769,2477153,2477507,2477891,2478246,2478601,2478984,2479339,2479692,2480076,2480431,2480785,2481169,2481524,2481908,2482263,2482616,2482999,2483354,2483709,2484093,2484447,2484831,2485186,2485541,2485924,2486277,2486632,2487016,2487371,2487725,2488109,2451545];

// 儒略日转换函数
function g2jd(y, m, d) {
  if (m <= 2) { y--; m += 12; }
  const A = Math.trunc(y / 100);
  const B = 2 - A + Math.trunc(A / 4);
  return Math.trunc(365.25 * (y + 4716)) + Math.trunc(30.6001 * (m + 1)) + d + B - 1524.5;
}

function jd2g(jd) {
  const J = jd + 0.5, Z = Math.trunc(J), F = J - Z;
  let A = Z;
  if (Z >= 2299161) { const a = Math.trunc((Z - 1867216.25) / 36524.25); A = Z + 1 + a - Math.trunc(a / 4); }
  const B = A + 1524, C = Math.trunc((B - 122.1) / 365.25), D = Math.trunc(365.25 * C), E = Math.trunc((B - D) / 30.6001);
  const day = B - D - Math.trunc(30.6001 * E) + F;
  const month = E < 14 ? E - 1 : E - 13;
  return { y: month > 2 ? C - 4716 : C - 4715, m: month, d: Math.trunc(day) };
}

// 农历转换函数
function solarToLunar(date) {
  const jd = g2jd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const offset = jd - LUNAR_M1[0];
  
  let yearIdx = 0;
  for (let i = 0; i < LUNAR_YEARS.length; i++) {
    if (jd >= LUNAR_M1[i] && (i === LUNAR_YEARS.length - 1 || jd < LUNAR_M1[i + 1])) {
      yearIdx = i;
      break;
    }
  }
  
  const year = 1900 + yearIdx;
  const lunarYear = LUNAR_YEARS[yearIdx];
  const isLeapMonth = (lunarYear >> 13) & 1;
  const leapMonth = (lunarYear >> 13) & 0xf;
  const isLeapBig = (lunarYear >> 17) & 1;
  
  let month = 1, day = 1;
  let currentDay = offset;
  
  for (let m = 1; m <= 12; m++) {
    const isBig = (lunarYear >> (m - 1)) & 1;
    const monthDays = isBig ? 30 : 29;
    
    if (currentDay < monthDays) {
      month = m;
      day = currentDay + 1;
      break;
    }
    currentDay -= monthDays;
  }
  
  return {
    year,
    month,
    day,
    isLeap: month === leapMonth,
    isLeapBig
  };
}

// 获取农历月份名称
function getLunarMonthName(month, isLeap) {
  const months = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
  return isLeap ? `闰${months[month - 1]}` : months[month - 1];
}

// 获取农历日期名称
function getLunarDayName(day) {
  const days = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                 '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                 '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
  return days[day - 1];
}

// 格式化日期
function formatDate(date, format) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
}

// 获取月份名称
function getMonthName(month) {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return months[month - 1];
}

// 获取星期名称
function getWeekDayName(day) {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return `周${days[day]}`;
}

// 解析日期字符串
function parseDateString(dateStr) {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

// 获取月份的第一天和最后一天
function getMonthRange(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  return { firstDay, lastDay };
}

// 生成日历数据
function generateCalendarData(year, month) {
  const { firstDay, lastDay } = getMonthRange(year, month);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  const calendar = [];
  
  // 添加上个月的日期
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevMonthLastDay = new Date(prevYear, prevMonth, 0).getDate();
  
  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(prevYear, prevMonth - 1, day);
    const lunar = solarToLunar(date);
    calendar.push({
      date,
      day,
      isCurrentMonth: false,
      lunar: {
        month: lunar.month,
        day: lunar.day,
        monthName: getLunarMonthName(lunar.month, lunar.isLeap),
        dayName: getLunarDayName(lunar.day)
      }
    });
  }
  
  // 添加当前月的日期
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const lunar = solarToLunar(date);
    calendar.push({
      date,
      day,
      isCurrentMonth: true,
      lunar: {
        month: lunar.month,
        day: lunar.day,
        monthName: getLunarMonthName(lunar.month, lunar.isLeap),
        dayName: getLunarDayName(lunar.day)
      }
    });
  }
  
  // 添加下个月的日期
  const endWeekday = lastDay.getDay();
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  
  for (let day = 1; day <= 42 - calendar.length; day++) {
    const date = new Date(nextYear, nextMonth - 1, day);
    const lunar = solarToLunar(date);
    calendar.push({
      date,
      day,
      isCurrentMonth: false,
      lunar: {
        month: lunar.month,
        day: lunar.day,
        monthName: getLunarMonthName(lunar.month, lunar.isLeap),
        dayName: getLunarDayName(lunar.day)
      }
    });
  }
  
  return calendar;
}

// 计算热力图颜色
function getHeatmapColor(count, maxCount) {
  if (count === 0) return '#f0f0f0';
  const ratio = count / maxCount;
  if (ratio <= 0.25) return '#ebedf0';
  if (ratio <= 0.5) return '#c6e48b';
  if (ratio <= 0.75) return '#7bc96f';
  return '#239a3b';
}

const resolveSetting = async (context, key, fallback) => {
  try {
    const value = await context.settings.get(key);
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  } catch {
    return fallback;
  }
};

const listNotesByDate = async (context, calendarTag, year, month) => {
  const request = {
    tags: [calendarTag],
    sort: "updated-desc",
    limit: 1000,
  };
  
  const result = await context.notes.query(request);
  const notes = result.notes || [];
  
  // 按日期分组
  const notesByDate = {};
  notes.forEach(note => {
    const noteDate = new Date(note.updated);
    if (noteDate.getFullYear() === year && noteDate.getMonth() + 1 === month) {
      const dateKey = `${noteDate.getFullYear()}-${String(noteDate.getMonth() + 1).padStart(2, '0')}-${String(noteDate.getDate()).padStart(2, '0')}`;
      if (!notesByDate[dateKey]) {
        notesByDate[dateKey] = [];
      }
      notesByDate[dateKey].push(note);
    }
  });
  
  return notesByDate;
};

const buildCalendarGrid = (calendar, notesByDate, maxCount) => {
  const grid = document.createElement('div');
  grid.style.cssText = 'display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #e5e7eb; padding: 1px; border-radius: 8px;';
  
  // 星期标题
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  weekDays.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.style.cssText = 'text-align: center; padding: 8px; font-weight: 600; color: #6b7280; font-size: 14px;';
    dayHeader.textContent = day;
    grid.appendChild(dayHeader);
  });
  
  // 日期格子
  calendar.forEach(day => {
    const dayCell = document.createElement('div');
    dayCell.style.cssText = `
      min-height: 80px;
      padding: 4px;
      background: ${day.isCurrentMonth ? '#ffffff' : '#f9fafb'};
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    `;
    
    if (day.isCurrentMonth) {
      dayCell.style.border = '1px solid #e5e7eb';
    }
    
    dayCell.addEventListener('mouseenter', () => {
      dayCell.style.background = day.isCurrentMonth ? '#f3f4f6' : '#f9fafb';
      dayCell.style.border = '1px solid #d1d5db';
    });
    
    dayCell.addEventListener('mouseleave', () => {
      dayCell.style.background = day.isCurrentMonth ? '#ffffff' : '#f9fafb';
      dayCell.style.border = '1px solid transparent';
    });
    
    // 日期数字
    const dayNumber = document.createElement('div');
    dayNumber.style.cssText = 'font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 2px;';
    dayNumber.textContent = day.day;
    dayCell.appendChild(dayNumber);
    
    // 农历日期
    const lunarText = document.createElement('div');
    lunarText.style.cssText = 'font-size: 11px; color: #6b7280; margin-bottom: 2px;';
    lunarText.textContent = `${day.lunar.monthName}${day.lunar.dayName}`;
    dayCell.appendChild(lunarText);
    
    // 热力图
    const dateKey = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, '0')}-${String(day.date.getDate()).padStart(2, '0')}`;
    const noteCount = notesByDate[dateKey] ? notesByDate[dateKey].length : 0;
    
    if (noteCount > 0) {
      const heatDot = document.createElement('div');
      heatDot.style.cssText = `
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${getHeatmapColor(noteCount, maxCount)};
        margin-top: 2px;
      `;
      dayCell.appendChild(heatDot);
    }
    
    grid.appendChild(dayCell);
  });
  
  return grid;
};

const buildNotesList = (notesByDate) => {
  const container = document.createElement('div');
  container.style.cssText = 'margin-top: 20px;';
  
  // 按日期分组显示笔记
  Object.keys(notesByDate).sort().reverse().forEach(dateKey => {
    const dayNotes = notesByDate[dateKey];
    
    const dateHeader = document.createElement('div');
    dateHeader.style.cssText = 'font-size: 14px; font-weight: 600; color: #374151; margin: 16px 0 8px 0; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb;';
    dateHeader.textContent = dateKey;
    container.appendChild(dateHeader);
    
    dayNotes.forEach(note => {
      const noteItem = document.createElement('button');
      noteItem.type = 'button';
      noteItem.style.cssText = `
        display: block;
        width: 100%;
        text-align: left;
        padding: 12px 16px;
        margin: 0 0 8px 0;
        border: 1px solid rgba(148, 163, 184, 0.45);
        border-radius: 8px;
        background: transparent;
        cursor: pointer;
        font: inherit;
        color: inherit;
      `;
      
      noteItem.addEventListener('mouseenter', () => { 
        noteItem.style.background = 'rgba(148, 163, 184, 0.15)'; 
      });
      noteItem.addEventListener('mouseleave', () => { 
        noteItem.style.background = 'transparent'; 
      });
      
      const title = document.createElement('div');
      title.textContent = note.title || note.excerpt || '（未命名笔记）';
      title.style.cssText = 'font-weight: 500; margin-bottom: 4px;';
      
      const excerpt = document.createElement('div');
      excerpt.textContent = note.excerpt || '';
      excerpt.style.cssText = 'font-size: 13px; opacity: 0.7; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
      
      const updateTime = document.createElement('div');
      updateTime.textContent = new Date(note.updated).toLocaleString('zh-CN');
      updateTime.style.cssText = 'font-size: 12px; opacity: 0.5; margin-top: 4px;';
      
      noteItem.append(title, excerpt, updateTime);
      noteItem.addEventListener('click', async () => {
        await context.ui.openNote(note.id);
      });
      
      container.appendChild(noteItem);
    });
  });
  
  return container;
};

const renderCalendarPanel = async (context, container, shell, options) => {
  const calendarTag = await resolveSetting(context, "calendar-tag", "日历");
  const dateFormat = await resolveSetting(context, "date-format", "YYYY-MM-DD");
  const timeFormat = await resolveSetting(context, "time-format", "YYYY-MM-DD HH:mm");
  
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth() + 1;
  
  const state = { notesByDate: {}, maxCount: 0 };
  
  const applyChrome = (count) => {
    shell.set({
      header: {
        title: "日历",
        description: `查看 ${currentYear} 年 ${getMonthName(currentMonth)} 的笔记`,
        actions: [
          { id: "prev-month", label: "上月" },
          { id: "next-month", label: "下月" },
          { id: "today", label: "今天" },
          { id: "refresh", label: "刷新" },
        ],
      },
      toolbar: [
        { 
          type: "custom", 
          content: `
            <div style="display: flex; align-items: center; gap: 8px;">
              <select id="year-select" style="padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                ${Array.from({ length: 21 }, (_, i) => currentYear - 10 + i).map(y => 
                  `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y} 年</option>`
                ).join('')}
              </select>
              <select id="month-select" style="padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                ${Array.from({ length: 12 }, (_, i) => i + 1).map(m => 
                  `<option value="${m}" ${m === currentMonth ? 'selected' : ''}>${getMonthName(m)}</option>`
                ).join('')}
              </select>
            </div>
          `
        },
      ],
      onAction(id) {
        if (id === "prev-month") {
          currentMonth--;
          if (currentMonth < 1) {
            currentMonth = 12;
            currentYear--;
          }
          render();
        } else if (id === "next-month") {
          currentMonth++;
          if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
          }
          render();
        } else if (id === "today") {
          currentYear = currentDate.getFullYear();
          currentMonth = currentDate.getMonth() + 1;
          render();
        } else if (id === "refresh") {
          render();
        }
      },
    });
  };
  
  const updateSelectors = () => {
    const yearSelect = container.querySelector('#year-select');
    const monthSelect = container.querySelector('#month-select');
    if (yearSelect) yearSelect.value = currentYear;
    if (monthSelect) monthSelect.value = currentMonth;
  };
  
  const render = async () => {
    container.replaceChildren();
    
    try {
      state.notesByDate = await listNotesByDate(context, calendarTag, currentYear, currentMonth);
      state.maxCount = Math.max(...Object.values(state.notesByDate).map(notes => notes.length), 1);
      
      const calendar = generateCalendarData(currentYear, currentMonth);
      const calendarGrid = buildCalendarGrid(calendar, state.notesByDate, state.maxCount);
      container.appendChild(calendarGrid);
      
      const notesList = buildNotesList(state.notesByDate);
      container.appendChild(notesList);
      
      updateSelectors();
      applyChrome(Object.keys(state.notesByDate).length);
    } catch (error) {
      const errorLine = document.createElement('p');
      errorLine.textContent = `加载日历数据失败：${error instanceof Error ? error.message : String(error)}`;
      container.appendChild(errorLine);
      applyChrome(0);
    }
  };
  
  // 监听选择器变化
  container.addEventListener('change', (event) => {
    if (event.target.id === 'year-select') {
      currentYear = parseInt(event.target.value);
      render();
    } else if (event.target.id === 'month-select') {
      currentMonth = parseInt(event.target.value);
      render();
    }
  });
  
  await render();
};

export default {
  activate(context) {
    // 注册日历面板
    const disposePanel = context.ui.panels.register({
      id: "calendar",
      title: "日历",
      purpose: "dashboard",
      presentation: "fullscreen",
      async mount(container, { state, shell }) {
        await renderCalendarPanel(context, container, shell, {
          startInCreateMode: Boolean(state?.create),
        });
      },
    });
    
    // 注册打开日历面板命令
    const disposeOpen = context.commands.register({
      id: "open-calendar",
      title: "打开日历面板",
      async run() {
        await context.ui.panels.open("calendar");
      },
    });
    
    // 注册插入日期快捷键
    const disposeInsertDate = context.commands.register({
      id: "insert-date",
      title: "插入当前日期",
      menu: false,
      key: "Control+;",
      async run() {
        const dateFormat = await resolveSetting(context, "date-format", "YYYY-MM-DD");
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate, dateFormat);
        
        try {
          // 插入到当前编辑的笔记
          await context.editor.insertText(formattedDate);
          context.ui.showNotice(`已插入日期：${formattedDate}`);
        } catch (error) {
          context.ui.showNotice(`插入日期失败：${error instanceof Error ? error.message : String(error)}`);
        }
      },
    });
    
    // 注册插入时间快捷键
    const disposeInsertTime = context.commands.register({
      id: "insert-time",
      title: "插入当前时间",
      menu: false,
      key: "Control+Shift+;",
      async run() {
        const timeFormat = await resolveSetting(context, "time-format", "YYYY-MM-DD HH:mm");
        const currentDate = new Date();
        const formattedTime = formatDate(currentDate, timeFormat);
        
        try {
          // 插入到当前编辑的笔记
          await context.editor.insertText(formattedTime);
          context.ui.showNotice(`已插入时间：${formattedTime}`);
        } catch (error) {
          context.ui.showNotice(`插入时间失败：${error instanceof Error ? error.message : String(error)}`);
        }
      },
    });
    
    // 注册统计命令
    const disposeStats = context.commands.register({
      id: "calendar-stats",
      title: "统计日历笔记数量",
      listed: false,
      async run() {
        const calendarTag = await resolveSetting(context, "calendar-tag", "日历");
        const request = {
          tags: [calendarTag],
          sort: "updated-desc",
          limit: 1000,
        };
        const result = await context.notes.query(request);
        const notes = result.notes || [];
        context.ui.showNotice(`当前共有 ${notes.length} 篇日历笔记（标签「${calendarTag}」）。`);
      },
    });
    
    return () => {
      disposePanel();
      disposeOpen();
      disposeInsertDate();
      disposeInsertTime();
      disposeStats();
    };
  },
};