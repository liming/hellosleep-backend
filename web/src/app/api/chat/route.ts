import { NextRequest, NextResponse } from 'next/server';

// 睡吧助手的系统提示
const SYSTEM_PROMPT = `你是一个温暖的失眠助手"小吧"，来自睡吧社区。

核心理念（必须遵守）：
1. 失眠不是"病"，而是身体和心理状态的表现
2. 应该改善自身问题，而不是"治疗"失眠
3. 恢复正常睡眠不代表恢复，睡不好仍能做好日常事才是恢复
4. 不对付失眠，而是解决造成失眠的根源
5. 失眠是"平常事"，不是"病"
6. 忽略失眠，而不是与之纠结
7. 停止为失眠做很多事，停止被失眠负面情绪左右
8. 专注于生活本身
9. 行动改变困境：只有积极言行才能改变困境

回答风格：
- 温暖、支持
- 不评判用户的失眠经历
- 引导用户关注生活，而不是失眠本身
- 强调"行动"和"改变"
- 不提供医疗诊断，建议寻求专业医生帮助

边界：
- 不做医疗诊断
- 不推荐药物
- 引导看专业医生
- 分享睡吧理念和经验

如果用户有自杀倾向或严重抑郁，表达关心并建议立即寻求专业帮助。`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json(
        { error: '消息不能为空' },
        { status: 400 }
      );
    }

    // 构建对话历史
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(history || []),
      { role: 'user', content: message }
    ];

    // TODO: 这里后续会调用 MiniMax API
    // 现在先用模拟回复测试
    const mockResponse = await getMockResponse(message);
    
    return NextResponse.json({
      response: mockResponse,
      history: [...(history || []), { role: 'user', content: message }, { role: 'assistant', content: mockResponse }]
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

// 模拟回复（测试用）
async function getMockResponse(message: string): Promise<string> {
  const msg = message.toLowerCase();
  
  // 简单关键词匹配
  if (msg.includes('失眠') && (msg.includes('怎么办') || msg.includes('怎么办'))) {
    return `你好呀，看到你失眠了，先别着急。\n\n我想先了解一下：最近是发生了什么特别的事情吗？\n\n先记住一句话：**失眠不是病，它只是身体在提醒你，生活可能需要调整一下。**\n\n不是说要去"对付"失眠，而是看看生活中有哪些地方可以让我们过得更平衡。\n\n你说说看，我听着呢 😊`;
  }
  
  if (msg.includes('睡不着')) {
    return `睡不着的滋味确实很难受。\n\n不过我想告诉你，**睡眠是自然的，不需要"努力"去睡着。**\n\n你越努力想睡着，反而越清醒。\n\n不如试试：\n- 放松躺在床上\n- 不强迫自己\n- 专注于呼吸\n\n睡不着的夜晚，就让它睡不着吧。重要的是白天依然好好生活。`;
  }
  
  if (msg.includes('焦虑') || msg.includes('害怕')) {
    return `焦虑和害怕是很正常的反应，很多人都会这样。\n\n但你知道吗？**焦虑只是情绪，情绪会来也会走。**\n\n不要和焦虑对抗，试着接纳它：\n- "好的，我现在有点焦虑"\n- "焦虑就焦虑吧"\n- 继续做你该做的事\n\n当你不对抗的时候，焦虑反而会慢慢消退。`;
  }
  
  if (msg.includes('谢谢')) {
    return `不客气！😊\n\n记住，你不是一个人在战斗。很多人都经历过失眠，你不是特例。\n\n重要的是：**失眠是可以走出来的。** 相信自己，也相信身体有自愈的能力。\n\n有任何问题随时问我～`;
  }
  
  // 默认回复
  return `我听到你了。\n\n失眠确实让人困扰，但请记住：**失眠不是你的敌人，而是身体发出的信号。**\n\n你可以告诉我：\n- 最近生活有什么变化吗？\n- 失眠影响了你的哪些方面？\n\n慢慢说，我听着呢。\n\n也欢迎你写下自己的失眠故事，这会帮助你更好地了解自己。`;
}
