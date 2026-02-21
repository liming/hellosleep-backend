import { NextRequest, NextResponse } from 'next/server';
import { processAssessment, tags } from '@/lib/assessment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 });
    }

    const activeTags = processAssessment(answers);

    return NextResponse.json({
      success: true,
      data: {
        calculatedTags: activeTags.map((tag) => ({
          name: tag.name,
          text: tag.text,
          category: tag.category,
          priority: tag.priority,
          recommendation: tag.recommendation,
        })),
        summary: {
          totalAnswers: Object.keys(answers).length,
          totalTags: activeTags.length,
        },
      },
    });
  } catch (error) {
    console.error('Static assessment API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      statistics: {
        totalTags: tags.length,
        availableTags: tags.map((tag) => ({ name: tag.name, text: tag.text })),
      },
    },
  });
}
