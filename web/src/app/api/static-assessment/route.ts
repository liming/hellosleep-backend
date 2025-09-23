import { NextRequest, NextResponse } from 'next/server';
import { staticAssessmentEngine } from '@/lib/static-assessment-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Invalid answers format' },
        { status: 400 }
      );
    }

    // Process assessment using static engine
    const result = staticAssessmentEngine.processAssessment(answers);

    // Save result (in production, this would save to database)
    staticAssessmentEngine.saveResult(result);

    return NextResponse.json({
      success: true,
      data: {
        calculatedTags: result.calculatedTags,
        bookletFacts: result.bookletFacts.map(fact => ({
          tag: fact.tag,
          factName: fact.factName,
          description: fact.description,
          content: fact.content,
          tutorialLink: fact.tutorialLink,
        })),
        completedAt: result.completedAt,
        summary: {
          totalAnswers: Object.keys(answers).length,
          totalTags: result.calculatedTags.length,
          totalFacts: result.bookletFacts.length
        }
      }
    });

  } catch (error) {
    console.error('Static assessment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get latest result for demonstration
    const latestResult = staticAssessmentEngine.getLatestResult();
    
    // Get statistics
    const allTags = staticAssessmentEngine.getAllTags();
    
    return NextResponse.json({
      success: true,
      data: {
        latestResult,
        statistics: {
          totalTags: allTags.length,
          availableTags: allTags.map(tag => ({
            name: tag.name,
            text: tag.text
          }))
        }
      }
    });

  } catch (error) {
    console.error('Static assessment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
