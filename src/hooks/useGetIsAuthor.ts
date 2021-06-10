import { useMeQuery, usePostQuery } from "../generated/graphql";

export const useGetIsAuthor = (postId: number) => {
    const [{ data: meData, fetching: fetchingMe }] = useMeQuery();
	const [{ data: postData, fetching: fetchingPost }] = usePostQuery({
		variables: { id: postId },
	});

    return meData?.me?.user?.id === postData?.post?.author.id;
}