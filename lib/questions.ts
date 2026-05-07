// 扩充的练习题库 - 各年级各知识点

export interface Question {
  id: string
  type: 'fill' | 'choice' | 'calc' | 'word'
  question: string
  options?: string[]
  answer: string
  difficulty: 1 | 2 | 3
  topic: string
  grade: number
  hint?: string
}

export const QUESTION_BANK: Record<string, Question[]> = {
  // 一年级
  'g1-1-20': [
    { id: 'g1-1-20-1', type: 'fill', question: '从1数到20：1、2、3、（ ）、（ ）、6、7、8、9、（ ）、（ ）、12、13、14、15、16、17、18、19、（ ）。', answer: '4,5,10,11,20', difficulty: 1, topic: '数数', grade: 1 },
    { id: 'g1-1-20-2', type: 'fill', question: '16是由（ ）个十和（ ）个一组成的。', answer: '1,6', difficulty: 1, topic: '数的组成', grade: 1 },
    { id: 'g1-1-20-3', type: 'calc', question: '在○里填上">""<"或"="：\n13 ○ 17', answer: '<', difficulty: 1, topic: '比大小', grade: 1 },
    { id: 'g1-1-20-4', type: 'calc', question: '在○里填上">""<"或"="：\n20 ○ 12', answer: '>', difficulty: 1, topic: '比大小', grade: 1 },
    { id: 'g1-1-20-5', type: 'calc', question: '在○里填上">""<"或"="：\n15 ○ 15', answer: '=', difficulty: 1, topic: '比大小', grade: 1 },
    { id: 'g1-1-20-6', type: 'fill', question: '与19相邻的两个数是（ ）和（ ）。', answer: '18,20', difficulty: 2, topic: '相邻数', grade: 1 },
    { id: 'g1-1-20-7', type: 'calc', question: '比18多1的数是（ ）。', answer: '19', difficulty: 1, topic: '数的大小', grade: 1 },
    { id: 'g1-1-20-8', type: 'calc', question: '比14少1的数是（ ）。', answer: '13', difficulty: 1, topic: '数的大小', grade: 1 },
    { id: 'g1-1-20-9', type: 'fill', question: '按从小到大的顺序排列：45、12、8、20\n（ ）<（ ）<（ ）<（ ）', answer: '8,12,20,45', difficulty: 2, topic: '排序', grade: 1, hint: '先找出最小和最大的数' },
    { id: 'g1-1-20-10', type: 'choice', question: '下面哪个数最大？', options: ['11', '13', '9', '15'], answer: '15', difficulty: 1, topic: '比大小', grade: 1 },
  ],
  'g1-add-10': [
    { id: 'g1-add-10-1', type: 'calc', question: '3 + 2 = ?', answer: '5', difficulty: 1, topic: '5以内加法', grade: 1 },
    { id: 'g1-add-10-2', type: 'calc', question: '4 + 1 = ?', answer: '5', difficulty: 1, topic: '5以内加法', grade: 1 },
    { id: 'g1-add-10-3', type: 'calc', question: '5 - 1 = ?', answer: '4', difficulty: 1, topic: '5以内减法', grade: 1 },
    { id: 'g1-add-10-4', type: 'calc', question: '3 - 2 = ?', answer: '1', difficulty: 1, topic: '5以内减法', grade: 1 },
    { id: 'g1-add-10-5', type: 'calc', question: '2 + 3 = ?', answer: '5', difficulty: 1, topic: '5以内加法', grade: 1 },
    { id: 'g1-add-10-6', type: 'calc', question: '5 - 3 = ?', answer: '2', difficulty: 1, topic: '5以内减法', grade: 1 },
    { id: 'g1-add-10-7', type: 'calc', question: '1 + 4 = ?', answer: '5', difficulty: 1, topic: '5以内加法', grade: 1 },
    { id: 'g1-add-10-8', type: 'calc', question: '4 - 1 = ?', answer: '3', difficulty: 1, topic: '5以内减法', grade: 1 },
    { id: 'g1-add-10-9', type: 'word', question: '小明有3个苹果，妈妈又给了他2个，小明现在有多少个苹果？', answer: '5', difficulty: 2, topic: '加法应用', grade: 1, hint: '把两部分合起来' },
    { id: 'g1-add-10-10', type: 'word', question: '小红有5个气球，飞走了2个，还剩几个？', answer: '3', difficulty: 2, topic: '减法应用', grade: 1, hint: '从总数里去掉' },
  ],
  'g1-add-20': [
    { id: 'g1-add-20-1', type: 'calc', question: '9 + 2 = ?', answer: '11', difficulty: 1, topic: '凑十法', grade: 1, hint: '用凑十法' },
    { id: 'g1-add-20-2', type: 'calc', question: '9 + 3 = ?', answer: '12', difficulty: 1, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-3', type: 'calc', question: '9 + 4 = ?', answer: '13', difficulty: 1, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-4', type: 'calc', question: '9 + 5 = ?', answer: '14', difficulty: 1, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-5', type: 'calc', question: '8 + 3 = ?', answer: '11', difficulty: 1, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-6', type: 'calc', question: '8 + 4 = ?', answer: '12', difficulty: 1, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-7', type: 'calc', question: '7 + 4 = ?', answer: '11', difficulty: 1, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-8', type: 'calc', question: '7 + 5 = ?', answer: '12', difficulty: 1, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-9', type: 'calc', question: '6 + 5 = ?', answer: '11', difficulty: 1, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-10', type: 'calc', question: '9 + 6 = ?', answer: '15', difficulty: 2, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-11', type: 'calc', question: '9 + 7 = ?', answer: '16', difficulty: 2, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-12', type: 'calc', question: '9 + 8 = ?', answer: '17', difficulty: 2, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-13', type: 'calc', question: '9 + 9 = ?', answer: '18', difficulty: 2, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-14', type: 'calc', question: '8 + 5 = ?', answer: '13', difficulty: 1, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-15', type: 'calc', question: '8 + 6 = ?', answer: '14', difficulty: 2, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-16', type: 'calc', question: '8 + 7 = ?', answer: '15', difficulty: 2, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-17', type: 'calc', question: '8 + 8 = ?', answer: '16', difficulty: 2, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-18', type: 'calc', question: '7 + 6 = ?', answer: '13', difficulty: 2, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-19', type: 'calc', question: '7 + 7 = ?', answer: '14', difficulty: 2, topic: '凑十法', grade: 1 },
    { id: 'g1-add-20-20', type: 'calc', question: '7 + 8 = ?', answer: '15', difficulty: 2, topic: '凑十法', grade: 1 },
  ],
  'g1-sub-20': [
    { id: 'g1-sub-20-1', type: 'calc', question: '15 - 8 = ?', answer: '7', difficulty: 2, topic: '破十法', grade: 1, hint: '用破十法' },
    { id: 'g1-sub-20-2', type: 'calc', question: '13 - 6 = ?', answer: '7', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-3', type: 'calc', question: '12 - 5 = ?', answer: '7', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-4', type: 'calc', question: '14 - 7 = ?', answer: '7', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-5', type: 'calc', question: '11 - 4 = ?', answer: '7', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-6', type: 'calc', question: '16 - 9 = ?', answer: '7', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-7', type: 'calc', question: '13 - 8 = ?', answer: '5', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-8', type: 'calc', question: '15 - 7 = ?', answer: '8', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-9', type: 'calc', question: '12 - 6 = ?', answer: '6', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-10', type: 'calc', question: '14 - 8 = ?', answer: '6', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-11', type: 'calc', question: '16 - 7 = ?', answer: '9', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-12', type: 'calc', question: '11 - 3 = ?', answer: '8', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-13', type: 'calc', question: '13 - 4 = ?', answer: '9', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-14', type: 'calc', question: '17 - 9 = ?', answer: '8', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-15', type: 'calc', question: '18 - 9 = ?', answer: '9', difficulty: 2, topic: '破十法', grade: 1 },
    { id: 'g1-sub-20-16', type: 'calc', question: '想加算减：11 - 7 = ?（因为7+4=11）', answer: '4', difficulty: 2, topic: '想加算减', grade: 1 },
    { id: 'g1-sub-20-17', type: 'calc', question: '想加算减：13 - 9 = ?（因为9+4=13）', answer: '4', difficulty: 2, topic: '想加算减', grade: 1 },
    { id: 'g1-sub-20-18', type: 'calc', question: '想加算减：15 - 8 = ?（因为8+7=15）', answer: '7', difficulty: 2, topic: '想加算减', grade: 1 },
    { id: 'g1-sub-20-19', type: 'word', question: '小明有12支铅笔，用了5支，还剩多少支？', answer: '7', difficulty: 2, topic: '减法应用', grade: 1 },
    { id: 'g1-sub-20-20', type: 'word', question: '小红有17颗糖，吃了8颗，还剩多少颗？', answer: '9', difficulty: 2, topic: '减法应用', grade: 1 },
  ],
  // 二年级
  'g2-mul-table': [
    { id: 'g2-mul-1', type: 'calc', question: '2 × 3 = ?', answer: '6', difficulty: 1, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-2', type: 'calc', question: '2 × 5 = ?', answer: '10', difficulty: 1, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-3', type: 'calc', question: '3 × 4 = ?', answer: '12', difficulty: 1, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-4', type: 'calc', question: '4 × 5 = ?', answer: '20', difficulty: 1, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-5', type: 'calc', question: '5 × 6 = ?', answer: '30', difficulty: 1, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-6', type: 'calc', question: '6 × 7 = ?', answer: '42', difficulty: 2, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-7', type: 'calc', question: '7 × 8 = ?', answer: '56', difficulty: 2, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-8', type: 'calc', question: '8 × 9 = ?', answer: '72', difficulty: 2, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-9', type: 'calc', question: '9 × 9 = ?', answer: '81', difficulty: 2, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-10', type: 'calc', question: '3 × 7 = ?', answer: '21', difficulty: 1, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-11', type: 'calc', question: '4 × 6 = ?', answer: '24', difficulty: 1, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-12', type: 'calc', question: '5 × 8 = ?', answer: '40', difficulty: 2, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-13', type: 'calc', question: '6 × 8 = ?', answer: '48', difficulty: 2, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-14', type: 'calc', question: '7 × 9 = ?', answer: '63', difficulty: 2, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-15', type: 'calc', question: '8 × 8 = ?', answer: '64', difficulty: 2, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-16', type: 'calc', question: '填口诀：二（ ）得六', answer: '三', difficulty: 1, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-17', type: 'calc', question: '填口诀：（ ）五十五', answer: '三', difficulty: 1, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-18', type: 'calc', question: '填口诀：三（ ）十二', answer: '四', difficulty: 1, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-19', type: 'calc', question: '填口诀：四（ ）二十', answer: '五', difficulty: 1, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-20', type: 'calc', question: '填口诀：（ ）八四十八', answer: '六', difficulty: 2, topic: '乘法口诀', grade: 2 },
    { id: 'g2-mul-21', type: 'calc', question: '4个3相加是多少？', answer: '12', difficulty: 1, topic: '乘法的意义', grade: 2, hint: '4×3' },
    { id: 'g2-mul-22', type: 'calc', question: '5个6相加是多少？', answer: '30', difficulty: 1, topic: '乘法的意义', grade: 2, hint: '5×6' },
    { id: 'g2-mul-23', type: 'word', question: '每排有7个同学，排了5排，一共有多少个同学？', answer: '35', difficulty: 2, topic: '乘法应用', grade: 2 },
    { id: 'g2-mul-24', type: 'word', question: '每个盒子有6个球，4个盒子一共有多少个球？', answer: '24', difficulty: 2, topic: '乘法应用', grade: 2 },
    { id: 'g2-mul-25', type: 'word', question: '小红每天看8页书，3天看了多少页？', answer: '24', difficulty: 2, topic: '乘法应用', grade: 2 },
  ],
  'g2-division': [
    { id: 'g2-div-1', type: 'calc', question: '12 ÷ 3 = ?', answer: '4', difficulty: 1, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-2', type: 'calc', question: '18 ÷ 6 = ?', answer: '3', difficulty: 1, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-3', type: 'calc', question: '24 ÷ 4 = ?', answer: '6', difficulty: 2, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-4', type: 'calc', question: '32 ÷ 8 = ?', answer: '4', difficulty: 2, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-5', type: 'calc', question: '35 ÷ 7 = ?', answer: '5', difficulty: 2, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-6', type: 'calc', question: '42 ÷ 6 = ?', answer: '7', difficulty: 2, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-7', type: 'calc', question: '48 ÷ 8 = ?', answer: '6', difficulty: 2, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-8', type: 'calc', question: '56 ÷ 7 = ?', answer: '8', difficulty: 2, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-9', type: 'calc', question: '63 ÷ 9 = ?', answer: '7', difficulty: 2, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-10', type: 'calc', question: '72 ÷ 8 = ?', answer: '9', difficulty: 2, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-11', type: 'calc', question: '20 ÷ 5 = ?', answer: '4', difficulty: 1, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-12', type: 'calc', question: '27 ÷ 9 = ?', answer: '3', difficulty: 1, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-13', type: 'calc', question: '36 ÷ 6 = ?', answer: '6', difficulty: 1, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-14', type: 'calc', question: '45 ÷ 9 = ?', answer: '5', difficulty: 1, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-15', type: 'calc', question: '54 ÷ 6 = ?', answer: '9', difficulty: 2, topic: '除法口诀', grade: 2 },
    { id: 'g2-div-16', type: 'word', question: '把15平均分成3份，每份是多少？', answer: '5', difficulty: 2, topic: '除法应用', grade: 2 },
    { id: 'g2-div-17', type: 'word', question: '有24个苹果，每个小朋友分6个，可以分给几个小朋友？', answer: '4', difficulty: 2, topic: '除法应用', grade: 2 },
    { id: 'g2-div-18', type: 'word', question: '一本故事书36页，小明每天看9页，几天可以看完？', answer: '4', difficulty: 2, topic: '除法应用', grade: 2 },
    { id: 'g2-div-19', type: 'word', question: '二（1）班有42人，正好分成6组，每组有几人？', answer: '7', difficulty: 2, topic: '除法应用', grade: 2 },
    { id: 'g2-div-20', type: 'word', question: '每个盒子装8个球，56个球需要几个盒子？', answer: '7', difficulty: 2, topic: '除法应用', grade: 2 },
  ],
  'g2-add-sub-100': [
    { id: 'g2-as-1', type: 'calc', question: '56 + 38 = ?', answer: '94', difficulty: 2, topic: '进位加法', grade: 2 },
    { id: 'g2-as-2', type: 'calc', question: '73 - 45 = ?', answer: '28', difficulty: 2, topic: '退位减法', grade: 2 },
    { id: 'g2-as-3', type: 'calc', question: '67 + 29 = ?', answer: '96', difficulty: 2, topic: '进位加法', grade: 2 },
    { id: 'g2-as-4', type: 'calc', question: '82 - 37 = ?', answer: '45', difficulty: 2, topic: '退位减法', grade: 2 },
    { id: 'g2-as-5', type: 'calc', question: '45 + 38 = ?', answer: '83', difficulty: 2, topic: '进位加法', grade: 2 },
    { id: 'g2-as-6', type: 'calc', question: '91 - 56 = ?', answer: '35', difficulty: 2, topic: '退位减法', grade: 2 },
    { id: 'g2-as-7', type: 'calc', question: '38 + 47 = ?', answer: '85', difficulty: 2, topic: '进位加法', grade: 2 },
    { id: 'g2-as-8', type: 'calc', question: '76 - 38 = ?', answer: '38', difficulty: 2, topic: '退位减法', grade: 2 },
    { id: 'g2-as-9', type: 'calc', question: '29 + 64 = ?', answer: '93', difficulty: 2, topic: '进位加法', grade: 2 },
    { id: 'g2-as-10', type: 'calc', question: '83 - 47 = ?', answer: '36', difficulty: 2, topic: '退位减法', grade: 2 },
    { id: 'g2-as-11', type: 'calc', question: '列竖式计算：45 + 38 = ?', answer: '83', difficulty: 2, topic: '竖式计算', grade: 2, hint: '注意进位' },
    { id: 'g2-as-12', type: 'calc', question: '列竖式计算：73 - 27 = ?', answer: '46', difficulty: 2, topic: '竖式计算', grade: 2, hint: '注意退位' },
    { id: 'g2-as-13', type: 'word', question: '小明有65张卡片，小红比小明多28张，小红有多少张？', answer: '93', difficulty: 3, topic: '应用题', grade: 2 },
    { id: 'g2-as-14', type: 'word', question: '一捆绳子原来有83米，用了一些后还剩37米，用了多少米？', answer: '46', difficulty: 3, topic: '应用题', grade: 2 },
    { id: 'g2-as-15', type: 'word', question: '水果店上午卖出45箱苹果，下午卖出38箱，一共卖出多少箱？', answer: '83', difficulty: 2, topic: '应用题', grade: 2 },
  ],
  // 三年级
  'g3-multi-digit-add-sub': [
    { id: 'g3-as-1', type: 'calc', question: '456 + 378 = ?', answer: '834', difficulty: 2, topic: '三位数加法', grade: 3 },
    { id: 'g3-as-2', type: 'calc', question: '567 - 289 = ?', answer: '278', difficulty: 2, topic: '三位数减法', grade: 3 },
    { id: 'g3-as-3', type: 'calc', question: '732 - 458 = ?', answer: '274', difficulty: 2, topic: '三位数减法', grade: 3 },
    { id: 'g3-as-4', type: 'calc', question: '348 + 576 = ?', answer: '924', difficulty: 2, topic: '三位数加法', grade: 3 },
    { id: 'g3-as-5', type: 'calc', question: '625 - 367 = ?', answer: '258', difficulty: 2, topic: '三位数减法', grade: 3 },
    { id: 'g3-as-6', type: 'calc', question: '428 + 395 = ?', answer: '823', difficulty: 2, topic: '三位数加法', grade: 3 },
    { id: 'g3-as-7', type: 'calc', question: '700 - 356 = ?', answer: '344', difficulty: 2, topic: '三位数减法', grade: 3 },
    { id: 'g3-as-8', type: 'calc', question: '537 + 286 = ?', answer: '823', difficulty: 2, topic: '三位数加法', grade: 3 },
    { id: 'g3-as-9', type: 'calc', question: '800 - 427 = ?', answer: '373', difficulty: 2, topic: '三位数减法', grade: 3 },
    { id: 'g3-as-10', type: 'calc', question: '654 + 278 = ?', answer: '932', difficulty: 2, topic: '三位数加法', grade: 3 },
  ],
  'g3-multi-digit-mul': [
    { id: 'g3-mul-1', type: 'calc', question: '23 × 4 = ?', answer: '92', difficulty: 2, topic: '两位数乘一位数', grade: 3 },
    { id: 'g3-mul-2', type: 'calc', question: '125 × 4 = ?', answer: '500', difficulty: 2, topic: '三位数乘一位数', grade: 3 },
    { id: 'g3-mul-3', type: 'calc', question: '234 × 3 = ?', answer: '702', difficulty: 2, topic: '三位数乘一位数', grade: 3 },
    { id: 'g3-mul-4', type: 'calc', question: '156 × 5 = ?', answer: '780', difficulty: 2, topic: '三位数乘一位数', grade: 3 },
    { id: 'g3-mul-5', type: 'calc', question: '207 × 4 = ?', answer: '828', difficulty: 2, topic: '中间有0的乘法', grade: 3 },
    { id: 'g3-mul-6', type: 'calc', question: '134 × 7 = ?', answer: '938', difficulty: 2, topic: '三位数乘一位数', grade: 3 },
    { id: 'g3-mul-7', type: 'calc', question: '250 × 4 = ?', answer: '1000', difficulty: 2, topic: '末尾有0的乘法', grade: 3 },
    { id: 'g3-mul-8', type: 'calc', question: '108 × 6 = ?', answer: '648', difficulty: 2, topic: '中间有0的乘法', grade: 3 },
    { id: 'g3-mul-9', type: 'calc', question: '267 × 3 = ?', answer: '801', difficulty: 2, topic: '三位数乘一位数', grade: 3 },
    { id: 'g3-mul-10', type: 'calc', question: '189 × 5 = ?', answer: '945', difficulty: 2, topic: '三位数乘一位数', grade: 3 },
  ],
  'g3-two-digit-mul': [
    { id: 'g3-2mul-1', type: 'calc', question: '12 × 14 = ?', answer: '168', difficulty: 2, topic: '两位数乘两位数', grade: 3 },
    { id: 'g3-2mul-2', type: 'calc', question: '23 × 14 = ?', answer: '322', difficulty: 2, topic: '两位数乘两位数', grade: 3 },
    { id: 'g3-2mul-3', type: 'calc', question: '45 × 12 = ?', answer: '540', difficulty: 2, topic: '两位数乘两位数', grade: 3 },
    { id: 'g3-2mul-4', type: 'calc', question: '36 × 27 = ?', answer: '972', difficulty: 3, topic: '两位数乘两位数', grade: 3 },
    { id: 'g3-2mul-5', type: 'calc', question: '58 × 16 = ?', answer: '928', difficulty: 3, topic: '两位数乘两位数', grade: 3 },
    { id: 'g3-2mul-6', type: 'calc', question: '24 × 35 = ?', answer: '840', difficulty: 2, topic: '两位数乘两位数', grade: 3 },
    { id: 'g3-2mul-7', type: 'calc', question: '47 × 23 = ?', answer: '1081', difficulty: 3, topic: '两位数乘两位数', grade: 3 },
    { id: 'g3-2mul-8', type: 'calc', question: '39 × 28 = ?', answer: '1092', difficulty: 3, topic: '两位数乘两位数', grade: 3 },
    { id: 'g3-2mul-9', type: 'word', question: '每千克苹果12元，买25千克要多少钱？', answer: '300', difficulty: 2, topic: '乘法应用', grade: 3 },
    { id: 'g3-2mul-10', type: 'word', question: '一箱有24瓶饮料，35箱一共有多少瓶？', answer: '840', difficulty: 3, topic: '乘法应用', grade: 3 },
  ],
  'g3-division': [
    { id: 'g3-div-1', type: 'calc', question: '246 ÷ 3 = ?', answer: '82', difficulty: 2, topic: '除数是一位数的除法', grade: 3 },
    { id: 'g3-div-2', type: 'calc', question: '432 ÷ 6 = ?', answer: '72', difficulty: 2, topic: '除数是一位数的除法', grade: 3 },
    { id: 'g3-div-3', type: 'calc', question: '567 ÷ 7 = ?', answer: '81', difficulty: 2, topic: '除数是一位数的除法', grade: 3 },
    { id: 'g3-div-4', type: 'calc', question: '648 ÷ 8 = ?', answer: '81', difficulty: 2, topic: '除数是一位数的除法', grade: 3 },
    { id: 'g3-div-5', type: 'calc', question: '576 ÷ 8 = ?', answer: '72', difficulty: 2, topic: '除数是一位数的除法', grade: 3 },
    { id: 'g3-div-6', type: 'calc', question: '728 ÷ 8 = ?', answer: '91', difficulty: 2, topic: '除数是一位数的除法', grade: 3 },
    { id: 'g3-div-7', type: 'calc', question: '369 ÷ 9 = ?', answer: '41', difficulty: 2, topic: '除数是一位数的除法', grade: 3 },
    { id: 'g3-div-8', type: 'calc', question: '455 ÷ 7 = ?', answer: '65', difficulty: 2, topic: '除数是一位数的除法', grade: 3 },
    { id: 'g3-div-9', type: 'calc', question: '516 ÷ 6 = ?', answer: '86', difficulty: 2, topic: '除数是一位数的除法', grade: 3 },
    { id: 'g3-div-10', type: 'calc', question: '784 ÷ 8 = ?', answer: '98', difficulty: 2, topic: '除数是一位数的除法', grade: 3 },
  ],
  'g3-perimeter': [
    { id: 'g3-per-1', type: 'calc', question: '长8cm，宽5cm的长方形，周长是多少厘米？', answer: '26', difficulty: 1, topic: '周长', grade: 3, hint: '(长+宽)×2' },
    { id: 'g3-per-2', type: 'calc', question: '长12cm，宽6cm的长方形，周长是多少厘米？', answer: '36', difficulty: 1, topic: '周长', grade: 3 },
    { id: 'g3-per-3', type: 'calc', question: '边长9cm的正方形，周长是多少厘米？', answer: '36', difficulty: 1, topic: '周长', grade: 3 },
    { id: 'g3-per-4', type: 'calc', question: '边长15cm的正方形，周长是多少厘米？', answer: '60', difficulty: 1, topic: '周长', grade: 3 },
    { id: 'g3-per-5', type: 'calc', question: '长方形周长26cm，长8cm，宽是多少厘米？', answer: '5', difficulty: 2, topic: '周长逆运算', grade: 3 },
    { id: 'g3-per-6', type: 'calc', question: '正方形周长48cm，边长是多少厘米？', answer: '12', difficulty: 2, topic: '周长逆运算', grade: 3 },
    { id: 'g3-per-7', type: 'calc', question: '长10m，宽7m的长方形，周长是多少米？', answer: '34', difficulty: 1, topic: '周长', grade: 3 },
    { id: 'g3-per-8', type: 'calc', question: '用铁丝围一个边长6cm的正方形，需要多长的铁丝？', answer: '24', difficulty: 1, topic: '周长应用', grade: 3 },
  ],
  'g3-area': [
    { id: 'g3-area-1', type: 'calc', question: '长8cm，宽5cm的长方形，面积是多少平方厘米？', answer: '40', difficulty: 1, topic: '面积', grade: 3 },
    { id: 'g3-area-2', type: 'calc', question: '长12cm，宽6cm的长方形，面积是多少平方厘米？', answer: '72', difficulty: 1, topic: '面积', grade: 3 },
    { id: 'g3-area-3', type: 'calc', question: '边长9cm的正方形，面积是多少平方厘米？', answer: '81', difficulty: 1, topic: '面积', grade: 3 },
    { id: 'g3-area-4', type: 'calc', question: '边长7cm的正方形，面积是多少平方厘米？', answer: '49', difficulty: 1, topic: '面积', grade: 3 },
    { id: 'g3-area-5', type: 'calc', question: '3平方米 = （ ）平方分米', answer: '300', difficulty: 2, topic: '单位换算', grade: 3 },
    { id: 'g3-area-6', type: 'calc', question: '500平方厘米 = （ ）平方分米', answer: '5', difficulty: 2, topic: '单位换算', grade: 3 },
    { id: 'g3-area-7', type: 'calc', question: '长方形面积48平方厘米，长8cm，宽是多少厘米？', answer: '6', difficulty: 2, topic: '面积逆运算', grade: 3 },
    { id: 'g3-area-8', type: 'calc', question: '正方形面积64平方厘米，边长是多少厘米？', answer: '8', difficulty: 2, topic: '面积逆运算', grade: 3 },
  ],
  'g3-fractions-intro': [
    { id: 'g3-frac-1', type: 'choice', question: '下面哪个分数最大？', options: ['1/2', '1/3', '1/4', '1/5'], answer: '1/2', difficulty: 1, topic: '分数大小比较', grade: 3 },
    { id: 'g3-frac-2', type: 'calc', question: '2/5 和 3/5，哪个大？', answer: '3/5', difficulty: 1, topic: '分数大小比较', grade: 3 },
    { id: 'g3-frac-3', type: 'calc', question: '1/4 + 2/4 = ?', answer: '3/4', difficulty: 1, topic: '同分母分数加法', grade: 3 },
    { id: 'g3-frac-4', type: 'calc', question: '5/6 - 3/6 = ?', answer: '2/6=1/3', difficulty: 2, topic: '同分母分数减法', grade: 3 },
    { id: 'g3-frac-5', type: 'calc', question: '把一个蛋糕平均分成8份，小明吃了3份，他吃了这个蛋糕的几分之几？', answer: '3/8', difficulty: 1, topic: '分数意义', grade: 3 },
    { id: 'g3-frac-6', type: 'calc', question: '1里面有（ ）个 1/4', answer: '4', difficulty: 2, topic: '分数与整数', grade: 3 },
    { id: 'g3-frac-7', type: 'calc', question: '比较大小：1/3 ○ 1/5', answer: '>', difficulty: 1, topic: '分数大小比较', grade: 3 },
    { id: 'g3-frac-8', type: 'calc', question: '3/8 + 2/8 = ?', answer: '5/8', difficulty: 1, topic: '同分母分数加法', grade: 3 },
  ],
  // 四年级
  'g4-large-numbers': [
    { id: 'g4-large-1', type: 'fill', question: '读出下面的数：12,0000,0000', answer: '十二亿', difficulty: 2, topic: '大数读法', grade: 4 },
    { id: 'g4-large-2', type: 'fill', question: '写作：三千零八十万零五百', answer: '308000500', difficulty: 2, topic: '大数写法', grade: 4 },
    { id: 'g4-large-3', type: 'calc', question: '比较大小：450000 ○ 45万', answer: '=', difficulty: 2, topic: '大数比较', grade: 4 },
    { id: 'g4-large-4', type: 'calc', question: '一个数由5个亿、3个万和6个一组成，这个数是（ ）。', answer: '500030006', difficulty: 2, topic: '数的组成', grade: 4 },
    { id: 'g4-large-5', type: 'calc', question: '5670000 ≈ （ ）万', answer: '567', difficulty: 2, topic: '近似数', grade: 4 },
    { id: 'g4-large-6', type: 'calc', question: '读出：12,5000,0000', answer: '十二亿五千万', difficulty: 2, topic: '大数读法', grade: 4 },
    { id: 'g4-large-7', type: 'calc', question: '写作：一亿二千三百四十五万', answer: '123450000', difficulty: 2, topic: '大数写法', grade: 4 },
    { id: 'g4-large-8', type: 'calc', question: '99999 + 1 = ?', answer: '100000', difficulty: 1, topic: '大数计算', grade: 4 },
  ],
  'g4-decimal-intro': [
    { id: 'g4-dec-1', type: 'calc', question: '0.8 = （ ）/10', answer: '8', difficulty: 1, topic: '小数与分数', grade: 4 },
    { id: 'g4-dec-2', type: 'calc', question: '0.36 = （ ）/100', answer: '36', difficulty: 1, topic: '小数与分数', grade: 4 },
    { id: 'g4-dec-3', type: 'calc', question: '0.125 = （ ）/1000', answer: '125', difficulty: 2, topic: '小数与分数', grade: 4 },
    { id: 'g4-dec-4', type: 'calc', question: '把0.25化成百分数：0.25 = （ ）%', answer: '25', difficulty: 1, topic: '小数与百分数', grade: 4 },
    { id: 'g4-dec-5', type: 'calc', question: '把0.6化成百分数：0.6 = （ ）%', answer: '60', difficulty: 1, topic: '小数与百分数', grade: 4 },
    { id: 'g4-dec-6', type: 'calc', question: '比较大小：0.45 ○ 0.5', answer: '<', difficulty: 1, topic: '小数大小比较', grade: 4 },
    { id: 'g4-dec-7', type: 'calc', question: '比较大小：3.25 ○ 3.52', answer: '<', difficulty: 1, topic: '小数大小比较', grade: 4 },
    { id: 'g4-dec-8', type: 'calc', question: '0.8元 = （ ）角', answer: '8', difficulty: 1, topic: '小数应用', grade: 4 },
  ],
  'g4-triangle': [
    { id: 'g4-tri-1', type: 'calc', question: '一个三角形，两个角分别是50°和60°，第三个角是多少度？', answer: '70', difficulty: 2, topic: '三角形内角和', grade: 4 },
    { id: 'g4-tri-2', type: 'calc', question: '等边三角形的每个角是多少度？', answer: '60', difficulty: 1, topic: '等边三角形', grade: 4 },
    { id: 'g4-tri-3', type: 'choice', question: '下面的角，哪个是锐角？', options: ['89°', '90°', '91°', '180°'], answer: '89°', difficulty: 1, topic: '角的分类', grade: 4 },
    { id: 'g4-tri-4', type: 'calc', question: '直角三角形的一个锐角是35°，另一个锐角是多少度？', answer: '55', difficulty: 2, topic: '三角形内角和', grade: 4 },
    { id: 'g4-tri-5', type: 'calc', question: '等腰三角形顶角是100°，底角各是多少度？', answer: '40', difficulty: 2, topic: '等腰三角形', grade: 4 },
    { id: 'g4-tri-6', type: 'choice', question: '三角形两边长分别是3cm和5cm，第三边可能是多少？', options: ['2cm', '8cm', '6cm', '10cm'], answer: '6cm', difficulty: 3, topic: '三角形特性', grade: 4, hint: '两边之和大于第三边' },
    { id: 'g4-tri-7', type: 'calc', question: '一个等腰三角形，周长20cm，底边6cm，腰长多少厘米？', answer: '7', difficulty: 2, topic: '等腰三角形', grade: 4 },
  ],
  // 五年级
  'g5-equation-problems': [
    { id: 'g5-eq-1', type: 'calc', question: '解方程：x + 5 = 12', answer: 'x=7', difficulty: 1, topic: '简单方程', grade: 5 },
    { id: 'g5-eq-2', type: 'calc', question: '解方程：x - 8 = 15', answer: 'x=23', difficulty: 1, topic: '简单方程', grade: 5 },
    { id: 'g5-eq-3', type: 'calc', question: '解方程：3x = 24', answer: 'x=8', difficulty: 1, topic: '简单方程', grade: 5 },
    { id: 'g5-eq-4', type: 'calc', question: '解方程：x ÷ 5 = 7', answer: 'x=35', difficulty: 1, topic: '简单方程', grade: 5 },
    { id: 'g5-eq-5', type: 'calc', question: '解方程：2x + 3 = 13', answer: 'x=5', difficulty: 2, topic: '稍复杂方程', grade: 5 },
    { id: 'g5-eq-6', type: 'word', question: '小明买了3本笔记本，每本x元，一共花了42元。求每本多少钱。', answer: 'x=14', difficulty: 2, topic: '方程应用', grade: 5, hint: '列方程3x=42' },
    { id: 'g5-eq-7', type: 'word', question: '小红有x颗糖，给了朋友5颗后，还剩12颗。原来有多少颗？', answer: 'x=17', difficulty: 2, topic: '方程应用', grade: 5 },
    { id: 'g5-eq-8', type: 'calc', question: '解方程：5x - 8 = 22', answer: 'x=6', difficulty: 2, topic: '稍复杂方程', grade: 5 },
  ],
  'g5-fraction-ops': [
    { id: 'g5-frac-1', type: 'calc', question: '1/4 + 1/4 = ?', answer: '1/2', difficulty: 1, topic: '同分母分数加法', grade: 5 },
    { id: 'g5-frac-2', type: 'calc', question: '3/5 - 1/5 = ?', answer: '2/5', difficulty: 1, topic: '同分母分数减法', grade: 5 },
    { id: 'g5-frac-3', type: 'calc', question: '1/2 + 1/3 = ?', answer: '5/6', difficulty: 2, topic: '异分母分数加法', grade: 5 },
    { id: 'g5-frac-4', type: 'calc', question: '3/4 - 1/6 = ?', answer: '7/12', difficulty: 2, topic: '异分母分数减法', grade: 5 },
    { id: 'g5-frac-5', type: 'calc', question: '2/5 + 3/7 = ?（化成最简分数）', answer: '29/35', difficulty: 3, topic: '异分母分数加法', grade: 5 },
    { id: 'g5-frac-6', type: 'calc', question: '5/6 - 1/4 = ?（化成最简分数）', answer: '7/12', difficulty: 2, topic: '异分母分数减法', grade: 5 },
    { id: 'g5-frac-7', type: 'calc', question: '1/2 + 1/4 = ?', answer: '3/4', difficulty: 2, topic: '异分母分数加法', grade: 5 },
    { id: 'g5-frac-8', type: 'calc', question: '2/3 + 1/6 = ?', answer: '5/6', difficulty: 2, topic: '异分母分数加法', grade: 5 },
  ],
  'g5-polygon-area': [
    { id: 'g5-poly-1', type: 'calc', question: '平行四边形底8cm，高5cm，面积是多少？', answer: '40', difficulty: 1, topic: '平行四边形面积', grade: 5 },
    { id: 'g5-poly-2', type: 'calc', question: '三角形底6dm，高4dm，面积是多少？', answer: '12', difficulty: 1, topic: '三角形面积', grade: 5 },
    { id: 'g5-poly-3', type: 'calc', question: '梯形上底3cm，下底7cm，高4cm，面积是多少？', answer: '20', difficulty: 2, topic: '梯形面积', grade: 5 },
    { id: 'g5-poly-4', type: 'calc', question: '三角形面积12平方厘米，底4cm，高是多少？', answer: '6', difficulty: 2, topic: '三角形面积逆运算', grade: 5 },
    { id: 'g5-poly-5', type: 'calc', question: '平行四边形面积24平方厘米，底6cm，高是多少？', answer: '4', difficulty: 2, topic: '平行四边形面积逆运算', grade: 5 },
    { id: 'g5-poly-6', type: 'calc', question: '梯形面积30平方厘米，上底4cm，下底6cm，高是多少？', answer: '3', difficulty: 2, topic: '梯形面积逆运算', grade: 5 },
  ],
  // 六年级
  'g6-percent': [
    { id: 'g6-pct-1', type: 'calc', question: '75% = （ ）/（ ）', answer: '3/4', difficulty: 1, topic: '百分数化分数', grade: 6 },
    { id: 'g6-pct-2', type: 'calc', question: '2/5 = （ ）%', answer: '40', difficulty: 1, topic: '分数化百分数', grade: 6 },
    { id: 'g6-pct-3', type: 'calc', question: '把0.6化成百分数：0.6 = （ ）%', answer: '60', difficulty: 1, topic: '小数化百分数', grade: 6 },
    { id: 'g6-pct-4', type: 'calc', question: '把125%化成小数：125% = （ ）', answer: '1.25', difficulty: 1, topic: '百分数化小数', grade: 6 },
    { id: 'g6-pct-5', type: 'calc', question: '50% of 80 = ?', answer: '40', difficulty: 1, topic: '百分数应用', grade: 6 },
    { id: 'g6-pct-6', type: 'calc', question: '25% of 48 = ?', answer: '12', difficulty: 1, topic: '百分数应用', grade: 6 },
    { id: 'g6-pct-7', type: 'word', question: '一件衣服原价200元，打8折后是多少元？', answer: '160', difficulty: 2, topic: '折扣问题', grade: 6 },
    { id: 'g6-pct-8', type: 'word', question: '某种商品原价150元，现价120元，降价了百分之几？', answer: '20', difficulty: 2, topic: '百分数应用', grade: 6 },
  ],
  'g6-circle': [
    { id: 'g6-circle-1', type: 'calc', question: '圆的半径3cm，周长是多少？（π取3.14）', answer: '18.84', difficulty: 1, topic: '圆周长', grade: 6 },
    { id: 'g6-circle-2', type: 'calc', question: '圆的半径5cm，面积是多少？（π取3.14）', answer: '78.5', difficulty: 1, topic: '圆面积', grade: 6 },
    { id: 'g6-circle-3', type: 'calc', question: '圆的直径8dm，周长是多少？（π取3.14）', answer: '25.12', difficulty: 1, topic: '圆周长', grade: 6 },
    { id: 'g6-circle-4', type: 'calc', question: '圆的直径10cm，面积是多少？（π取3.14）', answer: '78.5', difficulty: 1, topic: '圆面积', grade: 6 },
    { id: 'g6-circle-5', type: 'calc', question: '圆的半径是（ ）时，周长是18.84cm（π取3.14）', answer: '3', difficulty: 2, topic: '圆周长逆运算', grade: 6 },
    { id: 'g6-circle-6', type: 'calc', question: '圆的面积314平方厘米，半径是多少？（π取3.14）', answer: '10', difficulty: 2, topic: '圆面积逆运算', grade: 6 },
    { id: 'g6-circle-7', type: 'calc', question: '大圆半径6cm，小圆半径3cm，大圆面积是小圆的多少倍？', answer: '4', difficulty: 2, topic: '圆面积应用', grade: 6 },
  ],
  'g6-proportion': [
    { id: 'g6-prop-1', type: 'choice', question: '单价一定，总价和数量成什么比例？', options: ['正比例', '反比例', '不成比例'], answer: '正比例', difficulty: 1, topic: '正反比例', grade: 6 },
    { id: 'g6-prop-2', type: 'choice', question: '路程一定，速度和时间成什么比例？', options: ['正比例', '反比例', '不成比例'], answer: '反比例', difficulty: 1, topic: '正反比例', grade: 6 },
    { id: 'g6-prop-3', type: 'calc', question: '判断：工作总量=工作效率×工作时间，工作效率一定时，工作总量和工作时间成（ ）比例', answer: '正', difficulty: 2, topic: '正反比例', grade: 6 },
    { id: 'g6-prop-4', type: 'calc', question: '判断：长方形面积=长×宽，长一定时，面积和宽成（ ）比例', answer: '正', difficulty: 2, topic: '正反比例', grade: 6 },
    { id: 'g6-prop-5', type: 'calc', question: '判断：圆的周长=π×直径，直径和周长成（ ）比例', answer: '正', difficulty: 2, topic: '正反比例', grade: 6 },
    { id: 'g6-prop-6', type: 'calc', question: '判断：给病人打点滴，每分钟滴数相同，时间和药液体积成（ ）比例', answer: '正', difficulty: 2, topic: '正反比例', grade: 6 },
  ],
}

// 获取指定主题的题目
export function getQuestionsByTopic(slug: string): Question[] {
  return QUESTION_BANK[slug] || []
}

// 获取指定年级的所有题目
export function getQuestionsByGrade(grade: number): Question[] {
  const questions: Question[] = []
  for (const topicQuestions of Object.values(QUESTION_BANK)) {
    const filtered = topicQuestions.filter(q => q.grade === grade)
    questions.push(...filtered)
  }
  return questions
}

// 随机获取指定数量的题目
export function getRandomQuestions(count: number, grade?: number): Question[] {
  let pool: Question[]
  
  if (grade) {
    pool = getQuestionsByGrade(grade)
  } else {
    pool = Object.values(QUESTION_BANK).flat()
  }
  
  // 按难度分组，确保题目多样性
  const easy = pool.filter(q => q.difficulty === 1)
  const medium = pool.filter(q => q.difficulty === 2)
  const hard = pool.filter(q => q.difficulty === 3)
  
  const result: Question[] = []
  const ratio = { easy: 0.5, medium: 0.35, hard: 0.15 }
  
  // 随机选择
  const shuffle = (arr: Question[]) => [...arr].sort(() => Math.random() - 0.5)
  
  result.push(...shuffle(easy).slice(0, Math.floor(count * ratio.easy)))
  result.push(...shuffle(medium).slice(0, Math.floor(count * ratio.medium)))
  result.push(...shuffle(hard).slice(0, Math.floor(count * ratio.hard)))
  
  // 如果还不够，随机补充
  const remaining = count - result.length
  if (remaining > 0) {
    const used = new Set(result.map(q => q.id))
    const extra = pool.filter(q => !used.has(q.id)).sort(() => Math.random() - 0.5)
    result.push(...extra.slice(0, remaining))
  }
  
  return result.sort(() => Math.random() - 0.5)
}
