// ============================================================================
// WEDINVITER pSEO — Page Intro Section
// ============================================================================

interface PageIntroProps {
  intro: {
    hook: string;
    context: string;
    preview: string;
  };
}

export function PageIntro({ intro }: PageIntroProps) {
  return (
    <div className="space-y-4">
      {/* Hook */}
      <p className="text-lg leading-relaxed text-gray-700 sm:text-xl">
        {intro.hook}
      </p>

      {/* Context */}
      <p className="text-base leading-relaxed text-gray-600">{intro.context}</p>

      {/* Preview */}
      <div className="rounded-lg border border-rose-100 bg-rose-50/50 p-4">
        <p className="text-sm font-medium text-rose-800">In this guide:</p>
        <p className="mt-1 text-sm text-rose-700">{intro.preview}</p>
      </div>
    </div>
  );
}
