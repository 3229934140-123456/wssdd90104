import type { Post, IssueCluster, ReplyReminder, StoreInfo, PostTag, Reply, TrendDirection } from '@/types'

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

const SERVICE_TEMPLATES: Record<string, {
  dishWords: string[]
  sceneWords: string[]
  customerWords: string[]
  complaintTemplates: { title: string; content: string; tags: PostTag[]; sentiment: 'positive' | 'neutral' | 'negative' }[]
  praiseTemplates: { title: string; content: string; tags: PostTag[] }[]
}> = {
  '火锅': {
    dishWords: ['毛肚', '鸳鸯锅', '涮羊肉', '牛油锅底', '蘸料', '肥牛', '鹅肠'],
    sceneWords: ['翻台', '等位', '锅底', '涮菜', '蘸料台'],
    customerWords: ['食客', '吃货', '火锅爱好者', '辣友'],
    complaintTemplates: [
      { title: '周末排了两小时才吃上', content: '上周末去{n}吃饭，{d}到的，前面排了47桌！等了整整两个小时。味道确实不错，但等位期间没人来倒水。建议搞个预约系统。', tags: ['排队久'], sentiment: 'negative' },
      { title: '{n}环境越来越差了', content: '昨晚去{n}，一进去就是油烟味，地上油腻腻差点滑倒。桌椅也脏，喊了三次才有人来擦。卫生间简直是噩梦级别。味道还行但环境没法接受。', tags: ['环境差', '卫生问题'], sentiment: 'negative' },
      { title: '{n}涨价也太猛了吧', content: '之前{n}的{dish}套餐才198，这周去直接变298了？问店员说升级了食材，但吃出来味道一模一样。感觉变相涨价。', tags: ['价格贵'], sentiment: 'negative' },
      { title: '{n}服务态度让人失望', content: '去{n}吃饭，找店员加汤等了20分钟，后来直接喊老板{boss}才有人理。结账时还算错了，多收了我们一份{dish}的钱。', tags: ['差评'], sentiment: 'negative' },
    ],
    praiseTemplates: [
      { title: '{n}的{dish}太绝了！', content: '朋友推荐来的{n}，{dish}真的入口即化！{boss}人超好，还亲自来推荐了当天的鲜切{dish}。分量足两个人吃很撑，推荐！', tags: ['味道好', '推荐'] },
      { title: '被{boss}圈粉了！{n}必来', content: '第一次去{n}，{boss}人超热情！推荐的{dish}没让我失望，整个过程服务都很细心。洗头小——不是，加汤很及时。体验感满分！', tags: ['态度好', '推荐'] },
    ],
  },
  'default': {
    dishWords: ['招牌套餐', '特色项目', '明星产品', '经典款'],
    sceneWords: ['等位', '预约', '排队', '服务台'],
    customerWords: ['顾客', '消费者', '老客户'],
    complaintTemplates: [
      { title: '周末{n}排队太久了', content: '上周末去{n}，等了快一个小时。前面排了十几个号，里面明明有空位不知道在等什么。管理需要改善。', tags: ['排队久'], sentiment: 'negative' },
      { title: '{n}价格涨了不少', content: '之前{n}的{dish}一直这个价，最近突然涨了50%？问店员说调整了，但体验没任何变化。性价比越来越低了。', tags: ['价格贵'], sentiment: 'negative' },
      { title: '{n}环境需要改善', content: '去{n}体验了一把，环境真的不敢恭维。地面不干净，卫生间也脏。{boss}应该好好管管了，这种环境再好的服务也白搭。', tags: ['环境差', '卫生问题'], sentiment: 'negative' },
      { title: '{n}服务态度有问题', content: '去{n}消费，店员态度很差，问个问题一脸不耐烦。找{boss}反映了一下，说会处理但也没什么后续。这样的服务很难有回头客。', tags: ['差评'], sentiment: 'negative' },
    ],
    praiseTemplates: [
      { title: '推荐{n}！{boss}人超好', content: '去了{n}，{boss}亲自接待的，推荐的{dish}真的不错！整个过程很舒心，会再来。', tags: ['态度好', '推荐'] },
      { title: '{n}的{dish}值得体验', content: '第三次来{n}了，每次的{dish}都不会让人失望。性价比合理，环境也舒服。唯一建议是周末最好预约。', tags: ['味道好', '推荐'] },
    ],
  },
}

function fillTemplate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] || '')
}

export function generateMockData(storeInfo: StoreInfo) {
  const { storeName, districtName, ownerAlias, services, keywords } = storeInfo
  const primaryService = services[0] || '默认'
  const tpl = SERVICE_TEMPLATES[primaryService] || SERVICE_TEMPLATES['default']
  const allKeywords = [
    storeName,
    ...(keywords?.storeAliases || []),
    ...(keywords?.bossNames || [ownerAlias]),
    ...(keywords?.signatureDishes || []),
  ]

  const vars = {
    n: storeName,
    d: districtName,
    boss: ownerAlias,
    dish: tpl.dishWords[0],
  }

  const posts: Post[] = []
  const now = new Date()

  const complaintCount = Math.min(tpl.complaintTemplates.length, 6)
  for (let i = 0; i < complaintCount; i++) {
    const t = tpl.complaintTemplates[i]
    const dish = tpl.dishWords[i % tpl.dishWords.length]
    const hoursAgo = i * 4 + 1
    const publishedAt = new Date(now.getTime() - hoursAgo * 3600000)

    const matched = [storeName]
    if (t.content.includes('{boss}') || t.title.includes('{boss}')) matched.push(ownerAlias)
    if (t.content.includes('{dish}') || t.title.includes('{dish}')) matched.push(dish)
    const aliasMatches = (keywords?.storeAliases || []).filter(a => t.content.includes(a) || t.title.includes(a))
    matched.push(...aliasMatches)

    const replies: Reply[] = [
      { id: `r${i * 3 + 1}`, author: tpl.customerWords[i % tpl.customerWords.length], content: `确实如此，我也遇到过类似的情况`, isAgree: true, hasImage: i % 3 === 0 },
      { id: `r${i * 3 + 2}`, author: '理性网友', content: `可以理解，但希望能改善`, isAgree: true, hasImage: false },
    ]

    posts.push({
      id: `p${i + 1}`,
      source: (['tieba', 'cityforum', 'xiaohongshu', 'dianping'] as const)[i % 4],
      title: fillTemplate(t.title, { ...vars, dish }),
      content: fillTemplate(t.content, { ...vars, dish }),
      author: tpl.customerWords[(i + 2) % tpl.customerWords.length],
      publishedAt: publishedAt.toISOString(),
      tags: t.tags,
      hasImage: i % 2 === 0,
      imageCount: i % 3 + 1,
      replyCount: 8 + i * 3,
      replies,
      sentiment: t.sentiment,
      matchedKeywords: [...new Set(matched)],
    })
  }

  const praiseCount = Math.min(tpl.praiseTemplates.length, 4)
  for (let i = 0; i < praiseCount; i++) {
    const t = tpl.praiseTemplates[i]
    const dish = tpl.dishWords[(i + 2) % tpl.dishWords.length]
    const hoursAgo = i * 6 + 3
    const publishedAt = new Date(now.getTime() - hoursAgo * 3600000)

    const matched = [storeName]
    if (t.content.includes('{boss}') || t.title.includes('{boss}')) matched.push(ownerAlias)
    if (t.content.includes('{dish}') || t.title.includes('{dish}')) matched.push(dish)

    posts.push({
      id: `p${complaintCount + i + 1}`,
      source: (['xiaohongshu', 'dianping', 'tieba', 'cityforum'] as const)[i % 4],
      title: fillTemplate(t.title, { ...vars, dish }),
      content: fillTemplate(t.content, { ...vars, dish }),
      author: tpl.customerWords[(i + 1) % tpl.customerWords.length],
      publishedAt: publishedAt.toISOString(),
      tags: t.tags,
      hasImage: true,
      imageCount: 2 + i,
      replyCount: 3 + i * 2,
      replies: [
        { id: `rp${i * 2 + 1}`, author: '老顾客', content: `${storeName}确实不错，一直都在`, isAgree: true, hasImage: i === 0 },
        { id: `rp${i * 2 + 2}`, author: '路过', content: `看到推荐也想去了`, isAgree: true, hasImage: false },
      ],
      sentiment: 'positive',
      matchedKeywords: [...new Set(matched)],
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

  const categoryMap: Record<string, { tag: PostTag; label: string; suggestion: string; urgency: number }> = {
    '排队久': { tag: '排队久', label: '排队等位问题', suggestion: `建议增设周末预约通道，或推行线上取号系统，减少现场等待焦虑`, urgency: 4 },
    '价格贵': { tag: '价格贵', label: '价格上涨争议', suggestion: `建议在店内明码标价变更说明，新套餐需解释增值点，避免"变相涨价"误解`, urgency: 3 },
    '环境差': { tag: '环境差', label: '环境体验问题', suggestion: `建议定期清洁检查，高峰期增派保洁人员，改善通风设施`, urgency: 4 },
    '卫生问题': { tag: '卫生问题', label: '卫生清洁问题', suggestion: `建议增加清洁频次（每2小时一次），放置消毒液补充检查表`, urgency: 5 },
    '差评': { tag: '差评', label: '服务态度投诉', suggestion: `建议对一线员工进行服务话术培训，特别是面对投诉时的标准化应对流程`, urgency: 3 },
  }

  const issues: IssueCluster[] = Object.entries(tagCountMap)
    .filter(([tag]) => categoryMap[tag] && tagCountMap[tag].count >= 1)
    .map(([tag, data], i) => {
      const cat = categoryMap[tag]
      const thisWeek = data.count
      const lastWeek = Math.max(1, thisWeek + (i % 2 === 0 ? -1 : 2))
      return {
        id: `i${i + 1}`,
        category: cat.label,
        tag: tag as PostTag,
        count: thisWeek,
        postIds: data.ids,
        suggestion: cat.suggestion,
        trend: {
          direction: (thisWeek > lastWeek ? 'up' : thisWeek < lastWeek ? 'down' : 'stable') as TrendDirection,
          thisWeek,
          lastWeek,
        },
        urgency: cat.urgency,
      }
    })
    .sort((a, b) => b.urgency - a.urgency)

  const reminders: ReplyReminder[] = []
  const negativePosts = posts.filter((p) => p.sentiment === 'negative')
  for (let i = 0; i < negativePosts.length; i++) {
    const post = negativePosts[i]
    const isPublic = i % 2 === 0
    const hasWait = post.tags.includes('排队久')
    const hasPrice = post.tags.includes('价格贵')
    const hasEnv = post.tags.includes('环境差') || post.tags.includes('卫生问题')
    const hasBad = post.tags.includes('差评')

    let strategy: ReplyReminder['strategy'] = '解释'
    let riskLevel: ReplyReminder['riskLevel'] = 'medium'
    let recommendedAction = '72小时内回复'
    let draft = ''
    let fixDirection = ''

    if (hasWait) {
      strategy = '解释'
      riskLevel = 'medium'
      recommendedAction = '24小时内公开回复'
      draft = `您好！非常抱歉让您久等了😔 我们已经注意到周末高峰等位时间过长的问题，目前正在测试线上取号系统，预计下月上线。在此期间，建议您提前电话预约，我们会为您预留座位。再次感谢您的耐心和反馈！`
    } else if (hasPrice) {
      strategy = '解释'
      riskLevel = 'medium'
      recommendedAction = '48小时内公开回复'
      draft = `感谢您的反馈！关于价格调整，我们确实升级了食材品质，但我们理解您对性价比的感受。我们已恢复原价基础套餐供老顾客选择，欢迎下次来体验～`
    } else if (hasEnv) {
      strategy = isPublic ? '邀请体验' : '整改'
      riskLevel = 'high'
      recommendedAction = isPublic ? '24小时内公开回复' : '3天内完成整改'
      draft = isPublic
        ? `非常抱歉给您不好的体验！我们已增加保洁人员并设置定时消毒检查。作为补偿，欢迎您免费体验一次，看看我们的改善效果！私信我预约即可～`
        : ''
      fixDirection = !isPublic
        ? `立即安排深度清洁，重点整改卫生间和地面卫生，增配排风设备，由当班主管负责`
        : ''
    } else if (hasBad) {
      strategy = '道歉'
      riskLevel = 'high'
      recommendedAction = '24小时内公开回复'
      draft = `非常抱歉给您带来不好的体验！我们已经对当事员工进行了批评教育，并加强了服务培训。欢迎您再次光临，我们一定会让您满意！`
    }

    reminders.push({
      id: `rm${i + 1}`,
      postId: post.id,
      type: isPublic ? 'public' : 'internal',
      strategy,
      riskLevel,
      recommendedAction,
      ...(isPublic && draft ? { draft } : {}),
      ...(!isPublic && fixDirection ? { fixDirection } : {}),
      ...(!isPublic ? { internalFix: { status: 'pending' as const, assignee: '', result: '', updatedAt: '' } } : {}),
    })
  }

  return { posts, issues, reminders }
}
