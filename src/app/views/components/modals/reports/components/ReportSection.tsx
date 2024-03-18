export interface ReportSectionTemplateProps {
	title: string | JSX.Element;
	text: string | JSX.Element;
	icon: JSX.Element;
	mainContent: JSX.Element;
	isTitle?: boolean;
	isTextBreak?: boolean;
	isIntro?: boolean;
}

export const ReportSectionTemplate: React.FC<ReportSectionTemplateProps> = ({
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
