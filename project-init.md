# 按以下步骤创建项目

1. 初始化一个空的vue项目

2. 安装lunisolar包

3. 界面布局如下：

- 在主页面最上方水平居中添加一个单选框（男/女）

- 换行往下添加4个下拉框，分别代表年（1901-2100）、月（1-12）、日（1-31）、时（1-23）

- 换行往下添加一个测算按钮，按钮宽度等于上一行的4个下拉框宽度之和

- **以下部分需要点击测算按钮成功后显示**

- 换行居中显示表格展示测算结果，格式如下：

|   排盘   |                       年柱                        |                        月柱                         |                      日柱                       |                       时柱                        |
| :------: | :-----------------------------------------------: | :-------------------------------------------------: | :---------------------------------------------: | :-----------------------------------------------: |
| **农历** |                 {d.char8.year}年                  |              {d.lunar.getMonthName()}               |             {d.lunar.getDayName()}              |              {d.lunar.getHourName()}              |
| **主星** |                       劫财                        |                        偏印                         |                      元男                       |                       伤官                        |
| **天干** |  {d.char8.year[0]} ({d.char8.year.stem.e5.name})  |  {d.char8.month[0]} ({d.char8.month.stem.e5.name})  |  {d.char8.day[0]} ({d.char8.day.stem.e5.name})  |  {d.char8.hour[0]} ({d.char8.hour.stem.e5.name})  |
| **地支** | {d.char8.year[1]} ({d.char8.year.branch.e5.name}) | {d.char8.month[1]} ({d.char8.month.branch.e5.name}) | {d.char8.day[1]} ({d.char8.day.branch.e5.name}) | {d.char8.hour[1]} ({d.char8.hour.branch.e5.name}) |
| **藏干** |                壬 偏印<br>甲 比肩                 |                 丁 伤官<br>己 正财                  |          庚 七杀<br>壬 偏印<br>戊 偏财          |                      乙 劫财                      |

- 换行三级标题输出“八字：{d.format("cY cM cD cH")}”

- 换行三级标题输出“日主：{ri_zhu-desc}”

- 换行三级标题输出“五行个数如下”

- 换行输出“木：{mu-desc}”

- 换行输出“火：{huo-desc}”

- 换行输出“土：{tu-desc}”

- 换行输出“金：{jin-desc}”

- 换行输出“水：{shui-desc}”

- 换行三级标题输出“十神个数如下”

- 换行输出“印星：{yin_xing-desc}”

- 换行输出“官杀：{guan_sha-desc}”

- 换行输出“食伤：{shi_shang-desc}”

- 换行输出“财星：{cai_xing-desc}”

- 换行输出“比劫：{bi_jie-desc}”

4. js逻辑：

- 四个下拉框值改变时要联动其他3个，比如闰年2月有29号，一三五七八十十二月有31天，四六九十一月只有30天等，可以使用现成的组件库

- 点击测算按钮后，获取四个输入框的值拼接日期字符串，然后调用lunisolar包算出八字及对应的五行，用法如下：

```javascript
import lunisolar from "lunisolar";

// 传入阳历日期和时辰（支持多种格式）
const d = lunisolar("2022/07/18 14:40");

// 一行代码，直接获取八字
const bazi = d.format("cY cM cD cH"); // 输出: '壬寅 丁未 壬申 丁未'
console.log(bazi);

// 获取八字各柱
console.log(d.char8.year.toString()); // 年柱 '壬寅'
console.log(d.char8.month.toString()); // 月柱 '丁未'
console.log(d.char8.day.toString()); // 日柱 '壬申'
console.log(d.char8.hour.toString()); // 时柱 '丁未'

// 获取某柱的天干
console.log(d.char8.year.stem.toString()); // 年柱天干 '壬'
console.log(d.char8.month.stem.toString()); // 月柱天干 '丁'

// 获取某柱的天干的五行
console.log(d.char8.year.stem.e5.name.toString()); // 年柱天干 '壬' 的五行 '水'
console.log(d.char8.month.stem.e5.name.toString()); // 月柱天干 '丁' 的五行 '火'

// 获取某柱的地支
console.log(d.char8.year.branch.toString()); // 年柱地支 '寅'
console.log(d.char8.month.branch.toString()); // 月柱地支 '未'

// 获取某柱的地支的五行
console.log(d.char8.year.branch.e5.name.toString()); // 年柱地支 '寅' 的五行 '木'
console.log(d.char8.month.branch.e5.name.toString()); // 月柱地支 '未' 的五行 '火'
```

- 算出八字d之后根据占位符渲染到页面
