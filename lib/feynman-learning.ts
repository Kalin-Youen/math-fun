// 费曼学习法 - 每个知识点的专属学习指导
export interface FeynmanStep {
  teacherPrompt: string // 老师的引导语
  studentTask: string // 学生的任务
  hint?: string // 提示
  successCriteria: string // 成功标准
}

export interface FeynmanTopic {
  title: string
  introduction: string // 知识点简介
  realLifeExample: string // 生活中的例子
  steps: FeynmanStep[] // 学习步骤
  keyPoints: string[] // 关键要点
  commonMistakes: string[] // 常见错误
  assessmentQuestions: string[] // 评估问题
}

export const feynmanTopics: Record<string, FeynmanTopic> = {
  // ========== 一年级 ==========
  'g1-1-20': {
    title: '1-20的认识',
    introduction: '数字1-20是我们认识数字的第一步。每个数字都有它独特的意义。',
    realLifeExample: '数一数你有几根手指？左手5根，右手5根，一共10根！',
    steps: [
      {
        teacherPrompt: '小朋友们，我们今天来认识数字1-20。先从1开始，1就像一根小手指。',
        studentTask: '请用手指表示数字1，然后说出"1"',
        hint: '1就是一根手指的样子',
        successCriteria: '能正确用手指数出1-20'
      },
      {
        teacherPrompt: '现在我们来数一数。数字2像什么？像两根小手指！',
        studentTask: '请用手指数出2，然后说出"2"',
        hint: '两根手指合在一起就是2',
        successCriteria: '能准确表示2'
      },
      {
        teacherPrompt: '数字10很特别，它由"1"和"0"组成。10就像一双手！',
        studentTask: '请数出10根小棒或10根手指',
        successCriteria: '能正确数出10个物品'
      }
    ],
    keyPoints: ['数字1-20的顺序', '数字与数量的对应', '10个一捆的概念'],
    commonMistakes: ['顺序容易颠倒', '数量数错'],
    assessmentQuestions: ['5后面是几？', '比8小1的是几？']
  },

  'g1-add-20': {
    title: '20以内加法',
    introduction: '加法就是"合起来"的意思，把两部分合并成一部分。',
    realLifeExample: '你有3颗糖，妈妈又给了你2颗，你现在有几颗糖？3+2=5！',
    steps: [
      {
        teacherPrompt: '今天我们学习加法。加法就是把东西"合起来"。看，盒子里有2个苹果，又放了3个苹果进去。',
        studentTask: '数一数，现在盒子里一共有几个苹果？',
        hint: '先把2个数清楚，再接着数后面的3个',
        successCriteria: '能说出答案是5'
      },
      {
        teacherPrompt: '很好！现在我们用手指来做加法。5加3等于多少？',
        studentTask: '伸出5根手指，再伸出3根，数一数一共有几根',
        hint: '从5开始继续数：6、7、8',
        successCriteria: '能正确计算5+3=8'
      },
      {
        teacherPrompt: '现在我们来做一个更难一点的：8+7。',
        studentTask: '先算8+2=10，再算10+5=15。所以8+7=?',
        hint: '可以用凑十法：8+2=10，7分成2和5',
        successCriteria: '能用凑十法计算'
      }
    ],
    keyPoints: ['加法的含义：合起来', '凑十法', '进位加法'],
    commonMistakes: ['忘记进位', '数错数量'],
    assessmentQuestions: ['9+5等于多少？', '你能给妈妈解释为什么3+4=7吗？']
  },

  'g1-sub-20': {
    title: '20以内减法',
    introduction: '减法就是"去掉"的意思，从总数中去掉一部分。',
    realLifeExample: '盘子里有8个饺子，小明吃了3个，还剩几个？8-3=5！',
    steps: [
      {
        teacherPrompt: '减法和加法相反，减法就是"拿走"或"去掉"。看，盘子里有5个橘子，吃掉了2个。',
        studentTask: '还剩几个橘子？请用手指数一数',
        hint: '从5开始，往回数2个：4、3',
        successCriteria: '能说出答案是3'
      },
      {
        teacherPrompt: '很好！现在我们用减法来算：7减3等于多少？',
        studentTask: '有7颗糖，吃掉了3颗，还剩几颗？',
        hint: '从7往前数：6、5、4',
        successCriteria: '能正确计算7-3=4'
      }
    ],
    keyPoints: ['减法的含义：去掉', '平十法和破十法', '不退位减法'],
    commonMistakes: ['用加法代替减法', '倒着数数出错'],
    assessmentQuestions: ['10-4等于多少？', '你能解释为什么8-3=5吗？']
  },

  'g1-compare': {
    title: '比较大小',
    introduction: '比较大小就是找出两个数谁多谁少。',
    realLifeExample: '你有5个球，我有3个球。你比我多2个球！',
    steps: [
      {
        teacherPrompt: '今天学习比较大小。比大小就是看谁多、谁少、还是一样多。',
        studentTask: '看这两堆苹果，哪堆多？',
        hint: '可以一个一个对应着数',
        successCriteria: '能正确比较'
      },
      {
        teacherPrompt: '很好！现在比较数字：5和3，哪个大？',
        studentTask: '请用手指数出5，再数出3，比较一下',
        hint: '5比3多，所以5>3',
        successCriteria: '能用">"、"<"、"="表示'
      }
    ],
    keyPoints: ['认识">"大于、"<"小于、"="等于', '一个一个对应的比较方法'],
    commonMistakes: ['">"和"<"分不清'],
    assessmentQuestions: ['8和6哪个大？', '用符号表示：4○3']
  },

  'g1-shapes': {
    title: '认识图形',
    introduction: '我们周围有很多图形，正方形、长方形、三角形、圆形...',
    realLifeExample: '魔方是正方形，手机屏幕是长方形，三角尺是三角形，硬币是圆形！',
    steps: [
      {
        teacherPrompt: '看看教室里有什么图形？黑板是什么形状？',
        studentTask: '找一找，说出它们的名字',
        hint: '黑板有4条边、4个角，是长方形',
        successCriteria: '能说出3种以上图形名称'
      },
      {
        teacherPrompt: '正方形有什么特点？',
        studentTask: '数一数正方形有几条边、几个角？每条边一样长吗？',
        hint: '正方形有4条边、4个角，每条边一样长',
        successCriteria: '能描述正方形特征'
      }
    ],
    keyPoints: ['正方形：4边4角相等', '长方形：4边对边相等', '三角形：3边3角'],
    commonMistakes: ['正方形和长方形混淆'],
    assessmentQuestions: ['正方形有几条边？', '找一找教室里有哪些是正方形？']
  },

  'g1-clock': {
    title: '认识钟表',
    introduction: '钟表帮助我们知道时间，有分针和时针。',
    realLifeExample: '早上7点起床，8点上学，12点吃午饭...时间让我们的生活有规律！',
    steps: [
      {
        teacherPrompt: '看这个钟表，短的是时针，长的是分针。时针走一格是1小时。',
        studentTask: '找出时针指着的数字，说出是几点',
        hint: '短针指着几就是几点',
        successCriteria: '能读出整点'
      },
      {
        teacherPrompt: '分针走一圈是60分钟，走一格是5分钟。现在分针指向12，表示整点。',
        studentTask: '当分针指向12，时针指向3，是几点？',
        hint: '3点整的时候，时针指向3，分针指向12',
        successCriteria: '能读写整点时间'
      }
    ],
    keyPoints: ['时针短、分针长', '整点的读法', '时间在生活中的应用'],
    commonMistakes: ['时针和分针分不清'],
    assessmentQuestions: ['3点整，时针和分针分别指向哪里？']
  },

  'g1-money': {
    title: '认识人民币',
    introduction: '人民币是我们买东西用的钱，有纸币和硬币。',
    realLifeExample: '买一个冰淇淋要5元，买一瓶水要2元...',
    steps: [
      {
        teacherPrompt: '认识这些人民币吗？1元、5元、10元、20元、50元、100元。',
        studentTask: '说出每张钱的面值',
        hint: '数字越大，钱越多',
        successCriteria: '能识别常见人民币'
      },
      {
        teacherPrompt: '你有1元和5角，能买什么东西？',
        studentTask: '1元5角可以买什么？付钱时应该怎么给？',
        hint: '1元5角 = 1元 + 5角 = 15角',
        successCriteria: '理解元角换算'
      }
    ],
    keyPoints: ['元角分的换算', '1元=10角', '简单计算价格'],
    commonMistakes: ['元角分换算混淆'],
    assessmentQuestions: ['2元等于多少角？', '你有10元，买一个6元的东西，应该找回多少？']
  },

  // ========== 二年级 ==========
  'g2-mul-table': {
    title: '乘法口诀',
    introduction: '乘法是加法的简便运算，3×5就是5个3相加。',
    realLifeExample: '一排有4个苹果，有3排，一共几个苹果？4+4+4=12，可以写成3×4=12！',
    steps: [
      {
        teacherPrompt: '乘法就是"几个几"。2×3是什么意思？',
        studentTask: '请用手指表示：2个3相加',
        hint: '2×3 = 3 + 3 = 6',
        successCriteria: '理解乘法的意义'
      },
      {
        teacherPrompt: '现在我们来背乘法口诀。从"一一得一"开始。',
        studentTask: '背诵2的乘法口诀',
        hint: '一二得二、二二得四...',
        successCriteria: '能背诵2的乘法口诀'
      },
      {
        teacherPrompt: '3×7等于多少？',
        studentTask: '用乘法口诀算出答案',
        hint: '想"三七二十一"',
        successCriteria: '能用口诀计算'
      }
    ],
    keyPoints: ['乘法的意义：几个几', '乘法口诀', '乘除法的关系'],
    commonMistakes: ['口诀背错', '不理解乘法意义'],
    assessmentQuestions: ['4×6等于多少？', '你能解释为什么3×4=12吗？']
  },

  'g2-division': {
    title: '表内除法',
    introduction: '除法是"平均分"或"包含除"，和乘法相反。',
    realLifeExample: '12个苹果平均分给3个人，每人几个？12÷3=4！',
    steps: [
      {
        teacherPrompt: '除法就是把东西平均分。6颗糖分给2个小朋友，每人几颗？',
        studentTask: '用分糖的方式来算6÷2',
        hint: '每人分1颗，还剩4颗；再分1颗，还剩2颗...',
        successCriteria: '能正确平均分'
      },
      {
        teacherPrompt: '很好！现在用乘法来验证：2×3=6，所以6÷2=3。',
        studentTask: '想一想：乘法口诀中哪个和除法有关？',
        hint: '二三得六',
        successCriteria: '能用乘法口诀做除法'
      }
    ],
    keyPoints: ['平均分', '包含除', '乘除法的互逆关系'],
    commonMistakes: ['分不清楚该用哪个乘法口诀'],
    assessmentQuestions: ['15÷3等于多少？你是怎么算的？']
  },

  'g2-angle': {
    title: '角的初步认识',
    introduction: '角是由一个顶点和两条边组成的。',
    realLifeExample: '三角尺上有角，桌子角、墙角都是角！',
    steps: [
      {
        teacherPrompt: '看这个角，它有一个顶点和两条边。这两条边是直直的线。',
        studentTask: '用手指比划出一个角的样子',
        hint: '两根手指张开，像一个角的形状',
        successCriteria: '能指出角的顶点和边'
      },
      {
        teacherPrompt: '角有大小。直角是最特别的角，像三角尺上的角。',
        studentTask: '找出教室里哪些地方有直角',
        hint: '书角、桌面角、门角通常是直角',
        successCriteria: '能识别直角'
      }
    ],
    keyPoints: ['角的组成：顶点和边', '认识直角', '比较角的大小'],
    commonMistakes: ['把角的开口方向当作角的大小'],
    assessmentQuestions: ['角是由什么组成的？', '直角有什么特点？']
  },

  // ========== 三年级 ==========
  'g3-fractions-intro': {
    title: '分数的初步认识',
    introduction: '分数表示把一个整体平均分成几份，取其中的一份或几份。',
    realLifeExample: '妈妈买了一个蛋糕，平均切成4份，你吃了1份，就是吃了1/4！',
    steps: [
      {
        teacherPrompt: '什么是分数？把一个苹果平均切成2半，一半是整个苹果的几分之几？',
        studentTask: '用手指比划出1/2的大小',
        hint: '下面的是分母，表示分成2份；上面的是分子，表示取了1份',
        successCriteria: '理解分子分母的含义'
      },
      {
        teacherPrompt: '把一个蛋糕平均切成4份，取了3份，用什么分数表示？',
        studentTask: '写出这个分数',
        hint: '3/4表示取了4份中的3份',
        successCriteria: '能读写简单分数'
      },
      {
        teacherPrompt: '比较一下1/2和1/4，哪个更大？',
        studentTask: '用画图的方式比较这两个分数',
        hint: '分得越少，每一份越大',
        successCriteria: '理解同分子分数的大小比较'
      }
    ],
    keyPoints: ['分数的含义：平均分', '分子分母的作用', '简单分数的大小比较'],
    commonMistakes: ['分子分母混淆', '分母越大分数越大'],
    assessmentQuestions: ['3/5表示什么意思？', '1/2和1/4哪个更大？为什么？']
  },

  'g3-perimeter': {
    title: '长方形和正方形的周长',
    introduction: '周长就是围成一个图形所有边的总长度。',
    realLifeExample: '用绳子围着一块地走一圈，绳子有多长就是周长！',
    steps: [
      {
        teacherPrompt: '什么是周长？周长就是围成一个图形一圈的长度。',
        studentTask: '用手指沿着数学书的边线走一圈',
        hint: '数学书是长方形，有4条边',
        successCriteria: '理解周长的概念'
      },
      {
        teacherPrompt: '长方形的周长怎么算？长是6厘米，宽是4厘米。',
        studentTask: '把长方形的4条边加起来',
        hint: '长+宽+长+宽，或者(长+宽)×2',
        successCriteria: '能用两种方法计算长方形周长'
      },
      {
        teacherPrompt: '正方形的边长是5厘米，周长是多少？',
        studentTask: '正方形4条边一样长，怎么算？',
        hint: '5+5+5+5，或者5×4',
        successCriteria: '能计算正方形周长'
      }
    ],
    keyPoints: ['周长的定义', '长方形周长=(长+宽)×2', '正方形周长=边长×4'],
    commonMistakes: ['忘记×2', '单位写错'],
    assessmentQuestions: ['一个长方形长8厘米，宽5厘米，周长是多少？', '你能给弟弟妹妹解释什么是周长吗？']
  },

  'g3-area': {
    title: '面积',
    introduction: '面积就是物体表面的大小。',
    realLifeExample: '桌面的大小就是桌面的面积，地板的大小就是地板的面积！',
    steps: [
      {
        teacherPrompt: '面积和周长不一样。周长是边的长度，面积是面的大小。',
        studentTask: '用数学书测量课桌面的面积',
        hint: '用数学书作为测量单位，数一数能铺几本',
        successCriteria: '区分面积和周长'
      },
      {
        teacherPrompt: '长方形的面积怎么算？长6厘米，宽4厘米。',
        studentTask: '在草稿纸上画一画，用方格数一数',
        hint: '长×宽 = 6×4',
        successCriteria: '能用公式计算长方形面积'
      }
    ],
    keyPoints: ['面积的意义', '长方形面积=长×宽', '面积单位：平方厘米'],
    commonMistakes: ['面积和周长混淆'],
    assessmentQuestions: ['长5米、宽3米的房间，面积是多少？', '面积和周长有什么区别？']
  },

  // ========== 四年级 ==========
  'g4-decimal-intro': {
    title: '小数的意义和性质',
    introduction: '小数是分数的另一种表示形式。1.5就是1又1/2。',
    realLifeExample: '超市里商品的价格：3.5元、0.8元...这些都是小数！',
    steps: [
      {
        teacherPrompt: '什么是小数？1.5里面的"."是小数点。',
        studentTask: '把1米分成10份，每份是1分米，用小数表示是多少米？',
        hint: '1分米 = 0.1米',
        successCriteria: '理解小数的意义'
      },
      {
        teacherPrompt: '比较0.8和0.15，哪个更大？',
        studentTask: '画一条数轴，标出这两个小数的位置',
        hint: '0.8比0.5大，比1小；0.15比0.1大，比0.2小',
        successCriteria: '能比较小数大小'
      }
    ],
    keyPoints: ['小数的意义', '小数的大小比较', '小数点的移动'],
    commonMistakes: ['小数比较时只看数字大小'],
    assessmentQuestions: ['0.5和0.35哪个大？为什么？']
  },

  'g4-triangle': {
    title: '三角形',
    introduction: '三角形有3条边、3个角、3个顶点。',
    realLifeExample: '三角板、金字塔、自行车的车架都是三角形！',
    steps: [
      {
        teacherPrompt: '三角形有什么特点？数一数它有几条边、几个角、几个顶点？',
        studentTask: '画一个三角形，标出边、角、顶点',
        hint: '任意3条首尾相连的线段围成的图形',
        successCriteria: '能描述三角形的基本特征'
      },
      {
        teacherPrompt: '三角形按角分类，可以分成哪几种？',
        studentTask: '找出三种不同类型的三角形',
        hint: '直角三角形、锐角三角形、钝角三角形',
        successCriteria: '能识别三种三角形'
      }
    ],
    keyPoints: ['三角形的基本特征', '按角分类：直角、锐角、钝角', '三角形内角和180°'],
    commonMistakes: ['等边三角形和等腰三角形混淆'],
    assessmentQuestions: ['直角三角形有什么特点？', '所有三角形的内角和都是多少度？']
  },

  // ========== 五年级 ==========
  'g5-equation-problems': {
    title: '简易方程',
    introduction: '方程就是含有未知数的等式，用X表示不知道的数。',
    realLifeExample: '我有X颗糖，妈妈又给了我3颗，现在有10颗。X+3=10，X=7！',
    steps: [
      {
        teacherPrompt: '什么是方程？方程两边要相等。X+5=12，X是多少？',
        studentTask: '想一想：什么数加上5等于12？',
        hint: '12-5=7，所以X=7',
        successCriteria: '能解简单方程'
      },
      {
        teacherPrompt: '现在用等式的性质来解：X+5=12。两边同时减去5。',
        studentTask: '两边同时减去5，等式还成立吗？X等于多少？',
        hint: 'X+5-5=12-5，X=7',
        successCriteria: '能用等式性质解方程'
      }
    ],
    keyPoints: ['方程的意义', '等式性质：两边同时加减乘除同一个数', '验算'],
    commonMistakes: ['等式两边同时变换时出错'],
    assessmentQuestions: ['X-8=15，X等于多少？', '你能自己出一道方程题吗？']
  },

  'g5-fraction-ops': {
    title: '分数的加法和减法',
    introduction: '同分母分数相加减，分母不变，分子相加减。',
    realLifeExample: '吃了1/5块蛋糕，又吃了2/5块，一共吃了多少？1/5+2/5=3/5！',
    steps: [
      {
        teacherPrompt: '分数相加：2/7 + 3/7 = ? 分母相同，分子相加。',
        studentTask: '算出答案',
        hint: '2+3=5，所以答案是5/7',
        successCriteria: '能计算同分母分数加减法'
      },
      {
        teacherPrompt: '异分母分数相加：1/2 + 1/3 = ? 先要通分。',
        studentTask: '把1/2和1/3通分，变成同分母分数',
        hint: '2和3的最小公倍数是6，所以变成3/6和2/6',
        successCriteria: '理解通分的意义'
      }
    ],
    keyPoints: ['同分母分数加减法', '通分', '异分母分数加减法'],
    commonMistakes: ['通分找错最小公倍数', '分子分母同时加减'],
    assessmentQuestions: ['2/5 + 1/5等于多少？', '为什么异分母分数不能直接相加？']
  },

  // ========== 六年级 ==========
  'g6-percent': {
    title: '百分数',
    introduction: '百分数就是表示一个数是另一个数的百分之几，用%表示。',
    realLifeExample: '考试得了95分，就是100分里的95分，用95%表示！',
    steps: [
      {
        teacherPrompt: '什么是百分数？50%是什么意思？',
        studentTask: '把一个圆形平均分成100份，涂色50份',
        hint: '50%就是100份中的50份，就是一半',
        successCriteria: '理解百分数的意义'
      },
      {
        teacherPrompt: '把分数转换成百分数：1/4 = ?%',
        studentTask: '算一算1/4等于多少百分数',
        hint: '1÷4=0.25=25%',
        successCriteria: '能进行分数和小数的互化'
      },
      {
        teacherPrompt: '应用题：某班50人，近视的有20人，近视率是多少？',
        studentTask: '近视率 = 近视人数 ÷ 全班人数 × 100%',
        hint: '20÷50=0.4=40%',
        successCriteria: '能解决简单的百分数应用题'
      }
    ],
    keyPoints: ['百分数的意义', '分数、小数、百分数的互化', '百分数应用题'],
    commonMistakes: ['百分数和小数转换时丢0'],
    assessmentQuestions: ['0.75等于百分之几？', '一件衣服原价200元，打8折后是多少元？']
  },

  'g6-circle': {
    title: '圆的周长和面积',
    introduction: '圆是最美的图形，有无数条对称轴。圆周率π≈3.14。',
    realLifeExample: '自行车的轮子是圆的，钟表的表面是圆的...圆无处不在！',
    steps: [
      {
        teacherPrompt: '圆周率是什么？π是怎么来的？',
        studentTask: '用绳子绕着圆规画出的圆，量一量周长和直径',
        hint: '周长÷直径≈3.14',
        successCriteria: '理解圆周率的意义'
      },
      {
        teacherPrompt: '圆的周长公式是什么？',
        studentTask: '如果圆的直径是10厘米，周长是多少？',
        hint: 'C=πd = 3.14×10',
        successCriteria: '能计算圆的周长'
      },
      {
        teacherPrompt: '圆的面积公式是什么？',
        studentTask: '如果圆的半径是5厘米，面积是多少？',
        hint: 'S=πr² = 3.14×5×5',
        successCriteria: '能计算圆的面积'
      }
    ],
    keyPoints: ['圆周率π≈3.14', '圆周长C=πd或2πr', '圆面积S=πr²'],
    commonMistakes: ['周长和面积公式混淆', '平方忘记×r'],
    assessmentQuestions: ['半径3厘米的圆，周长和面积分别是多少？', '你能解释为什么圆的面积要乘r²吗？']
  },

  'g6-proportion': {
    title: '比例',
    introduction: '比例表示两个比相等的式子。4:2 = 6:3。',
    realLifeExample: '做蛋糕的配方：2杯面粉配1杯水，4杯面粉配2杯水，比例一样！',
    steps: [
      {
        teacherPrompt: '什么是比例？4:2和6:3这两个比相等吗？',
        studentTask: '算出两个比的比值进行比较',
        hint: '4÷2=2，6÷3=2，所以相等',
        successCriteria: '理解比例的意义'
      },
      {
        teacherPrompt: '正比例是什么意思？',
        studentTask: '速度一定，路程和时间是什么关系？',
        hint: '速度=路程÷时间，速度不变，路程越大时间越长',
        successCriteria: '理解正比例关系'
      }
    ],
    keyPoints: ['比例的意义', '正比例和反比例', '比例尺'],
    commonMistakes: ['正比例和反比例混淆'],
    assessmentQuestions: ['判断：路程一定，速度和时间成什么比例？']
  }
}

// 获取知识点的费曼学习数据
export const getFeynmanData = (slug: string): FeynmanTopic | null => {
  return feynmanTopics[slug] || null
}
