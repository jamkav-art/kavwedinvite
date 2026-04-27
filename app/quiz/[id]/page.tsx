import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { APP_URL } from "@/lib/constants";
import type { QuestionCategory } from "@/types/anniversary-quiz.types";
import QuizPageContent from "./QuizPageContent.client";

type QuizPageProps = {
  params: { id: string };
};

async function fetchQuizSession(inviteId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("invite_id", inviteId)
    .single();

  if (error || !data) return null;

  // Fetch the full question data from config
  const config = data.config as { q_id: string; correct_idx: number }[];
  const questionIds = config.map((c) => c.q_id);

  const { data: questions } = await supabase
    .from("question_bank")
    .select("*")
    .in("id", questionIds);

  if (!questions || questions.length === 0) return null;

  return {
    id: data.id,
    invite_id: data.invite_id,
    couple_name_1: data.couple_name_1,
    couple_name_2: data.couple_name_2,
    questions: questions.map(
      (q: {
        id: string;
        category: string;
        question_text: string;
        options: string[];
      }) => ({
        id: q.id,
        category: q.category as QuestionCategory,
        question_text: q.question_text,
        options: q.options as [string, string, string],
      }),
    ),
    config: config as { q_id: string; correct_idx: number }[],
    couple_photo_url: data.couple_photo_url as string | null,
    love_note: data.love_note as string | null,
  };
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const quiz = await fetchQuizSession(id);
    if (!quiz) {
      return {
        title: "Quiz Not Found — WedInviter",
        robots: { index: false },
      };
    }

    const title = `Soul-Sync Quiz: ${quiz.couple_name_1} & ${quiz.couple_name_2} — WedInviter`;
    const description = `How well do you know ${quiz.couple_name_1}? Take the Soul-Sync quiz created by ${quiz.couple_name_1} & ${quiz.couple_name_2} and discover your connection score!`;
    const canonical = new URL(`/quiz/${id}`, APP_URL).toString();

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: "website",
        url: canonical,
        siteName: "WedInviter",
        images: [
          {
            url: `${APP_URL}/api/og/quiz/${id}`,
            width: 1200,
            height: 630,
            alt: `${quiz.couple_name_1} & ${quiz.couple_name_2} Soul-Sync Quiz`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${APP_URL}/api/og/quiz/${id}`],
      },
      robots: {
        index: true,
        follow: false,
      },
    };
  } catch {
    return {
      title: "Soul-Sync Quiz — WedInviter",
      robots: { index: false },
    };
  }
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { id } = await params;
  const quiz = await fetchQuizSession(id);

  if (!quiz) {
    notFound();
  }

  return <QuizPageContent quizData={quiz} />;
}
