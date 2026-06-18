import type {
  Post, IssueCluster, ReplyReminder, StoreInfo, PostTag, Reply,
  TrendDirection, KeywordMatch, Confidence, StoreKeywords,
} from '@/types'

export const SERVICE_OPTIONS = [
  '火锅', '烧烤', '奶茶', '咖啡', '日料',
  '美甲', '理发', '洗车', '健身', '私房菜',
  '美容', '足疗', 'KTV', '蛋糕', '西餐',
]

export const SOURCE_MAP: Record<string, { label: string }> = {
  tieba: { label: '百度贴吧' },
  cityforum: { label: '城市论坛' },
  xiaohongshu: { label: '小红书' },
  dianping: { label: '大众点评' },
}

export const TAG_CONFIG: Record<string, { color: string; bg: string }> = {
  '排队久': { color: '#E53E3E', bg: '#FFF5F5' },
  '价格贵': { color: '#D69E2E', bg: '#FFFFF0' },
  '态度好': { color: '#38A169', bg: '#F0FFF4' },
  '环境差': { color: '#C53030', bg: '#FFF5F5' },
  '味道好': { color: '#3182CE', bg: '#EBF8FF' },
  '推荐': { color: '#38A169', bg: '#F0FFF4' },
  '差评': { color: '#E53E3E', bg: '#FFF5F5' },
  '卫生问题': { color: '#805AD5', bg: '#FAF5FF' },
  '态度差': { color: '#E53E3E', bg: '#FFF5F5' },
}

export const STRATEGY_CONFIG: Record<string, { color: string; bg: string }> = {
  '道歉': { color: '#E53E3E', bg: '#FFF5F5' },
  '解释': { color: '#3182CE', bg: '#EBF8FF' },
  '邀请体验': { color: '#38A169', bg: '#F0FFF4' },
  '整改': { color: '#D69E2E', bg: '#FFFFF0' },
  '观察': { color: '#718096', bg: '#F7FAFC' },
}

export const RISK_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  high: { color: '#E53E3E', bg: '#FFF5F5', label: '高风险' },
  medium: { color: '#D69E2E', bg: '#FFFFF0', label: '中风险' },
  low: { color: '#38A169', bg: '#F0FFF4', label: '低风险' },
}

export const CONFIDENCE_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  high: { color: '#38A169', bg: '#F0FFF4', label: '高匹配' },
  medium: { color: '#D69E2E', bg: '#FFFFF0', label: '中匹配' },
  low: { color: '#E53E3E', bg: '#FFF5F5', label: '低置信度' },
}

export const DIMENSION_CONFIG: Record<string, { color: string; label: string }> = {
  '排队': { color: '#E53E3E', label: '排队等位' },
  '价格': { color: '#D69E2E', label: '价格价值' },
  '服务': { color: '#3182CE', label: '服务态度' },
  '环境': { color: '#805AD5', label: '环境卫生' },
  '产品': { color: '#38A169', label: '产品品质' },
}

interface IndustryTemplate {
  dishWords: string[]
  staff: string[]
  action: string
  customerWords: string[]
  landmarks?: string[]
  peakScenes?: string[]
  complaintTemplates: {
    title: string
    content: string
    tags: PostTag[]
    sentiment: 'positive' | 'negative' | 'neutral'
    containsBoss: boolean
    containsDish: number[]
    sceneHint?: 'weekend' | 'evening' | 'workday' | 'lunch'
  }[]
  praiseTemplates: {
    title: string
    content: string
    tags: PostTag[]
    containsBoss: boolean
    containsDish: number[]
    sceneHint?: 'weekend' | 'evening' | 'workday' | 'lunch'
  }[]
}

const TEMPLATES: Record<string, IndustryTemplate> = {
  '火锅': {
    dishWords: ['毛肚', '鸳鸯锅', '牛油锅底', '涮羊肉', '蘸料', '肥牛', '鹅肠'],
    staff: ['服务员', '加汤员', '店员'],
    action: '加汤',
    customerWords: ['火锅爱好者', '辣友', '吃货小王', '涮肉达人'],
    landmarks: ['万达广场', '地铁口出来50米', '步行街入口', '美食街第三家', '写字楼B1层', '电影院旁边'],
    peakScenes: ['周五晚上七点', '周六中午', '周日晚高峰', '下班高峰六点半', '节假日排队'],
    complaintTemplates: [
      { title: '周末去{n}排了两小时', content: '上周六在{l}附近逛，七点到{n}，前面47桌！足足等了两个小时，{p}名不虚传。味道确实不错，但等位期间没人来倒柠檬水。建议搞个取号系统或线上预约。', tags: ['排队久'], sentiment: 'negative', containsBoss: false, containsDish: [0], sceneHint: 'weekend' },
      { title: '{n}环境越来越差', content: '昨晚下班和同事去{n}，一进去就是油烟味，地上油腻腻差点滑倒。桌椅也是脏的，喊了三次才有人来擦。卫生间简直噩梦级别。', tags: ['环境差', '卫生问题'], sentiment: 'negative', containsBoss: false, containsDish: [2], sceneHint: 'evening' },
      { title: '{n}涨价也太猛了', content: '之前{n}的{dish}套餐才198，这周去直接变298？问店员说升级了食材，但吃出来一模一样。感觉变相涨价，老顾客很失望。', tags: ['价格贵'], sentiment: 'negative', containsBoss: false, containsDish: [0, 1] },
      { title: '{n}服务员态度太差', content: '找{staff}加汤等了20分钟，后来直接喊老板{boss}才有人理。结账时还算错了，多收一份{dish}的钱。体验大打折扣。', tags: ['态度差', '差评'], sentiment: 'negative', containsBoss: true, containsDish: [0] },
      { title: '周末等位真的太久了', content: '上周末去{n}，{d}附近所有店都爆满，但这家特别夸张。排了一个半小时，期间{staff}连个取号牌都没给，我差点以为被遗忘了。', tags: ['排队久'], sentiment: 'negative', containsBoss: false, containsDish: [3], sceneHint: 'weekend' },
    ],
    praiseTemplates: [
      { title: '{n}的{dish}太绝了！', content: '朋友推荐来的{n}，在{l}那边位置很好找。{dish}真的入口即化！{boss}人超好，亲自来推荐了当天的鲜切肉。分量足两个人吃很撑，强烈推荐！', tags: ['味道好', '推荐'], containsBoss: true, containsDish: [0] },
      { title: '被{boss}圈粉了！', content: '第一次去{n}，{boss}人超热情！推荐的{dish}没让我失望，{staff}加汤很及时。环境虽然烟火气但挺舒服，体验感满分！', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [1] },
      { title: '{n}的{dish}确实好', content: '第三次来{n}，{dish}每次都很新鲜，辣度刚好。{staff}服务也不错，{boss}还记得我上次来过，这种老顾客感真的加分。', tags: ['味道好', '态度好'], containsBoss: true, containsDish: [0, 2] },
    ],
  },

  '理发': {
    dishWords: ['男士油头', '女士锁骨发', '法式刘海', '烫发', '染发', '头皮护理', '剪发'],
    staff: ['托尼老师', '助理小哥哥', '洗发小哥'],
    action: '洗头',
    customerWords: ['造型控', '发型达人', '烫发女生', '油头男孩'],
    landmarks: ['小区楼下', '大学城', '商场二楼', '地铁口出来50米', '写字楼12楼', '购物中心三楼'],
    peakScenes: ['周六下午', '周末约满', '下班之后', '周五晚上', '周末客流'],
    complaintTemplates: [
      { title: '{n}周末预约全部满员', content: '上周六在{l}，想剪头发，打{n}电话说预约全满，要排队等2小时。{p}真的夸张。现场去了发现人挤人，{staff}都忙不过来。理发店就不能多请几个技师？', tags: ['排队久'], sentiment: 'negative', containsBoss: false, containsDish: [6], sceneHint: 'weekend' },
      { title: '{n}做{dish}被加价', content: '约{n}做{dish}，原本说398，做完要我付698，说加了进口药水但根本没跟我确认。{boss}还说大家都这个价，气得我差点报警。', tags: ['价格贵', '差评'], sentiment: 'negative', containsBoss: true, containsDish: [3] },
      { title: '{n}的{staff}技术太差', content: '想做{dish}结果完全剪毁了，我说的是锁骨以下，他给我剪到下巴。找{boss}理论，说免费帮我修但我已经不敢了。', tags: ['态度差', '差评'], sentiment: 'negative', containsBoss: true, containsDish: [1] },
      { title: '{n}环境真的需要整顿', content: '店里满地头发渣都不清，{action}池的毛巾看起来脏兮兮的。{staff}戴的围裙有明显污渍。虽然剪得还行，但这个卫生真的不行。', tags: ['环境差', '卫生问题'], sentiment: 'negative', containsBoss: false, containsDish: [6] },
      { title: '洗头时推销产品烦死了', content: '去{n}{action}，{staff}全程在推销办卡和护发产品。我都说了不要还一个劲说，烦死了。最后{boss}又来推销一遍，下次不来了。', tags: ['态度差'], sentiment: 'negative', containsBoss: true, containsDish: [5] },
    ],
    praiseTemplates: [
      { title: '{boss}真的会剪！推荐{n}', content: '找{boss}做的{dish}，效果超出预期！全程没有推销，沟通特别顺畅。{staff}手法也很专业，环境舒服。强烈推荐！', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [2] },
      { title: '{n}的{dish}真的好', content: '终于在{d}附近找到一家靠谱的！就在{l}旁边，{boss}剪发技术棒，做出来的{dish}跟图片一模一样，朋友都说好看。', tags: ['推荐'], containsBoss: true, containsDish: [0] },
      { title: '{boss}的{dish}做得超自然', content: '第一次做{dish}选了{n}，{boss}给我设计的款式很适合我的脸型，不是那种很假的卷。{staff}服务也好，{action}时按摩超舒服。', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [3] },
    ],
  },

  '美甲': {
    dishWords: ['法式美甲', '日式光疗', '猫眼甲', '延长甲', '手部护理', '渐变美甲', '雕花'],
    staff: ['美甲师', '小姐姐', '前台'],
    action: '修手',
    customerWords: ['美甲控Lily', '指尖艺术家', '猫眼爱好者', '延长甲狂人'],
    complaintTemplates: [
      { title: '周末{n}约不到位', content: '想做{dish}，打{n}三天前就预约满了。现场去了说要等3小时，美甲师都在忙。建议加几个位或者分时段预约。', tags: ['排队久'], sentiment: 'negative', containsBoss: false, containsDish: [0] },
      { title: '{n}价格翻倍了？', content: '上个月{n}的{dish}还是198，这周去直接变398，说升级了进口胶但我做出来一模一样。问{boss}说物价涨了，这个涨幅太离谱。', tags: ['价格贵'], sentiment: 'negative', containsBoss: true, containsDish: [1] },
      { title: '{n}做的{dish}一周就掉', content: '才一周，{dish}就掉了三个。找{n}说我自己碰的，{boss}态度特别差，说修补要加钱。这种质量还这态度，一生黑。', tags: ['态度差', '差评'], sentiment: 'negative', containsBoss: true, containsDish: [2] },
      { title: '{n}工具都不消毒', content: '做{dish}的时候，看到{n}的{staff}从一个盒子里拿出锉刀，直接就用，根本没消毒。上次做完指甲边缘就发炎了，{boss}说不是他们的问题。', tags: ['卫生问题'], sentiment: 'negative', containsBoss: true, containsDish: [0] },
    ],
    praiseTemplates: [
      { title: '{boss}的{dish}太美了！', content: '在{n}找{boss}做的{dish}，颜色和花型都做得超精致。全程不推销，{staff}还帮我存了款式图。强烈推荐！', tags: ['推荐', '态度好'], containsBoss: true, containsDish: [0] },
      { title: '{n}的{dish}保持超久', content: '做的{dish}都快三周了，完全没掉边。{boss}技术真的好，{staff}也很细心。{action}做的也很舒服，办了张卡。', tags: ['态度好'], containsBoss: true, containsDish: [1] },
    ],
  },

  '洗车': {
    dishWords: ['精洗', '打蜡', '内饰清洁', '镀膜', '轮胎上光', '发动机清洁', '普洗'],
    staff: ['洗车小哥', '前台', '师傅'],
    action: '擦车',
    customerWords: ['车主联盟', '爱车族', '精洗控', '老司机'],
    complaintTemplates: [
      { title: '{n}洗车排队长态度差', content: '今天去{n}，等了40分钟，{dish}居然收80元！以前才50。最气的是洗完车门上还有水渍，找{staff}说一句，居然说就这样不满意别来。', tags: ['排队久', '价格贵', '态度差'], sentiment: 'negative', containsBoss: false, containsDish: [6] },
      { title: '{n}精洗做的太敷衍', content: '花200做{dish}，后备箱根本没动，脚垫上还有沙子。找{boss}，说200的精洗就这水平，无语了。', tags: ['价格贵', '差评'], sentiment: 'negative', containsBoss: true, containsDish: [0] },
      { title: '{n}排队管理混乱', content: '周六去{n}，等了一个半小时，有人后来的都先洗了。问{staff}说人家是会员，普通客户就该等？{boss}出来也不给解释。', tags: ['排队久', '态度差'], sentiment: 'negative', containsBoss: true, containsDish: [6] },
    ],
    praiseTemplates: [
      { title: '{boss}的{n}洗的真干净', content: '在{d}附近对比了好几家，{boss}家的{n}最实在。{dish}做得很细，{staff}连轮毂缝都擦了。性价比高，办了卡。', tags: ['推荐'], containsBoss: true, containsDish: [0] },
      { title: '{n}做{dish}效果惊艳', content: '第一次做{dish}，{boss}全程盯着做，做完车亮得像新车。{staff}服务也不错，休息室还有咖啡。值得。', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [3] },
    ],
  },

  '健身': {
    dishWords: ['私教课程', '年卡', '动感单车', '瑜伽课', '跑步机', '自由重量', '团课'],
    staff: ['私教', '前台', '会籍顾问'],
    action: '锻炼',
    customerWords: ['健身小白', '撸铁达人', '瑜伽妹子', '减脂党'],
    complaintTemplates: [
      { title: '{n}私教疯狂推销', content: '去{n}办卡，{staff}全程推{dish}，我明确拒绝还一直跟着。{boss}过来又推一遍，锻炼的心情都没了。', tags: ['态度差'], sentiment: 'negative', containsBoss: true, containsDish: [0] },
      { title: '{n}卫生堪忧器材脏', content: '{n}的器材上全是汗渍，消毒液见底了没人补。更衣室地上到处湿毛巾和头发，垃圾桶都溢出来了。交年卡的钱就这环境？', tags: ['环境差', '卫生问题'], sentiment: 'negative', containsBoss: false, containsDish: [5] },
      { title: '{n}高峰时段{dish}抢不到', content: '晚上7点去{n}，{dish}区全满，排队等了40分钟。{staff}说高峰都这样，但这个{staff}人数明显不够啊。', tags: ['排队久'], sentiment: 'negative', containsBoss: false, containsDish: [4] },
      { title: '{n}年卡说涨价就涨价', content: '之前办的{dish}是2880，续费突然变成4880，说加了{dish}但我根本用不上。{boss}说爱续不续，被恶心到了。', tags: ['价格贵', '差评'], sentiment: 'negative', containsBoss: true, containsDish: [1, 6] },
    ],
    praiseTemplates: [
      { title: '{boss}的{dish}真的专业', content: '在{n}上{boss}的{dish}，一个月体脂降了5个点！全程不推销，动作纠正特别到位。{staff}也很nice，器械一直有人擦。', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [0] },
      { title: '{n}的{dish}课太好玩了', content: '每周都来上{dish}，{staff}很会带动气氛，{boss}偶尔也来上课。环境不错，器械维护的很好。', tags: ['推荐'], containsBoss: true, containsDish: [2] },
    ],
  },

  '奶茶': {
    dishWords: ['芋泥啵啵', '杨枝甘露', '多肉葡萄', '珍珠奶茶', '芝士奶盖', '水果茶', '焦糖奶茶'],
    staff: ['点单员', '吧台小姐姐', '店员'],
    action: '做奶茶',
    customerWords: ['奶茶续命', '芋泥控', '奶盖达人', '果茶少女'],
    complaintTemplates: [
      { title: '周末{n}等位一小时起', content: '周末想去{n}坐坐，结果告诉我至少等一小时！队伍排到隔壁店了。里面明明有空桌不知道在等什么。管理太混乱。', tags: ['排队久'], sentiment: 'negative', containsBoss: false, containsDish: [3] },
      { title: '{n}的{dish}越做越淡', content: '买了杯{dish}，感觉喝白开水一样，完全没有之前的味道。找{staff}说就是这个配方，{boss}也不管。花冤枉钱。', tags: ['差评'], sentiment: 'negative', containsBoss: true, containsDish: [0] },
      { title: '{n}一杯{dish}快40了', content: '加个奶盖加个芋圆，{n}的{dish}居然38了？我记得上个月才30。这个涨幅太夸张，而且量还少了。', tags: ['价格贵'], sentiment: 'negative', containsBoss: false, containsDish: [4] },
    ],
    praiseTemplates: [
      { title: '{n}的{dish}真的绝', content: '在{d}附近最好喝的{dish}！{boss}人超nice，加料从来不手抖。{staff}也很快，高峰期也不用等太久。', tags: ['推荐'], containsBoss: true, containsDish: [0] },
      { title: '{boss}记得老顾客口味！', content: '常去{n}买{dish}，{boss}居然记得我半糖少冰加珍珠。这种细节真的打动人。{staff}服务也很好。', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [3] },
    ],
  },

  '咖啡': {
    dishWords: ['手冲耶加雪菲', '冰美式', '榛果拿铁', 'dirty', '桂花拿铁', '冷萃', '卡布奇诺'],
    staff: ['咖啡师', '吧台小哥', '店员'],
    action: '做咖啡',
    customerWords: ['咖啡与猫', '手冲控', '拿铁爱好者', '咖啡因续命'],
    complaintTemplates: [
      { title: '{n}一杯{dish}要45，抢钱？', content: '新开业时去的{n}，{dish}才35，现在直接45。环境确实好，但这个价格在{d}这一片真的偏高了。', tags: ['价格贵'], sentiment: 'negative', containsBoss: false, containsDish: [0] },
      { title: '{n}高峰排队40分钟', content: '中午去{n}买杯{dish}，前面20杯，等了40分钟。{staff}做的速度慢还一直聊天。{boss}也不帮忙。', tags: ['排队久', '态度差'], sentiment: 'negative', containsBoss: true, containsDish: [1] },
      { title: '{n}的{dish}味道像刷锅水', content: '点的{dish}，又酸又涩，完全不像上次的。{staff}说换豆子了但没提前告知。{boss}说不喜欢下次别来。', tags: ['态度差', '差评'], sentiment: 'negative', containsBoss: true, containsDish: [2] },
    ],
    praiseTemplates: [
      { title: '{boss}的{dish}太专业了', content: '在{n}喝{boss}做的{dish}，冲煮参数都跟你讲，风味描述特别到位。{staff}也很懂豆子，环境舒服适合办公。', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [0] },
      { title: '{n}的环境和{dish}都赞', content: '工业风的装修，{dish}拉花超好看。{boss}时不时来聊天，聊了很多咖啡知识。{staff}也热情，会再来。', tags: ['推荐'], containsBoss: true, containsDish: [2] },
    ],
  },

  '烧烤': {
    dishWords: ['烤羊肉串', '烤茄子', '烤生蚝', '烤韭菜', '烤五花肉', '烤鸡翅', '锡纸粉丝'],
    staff: ['烤串师傅', '服务员', '传菜小哥'],
    action: '烤串',
    customerWords: ['深夜觅食者', '烧烤老炮', '撸串达人', '啤酒爱好者'],
    complaintTemplates: [
      { title: '{n}的环境脏乱差', content: '昨晚去{n}吃{dish}，一进去就是油烟味，桌上油乎乎的，地上全是纸巾竹签。{staff}也不来擦，喊了半天才理。', tags: ['环境差', '卫生问题'], sentiment: 'negative', containsBoss: false, containsDish: [0] },
      { title: '{n}等位等疯了', content: '周五晚上8点到{n}，说要等2小时，{dish}都要凉了。{boss}说要不先烤好带走，但我想吃热乎的。', tags: ['排队久'], sentiment: 'negative', containsBoss: true, containsDish: [5] },
      { title: '{n}的{dish}不熟', content: '吃的{dish}，里面还是红的，找{staff}说烧烤都是这样。闹肚子一晚上，{boss}也没道歉。', tags: ['差评', '卫生问题'], sentiment: 'negative', containsBoss: true, containsDish: [0] },
    ],
    praiseTemplates: [
      { title: '{boss}的{dish}真的香', content: '{n}的{boss}亲自烤的{dish}，火候刚刚好，孜然辣椒配的也好。{staff}上菜快，环境有烟火气就对了！', tags: ['推荐'], containsBoss: true, containsDish: [0] },
      { title: '{n}的{dish}配啤酒绝了', content: '吃了{n}的{dish}和{dish}，都很入味。{boss}还给我们打折，{staff}态度很好。{d}附近最好的烧烤店！', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [0, 2, 1] },
    ],
  },

  '日料': {
    dishWords: ['三文鱼刺身', '鳗鱼饭', '天妇罗', '和牛寿司', '味增汤', '清酒', '定食套餐'],
    staff: ['寿司师傅', '服务员', '主厨'],
    action: '切鱼生',
    customerWords: ['日料资深粉', '刺身控', '寿司狂', '一人食'],
    complaintTemplates: [
      { title: '{n}的{dish}定价离谱', content: '在{n}点了{dish}和{dish}，结账居然800多，问{staff}说食材都是进口的。但{d}这片同样品质的别家才500。', tags: ['价格贵'], sentiment: 'negative', containsBoss: false, containsDish: [0, 1] },
      { title: '{n}没有一人食套餐', content: '一个人想吃{n}，但最小的套餐也是双人份。跟{boss}建议加{dish}，就嗯了一声没下文。', tags: ['差评'], sentiment: 'negative', containsBoss: true, containsDish: [6] },
    ],
    praiseTemplates: [
      { title: '{boss}的{n}值得专程来', content: '{boss}的{dish}切的超厚，入口即化。{staff}推荐的{dish}很搭配。环境安静，服务细致。强烈推荐！', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [0, 5] },
      { title: '{n}的{dish}真的新鲜', content: '第三次来{n}，每次的{dish}都超赞。{boss}偶尔会出来跟顾客聊天，{staff}也记得我不吃姜。很用心的店。', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [0] },
    ],
  },

  '私房菜': {
    dishWords: ['招牌红烧肉', '清蒸鲈鱼', '黑椒牛柳', '佛跳墙', '松茸鸡汤', '小炒黄牛肉', '龙井虾仁'],
    staff: ['老板娘', '服务员', '阿姨'],
    action: '做菜',
    customerWords: ['探店达人阿明', '私房菜爱好者', '聚餐控', '家庭客'],
    complaintTemplates: [
      { title: '{n}地方难找还预约不上', content: '在{d}的巷子里绕了半小时才找到{n}，电话打了三天才预约到。味道还行但太折腾了，{boss}也不做个指示牌。', tags: ['排队久'], sentiment: 'negative', containsBoss: true, containsDish: [0] },
      { title: '{n}的{dish}有点咸', content: '慕名来{n}吃{dish}，但真的太咸了，配了两碗米饭都hold不住。跟{staff}说了，{boss}说这就是特色。', tags: ['差评'], sentiment: 'negative', containsBoss: true, containsDish: [0] },
    ],
    praiseTemplates: [
      { title: '被{n}的{dish}圈粉', content: '朋友推荐的{n}，{dish}真的入口即化，肥而不腻。{boss}还送了份{dish}。{staff}很亲切，像家里吃饭。', tags: ['推荐'], containsBoss: true, containsDish: [0, 4] },
      { title: '{boss}的{n}适合聚餐', content: '家庭聚餐选了{n}，{boss}推荐的菜搭配很好。{dish}、{dish}、{dish}全部光盘。环境也有格调，下次还来。', tags: ['推荐'], containsBoss: true, containsDish: [1, 0, 5] },
    ],
  },

  'KTV': {
    dishWords: ['夜场小包', '下午场大包', '啤酒套餐', '生日派对', '自助餐', '音响设备', '点歌系统'],
    staff: ['前台', '包厢服务员', '麦霸小哥'],
    action: '唱歌',
    customerWords: ['麦霸集合', '唱K达人', '派对动物', '周末聚会党'],
    complaintTemplates: [
      { title: '{n}周末预约不到包厢', content: '周五想订{n}的{dish}，提前三天都满了。现场等了1小时才有，期间{staff}连座位都不给安排。', tags: ['排队久'], sentiment: 'negative', containsBoss: false, containsDish: [0] },
      { title: '{n}价格翻倍了', content: '上次唱{dish}才198，这周去直接498，说换了{dish}但听着跟以前一样。{boss}还说爱唱不唱。', tags: ['价格贵', '差评'], sentiment: 'negative', containsBoss: true, containsDish: [1, 5] },
      { title: '{n}卫生太差了', content: '包厢里有异味，话筒套都是旧的，沙发靠垫上有污渍。{staff}说消过毒但根本没换。{boss}也不出面。', tags: ['卫生问题', '环境差'], sentiment: 'negative', containsBoss: true, containsDish: [5] },
    ],
    praiseTemplates: [
      { title: '{boss}的{n}音效真的棒', content: '在{n}开了{dish}，{dish}效果超赞，{staff}服务随叫随到。{boss}还送了{dish}，下次聚会还来。', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [1, 5, 2] },
    ],
  },

  '美容': {
    dishWords: ['小气泡清洁', '补水管理', '光子嫩肤', '面部拨筋', '身体SPA', '肩颈按摩', '美甲美睫'],
    staff: ['美容师', '顾问', '前台'],
    action: '做脸',
    customerWords: ['美容达人', '敏感肌女生', 'SPA爱好者', '抗衰小姐姐'],
    complaintTemplates: [
      { title: '{n}办卡后服务差太多', content: '没办卡时{n}各种热情，办了卡预约{dish}说要等三周。{staff}做完{dish}又推销更贵的项目，我拒绝了态度就差了。找{boss}也没说法。', tags: ['态度差', '差评'], sentiment: 'negative', containsBoss: true, containsDish: [0, 1] },
      { title: '{n}的{dish}做烂了', content: '花3000做{n}的{dish}，做完脸红肿了一周。{boss}说是正常排毒，医院说过敏。要求退钱各种推脱。', tags: ['差评'], sentiment: 'negative', containsBoss: true, containsDish: [2] },
    ],
    praiseTemplates: [
      { title: '{boss}的{n}真的专业', content: '在{n}做的{dish}，{boss}根据我肤质定制的方案，做完皮肤真的透亮。{staff}手法温柔，不推销。办了年卡。', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [1] },
    ],
  },

  '足疗': {
    dishWords: ['足底按摩', '泰式松骨', '精油SPA', '拔罐刮痧', '修脚', '采耳', '腰背推拿'],
    staff: ['技师', '前台', '足疗师'],
    action: '按摩',
    customerWords: ['解压星人', 'SPA控', '养生党', '白领放松'],
    complaintTemplates: [
      { title: '{n}技师还推销办卡', content: '周末去{n}做{dish}，{staff}全程在推卡，我说不需要就开始说我肩颈问题很严重不治要出大事。{boss}路过也加入了推销。', tags: ['态度差'], sentiment: 'negative', containsBoss: true, containsDish: [0] },
      { title: '{n}环境差毛巾脏', content: '做完{dish}发现{n}的毛巾有黄渍，问{staff}说高温消毒过了，但看着真的恶心。{boss}也不解释。', tags: ['卫生问题', '环境差'], sentiment: 'negative', containsBoss: true, containsDish: [0] },
      { title: '{n}周末排队还加钱', content: '周日想去{n}，说周末要加20%服务费，{dish}原价198变成238。{boss}说周末{staff}加班费，就很无语。', tags: ['价格贵', '排队久'], sentiment: 'negative', containsBoss: true, containsDish: [0] },
    ],
    praiseTemplates: [
      { title: '{boss}家的{n}真的解压', content: '在{n}做的{dish}，{staff}力度刚好，全程不推销。{boss}很懂养生，还教了我几个拉伸动作。', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [6] },
    ],
  },

  '蛋糕': {
    dishWords: ['榴莲千层', '提拉米苏', '芝士蛋糕', '生日蛋糕定制', '水果奶油', '慕斯切块', '蛋黄酥'],
    staff: ['烘焙师', '前台小姐姐', '裱花师'],
    action: '做蛋糕',
    customerWords: ['甜品控', '榴莲狂', '生日小能手', '下午茶仙女'],
    complaintTemplates: [
      { title: '{n}订的{dish}做错图案', content: '给孩子订的生日{n}的{dish}，图案跟图片完全不一样。{boss}说裱花是手工的不可能一模一样，拒绝重做也不退款。', tags: ['差评'], sentiment: 'negative', containsBoss: true, containsDish: [3] },
      { title: '{n}取蛋糕还要排队半小时', content: '提前三天订的{n}{dish}，说好下午3点取，去了说还没做好等半小时。{staff}也一直忙没人理。{boss}连声抱歉都没有。', tags: ['排队久', '态度差'], sentiment: 'negative', containsBoss: true, containsDish: [0] },
    ],
    praiseTemplates: [
      { title: '{boss}的{dish}真的好吃', content: '{n}的{dish}用料超足，榴莲肉厚厚的一层。{boss}很用心，还帮我写了祝福字。{staff}服务也很好。', tags: ['推荐'], containsBoss: true, containsDish: [0] },
    ],
  },

  '西餐': {
    dishWords: ['战斧牛排', '松露意面', '凯撒沙拉', '惠灵顿牛排', '海鲜拼盘', '鹅肝', '红酒'],
    staff: ['侍应生', '主厨', '领班'],
    action: '上菜',
    customerWords: ['约会族', '牛排控', '美食博主', '纪念日情侣'],
    complaintTemplates: [
      { title: '{n}的{dish}全熟了', content: '点的{n}{dish}三分熟，结果上来基本全熟。找{staff}说主厨今天新来的，{boss}只说打九折。太失望了。', tags: ['差评'], sentiment: 'negative', containsBoss: true, containsDish: [0] },
      { title: '{n}价格贵服务差', content: '两个人吃了{n}的{dish}和{dish}，结账1800。{staff}全程找不到，加水都要喊三次。{boss}也不打招呼。', tags: ['价格贵', '态度差'], sentiment: 'negative', containsBoss: true, containsDish: [3, 4] },
    ],
    praiseTemplates: [
      { title: '{boss}的{n}做的{dish}完美', content: '在{n}找{boss}推荐的{dish}，火候刚刚好，配{dish}绝了。{staff}服务细致，{d}附近最好的约会地。', tags: ['态度好', '推荐'], containsBoss: true, containsDish: [0, 6] },
    ],
  },
}

function fillTemplate(s: string, vars: Record<string, string>, dishes: IndustryTemplate['dishWords']): string {
  return s.replace(/\{(\w+)\}/g, (_, key) => {
    if (key === 'dish') {
      return dishes[0] || ''
    }
    return vars[key] || ''
  })
}

function computeMatchAndConfidence(
  text: string,
  storeInfo: StoreInfo,
  service: string,
): { matched: KeywordMatch[]; confidence: Confidence; confidenceReason: string } {
  const matched: KeywordMatch[] = []
  const { storeName, ownerAlias, keywords, services } = storeInfo
  const aliases = keywords?.storeAliases || []
  const bossNames = keywords?.bossNames || []
  const signatures = keywords?.signatureDishes || []
  const banned = keywords?.bannedPatterns || []

  const allText = text.toLowerCase()
  if (banned.some(b => b && allText.includes(b.toLowerCase()))) {
    return { matched: [], confidence: 'low', confidenceReason: '已被店长标记为误伤' }
  }

  if (storeName && allText.includes(storeName.toLowerCase())) {
    matched.push({ word: storeName, type: 'storeName' })
  }
  for (const a of aliases) {
    if (a && allText.includes(a.toLowerCase()) && !matched.find(m => m.word === a)) {
      matched.push({ word: a, type: 'alias' })
    }
  }
  if (ownerAlias && allText.includes(ownerAlias.toLowerCase()) && !matched.find(m => m.word === ownerAlias)) {
    matched.push({ word: ownerAlias, type: 'boss' })
  }
  for (const b of bossNames) {
    if (b && allText.includes(b.toLowerCase()) && !matched.find(m => m.word === b)) {
      matched.push({ word: b, type: 'boss' })
    }
  }
  for (const sg of signatures) {
    if (sg && allText.includes(sg.toLowerCase()) && !matched.find(m => m.word === sg)) {
      matched.push({ word: sg, type: 'signature' })
    }
  }

  let hasHighType = matched.some(m => m.type === 'storeName' || m.type === 'alias' || m.type === 'boss')
  if (!hasHighType) {
    if (service && allText.includes(service.toLowerCase())) {
      matched.push({ word: service, type: 'service' })
    }
    for (const srv of services) {
      if (srv && allText.includes(srv.toLowerCase()) && !matched.find(m => m.word === srv)) {
        matched.push({ word: srv, type: 'service' })
      }
    }
  }

  let confidence: Confidence = 'low'
  let confidenceReason = ''
  const nonService = matched.filter(m => m.type !== 'service').length
  const names = matched.filter(m => m.type === 'storeName' || m.type === 'alias').map(m => m.word)
  const boss = matched.filter(m => m.type === 'boss').map(m => m.word)
  const sigs = matched.filter(m => m.type === 'signature').map(m => m.word)
  const svcs = matched.filter(m => m.type === 'service').map(m => m.word)

  if (nonService >= 2) {
    confidence = 'high'
    const parts: string[] = []
    if (names.length) parts.push(`命中门店名"${names.join('/')}"`)
    if (boss.length) parts.push(`提到老板"${boss.join('/')}"`)
    if (sigs.length) parts.push(`点了招牌"${sigs.join('/')}"`)
    confidenceReason = parts.length ? `高可信：${parts.join('，')}，多维度交叉匹配` : '高可信：多维度匹配'
  } else if (nonService === 1) {
    confidence = 'medium'
    if (names.length) confidenceReason = `中可信：提到门店名"${names[0]}"，建议查看原帖确认`
    else if (boss.length) confidenceReason = `中可信：提到老板"${boss[0]}"，大概率是熟客讨论`
    else if (sigs.length) confidenceReason = `中可信：点了招牌"${sigs[0]}"，通常是真实顾客`
  } else if (svcs.length >= 1) {
    confidence = 'low'
    confidenceReason = `低置信度：仅命中泛服务词"${svcs.join('/')}"，可能是误伤，建议确认`
  } else {
    confidence = 'low'
    confidenceReason = '低置信度：没有命中关键词'
  }

  return { matched, confidence, confidenceReason }
}

const DEFAULT_LANDMARKS = ['万达广场', '地铁口出来', '步行街入口', '美食街', '写字楼', '电影院旁边', '小区楼下', '商场二楼']
const DEFAULT_PEAK = ['周六下午', '周末约满', '下班高峰', '周五晚上', '节假日排队', '周末客流']

function withDefault<T extends object>(tpl: T & { landmarks?: string[]; peakScenes?: string[] }) {
  return {
    ...tpl,
    landmarks: tpl.landmarks && tpl.landmarks.length ? tpl.landmarks : DEFAULT_LANDMARKS,
    peakScenes: tpl.peakScenes && tpl.peakScenes.length ? tpl.peakScenes : DEFAULT_PEAK,
  } as T & { landmarks: string[]; peakScenes: string[] }
}

function fillSceneTemplate(s: string, vars: Record<string, string>, dishes: string[], landmarks: string[], peaks: string[]): string {
  let result = fillTemplate(s, vars, dishes)
  result = result.replace(/\{l\}/g, () => landmarks[Math.floor(Math.random() * landmarks.length)])
  result = result.replace(/\{p\}/g, () => peaks[Math.floor(Math.random() * peaks.length)])
  return result
}

export function generateMockData(storeInfo: StoreInfo) {
  const { storeName, districtName, ownerAlias, services } = storeInfo
  const primaryService = services[0] || '火锅'
  const baseTpl = TEMPLATES[primaryService] || TEMPLATES['火锅']
  const tpl = withDefault(baseTpl)
  const dishes = tpl.dishWords
  const allServices = services.join(',')

  const vars: Record<string, string> = {
    n: storeName || '无名店',
    d: districtName || '本商圈',
    boss: ownerAlias || '老板',
    staff: tpl.staff[0],
  }

  const posts: Post[] = []
  const now = new Date()
  const sources = ['tieba', 'cityforum', 'xiaohongshu', 'dianping'] as const

  let postId = 1

  const complaintCount = Math.min(tpl.complaintTemplates.length, 5)
  for (let i = 0; i < complaintCount; i++) {
    const t = tpl.complaintTemplates[i]
    const dishList = t.containsDish.length > 0
      ? t.containsDish.map(idx => dishes[idx % dishes.length])
      : [dishes[0]]
    let title = fillSceneTemplate(t.title, vars, dishes, tpl.landmarks, tpl.peakScenes)
    let content = fillSceneTemplate(t.content, vars, dishes, tpl.landmarks, tpl.peakScenes)
    dishList.forEach((d) => {
      title = title.replace(/\{dish\}/, d)
      content = content.replace(/\{dish\}/, d)
    })

    const hoursAgo = i * 5 + 2
    const publishedAt = new Date(now.getTime() - hoursAgo * 3600000)
    const combinedText = title + content
    const { matched, confidence, confidenceReason } = computeMatchAndConfidence(combinedText, storeInfo, primaryService)

    const replies: Reply[] = [
      { id: `r${i}a`, author: tpl.customerWords[i % tpl.customerWords.length], content: `确实遇到过类似情况，太有共鸣了`, isAgree: true, hasImage: i % 3 === 0 },
      { id: `r${i}b`, author: '理性看待', content: `希望能改善，毕竟{n}是好店`.replace('{n}', storeName || '这家'), isAgree: true, hasImage: false },
    ]

    posts.push({
      id: `p${postId++}`,
      source: sources[i % sources.length],
      title,
      content,
      author: tpl.customerWords[(i + 1) % tpl.customerWords.length],
      publishedAt: publishedAt.toISOString(),
      tags: [...t.tags],
      hasImage: i % 2 === 0,
      imageCount: (i % 3) + 1,
      replyCount: 7 + i * 4,
      replies,
      sentiment: t.sentiment,
      matchedKeywords: matched,
      confidence,
      confidenceReason,
      dismissed: false,
    })
  }

  const praiseCount = Math.min(tpl.praiseTemplates.length, 3)
  for (let i = 0; i < praiseCount; i++) {
    const t = tpl.praiseTemplates[i]
    const dishList = t.containsDish.length > 0
      ? t.containsDish.map(idx => dishes[idx % dishes.length])
      : [dishes[0]]
    let title = fillSceneTemplate(t.title, vars, dishes, tpl.landmarks, tpl.peakScenes)
    let content = fillSceneTemplate(t.content, vars, dishes, tpl.landmarks, tpl.peakScenes)
    dishList.forEach((d) => {
      title = title.replace(/\{dish\}/, d)
      content = content.replace(/\{dish\}/, d)
    })

    const hoursAgo = i * 8 + 5
    const publishedAt = new Date(now.getTime() - hoursAgo * 3600000)
    const combinedText = title + content
    const { matched, confidence, confidenceReason } = computeMatchAndConfidence(combinedText, storeInfo, primaryService)

    posts.push({
      id: `p${postId++}`,
      source: sources[(i + 2) % sources.length],
      title,
      content,
      author: tpl.customerWords[(i + 2) % tpl.customerWords.length],
      publishedAt: publishedAt.toISOString(),
      tags: [...t.tags],
      hasImage: true,
      imageCount: 2 + i,
      replyCount: 3 + i * 3,
      replies: [
        { id: `rp${i}a`, author: '老顾客', content: `${storeName || '这家'}确实不错，一直都在`, isAgree: true, hasImage: i === 0 },
        { id: `rp${i}b`, author: '路人', content: `看完想去了`, isAgree: true, hasImage: false },
      ],
      sentiment: 'positive',
      matchedKeywords: matched,
      confidence,
      confidenceReason,
      dismissed: false,
    })
  }

  const tagCountMap: Record<string, { ids: string[]; count: number }> = {}
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagCountMap[tag]) tagCountMap[tag] = { ids: [], count: 0 }
      tagCountMap[tag].ids.push(post.id)
      tagCountMap[tag].count++
    }
  }

  const dimensionMap: Partial<Record<PostTag, IssueCluster['dimension']>> = {
    '排队久': '排队',
    '价格贵': '价格',
    '态度差': '服务',
    '态度好': '服务',
    '差评': '服务',
    '环境差': '环境',
    '卫生问题': '环境',
    '味道好': '产品',
    '推荐': '产品',
  }

  const categoryDetailMap: Record<string, {
    label: string
    suggestion: string
    urgency: number
    priorityReason: string
  }> = {
    '排队久': {
      label: '排队等位问题',
      suggestion: '建议增设线上取号系统，高峰期增派人手，可提供等待区小食/饮品安抚等待情绪',
      urgency: 4,
      priorityReason: '本周有上升趋势，且高峰时段持续超过1小时，容易因等待流失顾客或产生负面评价',
    },
    '价格贵': {
      label: '价格价值争议',
      suggestion: '在店内明码标价说明变更点，老顾客保留原价位过渡，新套餐附带增值权益说明',
      urgency: 3,
      priorityReason: '涉及顾客核心利益，若不解释易形成"宰客"口碑，影响复购',
    },
    '态度差': {
      label: '服务态度投诉',
      suggestion: '对一线员工进行服务话术培训，建立投诉快速响应机制，店长每日巡检高峰服务',
      urgency: 5,
      priorityReason: '态度问题直接影响复购和口碑传播，出现即需第一时间整改',
    },
    '差评': {
      label: '综合差评处理',
      suggestion: '建立差评回访机制，48小时内主动联系顾客了解具体情况并提供补偿方案',
      urgency: 4,
      priorityReason: '综合差评多为体验整体性崩坏，若不处理会形成连锁负面效应',
    },
    '环境差': {
      label: '环境体验问题',
      suggestion: '定期深度清洁，高峰期增派保洁人员，改善通风设施，设置卫生检查记录表',
      urgency: 4,
      priorityReason: '环境是顾客的第一印象，差评一旦附带图片传播极快',
    },
    '卫生问题': {
      label: '卫生清洁问题',
      suggestion: '增加清洁频次（每2小时一次），公共区域放置消毒用品，卫生责任到人',
      urgency: 5,
      priorityReason: '卫生问题触碰顾客底线，有引发食品安全或皮肤病风险，需最高优先级处理',
    },
  }

  const issues: IssueCluster[] = Object.entries(tagCountMap)
    .filter(([tag]) => categoryDetailMap[tag] && tagCountMap[tag].count >= 1)
    .map(([tag, data], i) => {
      const detail = categoryDetailMap[tag]
      const thisWeek = data.count
      const lastWeek = Math.max(1, thisWeek + (i % 2 === 0 ? -1 : 2))
      const days = ['一', '二', '三', '四', '五', '六', '日']
      const todayIdx = new Date().getDay()
      const dailyTrend = Array.from({ length: 7 }, (_, dayIdx) => {
        const idx = (todayIdx - 6 + dayIdx + 7) % 7
        const shift = Math.floor(Math.random() * 3) - 1
        const perDay = Math.max(0, Math.round(data.count / 7) + shift)
        return {
          day: days[idx],
          date: `6/${new Date().getDate() - 6 + dayIdx}`,
          count: dayIdx === 6 ? data.count : perDay,
        }
      })
      const total = dailyTrend.reduce((s, d) => s + d.count, 0)
      if (total > 0 && data.count > 0) {
        dailyTrend[dailyTrend.length - 1].count = dailyTrend[dailyTrend.length - 1].count + Math.max(0, data.count - total)
      }

      return {
        id: `i${i + 1}`,
        category: detail.label,
        tag: tag as PostTag,
        dimension: dimensionMap[tag as PostTag] || '服务',
        count: thisWeek,
        postIds: data.ids,
        suggestion: detail.suggestion,
        trend: {
          direction: (thisWeek > lastWeek ? 'up' : thisWeek < lastWeek ? 'down' : 'stable') as TrendDirection,
          thisWeek,
          lastWeek,
        },
        dailyTrend,
        urgency: detail.urgency,
        priorityReason: detail.priorityReason,
      }
    })
    .sort((a, b) => b.urgency - a.urgency)

  const existingReminders = loadExistingReminders()
  const reminders: ReplyReminder[] = []
  const negativePosts = posts.filter((p) => p.sentiment === 'negative')
  for (let i = 0; i < negativePosts.length; i++) {
    const post = negativePosts[i]
    const existing = existingReminders.find((r) => r.postId === post.id)
    if (existing) {
      reminders.push(existing)
      continue
    }
    const isPublic = i % 2 === 0
    const hasWait = post.tags.includes('排队久')
    const hasPrice = post.tags.includes('价格贵')
    const hasEnv = post.tags.includes('环境差') || post.tags.includes('卫生问题')
    const hasBad = post.tags.includes('差评') || post.tags.includes('态度差')

    let strategy: ReplyReminder['strategy'] = '解释'
    let riskLevel: ReplyReminder['riskLevel'] = 'medium'
    let recommendedAction = '72小时内回复'
    let draft = ''
    let fixDirection = ''

    if (hasWait) {
      strategy = '解释'
      riskLevel = 'medium'
      recommendedAction = '24小时内公开回复'
      draft = `您好！非常抱歉让您久等了😔 我们已经注意到周末高峰等位时间过长的问题，目前正在测试线上取号系统，预计下月上线。在此期间，建议您提前电话预约，我们会为您预留位置。再次感谢您的耐心和反馈！`
    } else if (hasPrice) {
      strategy = '解释'
      riskLevel = 'medium'
      recommendedAction = '48小时内公开回复'
      draft = `感谢您的反馈！关于价格调整，我们确实升级了产品/服务品质，但我们理解您对性价比的感受。我们已为老顾客保留原价基础档，欢迎下次来体验～`
    } else if (hasEnv) {
      strategy = isPublic ? '邀请体验' : '整改'
      riskLevel = 'high'
      recommendedAction = isPublic ? '24小时内公开回复' : '3天内完成整改'
      draft = isPublic
        ? `非常抱歉给您不好的体验！我们已加派清洁人员并设置定时消毒检查。作为补偿，欢迎您免费来体验一次，看看我们的改善效果！私信我预约即可～`
        : ''
      fixDirection = !isPublic ? '立即安排深度清洁，重点整改卫生间和卫生死角，增配排风设备，由当班主管负责落实并拍照反馈' : ''
    } else if (hasBad) {
      strategy = '道歉'
      riskLevel = 'high'
      recommendedAction = '24小时内公开回复'
      draft = `非常抱歉给您带来不好的体验！我们已经对当事员工进行了批评教育，并加强了服务培训。欢迎您再次光临，我们一定会让您满意！`
    }

    const daysForDeadline = hasEnv || hasBad ? 3 : 5
    const defaultDeadline = new Date(now.getTime() + daysForDeadline * 86400000).toISOString().slice(0, 10)

    const newReminder: ReplyReminder = {
      id: `rm${i + 1}`,
      postId: post.id,
      type: isPublic ? 'public' : 'internal',
      strategy,
      riskLevel,
      recommendedAction,
      completed: false,
      ...(isPublic && draft ? { draft, draftHistory: [{ version: 1, text: draft, savedAt: new Date().toISOString() }] } : {}),
      ...(!isPublic && fixDirection ? { fixDirection } : {}),
      ...(!isPublic ? { internalFix: { status: 'pending', assignee: '', result: '', deadline: defaultDeadline, updatedAt: '' } } : {}),
    }
    reminders.push(newReminder)
  }

  saveReminders(reminders)
  return { posts, issues, reminders }
}

const REMINDERS_KEY = 'reply_reminders_v2'

function loadExistingReminders(): ReplyReminder[] {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveReminders(data: ReplyReminder[]) {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export function saveGlobalReminders(data: ReplyReminder[]) {
  saveReminders(data)
}
