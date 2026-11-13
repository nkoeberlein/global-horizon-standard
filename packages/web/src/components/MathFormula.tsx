import katex from 'katex';

interface MathFormulaProps {
  tex: string;
  display?: boolean;
  variant?: 'pill' | 'box' | 'plain';
  className?: string;
}

export function MathFormula({
  tex,
  display = false,
  variant = 'pill',
  className = '',
}: MathFormulaProps) {
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: true,
    output: 'htmlAndMathml',
  });

  const baseClass =
    variant === 'pill' ? 'ghs-math-pill' : variant === 'box' ? 'ghs-math-box' : 'ghs-math-plain';

  return (
    <span
      className={`${baseClass} ${className}`.trim()}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static build-time KaTeX math rendering
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
