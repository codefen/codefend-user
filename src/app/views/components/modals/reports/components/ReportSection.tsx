import type { FC, ReactNode } from 'react';

export interface ReportSectionTemplateProps {
  title: string | ReactNode;
  text: string | ReactNode;
  icon: ReactNode | string;
  mainContent: ReactNode | string;
  isTitle?: boolean;
  isTextBreak?: boolean;
  isIntro?: boolean;
}

export const ReportSectionTemplate: FC<ReportSectionTemplateProps> = ({
  title,
  text,
  icon,
  mainContent,
  isTitle,
  isTextBreak,
  isIntro,
}) => {
  return (
    <div className={`${isIntro ? 'intro' : 'section'}`}>
      <div className={`${isIntro ? 'title' : 'title-main'}`}>
        {icon}
        {isTitle ? <h1>{title}</h1> : <h2>{title}</h2>}
      </div>
      <div className="contenido">
        <p className={`${isTextBreak ? 'print-break' : ''}`}>{text}</p>
        {mainContent}
      </div>
    </div>
  );
};
