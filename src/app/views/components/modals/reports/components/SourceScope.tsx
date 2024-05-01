import { type FC } from 'react';
import { type ResourceScope } from '../../../../../data';

export const SourceScope: FC<ResourceScope<any>> = ({
	resources,
	isLoading,
}) => {
	return (
		<ol className="source-code-scope">
			<li>
				<span className="source-scope-item">ID:</span>{' '}
				<span className="source-scope-item item-value">
					{!isLoading ? resources.id : '...'}
				</span>
			</li>
			<li>
				<span className="source-scope-item">Name:</span>{' '}
				<span className="source-scope-item item-value">
					{!isLoading ? resources.name : '...'}
				</span>
			</li>
			<li>
				<span className="source-scope-item">Link:</span>{' '}
				<span className="source-scope-item item-value">
					{!isLoading ? resources.access_link : '...'}
				</span>
			</li>
			<li>
				<span className="source-scope-item">Public:</span>{' '}
				<span className="source-scope-item item-value">
					{!isLoading ? resources.is_public : '...'}
				</span>
			</li>
			<li>
				<span className="source-scope-item">Source:</span>{' '}
				<span className="source-scope-item item-value">
					{!isLoading ? resources.source_code : '...'}
				</span>
			</li>
		</ol>
	);
};
