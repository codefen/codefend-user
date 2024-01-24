export interface FetchPattern<D> {
	error: null | Error;
	data: D | null;
	isLoading: boolean;
}
