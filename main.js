// 农历数据 (1900-2100)
const LUNAR_YEARS = [68562,1874,3749,43818,1611,2715,166570,1386,2905,19370,1874,52645,2853,2635,174411,685,1387,157105,3497,192146,3474,3365,183565,2646,694,166613,1748,3753,20298,3730,50854,1323,2647,174422,2906,1748,157537,1865,191251,2707,1323,181531,2733,1386,167333,2980,2889,19787,2709,60077,1334,2733,174794,1458,3493,159394,3402,66965,2711,1366,50549,2773,1746,34645,3749,1610,26191,2715,60122,1386,2921,43954,2898,2853,35627,2635,68267,685,1389,181673,3497,3474,36501,3365,85581,2646,694,49909,1749,3753,44882,3730,3366,25902,2647,68310,858,1749,43881,1865,1683,35483,1323,2651,19118,1386,60885,2980,2889,44371,2709,1325,34141,2741,76714,1490,3493,183946,3402,3221,35486,1366,2741,19162,1746,51045,1829,1611,42583,3243,1370,25966,2921,94034,2898,2853,183563,2635,1195,41659,1453,2922,19882,3474,61093,3365,2645,174669,1206,1461,157394,3785,69522,3730,3366,181526,2647,1238,164709,1877,1865,26443,1683,60075,1323,2651,43706,1386,2917,35754,2890,69013,2709,1325,50541,2741,1450,34261,3493,3402,28237,3222,60622,1366,2741,174802,1746,3749,34602,1611,67223,1195,1371,181590,2922,1874,35733,2853,2699,19023,1195];
const LUNAR_M1 = [2415051,2415435,2415789,2416144,2416527,2416881,2417236,2417620,2417974,2418329,2418713,2419067,2419451,2419805,2420159,2420543,2420897,2421252,2421636,2421991,2422375,2422729,2423083,2423467,2423821,2424175,2424560,2424914,2425269,2425653,2426007,2426390,2426744,2427099,2427483,2427838,2428192,2428576,2428930,2429314,2429668,2430022,2430406,2430761,2431115,2431500,2431854,2432208,2432592,2432946,2433330,2433684,2434039,2434423,2434777,2435132,2435516,2435870,2436253,2436608,2436962,2437346,2437701,2438055,2438439,2438794,2439147,2439531,2439886,2440270,2440624,2440979,2441363,2441717,2442071,2442455,2442809,2443193,2443547,2443902,2444286,2444641,2444995,2445379,2445733,2446117,2446471,2446825,2447209,2447564,2447919,2448303,2448657,2449011,2449394,2449749,2450133,2450487,2450842,2451226,2451580,2451934,2452318,2452672,2453027,2453411,2453765,2454150,2454504,2454858,2455242,2455596,2455950,2456334,2456689,2457073,2457427,2457782,2458166,2458520,2458874,2459258,2459612,2459967,2460351,2460705,2461089,2461443,2461797,2462181,2462536,2462890,2463274,2463629,2464013,2464367,2464721,2465105,2465459,2465813,2466197,2466552,2466907,2467291,2467645,2468029,2468383,2468737,2469121,2469475,2469830,2470214,2470569,2470953,2471307,2471661,2472044,2472399,2472753,2473137,2473492,2473846,2474230,2474584,2474968,2475322,2475677,2476061,2476415,2476770,2477154,2477508,2477892,2478246,2478600,2478984,2479339,2479693,2480077,2480432,2480786,2481170,2481524,2481908,2482262,2482617,2483001,2483355,2483710,2484093,2484447,2484831,2485185,2485540,2485924,2486279,2486633,2487017,2487371,2487725,2488109];

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

// 农历转换：公历 → 农历
// LUNAR_M1[i] 为第 i+1900 年正月初一的 JDN；年码位 0..11 为月大小，位 13..16 为闰月月号，位 17 为闰月大小
function solarToLunar(date) {
  const jdn = Math.round(g2jd(date.getFullYear(), date.getMonth() + 1, date.getDate()) + 0.5);
  if (jdn < LUNAR_M1[0]) return null;
  let yearIdx = LUNAR_YEARS.length - 1;
  for (let i = 0; i < LUNAR_YEARS.length; i++) {
    if (jdn >= LUNAR_M1[i] && (i === LUNAR_YEARS.length - 1 || jdn < LUNAR_M1[i + 1])) {
      yearIdx = i;
      break;
    }
  }
  const code = LUNAR_YEARS[yearIdx];
  const leapMonth = (code >> 13) & 0xF;
  const leapBig = (code >> 17) & 1;
  let offset = jdn - LUNAR_M1[yearIdx];
  for (let m = 1; m <= 12; m++) {
    const regLen = ((code >> (m - 1)) & 1) ? 30 : 29;
    if (offset < regLen) return { year: 1900 + yearIdx, month: m, day: offset + 1, isLeap: false };
    offset -= regLen;
    if (leapMonth === m) {
      const leapLen = leapBig ? 30 : 29;
      if (offset < leapLen) return { year: 1900 + yearIdx, month: m, day: offset + 1, isLeap: true };
      offset -= leapLen;
    }
  }
  return null;
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

// 农历显示信息（超出 1900-2100 数据范围时返回 null）
function lunarInfo(date) {
  const lunar = solarToLunar(date);
  if (!lunar) return null;
  return {
    month: lunar.month,
    day: lunar.day,
    monthName: getLunarMonthName(lunar.month, lunar.isLeap),
    dayName: getLunarDayName(lunar.day)
  };
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
    calendar.push({
      date,
      day,
      isCurrentMonth: false,
      lunar: lunarInfo(date)
    });
  }

  // 添加当前月的日期
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    calendar.push({
      date,
      day,
      isCurrentMonth: true,
      lunar: lunarInfo(date)
    });
  }
  
  // 添加下个月的日期
  const endWeekday = lastDay.getDay();
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  
  for (let day = 1; day <= 42 - calendar.length; day++) {
    const date = new Date(nextYear, nextMonth - 1, day);
    calendar.push({
      date,
      day,
      isCurrentMonth: false,
      lunar: lunarInfo(date)
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
    
    // 农历日期（初一则显示月名，如「八月」「闰六月」；其余显示日名）
    const lunarText = document.createElement('div');
    lunarText.style.cssText = 'font-size: 11px; color: #6b7280; margin-bottom: 2px;';
    lunarText.textContent = day.lunar
      ? (day.lunar.day === 1 ? `${day.lunar.monthName}月` : day.lunar.dayName)
      : '';
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

// 在当前编辑的笔记光标处插入文本（需宿主提供 editor.write 能力）
const insertAtCursor = async (context, text, label) => {
  try {
    await context.editor.insertAtCursor(text);
  } catch (error) {
    context.ui.showNotice(`插入${label}失败：${error instanceof Error ? error.message : String(error)}`);
  }
};

const insertCurrentDate = async (context) => {
  const format = await resolveSetting(context, "date-format", "YYYY-MM-DD");
  await insertAtCursor(context, formatDate(new Date(), format), "日期");
};

const insertCurrentTime = async (context) => {
  const format = await resolveSetting(context, "time-format", "YYYY-MM-DD HH:mm");
  await insertAtCursor(context, formatDate(new Date(), format), "时间");
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

    // 注册插入命令（EdgeEver 插件 API 无快捷键注册机制，
    // 命令显示在插件工具栏菜单中；下方的键盘监听为其快捷键补充）
    const disposeInsertDate = context.commands.register({
      id: "insert-date",
      title: "插入当前日期",
      listed: false,
      async run() {
        await insertCurrentDate(context);
      },
    });

    const disposeInsertTime = context.commands.register({
      id: "insert-time",
      title: "插入当前时间",
      listed: false,
      async run() {
        await insertCurrentTime(context);
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

    // 快捷键（尽力而为）：官方 API 未提供快捷键扩展点，若插件与宿主共享文档，
    // 则通过捕获阶段监听 Ctrl+;（日期）/ Ctrl+Shift+;（时间）。
    // 用 event.code 而非 event.key：Shift+; 在多数布局上产生 ":"，按物理键位才稳定。
    // 若宿主将插件隔离在沙箱文档中，此处静默失效，命令仍可从插件工具栏菜单触发。
    const onKeyDown = (event) => {
      if (event.code !== "Semicolon" || event.altKey || event.repeat) return;
      if (!(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.shiftKey) insertCurrentTime(context);
      else insertCurrentDate(context);
    };
    let disposeKeys = () => {};
    try {
      document.addEventListener("keydown", onKeyDown, true);
      disposeKeys = () => document.removeEventListener("keydown", onKeyDown, true);
    } catch {
      // 宿主沙箱不支持全局键盘监听时忽略，插件工具栏菜单命令始终可用
    }

    return () => {
      disposeKeys();
      disposePanel();
      disposeOpen();
      disposeInsertDate();
      disposeInsertTime();
      disposeStats();
    };
  },
};