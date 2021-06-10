import { usePostQuery } from "../generated/graphql";
import { useGetPostIdFromUrl } from "./useGetPostIdFromUrl";

export const useGetPostFromUrl = () => {
	const intId = useGetPostIdFromUrl();
	return usePostQuery({
		pause: intId === -1,
		variables: {
			id: intId,
		},
	});
};
